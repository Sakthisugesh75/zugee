// components/home/IndustrySection.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/industries";

export default function IndustrySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Auto-rotate every 6 seconds (slower, more premium feel)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll to active card on desktop
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.children;
    if (!cards[activeIndex]) return;

    const card = cards[activeIndex];
    const containerWidth = container.offsetWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
  }, [activeIndex]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + INDUSTRIES.length) % INDUSTRIES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section className="section-wrapper bg-gradient-to-b from-[#04070D] via-[#05070B] to-[#06090F] border-b border-white/[0.08] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for different businesses
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Each ZUGEE product is designed around how your industry actually works
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Navigation Buttons - Desktop only */}
          <button
            type="button"
            onClick={handlePrevious}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-12 h-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.12] text-white hover:bg-white/[0.08] hover:border-cyan-500/30 hover:scale-105 transition-all"
            aria-label="Previous industry"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-12 h-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.12] text-white hover:bg-white/[0.08] hover:border-cyan-500/30 hover:scale-105 transition-all"
            aria-label="Next industry"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="tablist"
            aria-label="Industry carousel"
          >
            {INDUSTRIES.map((industry, index) => {
              const isActive = index === activeIndex;
              const colorClasses = {
                cyan: "from-cyan-500/[0.08] to-transparent border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)]",
                orange: "from-orange-500/[0.08] to-transparent border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.2)]",
                sky: "from-sky-500/[0.08] to-transparent border-sky-500/40 shadow-[0_0_40px_rgba(14,165,233,0.2)]",
                blue: "from-blue-500/[0.08] to-transparent border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.2)]",
                violet: "from-violet-500/[0.08] to-transparent border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.2)]",
                amber: "from-amber-500/[0.08] to-transparent border-amber-500/40 shadow-[0_0_40px_rgba(251,191,36,0.2)]",
                pink: "from-pink-500/[0.08] to-transparent border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.2)]",
                emerald: "from-emerald-500/[0.08] to-transparent border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
              };

              return (
                <button
                  key={industry.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`industry-panel-${industry.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`group relative flex-shrink-0 snap-center p-7 rounded-2xl border backdrop-blur-md transition-all duration-500 text-left ${
                    isActive
                      ? `w-[320px] sm:w-[360px] bg-gradient-to-br ${colorClasses[industry.color]} scale-105`
                      : "w-[280px] sm:w-[320px] bg-white/[0.03] border-white/[0.10] hover:border-white/[0.15] hover:bg-white/[0.04] hover:scale-[1.02]"
                  }`}
                >
                  {/* Subtle gradient overlay for active card */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent opacity-50 pointer-events-none" />
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 transition-all duration-500 ${
                      isActive 
                        ? "bg-white/[0.12] border-2 border-white/[0.20] scale-110" 
                        : "bg-white/[0.06] border border-white/[0.10] group-hover:scale-105"
                    }`}>
                      <span className="text-3xl">{industry.icon}</span>
                    </div>

                    {/* Name */}
                    <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${
                      isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}>
                      {industry.name}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed transition-all duration-300 ${
                      isActive ? "text-slate-200" : "text-slate-400 group-hover:text-slate-300"
                    }`}>
                      {industry.description}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {INDUSTRIES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? "w-10 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                    : "w-2.5 h-2.5 bg-white/[0.20] hover:bg-white/[0.35] hover:scale-125"
                }`}
                aria-label={`Go to ${INDUSTRIES[index].name}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
