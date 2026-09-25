// app/sitemap.js
// Next.js sitemap generator for SEO.
// The site is a single page: search engines ignore #fragment URLs, so only real routes are listed.

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    }
  ];
}
