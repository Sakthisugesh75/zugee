// app/sitemap.js
// Next.js sitemap generator for SEO.
// The site is a single page: search engines ignore #fragment URLs, so only real routes are listed.

// Bump when the homepage content changes. A fixed date (not new Date()) keeps lastModified meaningful.
const HOMEPAGE_UPDATED = "2026-09-25";

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

  return [
    {
      url: `${siteUrl}/`,
      lastModified: HOMEPAGE_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0
    }
  ];
}
