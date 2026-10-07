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
import { availableProducts } from "@/lib/products";
import { useMediaQuery } from "@/lib/use-media-query";
import { accentInk } from "@/lib/theme";

// Only products a business can use today. Coming Soon products stay in lib/products.js and appear
// here automatically once their status changes to "available".
const SHOWCASE_PRODUCTS = availableProducts();

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
  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck },
  "gym":           { accent: "#10B981", accent2: "#059669", glow: "rgba(168,185,129,0.25)",  label: "FITNESS & WELLNESS", icon: Activity, replaces: "Card-based membership logs" },
  "salon":         { accent: "#EC4899", accent2: "#DB2777", glow: "rgba(236,72,153,0.25)",  label: "BEAUTY & SALON",    icon: Users, replaces: "Paper appointment books" },
  "medical":       { accent: "#EF4444", accent2: "#DC2626", glow: "rgba(239,68,68,0.25)",   label: "HEALTHCARE",        icon: Shield, replaces: "Paper OP registers + manual billing" },
  "construction":  { accent: "var(--color-slate-400)", accent2: "var(--color-slate-500)", glow: "rgba(148,163,184,0.25)", label: "CONSTRUCTION",      icon: Layers, replaces: "Site notebook muster rolls" },
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

// Shared look for the previous/next buttons (beside the stage on desktop, under it on mobile)
const ARROW_BUTTON_CLASS =
  "w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center bg-surface/90 border border-ink/[0.12] hover:border-cyan-400/50 hover:bg-surface-hover hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all duration-300 text-slate-300 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer";

function getAccent(slug) {
  return PRODUCT_ACCENTS[slug] || DEFAULT_ACCENT;
}


// Active Product Content Display with ZenXAI visual architecture
function ZenXProductHero({ product, onExplore }) {
  const accent = getAccent(product.slug);

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* 1. Eyebrow Tagline + Status */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
        <span
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em]"
          style={{ color: accentInk(accent.accent) }}
        >
          {accent.label}
        </span>
      </div>

      {/* 2. Big ZenXAI-Style Gradient Heading */}
      <h2
        className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 sm:mb-10 leading-[1.08] max-w-4xl"
        style={{
          backgroundImage: `linear-gradient(135deg, var(--color-fg) 40%, ${accent.accent} 140%)`,
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
            background: "var(--color-card)",
            border: `1px solid ${accent.accent}40`,
            boxShadow: `0 12px 36px -10px ${accent.glow}, var(--theme-shadow-card)`,
          }}
        >
          <div>
            <div
              className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] pb-3 mb-4 select-none"
              style={{
                color: accentInk(accent.accent),
                borderBottom: `1px solid ${accent.accent}30`,
              }}
            >
              About
            </div>
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-300 font-normal">
              {product.description}
            </p>
          </div>

          {/* The product slug stays in the data and anchors; it is not shown on the card. */}
          <div className="pt-4 mt-6 border-t border-ink/[0.06] flex flex-col gap-2 text-sm text-slate-400">
            <p>Tailored for {product.industry}</p>
            {accent.replaces && (
              <p className="text-xs text-rose-300/80 font-mono leading-relaxed">
                Replaces: {accent.replaces}
              </p>
            )}
          </div>
        </div>

        {/* Card 2: KEY CAPABILITIES */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
          style={{
            background: "var(--color-card)",
            border: `1px solid ${accent.accent}40`,
            boxShadow: `0 12px 36px -10px ${accent.glow}, var(--theme-shadow-card)`,
          }}
        >
          <div>
            <div
              className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] pb-3 mb-4 select-none"
              style={{
                color: accentInk(accent.accent),
                borderBottom: `1px solid ${accent.accent}30`,
              }}
            >
              Key Capabilities
            </div>

            <ul className="space-y-3">
              {product.modules.map((mod) => (
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

          <div className="pt-4 mt-6 border-t border-ink/[0.06] flex items-center gap-2 text-sm" style={{ color: accentInk(accent.accent) }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Runs as its own system, with its own login and data</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 overflow-hidden border shadow-2xl"
        style={{
          background: "var(--color-surface)",
          borderColor: `${accent.accent}50`,
          boxShadow: `0 20px 60px -10px ${accent.glow}, var(--theme-shadow-card-raised)`,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-ink/10 hover:bg-ink/20 text-slate-300 hover:text-fg flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: accentInk(accent.accent) }}
            >
              {accent.label}
            </span>
            <span className="text-ink/20">•</span>
            <span className="text-sm text-slate-400">Industry: {product.industry}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* What it replaces */}
        {accent.replaces && (
          <div className="p-4 rounded-xl bg-card border border-line shadow-card mb-6">
            <p className="text-xs font-mono uppercase tracking-wider text-rose-300/90 mb-1">
              Replaces Legacy Tools
            </p>
            <p className="text-sm font-semibold text-slate-200">
              {accent.replaces}
            </p>
          </div>
        )}

        {/* Full Capabilities Grid */}
        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Included Functional Modules
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {product.modules.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-line shadow-card text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: accentInk(accent.accent) }} />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation guarantee */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 gap-3 text-xs sm:text-sm text-emerald-300 mb-6">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            White-glove data migration &amp; live setup — typically within 14 days
          </span>
          <span className="font-bold">Managed Setup</span>
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
            className="w-full sm:w-auto py-3.5 px-6 rounded-full text-slate-300 hover:text-fg text-sm font-medium border border-ink/10 hover:bg-ink/5 transition-colors"
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
  const [isPaused, setIsPaused] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  // Auto-rotation is desktop only: on phones it swapped the product while people were reading it.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const sectionRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchDelta = useRef({ x: 0, y: 0 });

  const total = SHOWCASE_PRODUCTS.length;
  const activeProduct = SHOWCASE_PRODUCTS[activeIndex];
  const activeAccent = getAccent(activeProduct.slug);

  const goTo = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
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

  // Gentle auto-rotation every 7.5 seconds on desktop, when not paused or in modal
  useEffect(() => {
    if (!isDesktop || isPaused || modalProduct) return;
    const timer = setInterval(() => {
      goNext();
    }, 7500);
    return () => clearInterval(timer);
  }, [isDesktop, isPaused, goNext, modalProduct]);

  // Touch swipe support. Only a clearly horizontal swipe switches product, so vertical
  // page scrolls that drift sideways leave the carousel alone.
  const onTouchStart = (e) => {
    if (modalProduct) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = { x: 0, y: 0 };
  };
  const onTouchMove = (e) => {
    if (modalProduct) return;
    touchDelta.current = {
      x: e.touches[0].clientX - touchStart.current.x,
      y: e.touches[0].clientY - touchStart.current.y,
    };
  };
  const onTouchEnd = () => {
    if (modalProduct) return;
    const { x, y } = touchDelta.current;
    if (Math.abs(x) > 50 && Math.abs(x) > 1.5 * Math.abs(y)) {
      x > 0 ? goPrev() : goNext();
    }
    touchDelta.current = { x: 0, y: 0 };
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

  // Counter + progress bar, shown above the cards on mobile and below them on desktop
  const counter = (
    <div className="flex items-center gap-3 select-none">
      <span className="text-sm font-mono font-bold text-fg min-w-[2ch] text-right">
        {String(activeIndex + 1).padStart(2, "0")}
      </span>
      <div className="w-20 h-1 bg-ink/[0.10] relative overflow-hidden rounded-full">
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
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative overflow-x-clip py-20 sm:py-28 bg-canvas border-b border-ink/[0.05] scroll-mt-[80px]"
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
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full ambient-glow lg:blur-[190px] transition-colors duration-1000"
          style={{ background: `${activeAccent.accent}14` }}
        />
        <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-indigo-600/[0.04] rounded-full ambient-glow lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Our Products
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fg tracking-tight mb-4 leading-tight">
            Software built around your business
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-4">
            From CRM and billing to fleet, travel, education and operations — pick the ZUGEE product built for your kind of business.
          </p>

        </div>

        {/* Mobile navigation: previous/next and the counter sit above the cards, so they stay put
            when the next product is taller or shorter. */}
        <div className="flex lg:hidden items-center justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous product"
            className={`flex ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {counter}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next product"
            className={`flex ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* ========================================================
            ZENXAI-STYLE SHOWCASE STAGE (Single Active Experience)
           ======================================================== */}
        <div className="relative flex items-center justify-center min-h-[520px] px-2 lg:px-12">
          {/* External Left Navigation Arrow (desktop only) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous product"
            className={`hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* External Right Navigation Arrow (desktop only) */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next product"
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* SINGLE ACTIVE PRODUCT HERO. Every product is in the HTML; only the active one is displayed. */}
          <div className="w-full">
            {SHOWCASE_PRODUCTS.map((product, i) => (
              <div key={product.slug} className={i === activeIndex ? undefined : "hidden"}>
                <ZenXProductHero product={product} onExplore={handleOpenExplore} />
              </div>
            ))}
          </div>
        </div>

        {/* Counter and Navigation Controls below stage */}
        <div className="flex flex-col items-center justify-center gap-4 mt-12">
          {/* Counter + Progress (desktop; on mobile it sits above the cards) */}
          <div className="hidden lg:flex">{counter}</div>

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
                  background: i === activeIndex ? activeAccent.accent : "color-mix(in srgb, var(--color-ink) 18%, transparent)",
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
    </section>
  );
}
