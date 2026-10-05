// tests/structured-data.test.mjs
// JSON-LD must describe only what the visible site shows: no ratings, reviews or prices (ZUGEE has
// none published), the FAQ word for word, and only products a business can use today.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { homePageSchema, organizationSchema, serializeJsonLd } from "../lib/structured-data.js";
import { FAQ_ITEMS } from "../lib/site-content.js";
import { PRODUCTS, availableProducts, productAnchor } from "../lib/products.js";
import { COMPANY } from "../lib/legal.js";

const SITE = "https://www.example.com";
const organization = organizationSchema(SITE);
const home = homePageSchema(SITE);

// Keys that would claim ratings, reviews or prices we don't have.
const BANNED_KEYS = /^(aggregateRating|review|reviews|ratingValue|reviewCount|ratingCount|bestRating|offers|price|priceCurrency|priceRange|lowPrice|highPrice)$/i;

function allKeys(value) {
  if (Array.isArray(value)) return value.flatMap(allKeys);
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => [k, ...allKeys(v)]);
  return [];
}

test("no rating, review or price appears in any structured data", () => {
  for (const schema of [organization, home]) {
    for (const key of allKeys(schema)) {
      assert.ok(!BANNED_KEYS.test(key), `structured data contains "${key}"`);
    }
    assert.ok(!/₹|\bINR\b|"Rating"|"Review"|"Offer"/.test(JSON.stringify(schema)));
  }
});

test("no source file adds rating, review or offer schema", () => {
  const files = ["app", "components", "lib"].flatMap(function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(js|jsx|mjs)$/.test(entry.name) ? [full] : [];
    });
  });
  for (const file of files) {
    // Comments may explain why these are absent; only code counts.
    const source = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "");
    assert.ok(!/aggregateRating|"@type":\s*"(Review|Offer|AggregateRating)"/.test(source), `${file} adds rating/review/offer schema`);
  }
});

test("the Organization carries the company's real contact details, without a phone number", () => {
  assert.equal(organization["@type"], "Organization");
  assert.equal(organization.name, "ZUGEE");
  assert.equal(organization.url, `${SITE}/`);
  assert.equal(organization.logo, `${SITE}/zugee-mascot-icon.png`);
  assert.equal(organization.email, COMPANY.email);
  // The site publishes no phone number (tests/public-contact.test.mjs).
  assert.ok(!("telephone" in organization));
  assert.equal(organization.address.addressLocality, "Coimbatore");
  assert.equal(organization.address.addressRegion, "Tamil Nadu");
  assert.equal(organization.address.addressCountry, "IN");
});

test("the FAQPage matches the visible FAQ exactly", () => {
  const faq = home["@graph"].find((node) => node["@type"] === "FAQPage");
  assert.ok(faq);
  assert.deepEqual(
    faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
    FAQ_ITEMS.map((f) => [f.question, f.answer])
  );
});

test("every available product, and only those, is a SoftwareApplication", () => {
  const apps = home["@graph"].filter((node) => node["@type"] === "SoftwareApplication");
  const available = PRODUCTS.filter((p) => p.status === "available");
  assert.deepEqual(apps.map((a) => a.name), available.map((p) => p.name));
  for (const app of apps) {
    const product = available.find((p) => p.name === app.name);
    assert.equal(app.description, product.description);
    assert.equal(app.applicationCategory, "BusinessApplication");
    assert.equal(app.operatingSystem, "Web");
    assert.equal(app.publisher["@id"], organization["@id"]);
  }
});

test("serialised JSON-LD cannot close its script tag", () => {
  assert.ok(!serializeJsonLd({ text: "</script><script>alert(1)</script>" }).includes("<"));
});

test("every SoftwareApplication is a product the showcase renders, with its name and description", () => {
  const apps = home["@graph"].filter((node) => node["@type"] === "SoftwareApplication");
  const available = availableProducts();
  assert.equal(apps.length, available.length);
  available.forEach((product, i) => {
    assert.equal(apps[i]["@id"], `${SITE}/#${productAnchor(product.slug)}`);
    // No url: the showcase has no per-product anchor to point at.
    assert.ok(!("url" in apps[i]), `${product.name} points at an anchor that doesn't exist`);
  });

  // The showcase renders exactly the Available products (all of them in the HTML, the active one
  // shown), with the same name and description fields the structured data uses, and no status labels.
  const showcase = fs.readFileSync(path.join(import.meta.dirname, "..", "components", "home", "ProductShowcase.jsx"), "utf8");
  assert.match(showcase, /const SHOWCASE_PRODUCTS = availableProducts\(\);/);
  const showcaseCode = showcase.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, ""); // comments may explain the rule
  assert.ok(!/StatusChip|PRODUCT_STATUS|Available Now|Coming Soon/.test(showcaseCode), "the showcase shows no status labels");
  assert.match(showcase, /\{product\.name\}/);
  assert.match(showcase, /\{product\.description\}/);
  assert.match(showcase, /id="products"/, "the showcase keeps the #products anchor");
});

test("the footer lists only Available products", () => {
  const footer = fs.readFileSync(path.join(import.meta.dirname, "..", "components", "layout", "Footer.jsx"), "utf8");
  assert.match(footer, /const listedProducts = availableProducts\(\);/);
  assert.ok(!/coming_soon/.test(footer));
});
