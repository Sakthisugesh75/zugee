// components/home/HowWeWork.jsx
// How it works: Demo → Setup → Go-live → Support, from lib/site-content.js (HOW_WE_WORK). The only
// timeline shown is SETUP_TIMELINE, the Terms wording: a target, not a guarantee.
// Server component; only the "Book a demo" button is a client island.

import { ArrowRight } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { HOW_WE_WORK, SETUP_TIMELINE } from "@/lib/site-content";
import { SUPPORT_EMAIL } from "@/lib/site";

export default function HowWeWork() {
  return (
    <section id="how-it-works" className="scroll-mt-[80px] py-16 sm:py-20 bg-[#06090F] border-b border-white/[0.08]">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center mb-10 sm:mb-12">
          How it works
        </h2>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          {HOW_WE_WORK.map((step, i) => (
            <li key={step.title} className="flex flex-col rounded-2xl border border-white/[0.12] bg-white/[0.03] p-6">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-[#04121A] text-lg font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-slate-300">{step.body}</p>
              {step.title === "Support" && (
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-3 text-base font-semibold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-5 text-center">
          <p className="text-base sm:text-lg text-slate-200">{SETUP_TIMELINE}</p>
          <SmoothScrollLink
            targetId="contact"
            className="inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3 rounded-full text-base font-bold text-[#04121A] bg-cyan-400 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06090F] motion-safe:transition-colors"
          >
            Book a demo
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
