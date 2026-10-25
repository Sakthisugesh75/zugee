// scripts/chat-eval-checks.mjs
// Response checks used by scripts/chat-eval.mjs that need more than a regex, kept here so they have
// their own tests (tests/chatbot.test.mjs). Deliberately independent of lib/chatbot/demo-guard.js:
// the eval must be able to catch what the guard misses.

/** A demo, call or "would you like to see it" pitch, or a demo marker. */
export function isDemoPush(text) {
  return /\[\[demo:|\bdemo\b|demonstration|walk-?through|book a call|schedule a call|pricing call|(would you|if you would|if you'd) like to see|want to see (it|how)|in action\b|our team can (arrange|show you|walk you)/i.test(text);
}

/**
 * Claims a live / direct Tally sync. A negated sentence ("ZUGEE does not sync directly with Tally")
 * is not a claim (the eval run 4 false positive).
 */
export function claimsLiveTallySync(text) {
  const re = /(syncs?|integrates?) (directly |automatically |live )?with Tally(?! is)/gi;
  for (const match of String(text).matchAll(re)) {
    const before = text.slice(Math.max(0, match.index - 30), match.index);
    if (!/\b(not|n't|never|no)\b[^.]*$/i.test(before) && !/n't\s*$/i.test(before)) return true;
  }
  return false;
}

/**
 * Mentions part payments or instalments without a can't-confirm (run 6 said ZUGEE Water records
 * "part payments as they come in", copied from ZUGEE Hostels).
 */
export function claimsPartPayments(text) {
  const mentions = /part[- ]payments?|instal(l)?ments?/i.test(text);
  const hedged = /can'?t confirm|cannot confirm|not able to confirm|unable to confirm|not sure/i.test(text);
  return mentions && !hedged;
}
