// components/home/FinalCTA.jsx
// Final call to action in the original design (glass card with the mascot, benefit tiles, trust
// row) with current content only: "See the software live — book a free demo.", two points from
// Why ZUGEE, and the "Built for Indian SMEs" line from the footer. The form itself is in
// ContactSection, directly below. Server component; the mascot and the button are client islands.
// Glows and the button shine run only under motion-safe (the mascot handles reduced motion itself).

import { ArrowRight, Lock, Sparkles } from "lucide-react";
import InteractiveMascot from "@/components/animations/InteractiveMascot";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { WHY_ZUGEE } from "@/lib/site-content";

const BENEFITS = [
  { icon: Sparkles, text: WHY_ZUGEE.find((p) => p.key === "setup").title },
  { icon: Lock, text: WHY_ZUGEE.find((p) => p.key === "price").title }
];

export default function FinalCTA() {
  return (
    <section className="section-wrapper bg-gradient-to-b from-[#05070B] via-[#06090F] to-[#04070D] border-t border-white/[0.08] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden motion-safe:block" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[600px] bg-cyan-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] max-w-full h-[400px] bg-blue-500/5 rounded-full blur-[80px] lg:blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-feature-card border-cyan-500/30 motion-safe:shadow-[0_0_20px_rgba(0,240,255,0.15)] p-6 sm:p-12 lg:p-16 relative overflow-hidden group">
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-500"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="shrink-0 hidden lg:block" aria-hidden="true">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl hidden motion-safe:block" />
                  <InteractiveMascot size={140} className="relative z-10" enableProximity={true} enableMouseTracking={true} />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight">
                  See the software live — book a free demo.
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 list-none p-0">
                  {BENEFITS.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] hover:border-cyan-500/30 text-left"
                    >
                      <span className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                      </span>
                      <span className="text-base font-medium text-slate-100">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center lg:justify-start">
                  <SmoothScrollLink
                    targetId="contact"
                    className="btn-primary text-base !py-4 !px-8 group/btn relative overflow-hidden"
                  >
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[-100%] hidden motion-safe:block motion-safe:group-hover/btn:translate-x-[100%] motion-safe:transition-transform motion-safe:duration-1000"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Book a demo</span>
                    <ArrowRight className="w-5 h-5 relative z-10 motion-safe:group-hover/btn:translate-x-1 motion-safe:transition-transform" aria-hidden="true" />
                  </SmoothScrollLink>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-base text-slate-300">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Built for Indian SMEs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
