// components/home/WhyZugee.jsx
// "Why ZUGEE": four points from lib/site-content.js (WHY_ZUGEE). Light section for readability.
// Server component.

import { Calculator, Lock, Puzzle, Wrench } from "lucide-react";
import { WHY_ZUGEE } from "@/lib/site-content";

const ICONS = { tally: Calculator, price: Lock, setup: Wrench, custom: Puzzle };

export default function WhyZugee() {
  return (
    <section aria-labelledby="why-zugee-heading" className="py-16 sm:py-20 bg-[#F4F6F9] text-slate-900">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <h2 id="why-zugee-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center text-slate-900 mb-10 sm:mb-12">
          Why ZUGEE
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          {WHY_ZUGEE.map((point) => {
            const Icon = ICONS[point.key];
            return (
              <li key={point.key} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200">
                  <Icon className="w-6 h-6 text-cyan-700" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900">{point.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{point.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
