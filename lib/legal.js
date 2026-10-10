// lib/legal.js
// Facts shared by the three legal pages (/privacy, /terms, /refund), the footer and the sitemap.
// No JSX and relative imports only, so `node --test` can load this file.

import { SUPPORT_EMAIL } from "./site.js";

// TRUE while any page still contains a <Confirm> placeholder. While true the legal pages are kept
// out of search engines and the sitemap, and show a "draft" notice. Set to false only when every
// placeholder has been replaced with a confirmed fact (tests/site-content.test.mjs enforces this).
export const LEGAL_DRAFT = false;

// Shown on every legal page. Change it whenever the wording of any of them changes.
export const LEGAL_LAST_UPDATED = "10 October 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-10-10";

export const COMPANY = {
  name: "Zugee Systems Technologies Pvt. Ltd.",
  brand: "ZUGEE",
  city: "Coimbatore, Tamil Nadu, India",
  // The same place, split up for the Organization structured data (country as ISO 3166 code).
  address: { locality: "Coimbatore", region: "Tamil Nadu", country: "IN" },
  email: SUPPORT_EMAIL,
  // Matches the support hours in the Terms of Service.
  supportHours: "Mon–Sat, 10am–6pm IST"
  // No phone number: the site publishes none (tests/public-contact.test.mjs).
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
