// tests/guest-limits.test.mjs
// Guest usage limits for the "Ask ZUGEE" chat: daily quota with a midnight-IST reset, cooldown,
// burst, concurrency (compare-and-swap), the signed guest cookie, the IP backstop, the 429 shape,
// the Supabase backend's query shapes, and signed-in users being exempt.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  chatPolicy,
  checkGuest,
  consume,
  createMemoryBackend,
  decide,
  GUEST_LIMIT_MESSAGE,
  GUEST_LIMITS,
  guestSecret,
  IP_LIMITS,
  istDay,
  newGuestCookie,
  nextIstMidnight,
  readGuestCookie
} from "../lib/chatbot/guest-limits.js";
import { createSupabaseBackend } from "../lib/chatbot/guest-store-supabase.js";
import { CHAT_LIMITS, validateChatRequest } from "../lib/chatbot/validate.js";

const SECRET = "test-secret-test-secret-test-secret-1234";
// Always changes the last character (replacing it with a fixed one is a no-op when it already
// matches: about 1 run in 16 for a base64url SHA-256 signature).
const flipLast = (s) => s.slice(0, -1) + (s.at(-1) === "A" ? "B" : "A");
const at = (iso) => Date.parse(iso);
/** A clock the test moves by hand. */
function clock(startIso) {
  let t = at(startIso);
  const now = () => t;
  now.advance = (ms) => (t += ms);
  now.set = (iso) => (t = at(iso));
  return now;
}

// ---------------------------------------------------------------------------------------------
// Days in Asia/Kolkata
// ---------------------------------------------------------------------------------------------
test("the guest day follows Asia/Kolkata: it turns over at 18:30 UTC", () => {
  assert.equal(istDay(at("2026-10-25T18:29:59.999Z")), "2026-10-25");
  assert.equal(istDay(at("2026-10-25T18:30:00.000Z")), "2026-10-26");
  assert.equal(istDay(at("2026-10-25T00:00:00Z")), "2026-10-25"); // 05:30 IST
  assert.equal(nextIstMidnight(at("2026-10-25T18:29:59Z")), at("2026-10-25T18:30:00Z"));
  assert.equal(nextIstMidnight(at("2026-10-25T18:30:00Z")), at("2026-10-26T18:30:00Z"));
  // Month and year ends.
  assert.equal(nextIstMidnight(at("2026-12-31T20:00:00Z")), at("2027-01-01T18:30:00Z"));
});

// ---------------------------------------------------------------------------------------------
// The decision
// ---------------------------------------------------------------------------------------------
test("daily quota: 10 messages, then 429 until midnight IST, then a fresh 10", async () => {
  const backend = createMemoryBackend();
  const now = clock("2026-10-25T10:00:00Z"); // 15:30 IST
  for (let i = 1; i <= 10; i++) {
    const d = await consume(backend, "g:a", GUEST_LIMITS, now);
    assert.equal(d.allowed, true, `message ${i}`);
    assert.equal(d.remaining, 10 - i);
    now.advance(7000); // past cooldown and burst spacing
  }
  const blocked = await consume(backend, "g:a", GUEST_LIMITS, now);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.reason, "daily");
  assert.equal(blocked.retryAfterMs, at("2026-10-25T18:30:00Z") - now());

  now.set("2026-10-25T18:29:59Z"); // 23:59:59 IST: still blocked
  assert.equal((await consume(backend, "g:a", GUEST_LIMITS, now)).reason, "daily");
  now.set("2026-10-25T18:30:00Z"); // midnight IST: reset
  const fresh = await consume(backend, "g:a", GUEST_LIMITS, now);
  assert.equal(fresh.allowed, true);
  assert.equal(fresh.remaining, 9);
});

test("cooldown: a second message within 3 s is refused, with the exact wait", () => {
  const t0 = at("2026-10-25T10:00:00Z");
  const first = decide(null, t0, GUEST_LIMITS);
  const tooSoon = decide(first.next, t0 + 1200, GUEST_LIMITS);
  assert.equal(tooSoon.allowed, false);
  assert.equal(tooSoon.reason, "cooldown");
  assert.equal(tooSoon.retryAfterMs, 1800);
  assert.equal(tooSoon.remaining, 9, "a refused message is not counted");
  assert.equal(decide(first.next, t0 + 3000, GUEST_LIMITS).allowed, true);
});

test("burst: at most 5 messages in any 30 s", () => {
  let state = null;
  const t0 = at("2026-10-25T10:00:00Z");
  for (const s of [0, 3, 6, 9, 12]) {
    const d = decide(state, t0 + s * 1000, GUEST_LIMITS);
    assert.equal(d.allowed, true, `at ${s}s`);
    state = d.next;
  }
  const sixth = decide(state, t0 + 15000, GUEST_LIMITS);
  assert.equal(sixth.reason, "burst");
  assert.equal(sixth.retryAfterMs, 15000, "until the first message leaves the 30 s window");
  assert.equal(decide(state, t0 + 30001, GUEST_LIMITS).allowed, true);
});

// ---------------------------------------------------------------------------------------------
// Concurrency
// ---------------------------------------------------------------------------------------------
test("concurrent requests never exceed the daily quota (compare-and-swap)", async () => {
  const backend = createMemoryBackend();
  const loose = { dailyMessages: 10, cooldownMs: 0, burst: { max: 1000, windowMs: 30000 } };
  const now = () => at("2026-10-25T10:00:00Z");
  const results = await Promise.all(Array.from({ length: 25 }, () => consume(backend, "g:race", loose, now)));
  assert.equal(results.filter((r) => r.allowed).length, 10, "exactly the quota, never more");
  // The rest are refused: by the daily limit, or as a burst if they kept colliding. Never an error.
  assert.ok(results.filter((r) => !r.allowed).every((r) => r.reason === "daily" || r.reason === "burst"));
  assert.equal(backend.rows.get("g:race").state.count, 10);
});

test("concurrent messages from one guest at the same instant: the cooldown lets exactly one through", async () => {
  const backend = createMemoryBackend();
  const now = () => at("2026-10-25T10:00:00Z");
  const results = await Promise.all(Array.from({ length: 6 }, () => consume(backend, "g:tabs", GUEST_LIMITS, now)));
  assert.equal(results.filter((r) => r.allowed).length, 1);
  assert.ok(results.filter((r) => !r.allowed).every((r) => r.reason === "cooldown"));
});

// ---------------------------------------------------------------------------------------------
// Guest identity
// ---------------------------------------------------------------------------------------------
test("guest cookie: signed, and any edit or forgery is rejected", () => {
  const { id, value } = newGuestCookie(SECRET);
  assert.equal(readGuestCookie(value, SECRET), id);
  const [cid, sig] = value.split(".");
  assert.equal(readGuestCookie(`${cid}x.${sig}`, SECRET), null, "edited id");
  assert.equal(readGuestCookie(`${cid}.${flipLast(sig)}`, SECRET), null, "edited signature");
  assert.equal(readGuestCookie(value, "another-secret-another-secret-123456"), null, "other secret");
  for (const bad of [undefined, "", "abc", "a.b.c", "x".repeat(300)]) assert.equal(readGuestCookie(bad, SECRET), null);
});

test("refreshing or opening new tabs (same cookie) shares one quota; a missing or forged cookie gets a new id", async () => {
  const backend = createMemoryBackend();
  const now = clock("2026-10-25T10:00:00Z");
  const firstVisit = await checkGuest({ ip: "1.2.3.4", backend, secret: SECRET, now });
  assert.ok(firstVisit.setCookie.startsWith("zugee_chat_guest="));
  assert.match(firstVisit.setCookie, /HttpOnly/);
  assert.match(firstVisit.setCookie, /SameSite=Lax/);
  const cookieValue = firstVisit.setCookie.split(";")[0].split("=")[1];

  for (let i = 0; i < 9; i++) {
    now.advance(7000);
    const r = await checkGuest({ cookieValue, ip: "1.2.3.4", backend, secret: SECRET, now });
    assert.equal(r.allowed, true);
    assert.equal(r.setCookie, undefined, "a valid cookie is kept");
  }
  now.advance(7000);
  const eleventh = await checkGuest({ cookieValue, ip: "5.6.7.8", backend, secret: SECRET, now });
  assert.equal(eleventh.allowed, false, "a new IP does not reset the guest's quota");
  assert.equal(eleventh.status, 429);
  assert.equal(eleventh.reason, "daily");
  assert.equal(eleventh.error, GUEST_LIMIT_MESSAGE);
  assert.ok(eleventh.retryAfterSeconds > 0);
  assert.equal(eleventh.remaining, 0);

  const forged = await checkGuest({ cookieValue: flipLast(cookieValue), ip: "1.2.3.4", backend, secret: SECRET, now });
  assert.ok(forged.setCookie, "a forged cookie is replaced, not trusted");
});

test("deleting the cookie does not escape the per-IP backstop", async () => {
  const backend = createMemoryBackend();
  const now = clock("2026-10-25T10:00:00Z");
  let allowed = 0;
  // A visitor clears cookies after every 10 messages: 4 "different" guests on one IP.
  for (let guest = 0; guest < 4; guest++) {
    let cookieValue;
    for (let i = 0; i < 10; i++) {
      now.advance(7000);
      const r = await checkGuest({ cookieValue, ip: "9.9.9.9", backend, secret: SECRET, now });
      if (r.setCookie) cookieValue = r.setCookie.split(";")[0].split("=")[1];
      if (r.allowed) allowed++;
      else {
        assert.equal(r.status, 429);
        assert.equal(r.remaining, 10, "the guest's own quota is given back when the IP is the limit");
      }
    }
  }
  assert.equal(allowed, IP_LIMITS.dailyMessages);
});

test("a status check (record: false) counts nothing", async () => {
  const backend = createMemoryBackend();
  const now = clock("2026-10-25T10:00:00Z");
  const r = await checkGuest({ ip: "1.1.1.1", backend, secret: SECRET, now, record: false });
  assert.equal(r.remaining, 10);
  assert.equal(backend.rows.size, 0);
});

test("the signing secret: dedicated, derived from the admin secret, or a dev fallback; production fails closed", () => {
  assert.equal(guestSecret({ CHAT_GUEST_SECRET: "c".repeat(32) }), "c".repeat(32));
  const derived = guestSecret({ ADMIN_JWT_SECRET: "a".repeat(40) });
  assert.ok(derived.length >= 32 && derived !== "a".repeat(40), "derived, not the admin secret itself");
  assert.ok(guestSecret({ NODE_ENV: "development" }));
  assert.throws(() => guestSecret({ NODE_ENV: "production" }));
});

// ---------------------------------------------------------------------------------------------
// Signed-in users
// ---------------------------------------------------------------------------------------------
test("signed-in users get no guest limits and the larger message cap", () => {
  assert.deepEqual(chatPolicy(true), { applyGuestLimits: false, userChars: CHAT_LIMITS.userChars });
  assert.deepEqual(chatPolicy(false), { applyGuestLimits: true, userChars: 1000 });
  const long = { messages: [{ role: "user", content: "x".repeat(1500) }] };
  assert.equal(validateChatRequest(long, { userChars: chatPolicy(false).userChars }).ok, false, "guest: 1,000 max");
  assert.equal(validateChatRequest(long, { userChars: chatPolicy(true).userChars }).ok, true, "signed in: allowed");
  assert.equal(validateChatRequest({ messages: [{ role: "user", content: "x".repeat(1000) }] }, { userChars: 1000 }).ok, true);

  // The route takes the policy from the session and only runs checkGuest when it says so.
  const route = fs.readFileSync(path.join(import.meta.dirname, "..", "app", "api", "chat", "route.js"), "utf8");
  assert.match(route, /const policy = chatPolicy\(isSignedIn\(request\)\);/);
  assert.match(route, /if \(policy\.applyGuestLimits\) \{[\s\S]*?checkGuest\(/);
  assert.equal((route.match(/checkGuest\(/g) ?? []).length, 2, "POST (counting) and GET (status) only");
  assert.match(route, /export async function GET\(request\) \{\s*if \(isSignedIn\(request\)\)/);
});

// ---------------------------------------------------------------------------------------------
// Supabase backend: the query shapes that make compare-and-swap work
// ---------------------------------------------------------------------------------------------
/** A tiny stand-in for the supabase-js query builder over one in-memory table. */
function fakeSupabase() {
  const table = new Map();
  const calls = [];
  const client = {
    from(name) {
      assert.equal(name, "chat_guest_usage");
      const q = { filters: [], op: null, values: null, options: null };
      const run = () => {
        calls.push(q);
        const match = (row) => q.filters.every(([col, val]) => row[col] === val);
        if (q.op === "select") {
          const row = [...table.values()].find(match);
          return { data: row ? { ...row } : null, error: null };
        }
        if (q.op === "upsert") {
          if (table.has(q.values.key)) return { data: [], error: null };
          table.set(q.values.key, { ...q.values });
          return { data: [{ key: q.values.key }], error: null };
        }
        if (q.op === "update") {
          const row = [...table.values()].find(match);
          if (!row) return { data: [], error: null };
          Object.assign(row, q.values);
          return { data: [{ key: row.key }], error: null };
        }
        return { data: null, error: null };
      };
      const builder = {
        select() {
          if (!q.op) q.op = "select";
          return builder;
        },
        eq(col, val) {
          q.filters.push([col, val]);
          return builder;
        },
        maybeSingle: async () => run(),
        upsert(values, options) {
          q.op = "upsert";
          q.values = values;
          q.options = options;
          return builder;
        },
        update(values) {
          q.op = "update";
          q.values = values;
          return builder;
        },
        then: (resolve) => resolve(run())
      };
      return builder;
    }
  };
  return { client, table, calls };
}

test("Supabase backend: insert-if-absent and version-checked update give exact counts", async () => {
  const fake = fakeSupabase();
  const backend = createSupabaseBackend(fake.client);
  const loose = { dailyMessages: 10, cooldownMs: 0, burst: { max: 1000, windowMs: 30000 } };
  const now = () => at("2026-10-25T10:00:00Z");
  const results = await Promise.all(Array.from({ length: 15 }, () => consume(backend, "g:sb", loose, now)));
  assert.equal(results.filter((r) => r.allowed).length, 10);
  assert.equal(fake.table.get("g:sb").count, 10);
  const upsert = fake.calls.find((c) => c.op === "upsert");
  assert.deepEqual(upsert.options, { onConflict: "key", ignoreDuplicates: true });
  const update = fake.calls.find((c) => c.op === "update");
  assert.deepEqual(update.filters.map(([col]) => col), ["key", "version"], "update only where the version is unchanged");
});
