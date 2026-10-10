// components/home/ProductShowcase.jsx
// ZENXAI-INSPIRED SINGLE ACTIVE PRODUCT SHOWCASE
// Architecture: Single active product presentation with dynamic ambient lighting,
// large gradient typography, dual glass panels (About + Key Capabilities with glowing nodes),
// a link to each product's landing page, and quick navigation.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { availableProducts, productPagePath } from "@/lib/products";
import { getAccent } from "@/lib/product-accents";
import { useMediaQuery } from "@/lib/use-media-query";
import { accentInk } from "@/lib/theme";

// Only products a business can use today. Coming Soon products stay in lib/products.js and appear
// here automatically once their status changes to "available".
const SHOWCASE_PRODUCTS = availableProducts();

// Shared look for the previous/next buttons (beside the stage on desktop, under it on mobile)
const ARROW_BUTTON_CLASS =
  "w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center bg-surface/90 border border-ink/[0.12] hover:border-cyan-400/50 hover:bg-surface-hover hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all duration-300 text-slate-300 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer";


// Active Product Content Display with ZenXAI visual architecture
function ZenXProductHero({ product }) {
  const accent = getAccent(product.slug);

  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* 1. Eyebrow Tagline + Status */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
        <span
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em]"
          style={{ color: accentInk(accent.accent) }}
        >
          {product.categoryLabel}
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
            {product.replaces && (
              <p className="text-xs text-rose-300/80 font-mono leading-relaxed">
                Replaces: {product.replaces}
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
      <Link
        href={productPagePath(product) || "/#contact"}
        className="group/cta inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 shadow-lg hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${accent.accent}, ${accent.accent2})`,
          boxShadow: `0 8px 32px ${accent.glow}`,
        }}
      >
        <span>Explore {product.name} Details</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </Link>
    </div>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
  }, [goPrev, goNext]);

  // Gentle auto-rotation every 7.5 seconds on desktop, when not paused
  useEffect(() => {
    if (!isDesktop || isPaused) return;
    const timer = setInterval(() => {
      goNext();
    }, 7500);
    return () => clearInterval(timer);
  }, [isDesktop, isPaused, goNext]);

  // Touch swipe support. Only a clearly horizontal swipe switches product, so vertical
  // page scrolls that drift sideways leave the carousel alone.
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = { x: 0, y: 0 };
  };
  const onTouchMove = (e) => {
    touchDelta.current = {
      x: e.touches[0].clientX - touchStart.current.x,
      y: e.touches[0].clientY - touchStart.current.y,
    };
  };
  const onTouchEnd = () => {
    const { x, y } = touchDelta.current;
    if (Math.abs(x) > 50 && Math.abs(x) > 1.5 * Math.abs(y)) {
      x > 0 ? goPrev() : goNext();
    }
    touchDelta.current = { x: 0, y: 0 };
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
                <ZenXProductHero product={product} />
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

    </section>
  );
}
