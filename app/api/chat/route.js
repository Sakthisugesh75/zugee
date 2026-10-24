// app/api/chat/route.js
// The website chat assistant. Streams the model's reply back as plain text.
// The API key never leaves the server; nothing is stored: no chat is saved anywhere on our side.

import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chatbot/knowledge";
import { validateChatRequest } from "@/lib/chatbot/validate";
import { ChatProviderError, streamGeminiReply } from "@/lib/chatbot/gemini";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

// Vercel: allow a slow reply to finish streaming.
export const maxDuration = 60;

// Per IP: a burst limit and an hourly limit, so one visitor cannot use up the free-tier quota.
const minuteLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 6 });
const hourLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 40 });

// Built once per server instance: the prompt only changes with a deploy.
const SYSTEM_PROMPT = buildSystemPrompt();

const UNAVAILABLE = "The chat assistant is not available right now. Please book a demo or message us on WhatsApp.";
const BUSY = "The chat assistant is busy right now. Please try again in a minute, or book a demo or message us on WhatsApp.";

function errorResponse(status, error, headers) {
  return NextResponse.json({ error }, { status, headers });
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

  const body = await request.json().catch(() => null);
  const checked = validateChatRequest(body);
  if (!checked.ok) return errorResponse(400, checked.error);
  minuteLimiter.hit(ip);
  hourLimiter.hit(ip);

  const reply = streamGeminiReply({
    system: SYSTEM_PROMPT,
    messages: checked.messages,
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)])
  });

  // Wait for the first piece before answering, so quota and outage errors become a clean JSON error
  // the widget can show instead of a half-written reply.
  let first;
  try {
    first = await reply.next();
  } catch (error) {
    if (error instanceof ChatProviderError) {
      console.error("[chat]", error.message);
      return errorResponse(error.busy ? 503 : 502, error.busy ? BUSY : UNAVAILABLE);
    }
    console.error("[chat]", error);
    return errorResponse(502, UNAVAILABLE);
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
      "X-Content-Type-Options": "nosniff"
    }
  });
}
