// components/home/Hero.jsx
// Hero. Message: specialised software for each industry, set up for you. Each ZUGEE product
// is separate (own login, own database), so nothing here may claim a shared login or shared data.

import { ArrowRight, CheckCircle2 } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#06060e] border-b border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[80px] lg:blur-[180px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[80px] lg:blur-[160px]" />
        {/* Subtle cyber grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-cyan-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-300">
              INDUSTRY-SPECIFIC BUSINESS SOFTWARE
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight text-white leading-[1.08] uppercase">
            Specialised Software for Your Industry,{" "}
            <span
              className="inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4 20%, #3B82F6 60%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Set Up for You.
            </span>
          </h1>
        </div>

        {/* Subhead Value Proposition */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto text-center leading-relaxed mb-8">
          Running your business on WhatsApp, Excel and Tally means re-entering the same details and chasing staff for updates.
          ZUGEE makes a separate product for each industry — fleet, travel, water supply, real estate, manufacturing, schools and more.
          Our team sets yours up, moves your data across and trains your staff.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <SmoothScrollLink
            targetId="products"
            className="group/btn w-full sm:w-auto px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-[0_8px_32px_rgba(6,182,212,0.35)] hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
            }}
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </SmoothScrollLink>

          <SmoothScrollLink
            targetId="contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-slate-200 hover:text-white text-sm font-semibold tracking-wide inline-flex items-center justify-center bg-white/[0.04] border border-white/[0.12] hover:border-cyan-400/40 hover:bg-white/[0.08] transition-all duration-300"
          >
            Book a 1-on-1 Live Demo
          </SmoothScrollLink>
        </div>

        {/* Proof Checkpoints */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-4 text-xs sm:text-sm text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            Set up for you by our team
          </span>
        </div>

        {/* Each product is separate: own login, own database */}
        <p className="text-center text-xs text-slate-500 mb-12 max-w-xl mx-auto">
          Each ZUGEE product is separate software with its own login and its own data.
          Choose the one built for your business.
        </p>
      </div>
    </section>
  );
}
