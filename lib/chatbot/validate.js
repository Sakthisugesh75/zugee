// lib/chatbot/validate.js
// Checks a chat request from the browser before anything is sent to the model.
// No JSX and relative imports only, so `node --test` can load this file.

export const CHAT_LIMITS = {
  maxMessages: 20, // the whole conversation, user and assistant turns together
  userChars: 800, // one visitor message
  assistantChars: 4000, // one earlier assistant reply, sent back as history
  totalChars: 16000 // everything sent in one request
};

/**
 * @param {unknown} body  the parsed JSON body: { messages: [{ role: "user"|"assistant", content: string }] }
 * @returns {{ ok: true, messages: { role: "user"|"assistant", content: string }[] } | { ok: false, error: string }}
 */
export function validateChatRequest(body) {
  const messages = body && typeof body === "object" && !Array.isArray(body) ? body.messages : undefined;
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false, error: "No messages." };
  if (messages.length > CHAT_LIMITS.maxMessages) {
    return { ok: false, error: "This conversation is long. Please start a new chat, or book a demo to talk to our team." };
  }

  const clean = [];
  let total = 0;
  for (const message of messages) {
    if (!message || (message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string") {
      return { ok: false, error: "Invalid message." };
    }
    const content = message.content.trim();
    const limit = message.role === "user" ? CHAT_LIMITS.userChars : CHAT_LIMITS.assistantChars;
    if (!content) return { ok: false, error: "Empty message." };
    if (content.length > limit) {
      return { ok: false, error: `Please keep each message under ${CHAT_LIMITS.userChars} characters.` };
    }
    total += content.length;
    clean.push({ role: message.role, content });
  }
  if (total > CHAT_LIMITS.totalChars) {
    return { ok: false, error: "This conversation is long. Please start a new chat, or book a demo to talk to our team." };
  }
  if (clean[0].role !== "user" || clean[clean.length - 1].role !== "user") {
    return { ok: false, error: "Invalid conversation." };
  }
  return { ok: true, messages: clean };
}
