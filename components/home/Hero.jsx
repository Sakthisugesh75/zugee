// components/home/Hero.jsx
// Hero in the original dark design (ambient glow, grid texture, uppercase headline with a gradient
// half) with the current content only: headline, where we are based, one "Book a demo" button and
// the industries available today. No dashboards, screenshots or anything resembling product screens.
// Server component; only the scroll button is a client island. Glows only under motion-safe.

import { ArrowRight } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { availableProducts } from "@/lib/products";
import { productIcon } from "@/components/home/product-icons";

export default function Hero() {
  const products = availableProducts();

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#06060e] border-b border-white/[0.06]">
      {/* Background ambient lighting (motion-safe only) and grid texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hidden motion-safe:block absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] max-w-full h-[500px] bg-cyan-500/[0.07] rounded-full blur-[80px] lg:blur-[180px]" />
        <div className="hidden motion-safe:block absolute top-[40%] right-[10%] w-[450px] max-w-full h-[400px] bg-violet-600/[0.04] rounded-full blur-[80px] lg:blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight text-white leading-[1.08] uppercase text-balance">
            Industry-ready ERP &amp; CRM for Indian businesses —{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4 20%, #3B82F6 60%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              set up for you, supported by a real person.
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto text-center leading-relaxed mb-8">
          Based in Coimbatore, Tamil Nadu.
        </p>

        <div className="flex justify-center mb-12">
          <SmoothScrollLink
            targetId="contact"
            className="group/btn w-full sm:w-auto min-h-12 px-8 py-3.5 rounded-full text-white text-base font-bold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-br from-cyan-700 to-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060e] motion-safe:shadow-[0_8px_32px_rgba(6,182,212,0.35)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105"
          >
            <span>Book a demo</span>
            <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-1" aria-hidden="true" />
          </SmoothScrollLink>
        </div>

        <div className="max-w-5xl mx-auto">
          <p className="text-base text-slate-300 text-center mb-5">Software for these industries, available today:</p>
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 list-none p-0 m-0">
            {products.map((product) => {
              const Icon = productIcon(product.slug);
              return (
                <li
                  key={product.slug}
                  className="flex items-center gap-2.5 rounded-2xl sm:rounded-full border border-white/[0.12] bg-white/[0.03] backdrop-blur-md px-4 py-2.5"
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
