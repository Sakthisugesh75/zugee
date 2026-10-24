// lib/legal.js
// Facts shared by the three legal pages (/privacy, /terms, /refund) and the footer. The legal pages
// are always noindex, so they are never listed in the sitemap.
// No JSX and relative imports only, so `node --test` can load this file.

import { SUPPORT_EMAIL } from "./site.js";

// TRUE while any page still contains a <Confirm> placeholder. While true the legal pages are kept
// out of search engines and show a "draft" notice. Set to false only when every
// placeholder has been replaced with a confirmed fact (tests/site-content.test.mjs enforces this).
export const LEGAL_DRAFT = false;

// Shown on every legal page. Change it whenever the wording of any of them changes.
export const LEGAL_LAST_UPDATED = "25 October 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-10-25";

export const COMPANY = {
  name: "Zugee Systems Technologies Pvt. Ltd.",
  brand: "ZUGEE",
  city: "Salem, Tamil Nadu, India",
  // The same place, split up for the Organization structured data (country as ISO 3166 code).
  address: { locality: "Salem", region: "Tamil Nadu", country: "IN" },
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

/** Page metadata for a legal page. Always noindex so RAG crawlers do not surface legal
 *  disclaimers in brand search summaries, but follow so link equity flows normally.
 *  openGraph is repeated in full because a page's openGraph replaces the root layout's: without it
 *  a shared legal link would show the homepage's title and URL. */
export function legalMetadata({ path, title, description }) {
  const shareTitle = `${title} | ${COMPANY.brand}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: false, follow: true, nocache: true },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: COMPANY.brand,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: shareTitle }],
      locale: "en_IN",
      type: "website"
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: ["/og.jpg"] }
  };
}
