// lib/legal.js
// Facts shared by the three legal pages (/privacy, /terms, /refund), the footer and the sitemap.
// No JSX and relative imports only, so `node --test` can load this file.

import { SUPPORT_EMAIL } from "./site.js";

// TRUE while any page still contains a <Confirm> placeholder. While true the legal pages are kept
// out of search engines and the sitemap, and show a "draft" notice. Set to false only when every
// placeholder has been replaced with a confirmed fact (tests/site-content.test.mjs enforces this).
export const LEGAL_DRAFT = false;

// Shown on every legal page. Change it whenever the wording of any of them changes.
export const LEGAL_LAST_UPDATED = "2 October 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-10-02";

export const COMPANY = {
  name: "Zugee Systems Technologies Pvt. Ltd.",
  brand: "ZUGEE",
  city: "Coimbatore, Tamil Nadu, India",
  email: SUPPORT_EMAIL,
  phone: "+91 96291 44648",
  phoneHref: "tel:+919629144648"
};

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund & Cancellation Policy" }
];

/** Page metadata for a legal page. Unindexed while the pages are still a draft. */
export function legalMetadata({ path, title, description }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(LEGAL_DRAFT ? { robots: { index: false, follow: true } } : {})
  };
}
