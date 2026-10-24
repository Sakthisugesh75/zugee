// components/JsonLdSchema.jsx
// Reusable JSON-LD injector for AEO/GEO. Wraps the existing schema builders from
// lib/structured-data.js into drop-in React components that pages can compose.
//
// Usage:
//   <ProductPageJsonLd product={…} page={…} />     — every vertical product page
//   <FaqJsonLd faqs={[{ question, answer }]} />    — any other page with an FAQ section
// The Organization is emitted by the root layout and the homepage writes its own graph.

import { productPageSchema, serializeJsonLd } from "@/lib/structured-data";

/**
 * Low-level renderer: turns any JSON-LD object into a <script type="application/ld+json">.
 * Accepts a `schema` prop (plain object or array) and nothing else.
 */
export function JsonLdScript({ schema }) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

/**
 * Dynamically maps an array of { question, answer } (or { q, a }) objects into
 * FAQPage schema.org nodes. Use on any page that renders an FAQ section.
 */
export function FaqJsonLd({ faqs = [] }) {
  if (!faqs.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question || faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer || faq.a
      }
    }))
  };
  return <JsonLdScript schema={schema} />;
}

/**
 * A vertical product page's graph: SoftwareApplication (the product), FAQPage (the page's own
 * FAQs, word for word) and BreadcrumbList. Don't add a FaqJsonLd beside it: the FAQ is already in.
 */
export function ProductPageJsonLd({ product, page }) {
  return <JsonLdScript schema={productPageSchema(product, page)} />;
}
