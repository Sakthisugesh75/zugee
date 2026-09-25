// components/home/ProductsSection.jsx
// Server component: the ZUGEE product catalog, grouped by status so nothing unfinished is
// presented as ready. Data and statuses come from lib/products.js.

import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_STATUS } from "@/lib/products";
import ProductInterestButton from "@/components/home/ProductInterestButton";

const STATUS_STYLES = {
  available: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  progress: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  soon: "bg-white/[0.04] text-slate-400 border-white/[0.12]"
};

const CTA_LABEL = {
  available: "Book a demo",
  in_development: "Get early access",
  coming_soon: "Tell me when it's ready"
};

function StatusBadge({ status }) {
  const { label, tone } = PRODUCT_STATUS[status];
  return (
    <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[tone]}`}>
      {label}
    </span>
  );
}

function ProductCard({ product }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/[0.1] bg-[#0A0F1D]/80 p-6 h-full">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-lg font-bold text-white leading-snug">{product.name}</h3>
        <StatusBadge status={product.status} />
      </div>
      <p className="text-sm text-[#38BDF8] mb-3">{product.industry}</p>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{product.description}</p>

      {product.modules.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mb-5" aria-label={`${product.name} modules`}>
          {product.modules.map((m) => (
            <li key={m} className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-xs text-slate-300">
              {m}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-2">
        <ProductInterestButton
          slug={product.slug}
          label={CTA_LABEL[product.status]}
          emphasis={product.status !== "coming_soon"}
        />
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const active = PRODUCTS.filter((p) => p.status !== "coming_soon");
  const comingSoon = PRODUCTS.filter((p) => p.status === "coming_soon");

  return (
    <section id="products" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-[80px] md:scroll-mt-[80px]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">ZUGEE products</h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Each product is built around how one kind of business actually works. Book a demo and we&apos;ll
            walk you through the one for your business.
          </p>
        </div>

        {PRODUCT_CATEGORIES.map((category) => {
          const items = active.filter((p) => p.category === category.id);
          if (items.length === 0) return null;
          return (
            <div key={category.id} className="max-w-6xl mx-auto mb-12">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">{category.label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          );
        })}

        {comingSoon.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Coming soon</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {comingSoon.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate">{p.industry}</p>
                  </div>
                  <ProductInterestButton slug={p.slug} label="Notify me" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
