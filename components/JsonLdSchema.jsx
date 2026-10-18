// components/JsonLdSchema.jsx
// Reusable JSON-LD injector for AEO/GEO. Wraps the existing schema builders from
// lib/structured-data.js into drop-in React components that pages can compose.
//
// Usage:
//   <OrganizationJsonLd />                        — already in app/layout.jsx
//   <HomePageJsonLd />                             — homepage
//   <ProductPageJsonLd product={…} page={…} />     — vertical product pages
//   <FaqJsonLd faqs={[{ question, answer }]} />    — any page with an FAQ section

import { serializeJsonLd } from "@/lib/structured-data";

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
