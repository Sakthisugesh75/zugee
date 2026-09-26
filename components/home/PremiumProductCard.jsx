// components/home/PremiumProductCard.jsx
"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductInterestButton from "@/components/home/ProductInterestButton";
import { PRODUCT_STATUS } from "@/lib/products";

const INDUSTRY_COLORS = {
  "Any business": "cyan",
  "Fleet & transport": "orange",
  "Travel agencies": "sky",
  "Packaged drinking water": "blue",
  "Real estate": "violet",
  "Manufacturing": "blue",
  "Schools": "amber",
  "Colleges": "amber",
  "PGs & hostels": "pink",
  "Resorts": "pink",
  "Logistics & delivery": "orange",
  "Gyms & fitness": "emerald",
  "Salons & spas": "pink",
  "Clinics": "red",
  "Construction": "slate",
  "Warehousing": "indigo",
  "Any team": "cyan"
};

const CTA_LABEL = {
  available: "Explore product",
  in_development: "Get early access",
  coming_soon: "Notify me"
};

// Simple icon component based on industry
function IndustryIcon({ industry }) {
  const icons = {
    "Any business": "💼",
    "Fleet & transport": "🚚",
    "Travel agencies": "✈️",
    "Packaged drinking water": "💧",
    "Real estate": "🏢",
    "Manufacturing": "⚙️",
    "Schools": "🎓",
    "Colleges": "📚",
    "PGs & hostels": "🏠",
    "Resorts": "🏨",
    "Logistics & delivery": "📦",
    "Gyms & fitness": "💪",
    "Salons & spas": "💅",
    "Clinics": "🏥",
    "Construction": "🏗️",
    "Warehousing": "📦",
    "Any team": "👥"
  };

  return (
    <span className="text-4xl" role="img" aria-label={industry}>
      {icons[industry] || "📋"}
    </span>
  );
}

function StatusBadge({ status }) {
  const { label, tone } = PRODUCT_STATUS[status];
  
  const styles = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    progress: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    soon: "bg-slate-500/10 text-slate-400 border-slate-500/30"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>
      {tone === "available" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {label}
    </span>
  );
}

export default function PremiumProductCard({ product, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const isAvailable = product.status === "available";
  const color = INDUSTRY_COLORS[product.industry] || "cyan";

  // Color-specific glow classes
  const glowClasses = {
    cyan: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    orange: "hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]",
    sky: "hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]",
    blue: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    violet: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    amber: "hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]",
    pink: "hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    emerald: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    red: "hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]",
    slate: "hover:shadow-[0_0_40px_rgba(148,163,184,0.15)]",
    indigo: "hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
  };

  const borderHoverClasses = {
    cyan: "hover:border-cyan-500/40",
    orange: "hover:border-orange-500/40",
    sky: "hover:border-sky-500/40",
    blue: "hover:border-blue-500/40",
    violet: "hover:border-violet-500/40",
    amber: "hover:border-amber-500/40",
    pink: "hover:border-pink-500/40",
    emerald: "hover:border-emerald-500/40",
    red: "hover:border-red-500/40",
    slate: "hover:border-slate-500/40",
    indigo: "hover:border-indigo-500/40"
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative flex flex-col glass-card p-7 h-full transition-all duration-300 animate-fade-in-up ${
        isAvailable ? `${borderHoverClasses[color]} ${glowClasses[color]}` : "hover:border-white/[0.15]"
      } hover:translate-y-[-6px]`}
    >
      {/* Subtle gradient background on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${color}-500/[0.03] via-transparent to-transparent pointer-events-none`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon & Status Badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/[0.15]">
            <IndustryIcon industry={product.industry} />
          </div>
          <StatusBadge status={product.status} />
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Industry Category */}
        <p className={`text-sm font-semibold text-${color}-400 mb-3`}>
          {product.industry}
        </p>

        {/* Value Proposition */}
        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          {product.description}
        </p>

        {/* Capabilities/Modules */}
        {product.modules.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Key capabilities
            </p>
            <ul className="flex flex-wrap gap-2">
              {product.modules.slice(0, 6).map((module) => (
                <li
                  key={module}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.10] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  {module}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="pt-4 border-t border-white/[0.08]">
          {isAvailable ? (
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
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all group/btn"
            >
              <span>{CTA_LABEL[product.status]}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          ) : (
            <ProductInterestButton
              slug={product.slug}
              label={CTA_LABEL[product.status]}
              emphasis={false}
            />
          )}
        </div>
      </div>
    </article>
  );
}
