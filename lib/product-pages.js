// lib/product-pages.js
// The copy for each product's landing page (/fleet-management-software and so on), keyed by the
// product's id in lib/products.js. Each product's copy is in its own file under lib/product-pages/.
// One template (components/product/ProductPage.jsx) renders every page, and the same objects feed
// the page metadata, the FAQPage/BreadcrumbList structured data and the sitemap. A product gets a
// page when it has an entry here AND a pageSlug in lib/products.js.
// No JSX and relative imports only, so `node --test` can load this file.
//
// Claim rules (CLAUDE.md, docs/ZUGEE-PLATFORM-PLAN.md): only what the product does today. No
// statistics, customer names, ratings or testimonials. WhatsApp sending is "coming soon".
// Nothing about where data is hosted or kept copies of, and no certifications
// (tests/site-content.test.mjs). No prices (the ₹ amounts in sampleRows are made-up sample data).
// No product screenshots anywhere (founder, 2026-10-10): the hero shows a sample card built in code.
// tests/product-pages.test.mjs checks every page against these rules and the SEO brief.
//
// Fields
//   primaryKeyword, secondaryKeywords  SEO targets; the H1 carries the primary, feature H3s the secondaries
//   title, metaDescription             <title> (≤ 60 chars) and meta description (140–155 chars)
//   h1, intro                          hero heading and the two-sentence intro
//   sampleRows[3–4] {name, stage, value, time}   rows of the hero's "illustrative data only" card;
//                                      clearly fake (SAMPLE ids, TN-00 plates), never real customers
//   problemsHeading, problems[4], solutions[4]   "Without / With [product]" cards
//   featuresHeading, workflowHeading   H2s for the features and how-it-works sections
//   features[6] {title, text, icon}    icon is a lucide-react icon name (see ProductPage.jsx)
//   workflow[3] {title, text}          how the product runs a day in that industry
//   audienceIntro, audiences[]         "Who it's for" paragraph and chips
//   setup[4]                           the product's line for each 14-day setup step
//   faqSubtitle, faqs[] {q, a}         shown on the page and emitted as FAQPage, word for word
//   related[3]                         pageSlugs of related products
//   extraSections?[] {id, heading, paragraphs[], points?[], draft?}   rendered before the FAQ.
//                                      draft: true hides a section until its facts are confirmed;
//                                      a section holding any "[TODO" must be a draft.

import { PRODUCTS } from "./products.js";
import zugeeOmni from "./product-pages/zugee-omni.js";
import fleet from "./product-pages/fleet.js";
import tours from "./product-pages/tours.js";
import water from "./product-pages/water.js";
import estates from "./product-pages/estates.js";
import factory from "./product-pages/factory.js";
import schools from "./product-pages/schools.js";
import campus from "./product-pages/campus.js";
import hostels from "./product-pages/hostels.js";
import resorts from "./product-pages/resorts.js";
import care from "./product-pages/care.js";

export const PRODUCT_PAGES = {
  "core-erp": zugeeOmni,
  transposs: fleet,
  "tours-travels": tours,
  "aqua-erp": water,
  "real-estate": estates,
  manuflow: factory,
  "school-erp": schools,
  college: campus,
  "pg-management": hostels,
  resort: resorts,
  medical: care
};

/** Every product that has a landing page, in catalog order: { product, page }. */
export function productPages() {
  return PRODUCTS.filter((p) => p.pageSlug && PRODUCT_PAGES[p.slug]).map((product) => ({
    product,
    page: PRODUCT_PAGES[product.slug]
  }));
}

/** The product and its page copy for a URL slug ("fleet-management-software"), or null. */
export function getProductPage(pageSlug) {
  return productPages().find(({ product }) => product.pageSlug === pageSlug) || null;
}
