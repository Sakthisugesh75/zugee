// app/sitemap.js
// Next.js sitemap generator for SEO.
// Search engines ignore #fragment URLs, so only real routes are listed: the homepage, the products
// hub and the product landing pages.
//
// The legal pages are left out on purpose: they are always noindex (lib/legal.js), and listing a
// noindex URL in the sitemap is a contradiction Search Console reports as an error.

import { SITE_URL } from "@/lib/site";
import { productPages } from "@/lib/product-pages";

// Bump when the homepage content changes. A fixed date (not new Date()) keeps lastModified
// meaningful: search engines stop trusting lastmod on sites where it changes on every build.
export const HOMEPAGE_UPDATED = "2026-10-25";
// Bump when any product page's copy changes.
export const PRODUCT_PAGES_UPDATED = "2026-10-25";

export default function sitemap() {
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
    }))
  ];
}
