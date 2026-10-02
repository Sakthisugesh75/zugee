// app/robots.js
// Dynamic robots.txt configuration for search engine crawlers.
// Keeps the admin portal and API routes out of search indexes.

import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
