// lib/structured-data.js
// JSON-LD (schema.org) for search engines and AI answer engines. Every value is read from the same
// data that renders the visible page, so the structured data can never claim more than the site shows.
// No JSX and relative imports only, so `node --test` can load this file.
//
// Deliberately absent: aggregateRating, review and offers/price. ZUGEE has no published ratings,
// reviews or prices, and Google penalises structured data that isn't backed by the visible page.
// tests/structured-data.test.mjs enforces this.

import { getSiteUrl, SOCIAL_PROFILES } from "./site.js";
import { COMPANY } from "./legal.js";
import { availableProducts, productAnchor, productFullName, productPagePath } from "./products.js";
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
    logo: `${siteUrl}/icon-512.png`,
    email: COMPANY.email,
    // The same profiles the footer links to.
    sameAs: SOCIAL_PROFILES.map((profile) => profile.url),
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

/**
 * A product's one @id, shared by the homepage and its own landing page, so search engines see one
 * entity per product rather than two. A product without a landing page falls back to its homepage anchor.
 */
export function softwareApplicationId(product, siteUrl = getSiteUrl()) {
  const pagePath = productPagePath(product);
  return pagePath ? `${siteUrl}${pagePath}#software` : `${siteUrl}/#${productAnchor(product.slug)}`;
}

/**
 * The site itself. Google uses WebSite (name, alternateName, url) to choose the site name shown
 * in results. Homepage only, as Google recommends.
 */
export function websiteSchema(siteUrl = getSiteUrl()) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: COMPANY.brand,
    alternateName: ["Zugee", "getzugee.com"],
    url: `${siteUrl}/`,
    inLanguage: "en-IN",
    publisher: { "@id": organizationId(siteUrl) }
  };
}

/** One SoftwareApplication per product a business can use today. "Coming soon" products are not software yet. */
export function softwareApplicationSchemas(siteUrl = getSiteUrl()) {
  return availableProducts().map((product) => ({
    "@type": "SoftwareApplication",
    "@id": softwareApplicationId(product, siteUrl),
    name: productFullName(product),
    description: product.description,
    // The product's own landing page, when it has one.
    ...(productPagePath(product) ? { url: `${siteUrl}${productPagePath(product)}` } : {}),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    publisher: { "@id": organizationId(siteUrl) }
  }));
}

/** Everything the homepage describes: the FAQ and the products shown in the product showcase. */
export function homePageSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": CONTEXT,
    "@graph": [websiteSchema(siteUrl), faqPageSchema(), ...softwareApplicationSchemas(siteUrl)]
  };
}

/**
 * A product landing page (/fleet-management-software): the product, its FAQ word for word as the
 * page shows it, and the breadcrumb trail the page shows (Home / Products / category).
 * No offers: ZUGEE publishes no prices (see the note at the top of this file).
 */
export function productPageSchema(product, page, siteUrl = getSiteUrl()) {
  const url = `${siteUrl}/${product.pageSlug}`;
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "SoftwareApplication",
        // The same @id the homepage uses for this product.
        "@id": softwareApplicationId(product, siteUrl),
        name: productFullName(product),
        description: page.metaDescription,
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android, iOS",
        // publisher, as on the homepage, so the two descriptions of the product agree.
        publisher: { "@id": organizationId(siteUrl) }
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: `${siteUrl}/` },
          { name: "Products", item: `${siteUrl}/products` },
          { name: product.categoryLabel, item: url }
        ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb }))
      }
    ]
  };
}

/**
 * The /products hub: its breadcrumb (Home / Products) and the list of product pages, in the order
 * the page shows them. `products` is the same array the page renders.
 */
export function productsHubSchema(products, siteUrl = getSiteUrl()) {
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/products#list`,
        name: "ZUGEE products",
        itemListElement: products.map((product, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: productFullName(product),
          url: `${siteUrl}${productPagePath(product)}`
        }))
      }
    ]
  };
}

/** Serialise for a <script type="application/ld+json">. "<" is escaped so the payload can never close the tag. */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

