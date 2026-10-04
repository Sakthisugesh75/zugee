// components/home/Hero.jsx
// Text-first hero for business owners, most of them on a phone: one headline, where we are based,
// one button, and a row of simple icons for the products available today. No dashboards,
// screenshots or anything that looks like the product's own screens.
// Server component: only the scroll button is a client island.

import { ArrowRight } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { availableProducts } from "@/lib/products";
import { productIcon } from "@/components/home/product-icons";

export default function Hero() {
  const products = availableProducts();

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[#06090F] border-b border-white/[0.08]">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-[3.25rem] font-extrabold tracking-tight text-white leading-tight text-balance">
          Industry-ready ERP &amp; CRM for Indian businesses — set up for you, supported by a real person.
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-300">Based in Coimbatore, Tamil Nadu.</p>

        <div className="mt-9 flex justify-center">
          <SmoothScrollLink
            targetId="contact"
            className="inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3.5 rounded-full text-base font-bold text-[#04121A] bg-cyan-400 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06090F] motion-safe:transition-colors"
          >
            Book a demo
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </SmoothScrollLink>
        </div>

        <div className="mt-14">
          <p className="text-base text-slate-300 mb-5">Software for these industries, available today:</p>
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 list-none p-0 m-0">
            {products.map((product) => {
              const Icon = productIcon(product.slug);
              return (
                <li
                  key={product.slug}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3.5 py-2.5 text-left"
                >
                  <Icon className="w-5 h-5 shrink-0 text-cyan-300" aria-hidden="true" />
                  <span className="text-base text-slate-100 leading-snug">{product.industry}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
