// components/home/Hero.jsx
// Server component. Nothing above the fold depends on client JavaScript, so the hero is readable
// the moment the HTML arrives. Entrance uses a short CSS fade only.

import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

// Industries shown as plain text under the CTAs — only products with code behind them.
const FEATURED_INDUSTRIES = PRODUCTS.filter((p) => p.category === "industry" && p.status !== "coming_soon").map(
  (p) => p.industry
);

export default function Hero() {
  return (
    <section className="relative pt-28 pb-8 md:pt-40 md:pb-12 overflow-hidden bg-[#06090F] bg-cyber-grid">
      <div className="hero-glow-sphere top-10 left-1/2 -translate-x-1/2 opacity-70" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-sm font-semibold text-[#38BDF8] mb-4">Business software for Indian businesses</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Business software built for{" "}
            <span className="blue-cyan-gradient-text">the way your business operates.</span>
          </h1>

          {/* The brief's line promised "one connected platform"; the shared account isn't built yet,
              so this says what is true today. Restore it once SSO across products ships (Phase 3). */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            ZUGEE makes industry-focused CRM, ERP, billing and operations software. Pick the product made for
            your trade and we&apos;ll show it to you in a live demo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <SmoothScrollLink targetId="products" className="btn-primary w-full sm:w-auto text-sm !py-4 !px-8 inline-flex items-center justify-center gap-2">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </SmoothScrollLink>
            <SmoothScrollLink targetId="contact" className="btn-secondary w-full sm:w-auto text-sm !py-4 !px-6 inline-flex items-center justify-center">
              Book a Demo
            </SmoothScrollLink>
          </div>

          {FEATURED_INDUSTRIES.length > 0 && (
            <p className="mt-6 text-sm text-slate-400">Software for {FEATURED_INDUSTRIES.join(" · ")} and more</p>
          )}
        </div>
      </div>
    </section>
  );
}
