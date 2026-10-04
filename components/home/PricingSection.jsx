// components/home/PricingSection.jsx
// Pricing approach: no prices are published. Each business is quoted on a short call, and the
// monthly price is fixed for the life of the subscription. Wording follows the Terms of Service.
// Nothing from lib/pricing.js reaches this component.
// Server component; only the button is a client island.

import { ArrowRight, Building2, Lock, Package, Users, Wrench } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

// What a quote depends on (Terms: product, users and branches, and how much setup you need).
const PRICE_FACTORS = [
  { icon: Package, title: "Your product", desc: "Each ZUGEE product is priced on its own." },
  { icon: Users, title: "Number of users", desc: "How many of your staff will sign in." },
  { icon: Building2, title: "Number of branches", desc: "One location or several." },
  { icon: Wrench, title: "Setup needs", desc: "Data migration, configuration and training." }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-[80px] py-16 sm:py-20 bg-[#080C14] border-b border-white/[0.08]">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Pricing</h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            We don&apos;t publish prices. We quote each business on a short call, based on the product, the number of
            users and branches, and how much setup you need.
          </p>
        </div>

        <div className="mt-8 mx-auto max-w-2xl flex items-start sm:items-center gap-4 rounded-2xl border border-cyan-400/40 bg-cyan-400/[0.08] p-5 sm:p-6">
          <Lock className="w-7 h-7 shrink-0 text-cyan-300" aria-hidden="true" />
          <p className="text-lg sm:text-xl font-bold text-white leading-snug">
            Your monthly price is fixed for the life of your subscription.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
          {PRICE_FACTORS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-5">
              <Icon className="w-6 h-6 text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
              <p className="mt-1 text-base text-slate-300">{desc}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <SmoothScrollLink
            targetId="contact"
            className="inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3 rounded-full text-base font-bold text-[#04121A] bg-cyan-400 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14] motion-safe:transition-colors"
          >
            Ask for a quote
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
