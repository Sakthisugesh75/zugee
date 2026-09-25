// components/home/PricingSection.jsx
// Server component: two tiers, who each is for, then the six buying-objection FAQs.

import { PRICING_TIERS } from "@/lib/verticals";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { HexCheck } from "@/components/ui/PrecisionIcons";
import FAQSection from "@/components/home/FAQSection";
import { ArrowRight } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container relative z-10">
        <MotionReveal className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Simple pricing. Start free for 14 days.
          </h2>
          <p className="text-sm font-mono text-slate-400">
            Free for 14 days after your call · No credit card · Prices exclude GST
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {PRICING_TIERS.map((tier, i) => (
            <MotionReveal
              key={tier.id}
              delay={i * 0.08}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col border ${
                tier.featured
                  ? "border-[#00F0FF]/50 bg-[#0E172A]/90 shadow-[0_0_35px_rgba(0,240,255,0.12)]"
                  : "border-white/[0.1] bg-[#0A0F1D]/80"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <p className="text-right">
                  <span className="text-2xl font-bold font-mono text-[#00F0FF]">{tier.priceDisplay}</span>
                  <span className="block text-[11px] font-mono text-slate-400">{tier.period}</span>
                </p>
              </div>
              <p className="text-sm text-slate-300 mb-6">{tier.audience}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                    <HexCheck className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`${tier.featured ? "btn-primary" : "btn-secondary"} w-full text-xs font-mono uppercase tracking-wider !py-3.5`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal>
          <FAQSection />
        </MotionReveal>
      </div>
    </section>
  );
}
