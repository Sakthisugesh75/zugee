// lib/auth.js
// Server-side authentication for Zugee Admin.
// Uses Node's built-in crypto for token signing (no external JWT dependency).
// The session token is stored in an httpOnly cookie so client-side scripts can never read it.

import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "zugee_admin_session";
export const SESSION_TTL_SECONDS = 24 * 60 * 60; // 24 hours

const MIN_PRODUCTION_PASSWORD_LENGTH = 12;
const DEV_PASSWORD = "zugee_admin_dev";
const DEV_SECRET = "zugee_dev_only_signing_secret";

const isProduction = process.env.NODE_ENV === "production";
let warnedAboutDevFallback = false;

function warnDevFallback() {
  if (warnedAboutDevFallback) return;
  warnedAboutDevFallback = true;
  console.warn(
    `[Admin Auth] ADMIN_PASSWORD / ADMIN_JWT_SECRET not set — using development defaults (password: "${DEV_PASSWORD}"). Never deploy like this.`
  );
}

/**
 * Resolve credentials lazily so `next build` works without runtime secrets,
 * but any production request fails closed when they are missing or weak.
 */
function getAuthConfig() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (isProduction) {
    if (!password || password.length < MIN_PRODUCTION_PASSWORD_LENGTH) {
      throw new Error(
        `ADMIN_PASSWORD must be set to at least ${MIN_PRODUCTION_PASSWORD_LENGTH} characters in production.`
      );
    }
    if (!secret || secret.length < 32) {
      throw new Error("ADMIN_JWT_SECRET must be set to a random string of at least 32 characters in production.");
    }
    if (secret === password) {
      throw new Error("ADMIN_JWT_SECRET must be different from ADMIN_PASSWORD.");
    }
    return { password, secret };
  }

  if (!password || !secret) warnDevFallback();
  return { password: password || DEV_PASSWORD, secret: secret || DEV_SECRET };
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function sign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Verify admin password (constant-time).
 */
export function verifyAdminPassword(password) {
  if (!password || typeof password !== "string") return false;
  const { password: configuredPassword } = getAuthConfig();
  return safeEqual(password, configuredPassword);
}

/**
 * Generate a signed session token.
 */
export function createAdminToken() {
  const { secret } = getAuthConfig();
  const payload = {
    role: "admin",
    exp: Date.now() + SESSION_TTL_SECONDS * 1000
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, secret)}`;
}

/**
 * Verify token authenticity and expiration.
 * Rotating ADMIN_JWT_SECRET invalidates every issued session.
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data, signature] = parts;
  const { secret } = getAuthConfig();
  if (!safeEqual(signature, sign(data, secret))) return false;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    if (!payload.exp || Date.now() > payload.exp) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Check whether an incoming route-handler request carries a valid admin session cookie.
 */
export function isAdminRequest(request) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

/**
 * Server Component helper: does the current request carry a valid admin session?
 * Fails closed (returns false) if auth is misconfigured.
 */
export async function hasAdminSession() {
  // Keep cookies() outside the try: Next.js signals dynamic rendering by throwing from it,
  // and that signal must not be swallowed.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  try {
    return verifyAdminToken(token);
  } catch (err) {
    console.error("[Admin Session Check Error]:", err);
    return false;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge
  };
}
