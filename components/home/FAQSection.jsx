// components/home/FAQSection.jsx
// Server component using native <details>: no JavaScript needed, fully readable by crawlers,
// and the visible answers are the same strings emitted in the FAQPage schema.

import { FAQ_ITEMS } from "@/lib/site-content";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  return (
    <div id="faq" className="max-w-3xl mx-auto scroll-mt-[80px]">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <HelpCircle className="w-7 h-7 text-cyan-400" aria-hidden="true" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-slate-300">
          Everything you need to know about ZUGEE
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((faq, idx) => (
          <details
            key={faq.question}
            open={idx === 0}
            className="group glass-card border-white/[0.12] open:border-cyan-500/30 open:glow-cyan-soft transition-all duration-300 hover:border-white/[0.18]"
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 [&::-webkit-details-marker]:hidden hover:bg-white/[0.02] transition-colors rounded-2xl">
              <span className="text-sm sm:text-base font-bold text-white pr-2">{faq.question}</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center shrink-0 group-open:bg-cyan-500/10 group-open:border-cyan-500/30 transition-all">
                <ChevronDown className="w-4 h-4 text-slate-400 transition-all duration-300 group-open:rotate-180 group-open:text-cyan-400" />
              </div>
            </summary>
            <div className="px-6 pb-6 pt-1">
              <div className="pl-4 border-l-2 border-cyan-500/20">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-400 mb-3">Still have questions?</p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors"
        >
          Get in touch with us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
