// lib/chatbot/guest-limits.js
// Usage limits for GUEST visitors of the "Ask Tutu" chat. Signed-in users (an admin session; the
// public site has no other sign-in) are never counted here: app/api/chat/route.js skips this
// module for them.
//
//   per guest   10 messages per day (resets at midnight Asia/Kolkata), 3 s between messages,
//               at most 5 messages in any 30 s
//   per IP      30 messages per day and 10 per 30 s, a backstop for a guest who deletes the
//               cookie to get a fresh quota (the IP is stored only as a keyed hash)
//
// Who is a guest: a random id in an httpOnly cookie, signed with a server secret so it cannot be
// forged or edited. Refreshing or opening new tabs keeps the same id.
//
// Concurrency: each key is one row { day, count, recent[], version }. A message is counted with
// compare-and-swap: read the row, decide in code, write only if `version` is unchanged, otherwise
// re-read and decide again. Two simultaneous requests can never both take the last message.
// Storage is pluggable: Supabase in production (lib/chatbot/guest-store-supabase.js), memory in
// tests and local development.
// No JSX and relative imports only, so `node --test` can load this file.

import crypto from "crypto";
import { GUEST_DAILY_LIMIT, GUEST_LIMIT_MESSAGE } from "./guest-copy.js";
import { CHAT_LIMITS } from "./validate.js";

export { GUEST_LIMIT_MESSAGE };

export const GUEST_LIMITS = {
  dailyMessages: GUEST_DAILY_LIMIT,
  cooldownMs: 3000,
  burst: { max: 5, windowMs: 30000 },
  maxChars: 1000
};
export const IP_LIMITS = {
  dailyMessages: 30,
  cooldownMs: 0,
  burst: { max: 10, windowMs: 30000 }
};

/**
 * Which limits apply to a request. Signed-in users never get the guest limits (daily quota,
 * cooldown, burst, 1,000 characters); they keep the general per-IP limits and the 2,000-character cap.
 */
export function chatPolicy(signedIn) {
  return signedIn
    ? { applyGuestLimits: false, userChars: CHAT_LIMITS.userChars }
    : { applyGuestLimits: true, userChars: GUEST_LIMITS.maxChars };
}

export const GUEST_COOKIE_NAME = "zugee_chat_guest";
// Long enough that the daily quota survives browser restarts; disclosed in the Privacy Policy.
export const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// ---------------------------------------------------------------------------------------------
// Days in Asia/Kolkata (UTC+05:30 all year, no daylight saving)
// ---------------------------------------------------------------------------------------------
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** The Kolkata calendar day of a moment: "2026-10-25". */
export function istDay(nowMs) {
  return new Date(nowMs + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** The moment the next Kolkata day starts (midnight IST), in ms since the epoch. */
export function nextIstMidnight(nowMs) {
  const shifted = new Date(nowMs + IST_OFFSET_MS);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() + 1) - IST_OFFSET_MS;
}

// ---------------------------------------------------------------------------------------------
// The decision (pure)
// ---------------------------------------------------------------------------------------------
/**
 * @typedef {{ day: string, count: number, recent: number[] }} UsageState
 * @typedef {{ allowed: boolean, reason?: "daily"|"cooldown"|"burst", retryAfterMs: number,
 *             remaining: number, next?: UsageState }} Decision
 * @param {UsageState|null} state  the stored row, or null for a new key
 * @returns {Decision}
 */
export function decide(state, nowMs, limits) {
  const today = istDay(nowMs);
  // A new day starts a fresh count; old timestamps stay for the cooldown and burst checks.
  const count = state && state.day === today ? state.count : 0;
  const recent = (state?.recent ?? []).filter((t) => typeof t === "number" && t > nowMs - limits.burst.windowMs);

  if (count >= limits.dailyMessages) {
    return { allowed: false, reason: "daily", retryAfterMs: nextIstMidnight(nowMs) - nowMs, remaining: 0 };
  }
  const last = recent.length ? Math.max(...recent) : null;
  if (limits.cooldownMs && last !== null && nowMs - last < limits.cooldownMs) {
    return { allowed: false, reason: "cooldown", retryAfterMs: limits.cooldownMs - (nowMs - last), remaining: limits.dailyMessages - count };
  }
  if (recent.length >= limits.burst.max) {
    const oldest = Math.min(...recent);
    return { allowed: false, reason: "burst", retryAfterMs: oldest + limits.burst.windowMs - nowMs, remaining: limits.dailyMessages - count };
  }
  const next = { day: today, count: count + 1, recent: [...recent, nowMs].slice(-limits.burst.max) };
  return { allowed: true, retryAfterMs: 0, remaining: limits.dailyMessages - next.count, next };
}

/** How many messages are left today, without counting one. */
export function remainingToday(state, nowMs, limits) {
  const count = state && state.day === istDay(nowMs) ? state.count : 0;
  return Math.max(0, limits.dailyMessages - count);
}

// ---------------------------------------------------------------------------------------------
// Counting with compare-and-swap
// ---------------------------------------------------------------------------------------------
/**
 * A storage backend: three atomic operations on one row per key.
 * @typedef {{
 *   get(key: string): Promise<{ state: UsageState, version: number } | null>,
 *   insert(key: string, state: UsageState): Promise<boolean>,               // false if the key exists
 *   update(key: string, state: UsageState, expectedVersion: number): Promise<boolean> // false if the version changed
 * }} UsageBackend
 */

const MAX_ATTEMPTS = 12;
const backoff = (attempt) => new Promise((resolve) => setTimeout(resolve, Math.random() * 10 * (attempt + 1)));

/**
 * Decides and, if allowed, records one message for `key`. Safe under concurrency: a lost
 * compare-and-swap re-reads and decides again (with a short random backoff). Many simultaneous
 * requests for ONE key can only be a flood, so if they keep colliding the request is refused as a
 * burst rather than failing.
 * @param {UsageBackend} backend
 * @returns {Promise<Decision>}
 */
export async function consume(backend, key, limits, now = Date.now) {
  let lastRemaining = limits.dailyMessages;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const row = await backend.get(key);
    const decision = decide(row?.state ?? null, now(), limits);
    if (!decision.allowed) return decision;
    lastRemaining = decision.remaining + 1;
    const written = row ? await backend.update(key, decision.next, row.version) : await backend.insert(key, decision.next);
    if (written) return decision;
    // Someone else wrote first: read again and decide on the new state.
    await backoff(attempt);
  }
  return { allowed: false, reason: "burst", retryAfterMs: 2000, remaining: lastRemaining };
}

/** Gives back one message of today's count (the model never answered). Best effort. */
export async function refund(backend, key, now = Date.now) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const row = await backend.get(key);
    if (!row || row.state.day !== istDay(now()) || row.state.count === 0) return;
    if (await backend.update(key, { ...row.state, count: row.state.count - 1 }, row.version)) return;
  }
}

/** Reads today's remaining count without recording anything. */
export async function peekRemaining(backend, key, limits, now = Date.now) {
  const row = await backend.get(key);
  return remainingToday(row?.state ?? null, now(), limits);
}

/** In-memory backend: tests and local development (one process only). */
export function createMemoryBackend() {
  const rows = new Map();
  const copy = (state) => ({ ...state, recent: [...state.recent] });
  // Each call yields to the event loop, so concurrent requests really interleave in tests.
  const tick = () => new Promise((resolve) => setImmediate(resolve));
  return {
    rows,
    async get(key) {
      await tick();
      const row = rows.get(key);
      return row ? { state: copy(row.state), version: row.version } : null;
    },
    async insert(key, state) {
      await tick();
      if (rows.has(key)) return false;
      rows.set(key, { state: copy(state), version: 1 });
      return true;
    },
    async update(key, state, expectedVersion) {
      await tick();
      const row = rows.get(key);
      if (!row || row.version !== expectedVersion) return false;
      rows.set(key, { state: copy(state), version: expectedVersion + 1 });
      return true;
    }
  };
}

// ---------------------------------------------------------------------------------------------
// Signed guest id
// ---------------------------------------------------------------------------------------------
const DEV_SECRET = "zugee_dev_only_chat_guest_secret";

/**
 * The key that signs guest ids and hashes IPs. CHAT_GUEST_SECRET if set; otherwise derived from
 * ADMIN_JWT_SECRET (already required in production) so no new secret is needed. Development falls
 * back to a fixed secret; production without either fails closed.
 */
export function guestSecret(env = process.env) {
  if (env.CHAT_GUEST_SECRET && env.CHAT_GUEST_SECRET.length >= 32) return env.CHAT_GUEST_SECRET;
  if (env.ADMIN_JWT_SECRET && env.ADMIN_JWT_SECRET.length >= 32) {
    return crypto.createHmac("sha256", env.ADMIN_JWT_SECRET).update("zugee-chat-guest-v1").digest("base64url");
  }
  if (env.NODE_ENV === "production") throw new Error("Set CHAT_GUEST_SECRET (or ADMIN_JWT_SECRET) to at least 32 characters.");
  return DEV_SECRET;
}

const hmac = (secret, value) => crypto.createHmac("sha256", secret).update(value).digest("base64url");

/** A new guest id and its cookie value "<id>.<signature>". */
export function newGuestCookie(secret) {
  const id = crypto.randomBytes(16).toString("base64url");
  return { id, value: `${id}.${hmac(secret, id)}` };
}

/** The guest id from a cookie value, or null if it is missing, malformed or tampered with. */
export function readGuestCookie(value, secret) {
  if (typeof value !== "string" || value.length > 200) return null;
  const [id, signature, extra] = value.split(".");
  if (!id || !signature || extra !== undefined || !/^[A-Za-z0-9_-]{16,64}$/.test(id)) return null;
  const expected = hmac(secret, id);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? id : null;
}

/** Storage keys: the raw IP is never stored, only a keyed hash of it. */
export function guestKey(id) {
  return `g:${id}`;
}
export function ipKey(ip, secret) {
  return `ip:${hmac(secret, `ip:${ip}`).slice(0, 32)}`;
}

/** Set-Cookie header value for the guest cookie. */
export function guestCookieHeader(value, { secure }) {
  return `${GUEST_COOKIE_NAME}=${value}; Path=/api/chat; Max-Age=${GUEST_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
}

// ---------------------------------------------------------------------------------------------
// The whole guest check for one request
// ---------------------------------------------------------------------------------------------
/**
 * @param {{ cookieValue?: string, ip: string, backend: UsageBackend, secret: string, now?: () => number,
 *           secureCookie?: boolean, record?: boolean }} options
 *   record  false for a status check (GET): reads the remaining count, counts nothing.
 * @returns {Promise<{ allowed: boolean, status?: number, error?: string, reason?: string,
 *   retryAfterSeconds?: number, remaining: number, limit: number, setCookie?: string,
 *   keys: { guest: string, ip: string } }>}
 */
export async function checkGuest({ cookieValue, ip, backend, secret, now = Date.now, secureCookie = false, record = true }) {
  let id = readGuestCookie(cookieValue, secret);
  let setCookie;
  if (!id) {
    const fresh = newGuestCookie(secret);
    id = fresh.id;
    setCookie = guestCookieHeader(fresh.value, { secure: secureCookie });
  }
  const keys = { guest: guestKey(id), ip: ipKey(ip || "unknown", secret) };
  const base = { limit: GUEST_LIMITS.dailyMessages, setCookie, keys };

  if (!record) {
    return { allowed: true, remaining: await peekRemaining(backend, keys.guest, GUEST_LIMITS, now), ...base };
  }

  const guest = await consume(backend, keys.guest, GUEST_LIMITS, now);
  if (!guest.allowed) return denied(guest, base);

  const byIp = await consume(backend, keys.ip, IP_LIMITS, now);
  if (!byIp.allowed) {
    // The guest's own quota was not the problem: give that message back.
    await refund(backend, keys.guest, now);
    return denied({ ...byIp, remaining: guest.remaining + 1 }, base);
  }
  return { allowed: true, remaining: guest.remaining, ...base };
}

function denied(decision, base) {
  const retryAfterSeconds = Math.max(1, Math.ceil(decision.retryAfterMs / 1000));
  const error =
    decision.reason === "daily"
      ? GUEST_LIMIT_MESSAGE
      : decision.reason === "cooldown"
        ? `Please wait ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"} before sending another message.`
        : `You're sending messages quickly. Please wait ${retryAfterSeconds} seconds and try again.`;
  return { allowed: false, status: 429, error, reason: decision.reason, retryAfterSeconds, remaining: decision.remaining, ...base };
}
