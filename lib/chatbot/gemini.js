// lib/chatbot/gemini.js
// Server-only: streams a reply from Google's Gemini API (Google AI Studio key) as plain text chunks,
// running tool calls (function calling) on the way. One function, so another provider can replace
// it without touching the route or the widget.
//
// Env: GEMINI_API_KEY (required), GEMINI_MODEL (optional, default below).
// Free-tier note: Google may use free-tier prompts and replies to improve its products; the widget
// and the Privacy Policy say so.
//
// Function calling (REST generateContent, verified against the live API on 2026-10-25): a model turn
// may contain functionCall parts { name, args, id } carrying a thoughtSignature. The model's turn is
// sent back unchanged (signatures included), followed by a user turn of functionResponse parts
// { name, id, response }.

// Google's recommended model for new projects that need speed and low cost; thinking defaults to minimal.
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
const MAX_TOOL_ROUNDS = 3;

export class ChatProviderError extends Error {
  /** @param {string} message @param {{ status?: number, busy?: boolean }} [info] */
  constructor(message, info = {}) {
    super(message);
    this.name = "ChatProviderError";
    this.status = info.status;
    this.busy = Boolean(info.busy);
  }
}

/** Parses an SSE body into JSON chunks; malformed lines are skipped, not fatal. */
async function* sseChunks(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const parseLine = (raw) => {
    const line = raw.trim();
    if (!line.startsWith("data:")) return null;
    try {
      return JSON.parse(line.slice(5));
    } catch {
      return null;
    }
  };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const chunk = parseLine(buffer.slice(0, newline));
      buffer = buffer.slice(newline + 1);
      if (chunk) yield chunk;
    }
  }
  const last = parseLine(buffer);
  if (last) yield last;
}

/**
 * Yields the reply text as it is generated. When the model calls a tool, `runTool` is executed and
 * the result sent back, up to MAX_TOOL_ROUNDS times.
 * @param {{ system: string, messages: { role: "user"|"assistant", content: string }[], signal?: AbortSignal,
 *           apiKey?: string, model?: string, tools?: object[],
 *           runTool?: (name: string, args: object) => object }} options
 */
export async function* streamGeminiReply({ system, messages, signal, apiKey = process.env.GEMINI_API_KEY, model, tools = [], runTool }) {
  if (!apiKey) throw new ChatProviderError("GEMINI_API_KEY is not set");
  const modelId = model || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const contents = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

  for (let round = 0; ; round++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        // The key goes in a header, not the URL, so it never lands in request logs.
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          ...(tools.length && round < MAX_TOOL_ROUNDS ? { tools: [{ functionDeclarations: tools }] } : {}),
          generationConfig: { maxOutputTokens: 1536 }
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
    if (!response.body) throw new ChatProviderError("Gemini returned no body", { status: 502 });

    const modelParts = []; // the model's turn as received, to send back unchanged after a tool call
    const calls = [];
    let blocked = false;
    for await (const chunk of sseChunks(response.body)) {
      if (chunk.promptFeedback?.blockReason) blocked = true;
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        modelParts.push(part);
        if (part.functionCall?.name) calls.push(part.functionCall);
        // Skip thought summaries; only the answer is shown.
        else if (typeof part.text === "string" && !part.thought) yield part.text;
      }
    }
    if (blocked) throw new ChatProviderError("Gemini blocked the prompt", { status: 400 });
    if (calls.length === 0) return;
    if (!runTool || round >= MAX_TOOL_ROUNDS) throw new ChatProviderError("Gemini asked for a tool it cannot use", { status: 502 });

    contents.push({ role: "model", parts: modelParts });
    contents.push({
      role: "user",
      parts: calls.map((call) => ({
        functionResponse: { name: call.name, ...(call.id ? { id: call.id } : {}), response: runTool(call.name, call.args) }
      }))
    });
  }
}
