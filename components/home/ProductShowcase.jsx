// components/home/ProductShowcase.jsx
// ZENXAI-INSPIRED SINGLE ACTIVE PRODUCT SHOWCASE
// Architecture: Single active product presentation with dynamic ambient lighting,
// large gradient typography, dual glass panels (About + Key Capabilities with glowing nodes),
// interactive drill-down preview modal (no more blind scroll-trap), and quick navigation.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Cpu,
  Truck,
  Plane,
  Activity,
  Building,
  Layers,
  School,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { PRODUCTS, PRODUCT_STATUS } from "@/lib/products";

// All products in showcase order
const SHOWCASE_PRODUCTS = [
  ...PRODUCTS.filter((p) => p.status === "available"),
  ...PRODUCTS.filter((p) => p.status === "in_development"),
  ...PRODUCTS.filter((p) => p.status === "coming_soon"),
];

// Product accent palette & category metadata inspired by ZenXAI visual tokens
const PRODUCT_ACCENTS = {
  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   label: "BUSINESS PLATFORM", icon: Cpu, replaces: "Excel + WhatsApp + Standalone Tally" },
  "transposs":     { accent: "#3B82F6", accent2: "#6366F1", glow: "rgba(59,130,246,0.25)",  label: "FLEET MANAGEMENT",  icon: Truck, replaces: "Paper logbooks + WhatsApp driver dispatch" },
  "tours-travels": { accent: "#8B5CF6", accent2: "#A855F7", glow: "rgba(139,92,246,0.25)",  label: "TRAVEL & TOURISM",  icon: Plane, replaces: "Word doc quotations + scattered email PDFs" },
  "aqua-erp":      { accent: "#38BDF8", accent2: "#0284C7", glow: "rgba(56,189,248,0.25)",  label: "WATER OPERATIONS",  icon: Activity, replaces: "Pocket diary route delivery records" },
  "real-estate":   { accent: "#A855F7", accent2: "#EC4899", glow: "rgba(168,85,247,0.25)",  label: "REAL ESTATE",       icon: Building, replaces: "Fragmented spreadsheets + broker chats" },
  "manuflow":      { accent: "#F97316", accent2: "#EF4444", glow: "rgba(249,115,22,0.25)",  label: "MANUFACTURING",     icon: Layers, replaces: "Manual job cards + offline inventory logs" },
  "school-erp":    { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)",  label: "EDUCATION",         icon: School, replaces: "Paper attendance sheets + manual fee receipts" },
  "college":       { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)",  label: "COLLEGE ERP",       icon: School, replaces: "Legacy college servers + manual desk fees" },
  "pg-management": { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  label: "HOSPITALITY",       icon: Building, replaces: "Paper rent registers + cash deposit slips" },
  "resort":        { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  label: "RESORT SUITE",      icon: Building, replaces: "Separate booking calendar + desk invoices" },
  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck, replaces: "Manual E-Way bill entry + offline tracking" },
  "gym":           { accent: "#10B981", accent2: "#059669", glow: "rgba(168,185,129,0.25)",  label: "FITNESS & WELLNESS", icon: Activity, replaces: "Card-based membership logs" },
  "salon":         { accent: "#EC4899", accent2: "#DB2777", glow: "rgba(236,72,153,0.25)",  label: "BEAUTY & SALON",    icon: Users, replaces: "Paper appointment books" },
  "medical":       { accent: "#EF4444", accent2: "#DC2626", glow: "rgba(239,68,68,0.25)",   label: "HEALTHCARE",        icon: Shield, replaces: "Handwritten prescription pads + desk billing" },
  "construction":  { accent: "#94A3B8", accent2: "#64748B", glow: "rgba(148,163,184,0.25)", label: "CONSTRUCTION",      icon: Layers, replaces: "Site notebook muster rolls" },
  "warehouse":     { accent: "#6366F1", accent2: "#4F46E5", glow: "rgba(99,102,241,0.25)",  label: "WAREHOUSING",       icon: Layers, replaces: "Bin cards + manual tallying" },
  "tasks":         { accent: "#06B6D4", accent2: "#0284C7", glow: "rgba(6,182,212,0.25)",   label: "PRODUCTIVITY",      icon: TrendingUp, replaces: "Scattered WhatsApp task reminders" },
};

const DEFAULT_ACCENT = {
  accent: "#06B6D4",
  accent2: "#3B82F6",
  glow: "rgba(6,182,212,0.25)",
  label: "PRODUCT",
  icon: Cpu,
  replaces: "Spreadsheets + disconnected software",
};

function getAccent(slug) {
  return PRODUCT_ACCENTS[slug] || DEFAULT_ACCENT;
}

// Status chip
function StatusChip({ status }) {
  const { label, tone } = PRODUCT_STATUS[status] || PRODUCT_STATUS.available;
  const map = {
    available: { bg: "rgba(16,185,129,0.12)", color: "#34D399", border: "rgba(16,185,129,0.35)" },
    progress:  { bg: "rgba(56,189,248,0.12)", color: "#38BDF8", border: "rgba(56,189,248,0.35)" },
    soon:      { bg: "rgba(148,163,184,0.08)", color: "#94A3B8", border: "rgba(148,163,184,0.22)" },
  };
  const s = map[tone] || map.available;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {tone === "available" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {label}
    </span>
  );
}

// Active Product Content Display with ZenXAI visual architecture
function ZenXProductHero({ product, direction, onExplore }) {
  const accent = getAccent(product.slug);

  return (
    <div
      key={product.slug}
      className={`w-full flex flex-col items-center text-center ${
        direction === "next" ? "animate-zen-next" : "animate-zen-prev"
      }`}
    >
      {/* 1. Eyebrow Tagline + Status */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
        <span
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em]"
          style={{ color: accent.accent }}
        >
          {accent.label}
        </span>
        <span className="text-white/20">•</span>
        <StatusChip status={product.status} />
      </div>

      {/* 2. Big ZenXAI-Style Gradient Heading */}
      <h2
        className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 sm:mb-10 leading-[1.08] max-w-4xl"
        style={{
          backgroundImage: `linear-gradient(135deg, #FFFFFF 40%, ${accent.accent} 140%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {product.name}
      </h2>

      {/* 3. Dual Glass Cards (About + Key Capabilities) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 text-left">
        {/* Card 1: ABOUT */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${accent.accent}40`,
            boxShadow: `0 12px 36px -10px ${accent.glow}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <div
              className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] pb-3 mb-4"
              style={{
                color: accent.accent,
                borderBottom: `1px solid ${accent.accent}30`,
              }}
            >
              About
            </div>
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-300 font-normal">
              {product.description}
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-white/[0.06] flex flex-col gap-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Tailored for {product.industry}</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                Module #{product.slug}
              </span>
            </div>
            <div className="text-[11px] text-rose-300/80 font-mono">
              Replaces: {accent.replaces}
            </div>
          </div>
        </div>

        {/* Card 2: KEY CAPABILITIES */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${accent.accent}40`,
            boxShadow: `0 12px 36px -10px ${accent.glow}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <div
              className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] pb-3 mb-4"
              style={{
                color: accent.accent,
                borderBottom: `1px solid ${accent.accent}30`,
              }}
            >
              Key Capabilities
            </div>

            <ul className="space-y-3">
              {product.modules.slice(0, 5).map((mod) => (
                <li
                  key={mod}
                  className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-200"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: accent.accent,
                      boxShadow: `0 0 10px ${accent.accent}`,
                    }}
                  />
                  <span>{mod}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-2 text-xs" style={{ color: accent.accent }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated with unified ZUGEE Core database</span>
          </div>
        </div>
      </div>

      {/* 4. ZenXAI-Style Glowing CTA Button — Opens Product Deep-Dive Preview */}
      <button
        type="button"
        onClick={() => onExplore(product)}
        className="group/cta inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${accent.accent}, ${accent.accent2})`,
          boxShadow: `0 8px 32px ${accent.glow}`,
        }}
      >
        <span>Explore {product.name} Details</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </button>
    </div>
  );
}

// Product Deep-Dive Modal to prevent "Bait-and-Switch" scroll trap
function ProductDeepDiveModal({ product, onClose, onBookDemo }) {
  if (!product) return null;
  const accent = getAccent(product.slug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 overflow-hidden border shadow-2xl"
        style={{
          background: "#080c16",
          borderColor: `${accent.accent}50`,
          boxShadow: `0 20px 60px -10px ${accent.glow}`,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: accent.accent }}
            >
              {accent.label}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-slate-400">Industry: {product.industry}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* What it replaces */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-rose-300/90 mb-1">
            Replaces Legacy Tools
          </p>
          <p className="text-sm font-semibold text-slate-200">
            {accent.replaces}
          </p>
        </div>

        {/* Full Capabilities Grid */}
        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Included Functional Modules
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {product.modules.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: accent.accent }} />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation guarantee */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-6">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            White-glove data migration &amp; live setup within 14 days
          </span>
          <span className="font-bold">Guaranteed</span>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => onBookDemo(product)}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${accent.accent}, ${accent.accent2})`,
              boxShadow: `0 8px 30px ${accent.glow}`,
            }}
          >
            <span>Book Live Demo for {product.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full text-slate-300 hover:text-white text-sm font-medium border border-white/10 hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isPaused, setIsPaused] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const sectionRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);

  const total = SHOWCASE_PRODUCTS.length;
  const activeProduct = SHOWCASE_PRODUCTS[activeIndex];
  const activeAccent = getAccent(activeProduct.slug);

  const goTo = useCallback(
    (index) => {
      if (index === activeIndex) return;
      setDirection(index > activeIndex ? "next" : "prev");
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const goPrev = useCallback(() => {
    setDirection("prev");
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setDirection("next");
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalProduct) {
        if (e.key === "Escape") setModalProduct(null);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, modalProduct]);

  // Gentle auto-rotation every 7.5 seconds when not paused or in modal
  useEffect(() => {
    if (isPaused || modalProduct) return;
    const timer = setInterval(() => {
      goNext();
    }, 7500);
    return () => clearInterval(timer);
  }, [isPaused, goNext, modalProduct]);

  // Touch swipe support
  const onTouchStart = (e) => {
    if (modalProduct) return;
    touchStartX.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };
  const onTouchMove = (e) => {
    if (modalProduct) return;
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (modalProduct) return;
    if (Math.abs(touchDelta.current) > 40) {
      touchDelta.current > 0 ? goPrev() : goNext();
    }
    touchDelta.current = 0;
  };

  const handleOpenExplore = (product) => {
    setModalProduct(product);
  };

  const handleBookDemo = (product) => {
    setModalProduct(null);
    window.dispatchEvent(new CustomEvent("zugee:select-product", { detail: { slug: product.slug } }));
    const section = document.getElementById("contact");
    if (!section) return;
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, sectionTop - navbarHeight - 16), behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative overflow-x-clip py-20 sm:py-28 bg-[#06060e] border-b border-white/[0.05] scroll-mt-[80px]"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Dynamic Ambient Background Glow that morphs with active product accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[190px] transition-colors duration-1000"
          style={{ background: `${activeAccent.accent}14` }}
        />
        <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-indigo-600/[0.04] rounded-full blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Product Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Software built around your business
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From CRM and billing to fleet, travel, education and operations — ZUGEE connects the tools your business needs.
          </p>
        </div>

        {/* ========================================================
            ZENXAI-STYLE SHOWCASE STAGE (Single Active Experience)
           ======================================================== */}
        <div className="relative flex items-center justify-center min-h-[520px] px-2 sm:px-12">
          {/* External Left Navigation Arrow */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous product"
            className="absolute left-0 sm:-left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#0d0d1a]/90 border border-white/[0.12] hover:border-cyan-400/50 hover:bg-[#15152a] hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all duration-300 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* External Right Navigation Arrow */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next product"
            className="absolute right-0 sm:-right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[#0d0d1a]/90 border border-white/[0.12] hover:border-cyan-400/50 hover:bg-[#15152a] hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all duration-300 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* SINGLE ACTIVE PRODUCT HERO */}
          <ZenXProductHero
            product={activeProduct}
            direction={direction}
            onExplore={handleOpenExplore}
          />
        </div>

        {/* Counter and Navigation Controls below stage */}
        <div className="flex flex-col items-center justify-center gap-4 mt-12">
          {/* Counter + Progress */}
          <div className="flex items-center gap-3 select-none">
            <span className="text-sm font-mono font-bold text-white min-w-[2ch] text-right">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="w-20 h-1 bg-white/[0.10] relative overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${((activeIndex + 1) / total) * 100}%`,
                  background: activeAccent.accent,
                }}
              />
            </div>
            <span className="text-sm font-mono text-slate-500 min-w-[2ch]">
              {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Subtle Quick-Jump Indicator Pills */}
          <div className="flex justify-center gap-1.5 flex-wrap max-w-lg">
            {SHOWCASE_PRODUCTS.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${p.name}`}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === activeIndex ? "24px" : "6px",
                  height: "6px",
                  background: i === activeIndex ? activeAccent.accent : "rgba(255,255,255,0.18)",
                  boxShadow: i === activeIndex ? `0 0 12px ${activeAccent.accent}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Drill-Down View */}
      {modalProduct && (
        <ProductDeepDiveModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onBookDemo={handleBookDemo}
        />
      )}

      {/* Scoped CSS animations for ZenXAI-inspired transitions */}
      <style jsx>{`
        @keyframes zenSlideNext {
          0% {
            opacity: 0;
            transform: translateX(40px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes zenSlidePrev {
          0% {
            opacity: 0;
            transform: translateX(-40px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-zen-next {
          animation: zenSlideNext 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-zen-prev {
          animation: zenSlidePrev 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-zen-next,
          .animate-zen-prev {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
