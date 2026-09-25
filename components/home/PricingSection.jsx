// components/home/PricingSection.jsx
// Server component. No price list yet: pricing depends on product, users and branches, and the
// per-product plans aren't set (docs/ZUGEE-PLATFORM-PLAN.md Phase 6). Followed by the FAQ.
// TODO(founder): once per-product plans are decided, render them here from one data file.

import FAQSection from "@/components/home/FAQSection";
import { ArrowRight } from "lucide-react";

const PRICE_FACTORS = ["The product you choose", "How many users need access", "How many branches you run", "The support you need"];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-20">
      <div className="container">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.1] bg-[#0A0F1D]/80 p-7 sm:p-10 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Pricing</h2>
          <p className="text-base text-slate-300 leading-relaxed mb-6">
            You pay for the product you use. Your quote is based on:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto mb-8">
            {PRICE_FACTORS.map((f) => (
              <li key={f} className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-sm text-slate-200">
                {f}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-primary text-sm !py-3.5 !px-6">
            <span>Get a quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <FAQSection />
      </div>
    </section>
  );
}
