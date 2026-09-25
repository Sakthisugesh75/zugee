// app/api/admin/auth/route.js
// Admin session endpoint.
//   POST   -> verify password, set httpOnly session cookie (rate limited)
//   GET    -> report whether the current request has a valid session
//   DELETE -> log out (clear the session cookie)

import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  isAdminRequest,
  sessionCookieOptions,
  verifyAdminPassword
} from "@/lib/auth";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

const WINDOW_MS = 15 * 60 * 1000;

// Per-IP failed attempts.
const ipFailures = createRateLimiter({ windowMs: WINDOW_MS, max: 5 });
// Global cap on failed attempts across all IPs. Bounds brute force even if the
// client IP header can be spoofed; the trade-off is a temporary lockout during an attack.
const globalFailures = createRateLimiter({ windowMs: WINDOW_MS, max: 100 });
const GLOBAL_KEY = "all";

function lockedResponse(retryAfterMs) {
  const waitMinutes = retryAfterMinutes(retryAfterMs);
  return NextResponse.json(
    {
      success: false,
      error: `Too many failed login attempts. Try again in ${waitMinutes} minute(s).`,
      locked: true,
      waitMinutes
    },
    { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
  );
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    const ipState = ipFailures.check(ip);
    if (ipState.limited) return lockedResponse(ipState.retryAfterMs);
    const globalState = globalFailures.check(GLOBAL_KEY);
    if (globalState.limited) return lockedResponse(globalState.retryAfterMs);

    const body = await request.json().catch(() => null);
    const password = body && typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ success: false, error: "Password is required." }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      const result = ipFailures.hit(ip);
      globalFailures.hit(GLOBAL_KEY);
      return NextResponse.json(
        {
          success: false,
          error:
            result.remaining > 0
              ? `Invalid administrator password. ${result.remaining} attempt(s) remaining before temporary lockout.`
              : `Invalid password. Maximum attempts exceeded; locked for ${retryAfterMinutes(result.retryAfterMs)} minute(s).`,
          remainingAttempts: result.remaining,
          locked: result.remaining === 0
        },
        { status: 401 }
      );
    }

    ipFailures.reset(ip);

    const response = NextResponse.json(
      { success: true, message: "Authenticated successfully." },
      { status: 200 }
    );
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(), sessionCookieOptions());
    return response;
  } catch (err) {
    console.error("[Admin Auth Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    return NextResponse.json({ authenticated: isAdminRequest(request) });
  } catch (err) {
    console.error("[Admin Session Check Error]:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", sessionCookieOptions(0));
  return response;
}
