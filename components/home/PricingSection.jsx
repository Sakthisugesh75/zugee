// components/home/PricingSection.jsx
// No prices are shown anywhere on the site. Pricing depends on the product, users, branches and
// setup needs, and is quoted on a short call. Nothing from lib/pricing.js reaches this component.

import PricingCallButton from "@/components/home/PricingCallButton";
import { ArrowRight, Package, Users, Building2, Wrench } from "lucide-react";

// What a quote depends on
const PRICE_FACTORS = [
  { icon: Package, title: "Your product", desc: "Each ZUGEE product is priced on its own" },
  { icon: Users, title: "Number of users", desc: "How many of your staff will sign in" },
  { icon: Building2, title: "Number of branches", desc: "One location or several" },
  { icon: Wrench, title: "Setup needs", desc: "Data migration, configuration and training" },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] scroll-mt-[80px]"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-cyan-500/[0.04] rounded-full blur-[80px] lg:blur-[190px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[450px] bg-blue-600/[0.03] rounded-full blur-[80px] lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
            Get a Clear Quote{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              For Your Business.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your price depends on the product you choose, how many users and branches you have, and how much setup your business needs. Tell us a little about your business and we&apos;ll share a clear quote on a short call.
          </p>
        </div>

        {/* ========================================================
            WHAT YOUR QUOTE DEPENDS ON + PRICING CALL CTA
           ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
          {PRICE_FACTORS.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs font-bold text-white mb-0.5">{factor.title}</p>
                <p className="text-[11px] text-slate-400">{factor.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <PricingCallButton className="px-7 sm:px-9 py-3.5 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer">
            <span>Schedule a pricing call</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PricingCallButton>
        </div>
      </div>

    </section>
  );
}
