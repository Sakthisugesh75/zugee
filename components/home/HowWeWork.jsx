// components/home/HowWeWork.jsx
// How it works in the original design (connected desktop timeline with icon nodes and a progress
// beam, vertical mobile timeline, staggered reveal, bottom banner) with the current content:
// Demo → Setup → Go-live → Support from lib/site-content.js (HOW_WE_WORK). The only timeline shown
// is SETUP_TIMELINE, the Terms wording: a target, not a guarantee.
// The reveal and glows run only under motion-safe; with reduced motion every step is visible at once.

"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, LifeBuoy, Rocket, ShieldCheck, Wrench } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
import { HOW_WE_WORK, SETUP_TIMELINE } from "@/lib/site-content";
import { SUPPORT_EMAIL } from "@/lib/site";

const ICONS = [Calendar, Wrench, Rocket, LifeBuoy];
const STEPS = HOW_WE_WORK.map((step, i) => ({ ...step, number: String(i + 1).padStart(2, "0"), icon: ICONS[i] }));

function SupportEmail({ step }) {
  if (step.title !== "Support") return null;
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="mt-3 inline-block text-base font-semibold text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline break-all"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

export default function HowWeWork() {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timers = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STEPS.forEach((_, index) => {
            timers.push(setTimeout(() => setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index])), index * 120));
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const progress = `${(activeStep / (STEPS.length - 1)) * 100}%`;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] scroll-mt-[80px]"
    >
      <div className="absolute inset-0 pointer-events-none hidden motion-safe:block" aria-hidden="true">
        <div className="absolute top-[25%] left-[20%] w-[500px] max-w-full h-[400px] bg-cyan-500/[0.03] rounded-full blur-[80px] lg:blur-[160px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] max-w-full h-[400px] bg-blue-600/[0.03] rounded-full blur-[80px] lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            How it{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              works
            </span>
          </h2>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative mb-16">
          <div className="absolute top-[36px] left-[6%] right-[6%] h-[2px] bg-white/[0.08] z-0" aria-hidden="true">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full motion-safe:transition-all motion-safe:duration-700"
              style={{ width: progress }}
            />
          </div>

          <ol className="grid grid-cols-4 gap-6 relative z-10 list-none p-0 m-0">
            {STEPS.map((step, index) => {
              const isVisible = visibleSteps.includes(index);
              const isActive = activeStep === index;
              const isPast = activeStep > index;
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setActiveStep(index)}
                  className={`group cursor-pointer motion-safe:transition-all motion-safe:duration-500 ${
                    isVisible ? "" : "motion-safe:opacity-0 motion-safe:translate-y-8"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-6 relative motion-safe:transition-all motion-safe:duration-500 ${
                        isActive
                          ? "bg-cyan-500/20 border-2 border-cyan-400 motion-safe:shadow-[0_0_30px_rgba(6,182,212,0.4)] motion-safe:scale-110"
                          : isPast
                          ? "bg-blue-500/10 border border-blue-400/40"
                          : "bg-[#0A0E1A] border border-white/[0.15] group-hover:border-white/[0.3]"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 ${isActive ? "text-cyan-300" : isPast ? "text-blue-300" : "text-slate-300"}`}
                        aria-hidden="true"
                      />
                      <span className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#060810] border border-white/[0.2] text-white" aria-hidden="true">
                        {step.number}
                      </span>
                    </div>

                    <div
                      className={`p-5 rounded-2xl w-full motion-safe:transition-all motion-safe:duration-300 ${
                        isActive
                          ? "bg-white/[0.04] border border-cyan-500/40 motion-safe:shadow-[0_10px_30px_rgba(6,182,212,0.12)]"
                          : "bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                        <span className="sr-only">Step {index + 1}: </span>
                        {step.title}
                      </h3>
                      <p className="text-base text-slate-300 leading-relaxed">{step.body}</p>
                      <SupportEmail step={step} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile timeline */}
        <div className="lg:hidden relative pl-6 mb-12">
          <div className="absolute top-4 bottom-4 left-[15px] w-[2px] bg-white/[0.08] z-0" aria-hidden="true">
            <div
              className="w-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full motion-safe:transition-all motion-safe:duration-500"
              style={{ height: progress }}
            />
          </div>
          <ol className="space-y-6 list-none p-0 m-0">
          {STEPS.map((step, index) => {
            const isActive = activeStep === index;
            const Icon = step.icon;
            return (
              <li key={step.title} onClick={() => setActiveStep(index)} className="relative z-10 flex gap-4 cursor-pointer">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                    isActive
                      ? "bg-cyan-400 border border-cyan-200 text-[#04121A] motion-safe:shadow-[0_0_16px_rgba(6,182,212,0.6)]"
                      : "bg-[#0A0E1A] border border-white/[0.2] text-slate-200"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`p-5 rounded-2xl flex-1 ${
                    isActive ? "bg-white/[0.05] border border-cyan-500/40" : "bg-white/[0.02] border border-white/[0.08]"
                  }`}
                >
                  <span className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300 block mb-1" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1.5">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-base text-slate-300 leading-relaxed">{step.body}</p>
                  <SupportEmail step={step} />
                </div>
              </li>
            );
          })}
          </ol>
        </div>

        {/* Bottom banner */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-300 shrink-0" aria-hidden="true" />
            <p className="text-base font-bold text-white">{SETUP_TIMELINE}</p>
          </div>
          <SmoothScrollLink
            targetId="contact"
            className="min-h-11 inline-flex items-center px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider text-[#04121A] bg-cyan-400 hover:bg-cyan-300 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 motion-safe:transition-colors"
          >
            Book a demo
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
