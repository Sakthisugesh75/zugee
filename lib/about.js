// lib/about.js
// Owner-supplied details for the /about page. No JSX, so tests can load it.
//
// OWNER DECISION: anything not yet filled in is HIDDEN, never shown as placeholder text. Each
// section on /about renders only when its data below is filled:
//   FOUNDER_STORY null      -> "Why we started" is not rendered
//   FOUNDERS empty          -> "The team" is not rendered
//   ADDRESS null            -> "Where we are" shows LOCATION_DISPLAY from lib/site.js instead
//   CIN / GSTIN null        -> that line is not rendered

// TODO(owner): Founder story, 3–5 sentences, as an array of paragraphs, e.g.
// ["We started ZUGEE in 2024 after …", "…"]. Leave null to hide "Why we started".
export const FOUNDER_STORY = null;

// TODO(owner): One entry per founder / team member. Leave empty to hide "The team".
// Shape: { name: "…", role: "Co-founder & CEO", bio: "2–3 lines.", photo: "/team/name.jpg" }
// `photo` is a path under public/ (square, at least 400×400). Without a photo, initials are shown.
export const FOUNDERS = [];

// TODO(owner): Full registered/office address, one line per array item, e.g.
// ["No. 12, Street name", "Area", "Salem 636 001", "Tamil Nadu, India"].
// Leave null to show LOCATION_DISPLAY ("Salem, Tamil Nadu, India").
export const ADDRESS = null;

// TODO(owner, optional): Company registration numbers, as strings. Leave null to hide.
export const CIN = null;
export const GSTIN = null;

/** True when an owner field has real content (non-empty string or non-empty array). */
export function isFilled(value) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}
