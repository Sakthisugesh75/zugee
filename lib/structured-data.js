// lib/structured-data.js
// JSON-LD (schema.org) for search engines and AI answer engines. Every value is read from the same
// data that renders the visible page, so the structured data can never claim more than the site shows.
// No JSX and relative imports only, so `node --test` can load this file.
//
// Deliberately absent: aggregateRating, review and offers/price. ZUGEE has no published ratings,
// reviews or prices, and Google penalises structured data that isn't backed by the visible page.
// tests/structured-data.test.mjs enforces this.

import { getSiteUrl } from "./site.js";
import { COMPANY } from "./legal.js";
import { availableProducts } from "./products.js";
import { FAQ_ITEMS } from "./site-content.js";

const CONTEXT = "https://schema.org";

function organizationId(siteUrl) {
  return `${siteUrl}/#organization`;
}

/** The company. Emitted on every page from the root layout. */
export function organizationSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: COMPANY.brand,
    legalName: COMPANY.name,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/zugee-mascot-icon.png`,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.address.locality,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.country
    }
  };
}

/** The homepage FAQ, question for question and word for word as FAQSection renders it. */
export function faqPageSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
}

/** One SoftwareApplication per product a business can use today. "Coming soon" products are not software yet. */
export function softwareApplicationSchemas(siteUrl = getSiteUrl()) {
  return availableProducts().map((product) => ({
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#product-${product.slug}`,
    name: product.name,
    description: product.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: { "@id": organizationId(siteUrl) }
  }));
}

/** Everything the homepage describes: the FAQ and the products shown in the product showcase. */
export function homePageSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": CONTEXT,
    "@graph": [faqPageSchema(), ...softwareApplicationSchemas(siteUrl)]
  };
}

/** Serialise for a <script type="application/ld+json">. "<" is escaped so the payload can never close the tag. */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
