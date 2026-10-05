// components/home/Hero.jsx
// Hero in the original dark design (ambient glow, grid texture, uppercase headline with a gradient
// half) with the current content only: headline, subline and one "Book a demo" button. No
// dashboards, screenshots or anything resembling product screens. The company's location is in
// the footer. Server component; only the scroll button is a client island. Glows only under
// motion-safe.

import { ArrowRight } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#06060e] border-b border-white/[0.06]">
      {/* Background ambient lighting (motion-safe only) and grid texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hidden motion-safe:block absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] max-w-full h-[500px] bg-cyan-500/[0.07] rounded-full blur-[80px] lg:blur-[180px]" />
        <div className="hidden motion-safe:block absolute top-[40%] right-[10%] w-[450px] max-w-full h-[400px] bg-violet-600/[0.04] rounded-full blur-[80px] lg:blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight text-white leading-[1.08] uppercase text-balance">
            ERP &amp; CRM{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4 20%, #3B82F6 60%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              built for your industry.
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto text-center leading-relaxed mb-10">
          Your daily operations in one system — configured to how your business works.
        </p>

        <div className="flex justify-center">
          <SmoothScrollLink
            targetId="contact"
            className="group/btn w-full sm:w-auto min-h-12 px-8 py-3.5 rounded-full text-white text-base font-bold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-br from-cyan-700 to-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060e] motion-safe:shadow-[0_8px_32px_rgba(6,182,212,0.35)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105"
          >
            <span>Book a demo</span>
            <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-1" aria-hidden="true" />
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
