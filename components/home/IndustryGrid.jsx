// components/home/IndustryGrid.jsx
// "Find your industry": one small card per Available product, all on one screen. Each card jumps
// to that product's slide in ProductCarousel. Coming Soon products are not shown.
// Server component; plain anchor links, no JavaScript.

import { availableProducts, productAnchor } from "@/lib/products";
import { productIcon } from "@/components/home/product-icons";

export default function IndustryGrid() {
  const products = availableProducts();

  return (
    <section id="products" className="scroll-mt-[80px] py-16 sm:py-20 bg-[#06090F] border-b border-white/[0.08]">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Find your industry</h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Choose your type of business to see what its software covers.
          </p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 list-none p-0 m-0">
          {products.map((product) => {
            const Icon = productIcon(product.slug);
            return (
              <li key={product.slug}>
                <a
                  href={`#${productAnchor(product.slug)}`}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 hover:border-cyan-400/60 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-safe:transition-colors"
                >
                  <Icon className="w-6 h-6 text-cyan-300" aria-hidden="true" />
                  <span className="text-base font-semibold text-white leading-snug">{product.industry}</span>
                  <span className="text-base text-slate-300 leading-snug">{product.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
