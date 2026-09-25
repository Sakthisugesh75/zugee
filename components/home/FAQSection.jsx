// components/home/FAQSection.jsx
// Server component using native <details>: no JavaScript needed, fully readable by crawlers,
// and the visible answers are the same strings emitted in the FAQPage schema.

import { FAQ_ITEMS } from "@/lib/verticals";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  return (
    <div id="faq" className="max-w-3xl mx-auto scroll-mt-28">
      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center mb-8">
        Common questions
      </h3>
      <div className="space-y-3">
        {FAQ_ITEMS.map((faq, idx) => (
          <details
            key={faq.question}
            open={idx === 0}
            className="group rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 open:border-[#00F0FF]/40 open:bg-[#0E1626] transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-sm sm:text-base font-bold text-white">{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180 group-open:text-[#00F0FF]" />
            </summary>
            <p className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
