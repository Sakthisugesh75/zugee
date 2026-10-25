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

// Markdown links [text](href). Only these targets become links; anything else (javascript:, data:,
// protocol-relative //host, http:, phone links) is shown as plain text.
const LINK = /\[([^\]\n]{1,100})\]\(([^)\s]{1,300})\)/g;
const SAFE_HREF = /^(https:\/\/[^\s]+|\/(?!\/)[^\s]*|#[A-Za-z][\w-]*|mailto:[^\s@]+@[^\s@]+)$/;

// Links to our own site become site paths, so they open in the same tab (and #anchors scroll).
const OWN_SITE = /^https:\/\/(www\.)?getzugee\.com(?=[/#]|$)/i;

export function isSafeHref(href) {
  return SAFE_HREF.test(String(href));
}

function boldSegments(text) {
  return text
    .split(/(\*\*[^*\n]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part) => (/^\*\*[^*\n]+\*\*$/.test(part) ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false }));
}

/**
 * "* " / "- " bullets become "• ", **bold** spans become { bold: true } segments, and safe Markdown
 * links become { href } segments (unsafe ones keep only their text).
 * @returns {{ text: string, bold: boolean, href?: string }[]}
 */
export function richSegments(text) {
  const normalised = text.replace(/^(\s*)[*-] /gm, "$1• ");
  const segments = [];
  let last = 0;
  for (const match of normalised.matchAll(LINK)) {
    segments.push(...boldSegments(normalised.slice(last, match.index)));
    const [, label, raw] = match;
    const href = OWN_SITE.test(raw) ? raw.replace(OWN_SITE, "") || "/" : raw;
    segments.push(isSafeHref(href) ? { text: label, bold: false, href } : { text: label, bold: false });
    last = match.index + match[0].length;
  }
  segments.push(...boldSegments(normalised.slice(last)));
  return segments;
}
