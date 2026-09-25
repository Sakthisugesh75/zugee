// components/home/Hero.jsx
// Server component. Nothing above the fold depends on client JavaScript, so the hero is readable
// the moment the HTML arrives. Entrance uses a short CSS fade only.

import { ArrowRight, FileSpreadsheet, MessageSquare, NotebookPen, BookOpen } from "lucide-react";

const TODAY_TOOLS = [
  { label: "Tally", Icon: BookOpen },
  { label: "Excel", Icon: FileSpreadsheet },
  { label: "WhatsApp", Icon: MessageSquare },
  { label: "Paper", Icon: NotebookPen }
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-[#06090F] bg-cyber-grid">
      <div className="hero-glow-sphere top-10 left-1/2 -translate-x-1/2 opacity-70" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <p className="eyebrow">Business management software for small businesses in India</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            GST billing and inventory software that{" "}
            <span className="blue-cyan-gradient-text">gets you paid on time.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Your bills live in Tally, your stock in Excel and your customer follow-ups in WhatsApp.
            Zugee puts all three in one place, so nothing gets missed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#contact" className="btn-primary w-full sm:w-auto text-sm font-mono uppercase tracking-wider !py-4 !px-8">
              <span>Book a Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#product" className="btn-secondary w-full sm:w-auto text-sm font-mono !py-4 !px-6">
              How it works
            </a>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-400">
            From ₹1,999/month · 14-day free trial · No credit card
          </p>
        </div>

        {/* Today vs. with Zugee */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-4 animate-fade-in">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0F1D]/80 p-5">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">Today</span>
            <div className="flex flex-wrap gap-2 mb-3">
              {TODAY_TOOLS.map(({ label, Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {label}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-400">Four places to check who owes you money.</p>
          </div>

          <div className="flex items-center justify-center text-[#00F0FF]">
            <ArrowRight className="w-6 h-6 rotate-90 sm:rotate-0" />
          </div>

          <div className="rounded-2xl border border-[#00F0FF]/40 bg-[#00F0FF]/[0.06] p-5 shadow-[0_0_30px_rgba(0,240,255,0.12)]">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-[#00F0FF] mb-3">With Zugee</span>
            <p className="text-base font-semibold text-white">One screen for bills, stock, payments and messages.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
