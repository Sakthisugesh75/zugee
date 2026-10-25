// lib/chatbot/metrics.js
// Privacy-safe request metrics for the chat route: one JSON line per request with the time, a keyed
// hash of the IP, the number of messages, latency, token usage and an error code. Never message
// text. Anything free-form that is logged (provider error details) has phone numbers and emails
// masked first.
// No JSX and relative imports only, so `node --test` can load this file.

import crypto from "crypto";

/** A short keyed hash of the IP: lets logs group requests without storing the address. */
export function hashIp(ip, secret) {
  return crypto.createHmac("sha256", secret).update(`log:${ip}`).digest("base64url").slice(0, 12);
}

/** Masks phone numbers and email addresses in a string that is about to be logged. */
export function redactForLog(text) {
  return String(text ?? "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]")
    .replace(/\+?\d[\d\s-]{7,}\d/g, "[phone]")
    .slice(0, 300);
}

/**
 * Keeps the last `maxMessages` messages and makes sure the trimmed history still starts with a
 * visitor message (the model API requires that).
 */
export function trimHistory(messages, maxMessages = 12) {
  let trimmed = messages.slice(-maxMessages);
  while (trimmed.length && trimmed[0].role !== "user") trimmed = trimmed.slice(1);
  return trimmed;
}

/** Writes one metrics line. Only the fields listed here can ever be logged. */
export function logChatMetrics({ event, ipHash, messages, latencyMs, inputTokens, outputTokens, status, code, guest }) {
  const line = { t: new Date().toISOString(), event, ipHash, messages, latencyMs, inputTokens, outputTokens, status, code, guest };
  for (const key of Object.keys(line)) if (line[key] === undefined) delete line[key];
  console.log(`[chat] ${JSON.stringify(line)}`);
}
