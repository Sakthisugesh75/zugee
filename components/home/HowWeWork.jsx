// components/home/HowWeWork.jsx
// Server component: how buying ZUGEE works, in three plain steps. Copy lives in lib/site-content.js.

import { HOW_WE_WORK } from "@/lib/site-content";

export default function HowWeWork() {
  return (
    <section id="how-it-works" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-20">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-center mb-10">How it works</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {HOW_WE_WORK.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6">
              <span className="flex w-9 h-9 items-center justify-center rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] font-bold mb-4">
                {i + 1}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
