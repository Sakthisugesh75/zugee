// lib/chatbot/gemini.js
// Server-only: streams a reply from Google's Gemini API (Google AI Studio key) as plain text chunks.
// One function, so another provider can replace it without touching the route or the widget.
//
// Env: GEMINI_API_KEY (required), GEMINI_MODEL (optional, default below).
// Free-tier note: Google may use free-tier prompts and replies to improve its products; the widget
// and the Privacy Policy say so.

// Google's recommended model for new projects that need speed and low cost; thinking defaults to minimal.
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

export class ChatProviderError extends Error {
  /** @param {string} message @param {{ status?: number, busy?: boolean }} [info] */
  constructor(message, info = {}) {
    super(message);
    this.name = "ChatProviderError";
    this.status = info.status;
    this.busy = Boolean(info.busy);
  }
}

/**
 * Yields the reply text as it is generated.
 * @param {{ system: string, messages: { role: "user"|"assistant", content: string }[], signal?: AbortSignal,
 *           apiKey?: string, model?: string }} options
 */
export async function* streamGeminiReply({ system, messages, signal, apiKey = process.env.GEMINI_API_KEY, model }) {
  if (!apiKey) throw new ChatProviderError("GEMINI_API_KEY is not set");
  const modelId = model || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      // The key goes in a header, not the URL, so it never lands in request logs.
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: 1024 }
      }),
      signal
    }
  );

  if (!response.ok) {
    // 429: the free tier's per-minute or per-day limit. Details stay in the server log only.
    const detail = await response.text().catch(() => "");
    throw new ChatProviderError(`Gemini ${response.status}: ${detail.slice(0, 300)}`, {
      status: response.status,
      busy: response.status === 429 || response.status === 503
    });
  }

  // Server-sent events: "data: {json}" lines separated by blank lines.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let blocked = false;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      let chunk;
      try {
        chunk = JSON.parse(line.slice(5));
      } catch {
        continue;
      }
      if (chunk.promptFeedback?.blockReason) blocked = true;
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        // Skip thought summaries; only the answer is shown.
        if (typeof part.text === "string" && !part.thought) yield part.text;
      }
    }
  }
  if (blocked) throw new ChatProviderError("Gemini blocked the prompt", { status: 400 });
}
