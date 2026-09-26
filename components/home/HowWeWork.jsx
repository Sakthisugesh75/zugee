// components/home/HowWeWork.jsx
// Complete 4-step onboarding timeline with horizontal connected desktop process,
// responsive vertical mobile timeline, interactive hover/active states, and staggered scroll reveal.
// Elevated to frame 14-day setup as a premier white-glove onboarding advantage.

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Calendar, FileText, Rocket, Building2, ShieldCheck, Database } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

const STEPS = [
  {
    number: "01",
    label: "DISCOVERY",
    title: "Discovery & Workflow Mapping",
    description: "We map your daily business operations, branches, and staff roles to eliminate spreadsheet bottlenecks.",
    tag: "Workflow Audit · Custom Rules",
    icon: Building2,
  },
  {
    number: "02",
    label: "WALKTHROUGH",
    title: "Interactive Live Demo",
    description: "Experience your specialized ZUGEE product populated with your own trade structure and real business examples.",
    tag: "Custom Demo · Live Validation",
    icon: Calendar,
  },
  {
    number: "03",
    label: "MIGRATION",
    title: "White-Glove Data Migration",
    description: "Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with zero data loss.",
    tag: "Clean Ledgers · Role Permissions",
    icon: Database,
  },
  {
    number: "04",
    label: "LAUNCH",
    title: "Go-Live & Dedicated Support",
    description: "Your team receives guided mobile training. You begin billing and dispatching live with dedicated onboarding support.",
    tag: "Live Operations · Ongoing Support",
    icon: Rocket,
  },
];

export default function HowWeWork() {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STEPS.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]));
            }, index * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] scroll-mt-[80px]"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-[500px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            White-Glove Implementation
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
            Zero Downtime. Zero Headaches.{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              How We Onboard You.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            You don&apos;t spend months wrestling with software configuration. Our team migrates your data and trains your staff in 14 days.
          </p>
        </div>

        {/* Desktop Process Timeline */}
        <div className="hidden lg:block relative mb-16">
          {/* Horizontal Connection Beam */}
          <div className="absolute top-[36px] left-[6%] right-[6%] h-[2px] bg-white/[0.08] z-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 rounded-full"
              style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-6 relative z-10">
            {STEPS.map((step, index) => {
              const isVisible = visibleSteps.includes(index);
              const isActive = activeStep === index;
              const isPast = activeStep > index;
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  onClick={() => handleStepClick(index)}
                  className={`group cursor-pointer transition-all duration-500 transform ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Step Node */}
                    <div
                      className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all duration-500 mb-6 relative ${
                        isActive
                          ? "bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-110"
                          : isPast
                          ? "bg-blue-500/10 border border-blue-400/40 text-blue-400"
                          : "bg-[#0A0E1A] border border-white/[0.12] text-slate-400 hover:border-white/[0.25]"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 transition-colors duration-300 ${
                          isActive ? "text-cyan-400" : isPast ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#060810] border border-white/[0.15] text-white">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Card Body */}
                    <div
                      className={`p-5 rounded-2xl w-full transition-all duration-300 ${
                        isActive
                          ? "bg-white/[0.04] border border-cyan-500/40 shadow-[0_10px_30px_rgba(6,182,212,0.12)]"
                          : "bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                        {step.label}
                      </span>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[48px]">
                        {step.description}
                      </p>
                      <div className="pt-3 border-t border-white/[0.06]">
                        <span className="text-[11px] font-medium text-slate-400">
                          {step.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden relative pl-6 space-y-6 mb-12">
          {/* Vertical Connecting Stem */}
          <div className="absolute top-4 bottom-4 left-[15px] w-[2px] bg-white/[0.08] z-0">
            <div
              className="w-full bg-gradient-to-b from-cyan-400 to-blue-500 transition-all duration-500 rounded-full"
              style={{ height: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {STEPS.map((step, index) => {
            const isActive = activeStep === index;
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                onClick={() => handleStepClick(index)}
                className="relative z-10 flex gap-4 cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 transition-all ${
                    isActive
                      ? "bg-cyan-500 border border-cyan-300 text-black shadow-[0_0_16px_rgba(6,182,212,0.6)]"
                      : "bg-[#0A0E1A] border border-white/[0.15] text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div
                  className={`p-5 rounded-2xl flex-1 transition-all ${
                    isActive
                      ? "bg-white/[0.05] border border-cyan-500/40"
                      : "bg-white/[0.02] border border-white/[0.06]"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                    {step.number} • {step.label}
                  </span>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span className="text-[11px] font-medium text-slate-400">
                    {step.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">
                Guaranteed 14-Day Implementation
              </p>
              <p className="text-xs text-slate-300">
                If your system isn&apos;t live in 2 weeks, your first month subscription is on us.
              </p>
            </div>
          </div>

          <SmoothScrollLink
            targetId="contact"
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-cyan-500 hover:bg-cyan-400 transition-colors shrink-0 shadow-md"
          >
            Start Your Onboarding
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
