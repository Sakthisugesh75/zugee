// lib/site.js
// The only place the site's domain is written down. Metadata, JSON-LD, robots.txt, the sitemap and
// email links all derive from these, so a domain change is a one-file edit.

// The public production site. Used as-is where a link must point at the live site even when the
// app runs somewhere else (the signature in customer emails, for example).
export const CANONICAL_SITE_URL = "https://www.getzugee.com";

// The mailbox customers write to. Mailboxes live on the bare domain, without "www".
export const SUPPORT_EMAIL = "support@getzugee.com";

// Where this deployment is served from, without a trailing slash. Read on each call so that code
// running outside the Next.js build (tests, scripts) sees the current environment.
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL).replace(/\/+$/, "");
}

export const SITE_URL = getSiteUrl();
