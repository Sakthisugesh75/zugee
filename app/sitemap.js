// app/sitemap.js
// Next.js sitemap generator for SEO.
// The site is a single page: search engines ignore #fragment URLs, so only real routes are listed.

import { SITE_URL } from "@/lib/site";

// Bump when the homepage content changes. A fixed date (not new Date()) keeps lastModified meaningful.
const HOMEPAGE_UPDATED = "2026-09-25";

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: HOMEPAGE_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0
    }
  ];
}
