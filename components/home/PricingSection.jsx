// components/home/PricingSection.jsx
// "Get the best price for your business": no prices are shown anywhere on the site. Pricing
// depends on the product, users, branches and setup needs, and is quoted on a short call.
// Shows what each plan includes (Starter, Growth), taken from lib/pricing.js.
//
// `plans` and `productSetups` come from the server page with the price fields stripped, so the
// numbers in lib/pricing.js never reach this client bundle.

"use client";

import { useState } from "react";
import PricingCallButton from "@/components/home/PricingCallButton";
import { Check, ChevronDown, ArrowRight, Package, Users, Building2, Wrench } from "lucide-react";

// What a quote depends on
const PRICE_FACTORS = [
  { icon: Package, title: "Your product", desc: "Each ZUGEE product is priced on its own" },
  { icon: Users, title: "Number of users", desc: "How many of your staff will sign in" },
  { icon: Building2, title: "Number of branches", desc: "One location or several" },
  { icon: Wrench, title: "Setup needs", desc: "Data migration, configuration and training" },
];

// Feature comparison matrix rows


export default function PricingSection({ plans, productSetups }) {
  const [openAccordions, setOpenAccordions] = useState({ starter: false, growth: false });

  const starter = plans.find((p) => p.key === "starter");
  const growth = plans.find((p) => p.key === "growth");

  const toggleAccordion = (planKey) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [planKey]: !prev[planKey],
    }));
  };

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
            Get the Best Price{" "}
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

        <div className="flex justify-center mb-12 sm:mb-16">
          <PricingCallButton className="px-7 sm:px-9 py-3.5 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer">
            <span>Schedule a pricing call</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PricingCallButton>
        </div>

        {/* ========================================================
            WHAT EACH PLAN INCLUDES: STARTER, GROWTH
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch mb-16">
          {/* 1. STARTER PLAN */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#080C16] border border-white/[0.10] hover:border-white/[0.20] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div>
              {/* Badge & Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
                  Starter Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Single Branch
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For independent businesses getting started with connected workflows.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {starter.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Setup Accordion */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("starter")}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white py-2 transition-colors cursor-pointer"
                >
                  <span>What white-glove setup covers</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      openAccordions.starter ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {openAccordions.starter && (
                  <ul className="p-3 mt-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-xs text-slate-300">
                    {starter.setupIncludes.slice(0, 5).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <PricingCallButton planName="Starter" className="btn-secondary w-full text-sm !py-3.5 justify-center cursor-pointer">
                <span>Get a Starter quote</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </PricingCallButton>
            </div>
          </article>

          {/* 2. GROWTH PLAN */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#0C1222] border-2 border-cyan-400/60 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.30)] hover:border-cyan-400"
          >
            <div>
              {/* Badge & Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                  Growth Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
                  Multi-Branch
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For expanding businesses with multiple branches, dispatch operations, or teams.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {growth.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-100 font-medium">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Setup Accordion */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion("growth")}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white py-2 transition-colors cursor-pointer"
                >
                  <span>What white-glove setup covers</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      openAccordions.growth ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {openAccordions.growth && (
                  <ul className="p-3 mt-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-xs text-slate-300">
                    {growth.setupIncludes.slice(0, 6).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <PricingCallButton planName="Growth" className="btn-primary w-full text-sm !py-3.5 justify-center cursor-pointer">
                <span>Get a Growth quote</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </PricingCallButton>
            </div>
          </article>
        </div>

        {/* Product Setup Focus Details */}
        {productSetups.length > 0 && (
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-1">
              Setup is tailored to your trade
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-5">
              During setup, our team configures workflows specific to your product:
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productSetups.map(({ slug, name, items }) => (
                <div key={slug} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <dt className="text-sm font-bold text-cyan-300 mb-2">{name}</dt>
                  <dd>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {items.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

    </section>
  );
}
