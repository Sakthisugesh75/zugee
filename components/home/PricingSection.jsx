// components/home/PricingSection.jsx
// "Get the best price for your business": no prices are shown anywhere on the site. Pricing
// depends on the product, users, branches and setup needs, and is quoted on a short call.
// Shows what each plan includes (Starter, Growth, Enterprise), an expandable comparison matrix,
// and trust guarantees.
//
// `plans` comes from the server page with the price fields stripped, so the
// numbers in lib/pricing.js never reach this client bundle.

"use client";

import { useState } from "react";
import PricingCallButton from "@/components/home/PricingCallButton";
import { Check, ChevronDown, ArrowRight, Package, Users, Building2, Wrench, ShieldCheck, Clock, Download } from "lucide-react";

// What a quote depends on
const PRICE_FACTORS = [
  { icon: Package, title: "Your product", desc: "Each ZUGEE product is priced on its own" },
  { icon: Users, title: "Number of users", desc: "How many of your staff will sign in" },
  { icon: Building2, title: "Number of branches", desc: "One location or several" },
  { icon: Wrench, title: "Setup needs", desc: "Data migration, configuration and training" },
];

// Feature comparison matrix rows
const COMPARISON_MATRIX = [
  {
    category: "Scale & Capacity",
    features: [
      { name: "Active User Accounts", starter: "Up to 5 Users", growth: "Up to 20 Users", enterprise: "Unlimited Users" },
      { name: "Branches & Locations", starter: "1 Single Branch", growth: "Multiple Branches", enterprise: "Unlimited Multi-Company" },
      { name: "Mobile Field Access", starter: "Included", growth: "Role-Based Hierarchy", enterprise: "Custom Roles & Permissions" },
    ],
  },
  {
    category: "Financials & Compliance",
    features: [
      { name: "Customer Ledgers", starter: "Standard", growth: "Real-time Multi-Branch Sync", enterprise: "Automated Bank Reconciliation" },
      { name: "Automated Payment Links", starter: "UPI & Bank Transfer", growth: "Automated Reminders", enterprise: "Custom Payment Gateway / Escrow" },
    ],
  },
  {
    category: "Implementation & Support",
    features: [
      { name: "White-Glove Setup", starter: "One-time, quoted on your call", growth: "One-time, quoted on your call", enterprise: "Custom Architect Included" },
      { name: "Legacy Data Migration", starter: "Excel & Customer Lists", growth: "Full Tally & Ledger History", enterprise: "Custom ERP & Database Bridge" },
      { name: "Implementation SLA", starter: "14-Day Target", growth: "14-Day Target", enterprise: "Dedicated Sprint Schedule" },
    ],
  },
];

const ENTERPRISE_FEATURES = [
  "Unlimited branches & staff accounts",
  "Dedicated cloud database",
  "Custom module development & API webhooks",
  "On-site staff & management training",
  "Priority support — direct founder line, business hours",
];

export default function PricingSection({ plans }) {
  const [openAccordions, setOpenAccordions] = useState({ starter: false, growth: false });
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

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
      className="relative overflow-hidden py-20 sm:py-28 bg-canvas-alt border-b border-ink/[0.06] scroll-mt-[80px]"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-cyan-500/[0.04] rounded-full ambient-glow lg:blur-[190px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[450px] bg-blue-600/[0.03] rounded-full ambient-glow lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg mb-4 leading-tight">
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
              <div key={factor.title} className="p-4 rounded-2xl bg-card border border-line shadow-card text-center">
                <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-bold text-fg mb-0.5">{factor.title}</p>
                <p className="text-xs text-slate-400">{factor.desc}</p>
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
            WHAT EACH PLAN INCLUDES: STARTER, GROWTH, ENTERPRISE
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch mb-16">
          {/* 1. STARTER PLAN */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-surface border border-ink/[0.10] hover:border-ink/[0.20] shadow-[0_10px_30px_color-mix(in_srgb,var(--color-shade)_50%,transparent)]"
          >
            <div>
              {/* Badge & Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
                  Starter Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-ink/[0.04] border border-ink/[0.08] text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Single Branch
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For independent businesses getting started with connected workflows.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {starter.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
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
                  className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-fg py-2 transition-colors cursor-pointer"
                >
                  <span>What white-glove setup covers</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      openAccordions.starter ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {openAccordions.starter && (
                  <ul className="p-3 mt-1.5 rounded-xl bg-card border border-line shadow-card space-y-1.5 text-sm text-slate-300">
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
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-surface-raised border-2 border-cyan-400/60 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.30)] hover:border-cyan-400"
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

              <p className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For expanding businesses with multiple branches, dispatch operations, or teams.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {growth.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-100 font-medium">
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
                  className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-fg py-2 transition-colors cursor-pointer"
                >
                  <span>What white-glove setup covers</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      openAccordions.growth ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {openAccordions.growth && (
                  <ul className="p-3 mt-1.5 rounded-xl bg-card border border-line shadow-card space-y-1.5 text-sm text-slate-300">
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

          {/* 3. ENTERPRISE / SCALE */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-surface border border-ink/[0.10] hover:border-ink/[0.20] shadow-[0_10px_30px_color-mix(in_srgb,var(--color-shade)_50%,transparent)]"
          >
            <div>
              {/* Badge & Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
                  Enterprise
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-[10px] font-bold tracking-wider text-violet-300 uppercase">
                  Custom Scale
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For corporations requiring 20+ users, custom ERP integrations, or dedicated cloud instances.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {ENTERPRISE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Value summary box */}
              <div className="rounded-2xl p-4 mb-5 border border-line bg-card shadow-card">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm text-slate-400">Implementation Scope</span>
                  <span className="text-sm font-bold text-fg font-mono">Dedicated Architect</span>
                </div>
                <p className="text-xs text-slate-400">
                  Full custom legacy database bridge and tailored workflow design included.
                </p>
              </div>

              <PricingCallButton
                planName="Enterprise"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-fg bg-ink/[0.08] hover:bg-ink/[0.15] light:bg-surface light:hover:bg-surface-hover light:shadow-card border border-ink/[0.15] hover:border-ink/[0.30] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Talk to Founders</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </PricingCallButton>
            </div>
          </article>
        </div>

        {/* ========================================================
            INTERACTIVE FULL FEATURE COMPARISON MATRIX
           ======================================================== */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 bg-ink/[0.03] light:bg-surface light:shadow-card border border-ink/[0.10] hover:border-cyan-400/50 hover:bg-ink/[0.06] transition-all cursor-pointer"
            >
              <span>{isMatrixOpen ? "Hide Detailed Feature Matrix" : "Compare All Plan Features & Limits"}</span>
              <ChevronDown
                className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
                  isMatrixOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isMatrixOpen && (
            <div className="rounded-3xl p-6 sm:p-8 bg-surface border border-ink/[0.08] shadow-2xl overflow-x-auto animate-fade-in">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-ink/[0.10] text-slate-400">
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px]">Feature Capability</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-slate-200">Starter</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-cyan-300">Growth</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-violet-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {COMPARISON_MATRIX.map((group) => (
                    <tr key={group.category} className="group/row">
                      <td colSpan={4} className="pt-6 pb-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                          {group.category}
                        </span>
                        <div className="mt-2 space-y-2.5">
                          {group.features.map((feat) => (
                            <div key={feat.name} className="grid grid-cols-4 py-2 border-b border-ink/[0.04] text-xs sm:text-sm">
                              <span className="text-slate-300 font-medium">{feat.name}</span>
                              <span className="text-slate-400">{feat.starter}</span>
                              <span className="text-slate-200 font-semibold">{feat.growth}</span>
                              <span className="text-violet-300 font-semibold">{feat.enterprise}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================================
            TRUST & SECURITY GUARANTEE BADGES
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
          <div className="p-4 rounded-2xl bg-card border border-line shadow-card text-center">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-bold text-fg mb-0.5">GST ITC Invoices</p>
            <p className="text-xs text-slate-400">GST-compliant billing</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-line shadow-card text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-bold text-fg mb-0.5">14-Day Setup Target</p>
            <p className="text-xs text-slate-400">Typical white-glove setup timeline</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-line shadow-card text-center">
            <Download className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-bold text-fg mb-0.5">1-Click Data Export</p>
            <p className="text-xs text-slate-400">Never locked in, own your data</p>
          </div>
        </div>

      </div>

    </section>
  );
}
