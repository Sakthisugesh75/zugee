// components/home/IndustryProductsSection.jsx
"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { INDUSTRIES } from "@/lib/industries";
import { PRODUCTS } from "@/lib/products";
import PremiumProductCard from "@/components/home/PremiumProductCard";

export default function IndustryProductsSection() {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0].id);

  const activeIndustry = INDUSTRIES.find((i) => i.id === selectedIndustry);
  const relevantProducts = PRODUCTS.filter((p) => 
    activeIndustry?.productSlugs.includes(p.slug)
  );

  const handleIndustryChange = (industryId) => {
    setSelectedIndustry(industryId);
  };

  return (
    <section id="products" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] scroll-mt-[80px] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Products built for your industry
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Choose your industry to see the products designed specifically for your business needs
          </p>
        </div>

        {/* Industry Selector - Mobile: Horizontal Scroll, Desktop: Wrapped Pills */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 sm:px-0">
            {INDUSTRIES.map((industry) => {
              const isActive = industry.id === selectedIndustry;
              
              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => handleIndustryChange(industry.id)}
                  className={`group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-500/10 border-2 border-cyan-500/40 text-white shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                      : "bg-white/[0.03] border border-white/[0.10] text-slate-300 hover:bg-white/[0.05] hover:border-white/[0.15] hover:text-white"
                  }`}
                >
                  <span className="text-xl">{industry.icon}</span>
                  <span className="whitespace-nowrap">{industry.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Industry Card */}
        {activeIndustry && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className="glass-feature-card border-cyan-500/30 p-8 sm:p-10 relative overflow-hidden group">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-blue-500/[0.05] opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                {/* Icon */}
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40 flex items-center justify-center">
                    <span className="text-5xl">{activeIndustry.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                    {activeIndustry.name}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4">
                    {activeIndustry.description}
                  </p>
                  <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-cyan-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>{relevantProducts.length} product{relevantProducts.length !== 1 ? 's' : ''} available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid with Animation */}
        <div className="max-w-6xl mx-auto">
          {relevantProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relevantProducts.map((product, index) => (
                <PremiumProductCard
                  key={product.slug}
                  product={product}
                  delay={index * 100}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.10] mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-lg text-slate-400">No products available yet for this industry</p>
              <p className="text-sm text-slate-500 mt-2">We're working on bringing solutions for {activeIndustry?.name}</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="glass-card p-8">
            <p className="text-lg text-slate-300 mb-5">
              Don't see your industry or need something custom?
            </p>
            <button
              type="button"
              onClick={() => {
                const section = document.getElementById("contact");
                if (!section) return;
                const navbar = document.querySelector("header");
                const navbarHeight = navbar?.getBoundingClientRect().height || 0;
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                  top: Math.max(0, sectionTop - navbarHeight - 16),
                  behavior: "smooth"
                });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-all group"
            >
              <span>Talk to our team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
