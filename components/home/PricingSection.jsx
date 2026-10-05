// components/home/PricingSection.jsx
// Pricing in the original dark design (ambient glow, uppercase gradient heading, factor tiles,
// gradient call button) with the current content: no published prices, a quote on a short call,
// and the monthly price fixed for the life of the subscription (Terms wording).
// Nothing from lib/pricing.js reaches this component. Server component; the button is a client
// island that also pre-selects "Pricing call" in the form. Glows only under motion-safe.

import { ArrowRight, Building2, Lock, Package, Users, Wrench } from "lucide-react";
import PricingCallButton from "@/components/home/PricingCallButton";

// What a quote depends on (Terms: product, users and branches, and how much setup you need).
const PRICE_FACTORS = [
  { icon: Package, title: "Your product", desc: "Each ZUGEE product is priced on its own." },
  { icon: Users, title: "Number of users", desc: "How many of your staff will sign in." },
  { icon: Building2, title: "Number of branches", desc: "One location or several." },
  { icon: Wrench, title: "Setup needs", desc: "Data migration, configuration and training." }
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] scroll-mt-[80px]"
    >
      <div className="absolute inset-0 pointer-events-none hidden motion-safe:block" aria-hidden="true">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[550px] bg-cyan-500/[0.04] rounded-full blur-[80px] lg:blur-[190px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] max-w-full h-[450px] bg-blue-600/[0.03] rounded-full blur-[80px] lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-4">
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Pricing
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We don&apos;t publish prices. We quote each business on a short call, based on the product, the number of
            users and branches, and how much setup you need.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10 flex items-start sm:items-center gap-4 rounded-2xl border border-cyan-400/40 bg-white/[0.03] backdrop-blur-md p-5 sm:p-6 motion-safe:shadow-[0_10px_30px_rgba(6,182,212,0.12)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Lock className="w-5 h-5 text-cyan-300" aria-hidden="true" />
          </span>
          <p className="text-lg sm:text-xl font-bold text-white leading-snug">
            Your monthly price is fixed for the life of your subscription.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10 list-none p-0">
          {PRICE_FACTORS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center">
              <Icon className="w-6 h-6 text-cyan-300 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-base font-bold text-white mb-1">{title}</h3>
              <p className="text-base text-slate-300">{desc}</p>
            </li>
          ))}
        </ul>

        <div className="flex justify-center">
          <PricingCallButton className="min-h-12 px-7 sm:px-9 py-3.5 rounded-full text-base font-bold tracking-wide text-white bg-gradient-to-r from-cyan-700 to-blue-700 inline-flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-safe:shadow-[0_4px_20px_rgba(6,182,212,0.35)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105">
            <span>Ask for a quote</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PricingCallButton>
        </div>
      </div>
    </section>
  );
}
