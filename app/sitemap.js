// app/sitemap.js
// Next.js sitemap generator for SEO.
// Search engines ignore #fragment URLs, so only real routes are listed: the homepage, the products
// hub, the product landing pages, and the legal pages once they are final.

import { SITE_URL } from "@/lib/site";
import { LEGAL_DRAFT, LEGAL_LAST_UPDATED_ISO, LEGAL_PAGES } from "@/lib/legal";
import { productPages } from "@/lib/product-pages";

// Bump when the homepage content changes. A fixed date (not new Date()) keeps lastModified meaningful.
const HOMEPAGE_UPDATED = "2026-10-04";
// Bump when any product page's copy changes.
const PRODUCT_PAGES_UPDATED = "2026-10-10";

export default function sitemap() {
  // While the legal pages still hold unconfirmed placeholders they are unindexed and left out.
  const legalPages = LEGAL_DRAFT
    ? []
    : LEGAL_PAGES.map((page) => ({
        url: `${SITE_URL}${page.href}`,
        lastModified: LEGAL_LAST_UPDATED_ISO,
        changeFrequency: "yearly",
        priority: 0.3
      }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: HOMEPAGE_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: PRODUCT_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9
    },
    ...productPages().map(({ product }) => ({
      url: `${SITE_URL}/${product.pageSlug}`,
      lastModified: PRODUCT_PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8
    })),
    ...legalPages
  ];
}
