// tests/product-pages.test.mjs
// Every product landing page (lib/product-pages.js) must meet the SEO brief and the site's claim
// rules, and its structured data must match what the page shows.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PRODUCTS, productFullName } from "../lib/products.js";
import { PRODUCT_PAGES, getProductPage, productPages } from "../lib/product-pages.js";
import { productPageSchema } from "../lib/structured-data.js";

const SITE = "https://www.example.com";
const pages = productPages();

/** Every string in a page's copy, flattened. */
function allStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

test("every page belongs to an Available product with a unique page slug", () => {
  assert.ok(pages.length > 0);
  for (const slug of Object.keys(PRODUCT_PAGES)) {
    const product = PRODUCTS.find((p) => p.slug === slug);
    assert.ok(product, `${slug} is not a product`);
    assert.equal(product.status, "available", `${slug} is not Available`);
    assert.match(product.pageSlug ?? "", /^[a-z0-9]+(-[a-z0-9]+)*$/, `${slug} needs a pageSlug`);
    assert.equal(getProductPage(product.pageSlug)?.product, product);
  }
  const slugs = PRODUCTS.map((p) => p.pageSlug).filter(Boolean);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate pageSlug");
  // Never collide with a real route in the (marketing) group.
  for (const reserved of ["privacy", "terms", "refund", "admin", "api", "products"]) assert.ok(!slugs.includes(reserved));
});

test("titles, descriptions and H1s meet the SEO brief", () => {
  for (const { product, page } of pages) {
    assert.ok(page.title.length <= 60, `${product.name} title is ${page.title.length} chars`);
    // "[Primary keyword] | Fleetova by ZUGEE"; Zugee Omni carries the brand in its name.
    assert.ok(page.title.endsWith(` | ${productFullName(product)}`), `${product.name} title format`);
    const len = page.metaDescription.length;
    assert.ok(len >= 140 && len <= 155, `${product.name} meta description is ${len} chars`);
    assert.match(page.metaDescription, /demo/i, `${product.name} meta description needs a call to action`);

    // The H1 carries every word of the primary keyword ("India" may read "Indian").
    const h1 = page.h1.toLowerCase();
    for (const word of page.primaryKeyword.toLowerCase().split(/\s+/)) {
      assert.ok(h1.includes(word === "india" ? "india" : word), `${product.name} H1 lacks "${word}"`);
    }
  }
});

test("every page has the sections the template expects", () => {
  for (const { product, page } of pages) {
    assert.equal(page.problems.length, 4, `${product.name} problems`);
    assert.equal(page.solutions.length, 4, `${product.name} solutions`);
    assert.equal(page.features.length, 6, `${product.name} features`);
    assert.equal(page.workflow.length, 3, `${product.name} workflow`);
    assert.equal(page.setup.length, 4, `${product.name} setup`);
    assert.equal(page.related.length, 3, `${product.name} related`);
    assert.ok(page.audiences.length >= 3, `${product.name} audiences`);
    assert.ok(page.audienceIntro?.length > 150, `${product.name} audienceIntro`);
    // The hero sample card: 3–4 rows, every one visibly made up.
    assert.ok(page.sampleRows.length >= 3 && page.sampleRows.length <= 4, `${product.name} sampleRows`);
    for (const row of page.sampleRows) {
      for (const key of ["name", "stage", "value", "time"]) assert.ok(row[key], `${product.name} sample row lacks ${key}`);
      assert.match(row.name, /sample/i, `${product.name}: "${row.name}" must read as sample data`);
    }
    assert.ok(page.intro.includes("14 days"), `${product.name} intro must mention the 14-day setup`);
  }
});

test("each page's secondary keywords appear in its feature headings", () => {
  for (const { product, page } of pages) {
    const headings = page.features.map((f) => f.title.toLowerCase()).join("\n");
    for (const keyword of page.secondaryKeywords) {
      assert.ok(headings.includes(keyword.toLowerCase()), `${product.name}: no feature heading uses "${keyword}"`);
    }
  }
});

test("related products are other products' pages", () => {
  for (const { product, page } of pages) {
    for (const pageSlug of page.related) {
      assert.notEqual(pageSlug, product.pageSlug, `${product.name} relates to itself`);
      assert.ok(PRODUCTS.some((p) => p.pageSlug === pageSlug), `${product.name}: unknown related page ${pageSlug}`);
    }
  }
});

test("each FAQ has 5–7 questions, including the required ones", () => {
  for (const { product, page } of pages) {
    assert.ok(page.faqs.length >= 5 && page.faqs.length <= 7, `${product.name} has ${page.faqs.length} FAQs`);
    const questions = page.faqs.map((f) => f.q);
    assert.ok(questions.some((q) => /^What is .+ software\?$/.test(q)), `${product.name} lacks "What is … software?"`);
    assert.ok(questions.includes(`How much does ${product.name} cost?`), `${product.name} lacks the cost question`);
    assert.ok(questions.some((q) => /mobile|phone/i.test(q)), `${product.name} lacks a mobile question`);
    assert.ok(questions.some((q) => /GST|bill/i.test(q)), `${product.name} lacks a GST/billing question`);
    assert.ok(questions.some((q) => /small/i.test(q)), `${product.name} lacks a small-business question`);
    assert.equal(new Set(questions).size, questions.length, `${product.name} repeats a question`);
  }
});

test("no page copy publishes a price, a statistic-style claim or a live WhatsApp feature", () => {
  for (const { product, page } of pages) {
    // sampleRows hold made-up ₹ amounts; the page labels them "illustrative data only".
    const copy = allStrings(Object.entries(page).filter(([key]) => key !== "sampleRows")).join("\n");
    assert.ok(!/₹|\bRs\.?\s?\d|\bINR\b/.test(copy), `${product.name} copy contains a price`);
    assert.ok(!/\d+(\.\d+)?\s?%/.test(copy), `${product.name} copy contains a percentage`);
    assert.ok(!/testimonial|\brated\b|\d\s?stars?\b|trusted by/i.test(copy), `${product.name} copy claims ratings or customers`);
    // WhatsApp may describe how businesses work today, or be "coming soon"; never a feature.
    const features = allStrings([page.solutions, page.features, page.workflow, page.setup]).join("\n");
    assert.ok(!/whatsapp/i.test(features), `${product.name} presents WhatsApp as a feature`);
    for (const faq of page.faqs) {
      if (/whatsapp/i.test(faq.a) && !/coming soon/i.test(faq.a)) {
        assert.ok(/whatsapp you|call or whatsapp/i.test(faq.a), `${product.name}: WhatsApp in "${faq.q}" must say coming soon`);
      }
    }
    // Each product has its own login and data; never a shared one.
    assert.ok(!/single login|one login|shared (login|database)|unified account/i.test(copy));
  }
});

test("the structured data matches the page: product, FAQ word for word, breadcrumb, no offers", () => {
  for (const { product, page } of pages) {
    const schema = productPageSchema(product, page, SITE);
    const graph = schema["@graph"];
    const app = graph.find((n) => n["@type"] === "SoftwareApplication");
    assert.equal(app.name, productFullName(product));
    assert.equal(app.url, `${SITE}/${product.pageSlug}`);
    assert.equal(app.applicationCategory, "BusinessApplication");
    assert.equal(app.provider["@id"], `${SITE}/#organization`);
    assert.ok(!("offers" in app) && !("aggregateRating" in app));

    const faq = graph.find((n) => n["@type"] === "FAQPage");
    assert.deepEqual(
      faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
      page.faqs.map((f) => [f.q, f.a])
    );

    const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList").itemListElement;
    assert.deepEqual(crumbs.map((c) => c.name), ["Home", "Products", product.categoryLabel]);
    assert.deepEqual(crumbs.map((c) => c.position), [1, 2, 3]);
  }
});

test("no paragraph is reused between pages", () => {
  const seen = new Map();
  for (const { product, page } of pages) {
    for (const text of allStrings(page).filter((s) => s.split(/\s+/).length >= 12)) {
      assert.ok(!seen.has(text), `"${text.slice(0, 60)}…" appears on both ${seen.get(text)} and ${product.name}`);
      seen.set(text, product.name);
    }
  }
});

// ---------------------------------------------------------------------------
// Product names (renamed 2026-10-10)
// ---------------------------------------------------------------------------
function siteSource() {
  const root = path.resolve(import.meta.dirname, "..");
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(js|jsx|mjs)$/.test(entry.name) ? [full] : [];
    });
  return ["app", "components", "lib"].flatMap((dir) => walk(path.join(root, dir))).map((file) => ({
    file: path.relative(root, file),
    // Comments may record the history; only code and copy count.
    code: fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "")
  }));
}

test("the catalog uses the new product names", () => {
  const names = Object.fromEntries(PRODUCTS.filter((p) => p.pageSlug).map((p) => [p.slug, p.name]));
  assert.deepEqual(names, {
    "core-erp": "Zugee Omni",
    transposs: "Fleetova",
    "tours-travels": "Tourvana",
    "aqua-erp": "Aqurix",
    "real-estate": "Estatova",
    manuflow: "Fabrova",
    "school-erp": "Scholora",
    college: "Campora",
    "pg-management": "Roomora",
    resort: "Resortique",
    medical: "Clinivance"
  });
});

test("no retired product name appears on the site", () => {
  // Names that were only ever brand names. Generic ones ("Hospital Management") also occur as plain
  // keyword phrases in page copy, so the catalog test above covers those. Case-sensitive: the lead
  // ids "transposs" and "manuflow" stay, because stored leads use them.
  const RETIRED = [/Transposs/, /ManuFlow|Manuflow/, /Aqua ERP/, /ZUGEE ERP \/ CRM/, /Tours & Travels CRM/, /School & College ERP/];
  for (const { file, code } of siteSource()) {
    for (const name of RETIRED) assert.ok(!name.test(code), `${file} still says ${name}`);
  }
});

test("Zugee Omni is always written in full", () => {
  for (const { file, code } of siteSource()) {
    assert.ok(!/(?<!Zugee )\bOmni\b/.test(code), `${file} says "Omni" without "Zugee"`);
  }
});

// ---------------------------------------------------------------------------
// All 11 pages, drafts, Fabrova's limits and the site-wide links (2026-10-10)
// ---------------------------------------------------------------------------
test("every Available product with a page slug has its page", () => {
  const withSlug = PRODUCTS.filter((p) => p.status === "available" && p.pageSlug);
  assert.equal(withSlug.length, 11);
  assert.deepEqual(pages.map(({ product }) => product.slug), withSlug.map((p) => p.slug));
  for (const { product, page } of pages) assert.ok(page.faqSubtitle, `${product.name} faqSubtitle`);
});

test("a section that still holds a TODO is a hidden draft", () => {
  for (const { product, page } of pages) {
    for (const section of page.extraSections ?? []) {
      if (allStrings(section).some((s) => s.includes("[TODO"))) {
        assert.equal(section.draft, true, `${product.name}: "${section.heading}" has TODOs but is not a draft`);
      }
    }
    // Draft or not, TODOs never reach the rendered copy.
    const visible = { ...page, extraSections: (page.extraSections ?? []).filter((s) => !s.draft) };
    assert.ok(!allStrings(visible).some((s) => s.includes("TODO")), `${product.name} shows a TODO`);
  }
  const template = fs.readFileSync(path.join(import.meta.dirname, "..", "components", "product", "ProductPage.jsx"), "utf8");
  assert.match(template, /extraSections\?\.filter\(\(section\) => !section\.draft\)/, "the template must skip drafts");
});

test("Clinivance has its security section (draft) and the patient data FAQ", () => {
  const { page } = productPages().find(({ product }) => product.slug === "medical");
  const security = page.extraSections.find((s) => s.heading === "Patient data security and privacy");
  assert.ok(security, "security section missing");
  assert.equal(security.link?.href, "/privacy");
  assert.ok(page.faqs.some((f) => f.q === "Is patient data secure?"));
  // No certification the founder has not confirmed.
  assert.ok(!/\bISO\b|HIPAA|ABDM|certified/i.test(allStrings(page).join("\n")));
});

test("Fabrova's copy stays inside what Fabrova does today", () => {
  const { page } = productPages().find(({ product }) => product.slug === "manuflow");
  const copy = allStrings(page).join("\n");
  assert.ok(!/\bAI\b|artificial intelligence/i.test(copy), 'say "cost insights", never "AI"');
  // Most Fabrova modules keep data in the browser: no shared data, cloud or role claims.
  assert.ok(!/\brole|cloud|shared|multi-user|everyone sees|same records|from any desk/i.test(copy), "Fabrova claims shared or cloud data");
  for (const term of ["cost insights", "11 languages", "proforma", "GRN", "HR"]) assert.ok(copy.includes(term), `Fabrova lacks "${term}"`);
});

test("the homepage showcase and the footer link to every product page", () => {
  const read = (...p) => fs.readFileSync(path.join(import.meta.dirname, "..", ...p), "utf8");
  const showcase = read("components", "home", "ProductShowcase.jsx");
  assert.match(showcase, /<Link\s+href=\{productPagePath\(product\)/, "Explore button must be a link to the page");
  assert.ok(!/ProductDeepDiveModal|onExplore/.test(showcase));
  const footer = read("components", "layout", "Footer.jsx");
  assert.match(footer, /listedProducts\.map\(/);
  assert.ok(!/listedProducts\.slice\(/.test(footer), "the footer lists every product");
  assert.match(footer, /href=\{productPagePath\(p\)/);
});

// ---------------------------------------------------------------------------
// Fabrova's slug move and the /products hub (2026-10-10)
// ---------------------------------------------------------------------------
test("Fabrova lives at /garment-manufacturing-erp and the old path redirects permanently", async () => {
  const fabrova = PRODUCTS.find((p) => p.slug === "manuflow");
  assert.equal(fabrova.pageSlug, "garment-manufacturing-erp");
  for (const { page } of pages) assert.ok(!page.related.includes("manufacturing-erp"), "a related link uses the old path");

  const { default: config } = await import("../next.config.mjs");
  const redirects = await config.redirects();
  assert.deepEqual(
    redirects.find((r) => r.source === "/manufacturing-erp"),
    { source: "/manufacturing-erp", destination: "/garment-manufacturing-erp", permanent: true }
  );
});

test("the products hub lists every product page, in its structured data too", async () => {
  const { productsHubSchema } = await import("../lib/structured-data.js");
  const listed = pages.map(({ product }) => product);
  const graph = productsHubSchema(listed, SITE)["@graph"];
  const list = graph.find((n) => n["@type"] === "ItemList").itemListElement;
  assert.equal(list.length, 11);
  assert.deepEqual(list.map((i) => i.url), listed.map((p) => `${SITE}/${p.pageSlug}`));
  assert.deepEqual(list.map((i) => i.position), listed.map((_, i) => i + 1));
  const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList").itemListElement;
  assert.deepEqual(crumbs.map((c) => [c.name, c.item]), [["Home", `${SITE}/`], ["Products", `${SITE}/products`]]);

  // Product page breadcrumbs point at the hub, not the homepage section.
  const { product, page } = pages[0];
  const productCrumbs = productPageSchema(product, page, SITE)["@graph"].find((n) => n["@type"] === "BreadcrumbList");
  assert.equal(productCrumbs.itemListElement[1].item, `${SITE}/products`);

  const read = (...p) => fs.readFileSync(path.join(import.meta.dirname, "..", ...p), "utf8");
  const hub = read("app", "(marketing)", "products", "page.jsx");
  assert.match(hub, /Industry-Specific Business Software for Indian SMEs/);
  assert.match(hub, /canonical: "\/products"/);
  assert.match(read("components", "layout", "Footer.jsx"), /<Link href="\/products"[^>]*>\s*View all products/);
  assert.match(read("app", "sitemap.js"), /\/products`,[\s\S]{0,120}priority: 0\.9/);
});
