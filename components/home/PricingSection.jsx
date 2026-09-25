// components/home/PricingSection.jsx
// Server component: the two plans, with the monthly subscription and the one-time Setup & Onboarding
// fee shown SEPARATELY on every card, plus exactly what the first payment and renewals will be.
// All numbers come from lib/pricing.js — never type a price into this file. Followed by the FAQ.

import FAQSection from "@/components/home/FAQSection";
import PlanButton from "@/components/home/PlanButton";
import { PLANS, PRODUCT_SETUP_FOCUS, newSubscriptionCharges, formatINR } from "@/lib/pricing";
import { getProduct } from "@/lib/products";
import { Check, ChevronDown } from "lucide-react";

function PlanCard({ plan }) {
  const charges = newSubscriptionCharges(plan.key);

  return (
    <article
      className={`rounded-3xl p-7 sm:p-8 flex flex-col border ${
        plan.featured
          ? "border-[#00F0FF]/50 bg-[#0E172A]/90 shadow-[0_0_35px_rgba(0,240,255,0.12)]"
          : "border-white/[0.1] bg-[#0A0F1D]/80"
      }`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">{plan.name}</h3>

      {/* Recurring price first and largest; the one-time setup directly underneath, never merged into it */}
      <p className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-white">{formatINR(plan.monthlyPrice)}</span>
        <span className="text-base text-slate-300">/ month</span>
      </p>
      <p className="mt-1 text-base font-semibold text-[#38BDF8]">+ {formatINR(plan.setupFee)} one-time setup</p>

      <p className="mt-4 text-sm text-slate-300">{plan.audience}</p>

      <ul className="mt-6 space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
            <Check className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* First payment vs recurring, spelled out so nothing is a surprise later */}
      <div className="mt-6 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 text-sm">
        <p className="flex items-baseline justify-between gap-3">
          <span className="font-semibold text-white">Starting today</span>
          <span className="text-lg font-bold text-white">{formatINR(charges.firstPayment)}</span>
        </p>
        <p className="mt-1 text-slate-400">
          {formatINR(charges.setupPayable)} setup + {formatINR(charges.monthlyPrice)} first month
        </p>
        <p className="mt-2 pt-2 border-t border-white/[0.08] text-slate-200">
          Then <span className="font-semibold text-white">{formatINR(charges.recurringPayment)}/month</span>
        </p>
      </div>

      <details className="group mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none text-sm font-semibold text-white rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] [&::-webkit-details-marker]:hidden">
          What the {formatINR(plan.setupFee)} setup includes
          <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="px-4 pb-4 space-y-1.5">
          {plan.setupIncludes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-1" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6">
        <PlanButton planKey={plan.key} planName={plan.name} featured={plan.featured} />
      </div>
    </article>
  );
}

export default function PricingSection() {
  const productSetups = Object.entries(PRODUCT_SETUP_FOCUS)
    .map(([slug, items]) => ({ product: getProduct(slug), items }))
    .filter((p) => p.product && p.product.status === "available");

  return (
    <section id="pricing" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Pricing</h2>
          <p className="text-lg text-slate-200 font-semibold mb-3">
            Pay once to get your business set up. Pay monthly to keep using ZUGEE.
          </p>
          <p className="text-base text-slate-300 leading-relaxed">
            Every ZUGEE workspace is configured around your business. The one-time Setup &amp; Onboarding fee
            covers the initial configuration, onboarding and help getting your data in, so you can start
            without spending hours setting everything up yourself.
          </p>
          {/* TODO(founder): confirm prices exclude GST (the earlier pricing said so). */}
          <p className="mt-4 text-sm text-slate-400">
            Prices exclude GST. The setup fee is charged once per product, never on monthly renewals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>

        {productSetups.length > 0 && (
          <div className="max-w-4xl mx-auto mt-10 rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6">
            <h3 className="text-base font-bold text-white mb-1">Setup is tailored to your product</h3>
            <p className="text-sm text-slate-400 mb-4">For example:</p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productSetups.map(({ product, items }) => (
                <div key={product.slug}>
                  <dt className="text-sm font-semibold text-[#38BDF8] mb-1.5">{product.name}</dt>
                  <dd className="text-sm text-slate-300 leading-relaxed">{items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-16">
          <FAQSection />
        </div>
      </div>
    </section>
  );
}
