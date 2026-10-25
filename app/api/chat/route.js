// app/api/chat/route.js
// The website chat assistant. POST streams the model's reply back as plain text; GET tells the
// widget how many free messages a guest has left today.
// The API key never leaves the server; no chat content is stored anywhere on our side.
//
// Limits:
//   everyone   per-IP burst limits in memory (6/min, 40/hour), as before
//   guests     10 messages a day (midnight IST reset), 3 s cooldown, 5 per 30 s, 1,000 characters,
//              counted in Supabase per signed guest cookie plus a per-IP backstop
//              (lib/chatbot/guest-limits.js); 429 with Retry-After when exceeded
//   signed in  an admin session (the only sign-in on this site) skips the guest limits

import { NextResponse } from "next/server";
import { buildSystemPrompt, demoAlreadyOffered, DEMO_ALREADY_OFFERED_NOTE } from "@/lib/chatbot/knowledge";
import { validateChatRequest } from "@/lib/chatbot/validate";
import { ChatProviderError, streamGeminiReply } from "@/lib/chatbot/gemini";
import { runTool, TOOL_DECLARATIONS } from "@/lib/chatbot/tools";
import { guardDemoOffers, userAskedForDemo } from "@/lib/chatbot/demo-guard";
import { guardSensitiveEcho } from "@/lib/chatbot/pii-guard";
import { chatPolicy, checkGuest, GUEST_COOKIE_NAME, guestSecret, refund } from "@/lib/chatbot/guest-limits";
import { guestUsageBackend, maybePurgeOldRows } from "@/lib/chatbot/guest-store-supabase";
import { isAdminRequest } from "@/lib/auth";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

// Vercel: allow a slow reply to finish streaming.
export const maxDuration = 60;

// Per IP, for everyone: a burst limit and an hourly limit (per server instance).
const minuteLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 6 });
const hourLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 40 });

// Built once per server instance: the prompt only changes with a deploy.
const SYSTEM_PROMPT = buildSystemPrompt();

const UNAVAILABLE = "The chat assistant is not available right now. Please book a demo or message us on WhatsApp.";
const BUSY = "The chat assistant is busy right now. Please try again in a minute, or book a demo or message us on WhatsApp.";
const SECURE_COOKIE = process.env.NODE_ENV === "production";

function errorResponse(status, error, headers, extra) {
  return NextResponse.json({ error, ...extra }, { status, headers });
}

/** An admin session is the only sign-in on the public site. Misconfigured auth counts as a guest. */
function isSignedIn(request) {
  try {
    return isAdminRequest(request);
  } catch {
    return false;
  }
}

/** Headers that carry the guest's remaining count (and a new guest cookie, if one was issued). */
function guestHeaders(guest) {
  const headers = { "X-Chat-Guest-Limit": String(guest.limit), "X-Chat-Guest-Remaining": String(guest.remaining) };
  if (guest.setCookie) headers["Set-Cookie"] = guest.setCookie;
  return headers;
}

export async function GET(request) {
  if (isSignedIn(request)) {
    return NextResponse.json({ guest: false }, { headers: { "Cache-Control": "no-store" } });
  }
  try {
    const guest = await checkGuest({
      cookieValue: request.cookies.get(GUEST_COOKIE_NAME)?.value,
      ip: getClientIp(request),
      backend: guestUsageBackend(),
      secret: guestSecret(),
      secureCookie: SECURE_COOKIE,
      record: false
    });
    return NextResponse.json(
      { guest: true, remaining: guest.remaining, limit: guest.limit },
      { headers: { ...guestHeaders(guest), "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[chat] guest status:", error.message);
    return errorResponse(503, UNAVAILABLE);
  }
}

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) return errorResponse(503, UNAVAILABLE);

  const ip = getClientIp(request);
  for (const limiter of [minuteLimiter, hourLimiter]) {
    const state = limiter.check(ip);
    if (state.limited) {
      return errorResponse(429, `Too many messages. Please try again in ${retryAfterMinutes(state.retryAfterMs)} minute(s).`, {
        "Retry-After": String(Math.ceil(state.retryAfterMs / 1000))
      });
    }
  }

  const policy = chatPolicy(isSignedIn(request));
  const body = await request.json().catch(() => null);
  // Invalid requests are rejected before anything is counted.
  const checked = validateChatRequest(body, { userChars: policy.userChars });
  if (!checked.ok) return errorResponse(400, checked.error);

  // Guests only: count the message against the stored daily, cooldown and burst limits.
  let guest = null;
  let backend = null;
  if (policy.applyGuestLimits) {
    try {
      backend = guestUsageBackend();
      guest = await checkGuest({
        cookieValue: request.cookies.get(GUEST_COOKIE_NAME)?.value,
        ip,
        backend,
        secret: guestSecret(),
        secureCookie: SECURE_COOKIE
      });
    } catch (error) {
      // Fail closed: without a working store, guest limits cannot be enforced.
      console.error("[chat] guest limits:", error.message);
      return errorResponse(503, UNAVAILABLE);
    }
    if (!guest.allowed) {
      return errorResponse(
        429,
        guest.error,
        { ...guestHeaders(guest), "Retry-After": String(guest.retryAfterSeconds) },
        { reason: guest.reason, retryAfterSeconds: guest.retryAfterSeconds, remaining: guest.remaining, limit: guest.limit }
      );
    }
    maybePurgeOldRows().catch(() => {});
  }
  minuteLimiter.hit(ip);
  hourLimiter.hit(ip);

  // A message the model never answered is given back, so outages do not use up a guest's day.
  const refundGuest = async () => {
    if (!guest) return;
    await Promise.all([refund(backend, guest.keys.guest), refund(backend, guest.keys.ip)]).catch((error) =>
      console.error("[chat] refund:", error.message)
    );
  };

  // Once a demo has been offered, a note after the (cached) prompt stops the model offering it again.
  const system = demoAlreadyOffered(checked.messages) ? `${SYSTEM_PROMPT}\n\n${DEMO_ALREADY_OFFERED_NOTE}` : SYSTEM_PROMPT;

  // Backstop for the prompt rule: drop a closing demo pitch unless the visitor asked for one.
  const latestQuestion = checked.messages[checked.messages.length - 1].content;
  // Backstop for "never repeat personal details": if the message looks sensitive, the reply is
  // collected and anything identifying the visitor typed is removed before it is sent.
  const reply = guardSensitiveEcho(
    guardDemoOffers(
      streamGeminiReply({
        system,
        messages: checked.messages,
        tools: TOOL_DECLARATIONS,
        runTool,
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)])
      }),
      userAskedForDemo(latestQuestion)
    ),
    latestQuestion,
    SYSTEM_PROMPT
  );

  // Wait for the first piece before answering, so quota and outage errors become a clean JSON error
  // the widget can show instead of a half-written reply.
  let first;
  try {
    first = await reply.next();
  } catch (error) {
    await refundGuest();
    const headers = guest ? guestHeaders({ ...guest, remaining: guest.remaining + 1 }) : undefined;
    if (error instanceof ChatProviderError) {
      console.error("[chat]", error.message);
      return errorResponse(error.busy ? 503 : 502, error.busy ? BUSY : UNAVAILABLE, headers);
    }
    console.error("[chat]", error);
    return errorResponse(502, UNAVAILABLE, headers);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!first.done) controller.enqueue(encoder.encode(first.value));
        for await (const text of reply) controller.enqueue(encoder.encode(text));
      } catch (error) {
        console.error("[chat] stream interrupted:", error?.message ?? error);
        controller.enqueue(encoder.encode("\n\n(Sorry, the reply was cut short. Please ask again, or book a demo.)"));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(guest ? guestHeaders(guest) : {})
    }
  });
}
