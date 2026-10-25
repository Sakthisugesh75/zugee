// lib/chatbot/format.js
// Turns the assistant's raw reply into what the widget shows: demo markers removed (and returned as
// product ids), a half-arrived marker at the end of a stream hidden, and light formatting split into
// segments. Segments are rendered as React text and <strong> elements, never as HTML, so model output
// cannot inject markup or scripts.
// No JSX and relative imports only, so `node --test` can load this file.

const MARKERS = /\[\[demo:([a-z0-9-]+)\]\]/g;
// The start of a marker still streaming in: "[", "[[", "[[de", … "[[demo:aqua-e"
const PARTIAL_MARKER = /\[(\[(d(e(m(o(:[a-z0-9-]*\]?)?)?)?)?)?)?$/;

/** @returns {{ visible: string, demoSlugs: string[] }} at most 3 distinct product ids */
export function splitReply(text) {
  const demoSlugs = [...new Set([...text.matchAll(MARKERS)].map((m) => m[1]))].slice(0, 3);
  const visible = text.replace(MARKERS, "").replace(PARTIAL_MARKER, "").trimEnd();
  return { visible, demoSlugs };
}

/**
 * "* " / "- " bullets become "• ", and **bold** spans become { bold: true } segments.
 * @returns {{ text: string, bold: boolean }[]}
 */
export function richSegments(text) {
  const normalised = text.replace(/^(\s*)[*-] /gm, "$1• ");
  return normalised
    .split(/(\*\*[^*\n]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part) => (/^\*\*[^*\n]+\*\*$/.test(part) ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false }));
}
