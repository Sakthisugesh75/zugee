// lib/chatbot/demo-guard.js
// Deterministic backstop for the "no unprompted demo pitches" rule. The prompt already says to offer
// a demo only when asked, but the model still sometimes ends a reply with "Would you like a demo?"
// (live eval run 2, 2026-10-25). When the visitor's latest message did not ask for a demo, a quote,
// a price or a call, the final paragraph of the reply is checked and any demo-pitch sentence or demo
// marker in it is removed.
// Only the last two paragraphs are held back while streaming; everything before them streams as usual.
// No JSX and relative imports only, so `node --test` can load this file.

// The visitor asked for something a demo, call or quote answers.
const ASKED = /\b(demos?|demonstration|walk-?through|quotes?|quotations?|price|prices|pricing|cost|costs|how much|call|calls|meeting|trial|book|booking|contact|talk to|speak to|see (it|how|the product)|show me|sales team)\b/i;
// A sentence that pitches a demo or call, including soft pitches without the word "demo"
// ("Would you like to see how ZUGEE Water manages your routes?", live eval run 4).
// …and rephrasings such as "our team can arrange a live walkthrough" (live eval, after run 5).
const PITCH =
  /\b(demo|demonstration|walk-?through|book a call|schedule a call|pricing call|book a meeting|schedule a meeting)\b|\b(would you|if you would|if you'd|you'd) like to see\b|\bwant to see (it|how)\b|\bsee (it|ZUGEE [A-Za-z]+) (in action|working|live)\b|\bour team can (arrange|set up|schedule|show you|walk you)\b/i;
const MARKER = /\[\[demo:[a-z0-9-]+\]\]/g;

export function userAskedForDemo(text) {
  return ASKED.test(String(text ?? ""));
}

/** Removes demo markers and demo-pitch sentences from the final paragraph of a reply. */
export function stripDemoPitch(tail) {
  const withoutMarkers = tail.replace(MARKER, "");
  // Split into sentences, keeping their punctuation and trailing space.
  const sentences = withoutMarkers.match(/[^.!?\n]+[.!?]*\s*|\n+/g) ?? [];
  return sentences.filter((s) => !PITCH.test(s)).join("").replace(/\s+$/, "");
}

/**
 * Wraps a reply stream. If `asked` is true it passes through untouched. Otherwise text is passed on
 * up to the last paragraph break, and the final paragraph is cleaned with stripDemoPitch at the end.
 * @param {AsyncIterable<string>} reply
 */
export async function* guardDemoOffers(reply, asked) {
  if (asked) {
    yield* reply;
    return;
  }
  // Hold back the last TWO paragraphs: the model often puts the pitch in one paragraph and the
  // [[demo:…]] marker alone in the next (live eval run 6), so checking only the last one missed it.
  let pending = "";
  for await (const text of reply) {
    pending += text;
    const last = pending.lastIndexOf("\n\n");
    const cut = last > 0 ? pending.lastIndexOf("\n\n", last - 1) : -1;
    if (cut !== -1) {
      yield pending.slice(0, cut + 2);
      pending = pending.slice(cut + 2);
    }
  }
  const tail = stripDemoPitch(pending);
  if (tail) yield tail;
}
