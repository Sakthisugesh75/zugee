// components/home/HowWeWork.jsx
// Complete 4-step onboarding timeline: one responsive list (vertical on phones, a connected
// four-column process from lg), interactive hover/active states, and staggered scroll reveal.
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
    description: "Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with validation at every step.",
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
      className="relative overflow-hidden py-20 sm:py-28 bg-canvas-alt border-b border-ink/[0.06] scroll-mt-[80px]"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-[500px] h-[400px] bg-cyan-500/[0.03] rounded-full ambient-glow lg:blur-[160px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[400px] bg-blue-600/[0.03] rounded-full ambient-glow lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            White-Glove Implementation
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg mb-4 leading-tight">
            No Disruption. No Headaches.{" "}
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

        {/* Process timeline: one list for every width (vertical on phones, four columns from lg),
            so each step's text appears in the DOM once. */}
        <div className="relative mb-12 lg:mb-16">
          {/* Connectors (decorative): vertical stem on phones, horizontal beam from lg */}
          <div aria-hidden="true" className="lg:hidden absolute top-4 bottom-4 left-[15px] w-[2px] bg-ink/[0.08] z-0">
            <div
              className="w-full bg-gradient-to-b from-cyan-400 to-blue-500 transition-all duration-500 rounded-full"
              style={{ height: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div aria-hidden="true" className="hidden lg:block absolute top-[36px] left-[6%] right-[6%] h-[2px] bg-ink/[0.08] z-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 rounded-full"
              style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 list-none p-0 m-0">
            {STEPS.map((step, index) => {
              const isVisible = visibleSteps.includes(index);
              const isActive = activeStep === index;
              const isPast = activeStep > index;
              const Icon = step.icon;

              return (
                <li
                  key={step.number}
                  onClick={() => handleStepClick(index)}
                  className={`group h-full cursor-pointer flex gap-4 lg:gap-0 lg:flex-col lg:items-center lg:text-center transition-all duration-500 transform ${
                    isVisible ? "lg:opacity-100 lg:translate-y-0" : "lg:opacity-0 lg:translate-y-8"
                  }`}
                >
                  {/* Step Node */}
                  <div
                    className={`w-8 h-8 rounded-xl mt-1 lg:mt-0 lg:w-[72px] lg:h-[72px] lg:rounded-2xl lg:mb-6 shrink-0 flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? "bg-tint-cyan border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] lg:scale-110"
                        : isPast
                        ? "bg-tint-blue border border-blue-400/40 text-blue-400"
                        : "bg-surface border border-ink/[0.12] text-slate-400 hover:border-ink/[0.25]"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`w-4 h-4 lg:w-7 lg:h-7 transition-colors duration-300 ${
                        isActive ? "text-cyan-400" : isPast ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                  </div>

                  {/* Step Card Body */}
                  <div
                    className={`p-5 rounded-2xl w-full flex-1 flex flex-col transition-all duration-300 ${
                      isActive
                        ? "bg-card border border-cyan-500/40 shadow-[0_10px_30px_rgba(6,182,212,0.12)]"
                        : "bg-card border border-line shadow-card hover:border-ink/[0.12]"
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                      {step.number} • {step.label}
                    </span>
                    <h3 className="text-base font-bold text-fg mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="mt-auto pt-3 border-t border-ink/[0.06]">
                      <span className="text-xs font-medium text-slate-400">
                        {step.tag}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <p className="text-base font-bold text-fg">
                Typical Setup: 14 Days, Start to Finish
              </p>
              <p className="text-sm text-slate-300">
                Discovery, data migration, staff training and go-live — we handle it all so you don&apos;t have to.
              </p>
            </div>
          </div>

          <SmoothScrollLink
            targetId="contact"
            className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-cyan-500 hover:bg-cyan-400 transition-colors shrink-0 shadow-md"
          >
            Start Your Onboarding
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
}
