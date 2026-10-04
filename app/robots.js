// app/robots.js
// Dynamic robots.txt configuration for search engine and AI crawlers.
// Keeps the admin portal and API routes out of search indexes.

import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = ["/admin", "/api"];

// Named explicitly so AI answer engines (ChatGPT, Claude, Perplexity, Gemini) and Bing know they
// are welcome. A crawler that matches a named group ignores the "*" group, so each group must
// repeat the private paths.
const WELCOMED_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Bingbot"];

export default function robots() {
  return {
    rules: [
      {
        userAgent: WELCOMED_CRAWLERS,
        allow: "/",
        disallow: PRIVATE_PATHS
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
