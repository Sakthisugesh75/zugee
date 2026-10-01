// app/robots.js
// Dynamic robots.txt configuration for search engine crawlers.
// Keeps the admin portal and API routes out of search indexes.

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zugee.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
