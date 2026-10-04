// components/home/FAQSection.jsx
// Light FAQ section. Server component using native <details>: no JavaScript needed, fully readable
// by crawlers, and the visible answers are the same strings emitted in the FAQPage schema.

import { FAQ_ITEMS } from "@/lib/site-content";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-[80px] py-16 sm:py-20 bg-[#F4F6F9] text-slate-900">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Frequently asked questions</h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700">Everything you need to know about ZUGEE.</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <details
              key={faq.question}
              open={idx === 0}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:border-cyan-600/40"
            >
              <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 cursor-pointer list-none rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 [&::-webkit-details-marker]:hidden">
                <span className="text-base sm:text-lg font-bold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-slate-500 group-open:rotate-180 group-open:text-cyan-700 motion-safe:transition-transform"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 sm:px-6 pb-5">
                <p className="text-base leading-relaxed text-slate-700">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-base text-slate-700 mb-2">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-base font-semibold text-cyan-800 hover:text-cyan-900 underline-offset-4 hover:underline"
          >
            Get in touch with us
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
