// components/home/ProofSection.jsx
//
// TODO(founder): PROOF SECTION — the biggest gap on the page.
// Supply, for each of 3 customers who agree to be named:
//   { quote, name, business, city, industry, metric }  — `metric` is ONE specific number they improved
// and one real METRIC_LINE (e.g. "__ businesses · __ GST invoices generated").
// Add them below and the cards render automatically. Until then the section shows an honest status
// line. Never add invented customers, or vague filler like "trusted by hundreds of businesses".

import { MotionReveal } from "@/components/ui/MotionReveal";
import { Quote } from "lucide-react";

const TESTIMONIALS = [];
const METRIC_LINE = null;

export default function ProofSection() {
  const hasProof = TESTIMONIALS.length > 0;

  return (
    <section id="proof" className="section-wrapper bg-[#06090F] border-b border-white/[0.08]">
      <div className="container">
        <MotionReveal className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Results from real Zugee customers
          </h2>
          {METRIC_LINE && <p className="text-sm font-mono text-[#00F0FF]">{METRIC_LINE}</p>}
        </MotionReveal>

        {hasProof ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <MotionReveal
                key={t.name}
                className="rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 flex flex-col"
              >
                <Quote className="w-5 h-5 text-[#00F0FF] mb-3" />
                <p className="text-sm text-slate-200 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-lg font-bold text-[#00F0FF] font-mono">{t.metric}</p>
                <p className="mt-2 text-xs text-slate-400">
                  <span className="text-white font-semibold">{t.name}</span>, {t.business}, {t.city} · {t.industry}
                </p>
              </MotionReveal>
            ))}
          </div>
        ) : (
          <MotionReveal className="max-w-2xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 text-center">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We are onboarding our first customers now. Named case studies with real numbers will appear
              here as customers agree to share them.
            </p>
          </MotionReveal>
        )}

        {process.env.NODE_ENV !== "production" && !hasProof && (
          <p className="mt-6 max-w-2xl mx-auto rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs font-mono text-amber-300 text-center">
            DEV ONLY · TODO(founder): add 3 testimonials + 1 metric line in components/home/ProofSection.jsx
          </p>
        )}
      </div>
    </section>
  );
}
