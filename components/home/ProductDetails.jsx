// components/home/ProductDetails.jsx
// One block per Available product, reached from the industry grid (#product-<slug>). Everything
// shown comes from lib/products.js: name, industry, description and the module list. Never add a
// capability here that isn't in that list.
// Server component; only the "Book a demo" buttons are client islands.

import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { availableProducts, productAnchor } from "@/lib/products";
import { productIcon } from "@/components/home/product-icons";

export default function ProductDetails() {
  const products = availableProducts();

  return (
    <section aria-labelledby="product-details-heading" className="py-16 sm:py-20 bg-[#080C14] border-b border-white/[0.08]">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <h2 id="product-details-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-center mb-10">
          What each product covers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {products.map((product) => {
            const Icon = productIcon(product.slug);
            return (
              <article
                key={product.slug}
                id={productAnchor(product.slug)}
                className="scroll-mt-[96px] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0B111C] p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/25">
                    <Icon className="w-6 h-6 text-cyan-300" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{product.name}</h3>
                    <p className="text-base text-slate-300">{product.industry}</p>
                  </div>
                </div>

                <p className="mt-4 text-base text-slate-200 leading-relaxed">{product.description}</p>

                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-slate-300">Covers</p>
                <ul className="mt-2 flex flex-wrap gap-2 list-none p-0 m-0">
                  {product.modules.map((module) => (
                    <li
                      key={module}
                      className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-base text-slate-100"
                    >
                      {module}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <SmoothScrollLink
                    targetId="contact"
                    className="inline-flex items-center min-h-11 px-5 rounded-full text-base font-semibold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-safe:transition-colors"
                  >
                    Book a demo<span className="sr-only">&nbsp;for {product.name}</span>
                  </SmoothScrollLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
