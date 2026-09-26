// components/home/FinalCTA.jsx
"use client";

import { useState } from "react";
import InteractiveMascot from "@/components/animations/InteractiveMascot";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function FinalCTA() {
  const [isHovering, setIsHovering] = useState(false);

  const scrollToContact = () => {
    const section = document.getElementById("contact");
    if (!section) return;

    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetPosition = sectionTop - navbarHeight - 16;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth"
    });
  };

  const benefits = [
    { icon: Sparkles, text: "Setup in 2 weeks" },
    { icon: Shield, text: "Data stays in India" },
    { icon: Zap, text: "Start for ₹1,999/month" }
  ];

  return (
    <section className="section-wrapper bg-gradient-to-b from-[#05070B] via-[#06090F] to-[#04070D] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <div className="glass-feature-card border-cyan-500/30 glow-cyan-soft p-8 sm:p-12 lg:p-16 relative overflow-hidden group">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left: Mascot */}
              <div className="shrink-0 hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl" />
                  <InteractiveMascot
                    size={140}
                    className="relative z-10"
                    enableProximity={true}
                    enableMouseTracking={true}
                  />
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Ready to transform your business?
                </h2>
                
                {/* Subheading */}
                <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
                  Join Indian businesses already using ZUGEE to streamline operations, boost productivity, and scale smarter.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {benefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={benefit.text}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={scrollToContact}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="btn-primary text-base !py-4 !px-8 group/btn relative overflow-hidden"
                  >
                    {/* Animated glow on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    
                    <span className="relative z-10">Book Your Free Demo</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-sm text-slate-400">
                    No credit card required · Free consultation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>100% Secure</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>Trusted by 100+ SMEs</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>14-Day Implementation Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
