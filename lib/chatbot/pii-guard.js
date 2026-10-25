// lib/chatbot/pii-guard.js
// Deterministic backstop for "never repeat personal details". The prompt already forbids it, but the
// model still sometimes echoes them (live eval run 5 repeated a patient's name after run 3 did not).
//
// When the visitor's latest message looks sensitive (ID numbers such as Aadhaar or PAN, bank details,
// or patient / health words), that reply is collected in full instead of streamed, and anything the
// visitor typed that could identify a person is removed from it before it is sent: names (capitalised
// words that are not ZUGEE vocabulary), long numbers, and health terms. Other replies stream as usual.
// No JSX and relative imports only, so `node --test` can load this file.

const SENSITIVE =
  /\b(aadhaa?r|pan( card| number)?|passport|voter id|account (number|no)|ifsc|upi pin|otp|patient|diagnos\w*|diabet\w*|hypertension|bp|blood (pressure|sugar|group)|pregnan\w*|hiv|cancer|tumou?r|asthma|thyroid|medical history|prescription|surgery)\b|\b\d{4}\s?\d{4}\s?\d{4}\b|\b[A-Z]{5}\d{4}[A-Z]\b/i;

const HEALTH_TERMS =
  /\b(diabet\w*|hypertension|blood pressure|blood sugar|pregnan\w*|hiv|cancer|tumou?r|asthma|thyroid|surgery)\b/gi;

export function looksSensitive(text) {
  return SENSITIVE.test(String(text ?? ""));
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * What to remove from the reply: names, long numbers and health terms from the visitor's message.
 * `vocabulary` is text whose words are never treated as names (the system prompt: product names,
 * places in the knowledge, GST, Tally, …).
 */
export function sensitiveTerms(userText, vocabulary = "") {
  const known = new Set(vocabulary.toLowerCase().match(/[a-z]+/g) ?? []);
  const terms = new Set();
  // Capitalised words, alone or in runs ("Kavitha Ramesh"), that the knowledge never uses.
  for (const word of userText.match(/\b[A-Z][a-z]{2,}\b/g) ?? []) {
    if (!known.has(word.toLowerCase())) terms.add(word);
  }
  for (const number of userText.match(/\d[\d\s-]{4,}\d/g) ?? []) terms.add(number.trim());
  for (const id of userText.match(/\b[A-Z]{5}\d{4}[A-Z]\b/g) ?? []) terms.add(id);
  for (const health of userText.match(HEALTH_TERMS) ?? []) terms.add(health.replace(/(ic|es|ed)$/i, ""));
  return [...terms];
}

/** Removes every term (and digit sequence equal to a removed number, ignoring spaces) from the reply. */
export function redactEcho(reply, terms) {
  let out = reply;
  for (const term of terms.sort((a, b) => b.length - a.length)) {
    if (/^\d[\d\s-]*$/.test(term)) {
      const digits = term.replace(/\D/g, "");
      out = out.replace(new RegExp(digits.split("").join("[\\s-]?"), "g"), "[number removed]");
    } else if (/^[A-Z]/.test(term)) {
      // Names: whole words only, so "Ramesh" never eats part of another word.
      out = out.replace(new RegExp(`\\b${escape(term)}\\b`, "g"), "[name removed]");
    } else {
      out = out.replace(new RegExp(`\\b${escape(term)}\\w*`, "gi"), "[detail removed]");
    }
  }
  // "[name removed] [name removed]" → one marker.
  return out.replace(/(\[name removed\])(\s+\[name removed\])+/g, "$1");
}

/**
 * Wraps a reply stream. Passes it through untouched unless the visitor's message looks sensitive;
 * then collects it and yields one redacted reply.
 * @param {AsyncIterable<string>} reply
 */
export async function* guardSensitiveEcho(reply, userText, vocabulary = "") {
  if (!looksSensitive(userText)) {
    yield* reply;
    return;
  }
  let full = "";
  for await (const text of reply) full += text;
  const redacted = redactEcho(full, sensitiveTerms(userText, vocabulary));
  if (redacted) yield redacted;
}
