// components/home/PricingSection.jsx
// ZenXAI-grade 3-Tier Pricing Architecture: Starter, Growth, Enterprise.
// Annual vs. Monthly Billing Toggle with 100% Waived Setup Fee Incentive,
// Expandable Full Feature Comparison Matrix, and Trust Guarantees.

"use client";

import { useState } from "react";
import FAQSection from "@/components/home/FAQSection";
import PlanButton from "@/components/home/PlanButton";
import { PLANS, PRODUCT_SETUP_FOCUS, newSubscriptionCharges, formatINR } from "@/lib/pricing";
import { getProduct } from "@/lib/products";
import {
  Check,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Database,
  Building2,
  FileCheck,
  Zap,
} from "lucide-react";

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
      { name: "GST & Tax Invoicing", starter: "Standard GST Bills", growth: "E-Invoicing & E-Way Bills", enterprise: "Multi-GSTIN & Consolidated" },
      { name: "Customer Ledgers", starter: "Standard", growth: "Real-time Multi-Branch Sync", enterprise: "Automated Bank Reconciliation" },
      { name: "Automated Payment Links", starter: "UPI & Bank Transfer", growth: "Automated WhatsApp Links", enterprise: "Custom Payment Gateway / Escrow" },
    ],
  },
  {
    category: "Implementation & Support",
    features: [
      { name: "White-Glove Setup", starter: "₹4,999 (FREE on Annual)", growth: "₹9,999 (FREE on Annual)", enterprise: "Custom Architect Included" },
      { name: "Legacy Data Migration", starter: "Excel & Customer Lists", growth: "Full Tally & Ledger History", enterprise: "Custom ERP & Database Bridge" },
      { name: "Implementation SLA", starter: "14-Day Guarantee", growth: "14-Day Guarantee", enterprise: "Dedicated Sprint Schedule" },
      { name: "Support Channels", starter: "Email & Chat Support", growth: "Priority WhatsApp Line", enterprise: "24/7 Dedicated Account Manager" },
    ],
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("annual"); // "annual" | "monthly"
  const [openAccordions, setOpenAccordions] = useState({ starter: false, growth: false });
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const toggleAccordion = (planKey) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [planKey]: !prev[planKey],
    }));
  };

  const handleEnterpriseCTA = () => {
    window.dispatchEvent(
      new CustomEvent("zugee:select-plan", { detail: { planName: "Enterprise Plan (Custom Scale)" } })
    );
    const section = document.getElementById("contact");
    if (!section) return;
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, sectionTop - navbarHeight - 16), behavior: "smooth" });
  };

  const productSetups = Object.entries(PRODUCT_SETUP_FOCUS)
    .map(([slug, items]) => ({
      product: getProduct(slug),
      items,
    }))
    .filter((entry) => Boolean(entry.product));

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] scroll-mt-[80px]"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-cyan-500/[0.04] rounded-full blur-[190px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[450px] bg-blue-600/[0.03] rounded-full blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Transparent Investment
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
            Predictable Plans.{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Zero Hidden Surprises.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Choose monthly flexibility or unlock 20% savings + 100% free white-glove onboarding with an annual subscription.
          </p>
        </div>

        {/* ========================================================
            BILLING CYCLE TOGGLE (Annual vs Monthly)
           ======================================================== */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="p-1.5 rounded-full bg-white/[0.03] border border-white/[0.10] flex items-center gap-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-white border border-white/30">
                Save 20% + Free Setup
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white/[0.12] text-white border border-white/[0.20]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* ========================================================
            3-TIER PRICING CARDS: STARTER, GROWTH, ENTERPRISE
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch mb-16">
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

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {billingCycle === "annual" ? "₹1,599" : "₹1,999"}
                  </span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>
                {billingCycle === "annual" ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Billed annually (₹19,188/yr) • Setup Fee 100% Waived!
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-semibold text-cyan-400">
                    + ₹4,999 one-time white-glove setup
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For independent businesses getting started with connected workflows.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {PLANS[0].features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Cost summary box */}
              <div className="rounded-2xl p-4 mb-5 border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-slate-400">
                    {billingCycle === "annual" ? "Annual commitment" : "First month payment"}
                  </span>
                  <span className="text-lg font-bold text-white font-mono">
                    {billingCycle === "annual" ? "₹19,188" : "₹6,998"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {billingCycle === "annual"
                    ? "Includes 12 months full cloud access + ₹0 setup fee"
                    : "Includes ₹4,999 white-glove setup + ₹1,999 month 1"}
                </p>
              </div>

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
                    {PLANS[0].setupIncludes.slice(0, 5).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <PlanButton planKey="starter" planName="Starter Plan" featured={false} />
            </div>
          </article>

          {/* 2. GROWTH PLAN (FEATURED) */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#0C1222] border-2 border-cyan-400/60 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.30)] hover:border-cyan-400"
          >
            {/* Top Recommended Banner */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6)" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Most Popular Choice</span>
            </div>

            <div>
              {/* Badge & Name */}
              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                  Growth Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
                  Multi-Branch
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {billingCycle === "annual" ? "₹3,299" : "₹4,099"}
                  </span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>
                {billingCycle === "annual" ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Billed annually (₹39,588/yr) • Setup Fee 100% Waived!
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-semibold text-cyan-400">
                    + ₹9,999 one-time white-glove setup
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For expanding businesses with multiple branches, dispatch operations, or teams.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {PLANS[1].features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-100 font-medium">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Cost summary box */}
              <div className="rounded-2xl p-4 mb-5 border border-cyan-500/25 bg-cyan-500/[0.05]">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-slate-300">
                    {billingCycle === "annual" ? "Annual commitment" : "First month payment"}
                  </span>
                  <span className="text-lg font-bold text-white font-mono">
                    {billingCycle === "annual" ? "₹39,588" : "₹14,098"}
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/80">
                  {billingCycle === "annual"
                    ? "Includes 12 months full cloud access + ₹0 setup fee (Save ₹9,999)"
                    : "Includes ₹9,999 white-glove setup + ₹4,099 month 1"}
                </p>
              </div>

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
                    {PLANS[1].setupIncludes.slice(0, 6).map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <PlanButton planKey="growth" planName="Growth Plan" featured={true} />
            </div>
          </article>

          {/* 3. ENTERPRISE / SCALE */}
          <article
            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#080C16] border border-white/[0.10] hover:border-white/[0.20] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
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

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    Custom
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Tailored to your legal entities &amp; fleet volume
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                For corporations requiring 20+ users, custom ERP integrations, or dedicated cloud instances.
              </p>

              {/* Key Features */}
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited branches & staff accounts",
                  "Dedicated cloud database & high-speed backup",
                  "Custom module development & API webhooks",
                  "On-site staff & management training",
                  "24/7 Dedicated SLA & direct founder hotline",
                  "Sovereign data hosting with custom compliance",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Value summary box */}
              <div className="rounded-2xl p-4 mb-5 border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Implementation Scope</span>
                  <span className="text-sm font-bold text-white font-mono">Dedicated Architect</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Full custom legacy database bridge and tailored workflow design included.
                </p>
              </div>

              <button
                type="button"
                onClick={handleEnterpriseCTA}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/[0.30] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Talk to Founders</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 bg-white/[0.03] border border-white/[0.10] hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all cursor-pointer"
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
            <div className="rounded-3xl p-6 sm:p-8 bg-[#080C16] border border-white/[0.08] shadow-2xl overflow-x-auto animate-fade-in">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.10] text-slate-400">
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px]">Feature Capability</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-slate-200">Starter</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-cyan-300">Growth (Popular)</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-violet-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {COMPARISON_MATRIX.map((group) => (
                    <tr key={group.category} className="group/row">
                      <td colSpan={4} className="pt-6 pb-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                          {group.category}
                        </span>
                        <div className="mt-2 space-y-2.5">
                          {group.features.map((feat) => (
                            <div key={feat.name} className="grid grid-cols-4 py-2 border-b border-white/[0.04] text-xs">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-2xl mb-1 block">🇮🇳</span>
            <p className="text-xs font-bold text-white mb-0.5">Indian Data Sovereignty</p>
            <p className="text-[11px] text-slate-400">Data never leaves Indian soil</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-2xl mb-1 block">🛡️</span>
            <p className="text-xs font-bold text-white mb-0.5">GST ITC Invoices</p>
            <p className="text-[11px] text-slate-400">100% tax compliant billing</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-2xl mb-1 block">⏱️</span>
            <p className="text-xs font-bold text-white mb-0.5">14-Day Guarantee</p>
            <p className="text-[11px] text-slate-400">Live setup or first month free</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
            <span className="text-2xl mb-1 block">🔄</span>
            <p className="text-xs font-bold text-white mb-0.5">1-Click Data Export</p>
            <p className="text-[11px] text-slate-400">Never locked in, own your data</p>
          </div>
        </div>

        {/* Product Setup Focus Details */}
        {productSetups.length > 0 && (
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-1">
              White-Glove Setup is Custom-Tailored to Your Trade
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-5">
              During the 14-day onboarding, our engineers configure workflows specific to your product:
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productSetups.map(({ product, items }) => (
                <div key={product.slug} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <dt className="text-sm font-bold text-cyan-300 mb-2">{product.name}</dt>
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

      {/* Embedded FAQ Section */}
      <FAQSection />
    </section>
  );
}
