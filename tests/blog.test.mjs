// tests/blog.test.mjs
// Blog posts (lib/blog.js) must meet the SEO brief, link to a real product page, and carry
// structured data that claims nothing the page doesn't show.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  BLOG_POSTS,
  TRIP_SHEET_DOWNLOAD,
  articleSchema,
  blogBreadcrumbSchema,
  getPost,
  postHeadings,
  publishedPosts
} from "../lib/blog.js";
import { PRODUCTS, productPagePath } from "../lib/products.js";

const SITE = "https://www.example.com";
const REQUIRED = ["slug", "title", "h1", "description", "category", "author", "datePublished", "dateModified", "ogImage", "relatedProductSlug", "blocks"];
const BANNED_KEYS = /^(aggregateRating|review|reviews|ratingValue|reviewCount|ratingCount|bestRating|offers|price|priceCurrency|priceRange|lowPrice|highPrice)$/i;

function allKeys(value) {
  if (Array.isArray(value)) return value.flatMap(allKeys);
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => [k, ...allKeys(v)]);
  return [];
}

function allStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

test("every post has the required fields", () => {
  assert.ok(BLOG_POSTS.length > 0);
  for (const post of BLOG_POSTS) {
    for (const field of REQUIRED) {
      assert.ok(post[field] !== undefined && post[field] !== "", `${post.slug}: missing ${field}`);
    }
    assert.match(post.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${post.slug}: slug format`);
    assert.match(post.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(post.dateModified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(post.blocks) && post.blocks.length > 0);
  }
});

test("slugs are unique", () => {
  const slugs = BLOG_POSTS.map((post) => post.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("titles and descriptions fit search results", () => {
  for (const post of BLOG_POSTS) {
    assert.ok(post.title.length <= 70, `${post.slug}: title is ${post.title.length} chars`);
    assert.ok(
      post.description.length >= 120 && post.description.length <= 160,
      `${post.slug}: description is ${post.description.length} chars`
    );
  }
});

test("each post has exactly one H1 and no H1 blocks in its body", () => {
  for (const post of BLOG_POSTS) {
    assert.equal(typeof post.h1, "string");
    assert.equal(post.blocks.filter((block) => block.type === "h1").length, 0, `${post.slug}: h1 block in body`);
  }
});

test("H2s have unique ids for the table of contents", () => {
  for (const post of BLOG_POSTS) {
    const ids = postHeadings(post).map((h) => h.id);
    assert.ok(ids.every(Boolean), `${post.slug}: H2 without id`);
    assert.equal(new Set(ids).size, ids.length, `${post.slug}: duplicate H2 id`);
  }
});

test("og images live under /og/", () => {
  for (const post of BLOG_POSTS) assert.match(post.ogImage, /^\/og\/[a-z0-9-]+\.(jpg|png)$/);
});

test("no unfilled TODO text reaches the page", () => {
  for (const post of BLOG_POSTS) {
    for (const s of allStrings(post)) assert.ok(!/TODO/.test(s), `${post.slug}: "${s}"`);
  }
});

test("structured data has no ratings, reviews or prices, and credits the organisation", () => {
  for (const post of BLOG_POSTS) {
    const article = articleSchema(post, SITE);
    for (const key of allKeys([article, blogBreadcrumbSchema(post, SITE)])) {
      assert.ok(!BANNED_KEYS.test(key), `${post.slug}: structured data contains "${key}"`);
    }
    assert.equal(article["@type"], "Article");
    assert.equal(article.headline, post.h1);
    assert.equal(article.image, `${SITE}${post.ogImage}`);
    assert.equal(article.publisher["@id"], `${SITE}/#organization`);
    assert.equal(article.author["@id"], `${SITE}/#organization`);
    assert.equal(article.mainEntityOfPage["@id"], `${SITE}/blog/${post.slug}`);

    const crumbs = blogBreadcrumbSchema(post, SITE).itemListElement.map((c) => c.name);
    assert.deepEqual(crumbs, ["Home", "Blog", post.h1]);
  }
});

test("each post's CTA product exists and has a landing page", () => {
  for (const post of BLOG_POSTS) {
    const product = PRODUCTS.find((p) => p.pageSlug === post.relatedProductSlug);
    assert.ok(product, `${post.slug}: no product with pageSlug ${post.relatedProductSlug}`);
    assert.equal(product.status, "available");
    assert.equal(productPagePath(product), `/${post.relatedProductSlug}`);
  }
});

test("helpers: getPost and publishedPosts", () => {
  assert.equal(getPost("trip-sheet-format")?.slug, "trip-sheet-format");
  assert.equal(getPost("no-such-post"), null);
  assert.ok(publishedPosts().some((p) => p.slug === "trip-sheet-format"));
});

test("the trip sheet Excel template exists in public/downloads", () => {
  const file = path.join(process.cwd(), "public", TRIP_SHEET_DOWNLOAD);
  assert.ok(fs.existsSync(file), `${file} is missing; run node scripts/generate-trip-sheet-template.mjs`);
  // An .xlsx is a zip: it starts with the local file header signature "PK\x03\x04".
  assert.equal(fs.readFileSync(file).subarray(0, 4).toString("binary"), "PK\x03\x04");
  for (const post of BLOG_POSTS) {
    for (const block of post.blocks.filter((b) => b.type === "download")) {
      assert.ok(fs.existsSync(path.join(process.cwd(), "public", block.href)), `${post.slug}: ${block.href} missing`);
    }
  }
});
