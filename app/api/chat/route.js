// app/api/chat/route.js
// The website chat assistant ("Ask Tutu"). POST streams the model's reply back as plain text; GET
// tells the widget how many free messages a guest has left today.
// The API key never leaves the server; no chat content is stored or logged anywhere on our side.
//
// Limits:
//   everyone   per-IP burst limits in memory (6/min, 40/hour), as before
//   guests     10 messages a day (midnight IST reset), 3 s cooldown, 5 per 30 s, 1,000 characters,
//              counted in Supabase per signed guest cookie plus a per-IP backstop
//              (lib/chatbot/guest-limits.js); 429 with Retry-After when exceeded
//   signed in  an admin session (the only sign-in on this site) skips the guest limits
// History: the model sees only the last 12 messages of the conversation.
// Logging: one metrics line per request (lib/chatbot/metrics.js): hashed IP, counts, latency,
// tokens, error code. Never message text.

import { NextResponse } from "next/server";
import { buildSystemPrompt, demoAlreadyOffered, DEMO_ALREADY_OFFERED_NOTE } from "@/lib/chatbot/knowledge";
import { validateChatRequest } from "@/lib/chatbot/validate";
import { ChatProviderError, streamGeminiReply } from "@/lib/chatbot/gemini";
import { needsGstCalculation, runTool, TOOL_DECLARATIONS } from "@/lib/chatbot/tools";
import { guardDemoOffers, userAskedForDemo } from "@/lib/chatbot/demo-guard";
import { guardSensitiveEcho } from "@/lib/chatbot/pii-guard";
import { chatPolicy, checkGuest, GUEST_COOKIE_NAME, guestSecret, refund } from "@/lib/chatbot/guest-limits";
import { guestUsageBackend, maybePurgeOldRows } from "@/lib/chatbot/guest-store-supabase";
import { hashIp, logChatMetrics, redactForLog, trimHistory } from "@/lib/chatbot/metrics";
import { isAdminRequest } from "@/lib/auth";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

// Vercel: allow a slow reply to finish streaming.
export const maxDuration = 60;

// Per IP, for everyone: a burst limit and an hourly limit (per server instance).
const minuteLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 6 });
const hourLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 40 });

// Built once per server instance: the prompt only changes with a deploy.
const SYSTEM_PROMPT = buildSystemPrompt();
const HISTORY_SENT_TO_MODEL = 12;

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

/** The IP as a short keyed hash for logs; never the address itself. */
function ipHashFor(ip) {
  try {
    return hashIp(ip, guestSecret());
  } catch {
    return "unavailable";
  }
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
    logChatMetrics({ event: "status_error", status: 503, code: redactForLog(error.message) });
    return errorResponse(503, UNAVAILABLE);
  }
}

export async function POST(request) {
  const started = Date.now();
  const ip = getClientIp(request);
  const ipHash = ipHashFor(ip);
  const metric = (fields) => logChatMetrics({ ipHash, latencyMs: Date.now() - started, ...fields });

  if (!process.env.GEMINI_API_KEY) {
    metric({ event: "error", status: 503, code: "no_api_key" });
    return errorResponse(503, UNAVAILABLE);
  }

  for (const limiter of [minuteLimiter, hourLimiter]) {
    const state = limiter.check(ip);
    if (state.limited) {
      metric({ event: "limited", status: 429, code: "ip_rate" });
      return errorResponse(429, `Too many messages. Please try again in ${retryAfterMinutes(state.retryAfterMs)} minute(s).`, {
        "Retry-After": String(Math.ceil(state.retryAfterMs / 1000))
      });
    }
  }

  const policy = chatPolicy(isSignedIn(request));
  const body = await request.json().catch(() => null);
  // Invalid requests are rejected before anything is counted.
  const checked = validateChatRequest(body, { userChars: policy.userChars });
  if (!checked.ok) {
    metric({ event: "rejected", status: 400, code: "invalid_request" });
    return errorResponse(400, checked.error);
  }
  const guestFlag = policy.applyGuestLimits;

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
      metric({ event: "error", status: 503, code: `guest_store: ${redactForLog(error.message)}`, guest: true });
      return errorResponse(503, UNAVAILABLE);
    }
    if (!guest.allowed) {
      metric({ event: "limited", status: 429, code: `guest_${guest.reason}`, guest: true });
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
    await Promise.all([refund(backend, guest.keys.guest), refund(backend, guest.keys.ip)]).catch(() => {});
  };

  // The model sees the last 12 messages; older turns are dropped server-side.
  const history = trimHistory(checked.messages, HISTORY_SENT_TO_MODEL);
  // Once a demo has been offered, a note after the (cached) prompt stops the model offering it again.
  const system = demoAlreadyOffered(history) ? `${SYSTEM_PROMPT}\n\n${DEMO_ALREADY_OFFERED_NOTE}` : SYSTEM_PROMPT;

  let usage = null;
  const latestQuestion = history[history.length - 1].content;
  // Backstops: drop a closing demo pitch the visitor did not ask for; if the message looks
  // sensitive, collect the reply and remove anything identifying the visitor typed.
  const reply = guardSensitiveEcho(
    guardDemoOffers(
      streamGeminiReply({
        system,
        messages: history,
        tools: TOOL_DECLARATIONS,
        runTool,
        // An amount calculation always goes through lib/gst.js, never the model's own arithmetic.
        forceTool: needsGstCalculation(latestQuestion),
        onUsage: (u) => (usage = u),
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
    const busy = error instanceof ChatProviderError && error.busy;
    const status = busy ? 503 : 502;
    const code = error instanceof ChatProviderError ? `provider_${error.status ?? "error"}` : redactForLog(error?.cause?.code ?? error?.message);
    metric({ event: "error", status, code, messages: checked.messages.length, guest: guestFlag });
    return errorResponse(status, busy ? BUSY : UNAVAILABLE, headers);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let code;
      try {
        if (!first.done) controller.enqueue(encoder.encode(first.value));
        for await (const text of reply) controller.enqueue(encoder.encode(text));
      } catch (error) {
        code = error instanceof ChatProviderError ? `stream_provider_${error.status ?? "error"}` : "stream_interrupted";
        controller.enqueue(encoder.encode("\n\n(Sorry, the reply was cut short. Please ask again, or book a demo.)"));
      } finally {
        controller.close();
        metric({
          event: "reply",
          status: 200,
          code,
          messages: checked.messages.length,
          inputTokens: usage?.inputTokens,
          outputTokens: usage?.outputTokens,
          guest: guestFlag
        });
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
