// components/product/ProductCard.jsx
// A product card linking to the product's landing page: category label, name, one-line description.
// Used by the /products hub and the "Related ZUGEE products" row on each product page.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAccent } from "@/lib/product-accents";
import { productPagePath } from "@/lib/products";
import { accentInk } from "@/lib/theme";

/** @param {{ product: import("@/lib/products").PRODUCTS[number] }} props */
export default function ProductCard({ product }) {
  const { accent, icon: Icon } = getAccent(product.slug);
  return (
    <Link
      href={productPagePath(product) || "/#products"}
      className="group h-full p-6 flex flex-col rounded-2xl bg-card border border-line shadow-card hover:border-cyan-500/40 transition-colors"
    >
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-3 text-slate-300">
        {/* Accent on the icon only: small accent-coloured text fails contrast for the darker accents. */}
        <Icon className="w-4 h-4" style={{ color: accentInk(accent) }} aria-hidden="true" />
        {product.categoryLabel}
      </span>
      <h3 className="text-lg font-bold text-fg mb-2">{product.name}</h3>
      <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-1">{product.description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
        See {product.name}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
