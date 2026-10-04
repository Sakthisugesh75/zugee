// components/home/FAQSection.jsx
// FAQ in the original dark glass design with the current questions and answers.
// Server component using native <details>: no JavaScript needed, fully readable by crawlers, and
// the visible answers are the same strings emitted in the FAQPage schema. Glow only under motion-safe.

import { FAQ_ITEMS } from "@/lib/site-content";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  return (
    <section id="faq" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-[80px]">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 mb-4">
              <HelpCircle className="w-7 h-7 text-cyan-300" aria-hidden="true" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Frequently asked questions</h2>
            <p className="text-base sm:text-lg text-slate-300">Everything you need to know about ZUGEE.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <details
                key={faq.question}
                open={idx === 0}
                className="group glass-card border-white/[0.14] open:border-cyan-500/40 hover:border-white/[0.22] motion-safe:open:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              >
                <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5 cursor-pointer list-none rounded-2xl hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 [&::-webkit-details-marker]:hidden">
                  <span className="text-base sm:text-lg font-bold text-white pr-2">{faq.question}</span>
                  <span className="w-9 h-9 rounded-lg bg-cyan-500/5 border border-cyan-500/25 flex items-center justify-center shrink-0 group-open:bg-cyan-500/10 group-open:border-cyan-500/40">
                    <ChevronDown
                      className="w-4 h-4 text-slate-300 group-open:rotate-180 group-open:text-cyan-300 motion-safe:transition-transform motion-safe:duration-300"
                      aria-hidden="true"
                    />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-6 pt-1">
                  <div className="pl-4 border-l-2 border-cyan-500/30">
                    <p className="text-base text-slate-200 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base text-slate-300 mb-3">Still have questions?</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-base font-semibold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline"
            >
              Get in touch with us
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
