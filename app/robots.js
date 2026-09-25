// app/robots.js
// Dynamic robots.txt configuration for search engine crawlers.
// Keeps the admin portal, the signed-in product app (/app) and API routes out of search indexes.

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/app", "/api"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
