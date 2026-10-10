// app/(marketing)/[slug]/page.jsx
// Product landing pages: /fleet-management-software and the rest. Fully static: one page per entry
// in lib/product-pages.js is built at build time, and any other slug is a 404. Static routes in
// this group (/privacy, /terms, /refund) take precedence over this dynamic one.

import { notFound } from "next/navigation";
import ProductPage from "@/components/product/ProductPage";
import { getProductPage, productPages } from "@/lib/product-pages";
import { productPageSchema, serializeJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return productPages().map(({ product }) => ({ slug: product.pageSlug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getProductPage(slug);
  if (!entry) return {};
  const { product, page } = entry;
  const path = `/${product.pageSlug}`;

  // openGraph and twitter replace the root layout's objects rather than merging, so every field
  // is repeated here. /og.jpg until each product has its own share image.
  return {
    title: { absolute: page.title },
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: path,
      siteName: "ZUGEE",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: page.title }],
      locale: "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: ["/og.jpg"]
    }
  };
}

export default async function ProductLandingPage({ params }) {
  const { slug } = await params;
  const entry = getProductPage(slug);
  if (!entry) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productPageSchema(entry.product, entry.page)) }}
      />
      <ProductPage product={entry.product} page={entry.page} />
    </>
  );
}
