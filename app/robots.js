// app/robots.js
// Dynamic robots.txt configuration for search engine crawlers.
// Excludes internal /admin and /api endpoints from search indexing.

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
