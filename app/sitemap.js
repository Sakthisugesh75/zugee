// app/sitemap.js
// Next.js sitemap generator for SEO.
// Search engines ignore #fragment URLs, so only real routes are listed: the homepage, the products
// hub, the product landing pages, /pricing, /about, the blog and its published posts, and the legal
// pages. /case-studies stays out until a real case study is published (it is noindex until then).

import { SITE_URL } from "@/lib/site";
import { productPages } from "@/lib/product-pages";
import { publishedPosts, postPath } from "@/lib/blog";
import { LEGAL_DRAFT, LEGAL_LAST_UPDATED_ISO, LEGAL_PAGES } from "@/lib/legal";

// Bump when the homepage content changes. A fixed date (not new Date()) keeps lastModified
// meaningful: search engines stop trusting lastmod on sites where it changes on every build.
export const HOMEPAGE_UPDATED = "2026-10-31";
// Bump when any product page's copy changes.
export const PRODUCT_PAGES_UPDATED = "2026-10-31";
// Bump when /pricing or /about changes.
export const PRICING_PAGE_UPDATED = "2026-10-31";
export const ABOUT_PAGE_UPDATED = "2026-10-31";

export default function sitemap() {
  const posts = publishedPosts();
  // The blog index changes whenever a post is published or updated.
  const blogUpdated = posts.map((post) => post.dateModified).sort().at(-1) || HOMEPAGE_UPDATED;

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
    {
      url: `${SITE_URL}/pricing`,
      lastModified: PRICING_PAGE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: ABOUT_PAGE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: blogUpdated,
      changeFrequency: "weekly",
      priority: 0.7
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}${postPath(post)}`,
      lastModified: post.dateModified,
      changeFrequency: "monthly",
      priority: 0.6
    })),
    // Legal pages: listed only while they are indexable (see lib/legal.js).
    ...(LEGAL_DRAFT
      ? []
      : LEGAL_PAGES.map((page) => ({
          url: `${SITE_URL}${page.href}`,
          lastModified: LEGAL_LAST_UPDATED_ISO,
          changeFrequency: "yearly",
          priority: 0.3
        })))
  ];
}
