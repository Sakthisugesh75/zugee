// components/home/WhyZugee.jsx
// "Why ZUGEE": four points from lib/site-content.js (WHY_ZUGEE), styled to match the original dark
// homepage design (uppercase gradient heading, glass cards, cyan icon tiles). Server component.
// Glows only under motion-safe.

import { Calculator, Lock, Puzzle, Wrench } from "lucide-react";
import { WHY_ZUGEE } from "@/lib/site-content";

const ICONS = { tally: Calculator, price: Lock, setup: Wrench, custom: Puzzle };

export default function WhyZugee() {
  return (
    <section
      aria-labelledby="why-zugee-heading"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06]"
    >
      <div className="absolute inset-0 pointer-events-none hidden motion-safe:block" aria-hidden="true">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[450px] bg-cyan-500/[0.04] rounded-full blur-[80px] lg:blur-[180px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="why-zugee-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white text-center leading-tight mb-12 sm:mb-16"
        >
          Why{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            ZUGEE
          </span>
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          {WHY_ZUGEE.map((point) => {
            const Icon = ICONS[point.key];
            return (
              <li
                key={point.key}
                className="glass-card flex flex-col p-6 border-white/[0.12] hover:border-cyan-500/40 motion-safe:hover:shadow-[0_10px_30px_rgba(6,182,212,0.12)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                  <Icon className="w-6 h-6 text-cyan-300" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold leading-snug text-white">{point.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-300">{point.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
