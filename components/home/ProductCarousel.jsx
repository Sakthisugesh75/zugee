// components/home/ProductCarousel.jsx
// "What each product covers": the single-product carousel design (gradient heading, About + Covers
// glass cards, detail pop-up) showing only the CURRENT product content from lib/products.js —
// name, industry, description and modules of the Available products. Never add a field here that
// the catalog doesn't hold (no "replaces", no login wording, no setup promises).
//
// - Every slide is in the server-rendered HTML (inactive ones are only hidden), so the
//   SoftwareApplication structured data matches visible content. Each slide carries the
//   #product-<slug> anchor that the structured data and the industry grid point to.
// - Grid cards and #product-<slug> URLs (on load, back/forward) select that slide and scroll here.
// - No auto-rotate. Swipe on touch screens, arrows and dots everywhere, arrow keys when the
//   carousel has focus. Glows and animation only under motion-safe.

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, X } from "lucide-react";
import { availableProducts, productAnchor } from "@/lib/products";
import { useMediaQuery } from "@/lib/use-media-query";

const PRODUCTS = availableProducts();

// Accent palette per product (visual only).
const PRODUCT_ACCENTS = {
  "core-erp": { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)" },
  transposs: { accent: "#3B82F6", accent2: "#6366F1", glow: "rgba(59,130,246,0.25)" },
  "tours-travels": { accent: "#8B5CF6", accent2: "#A855F7", glow: "rgba(139,92,246,0.25)" },
  "aqua-erp": { accent: "#38BDF8", accent2: "#0284C7", glow: "rgba(56,189,248,0.25)" },
  "real-estate": { accent: "#A855F7", accent2: "#EC4899", glow: "rgba(168,85,247,0.25)" },
  manuflow: { accent: "#F97316", accent2: "#EF4444", glow: "rgba(249,115,22,0.25)" },
  "school-erp": { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)" },
  college: { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)" },
  "pg-management": { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)" },
  resort: { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)" }
};
const DEFAULT_ACCENT = { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)" };
const getAccent = (slug) => PRODUCT_ACCENTS[slug] || DEFAULT_ACCENT;

// Accent colour for text: lightened 25% towards white, so every accent reaches WCAG AA (4.5:1) on
// the dark background. Borders, dots and gradients keep the original accent.
function textColor(hex) {
  const channel = (i) => {
    const v = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(v + (255 - v) * 0.25).toString(16).padStart(2, "0");
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

// White button text on the brighter accents (cyan, sky) is under 4.5:1, so buttons get a 40% dark
// tint over the accent gradient (lowest contrast across all products: 5.4:1).
const buttonBackground = (accent) =>
  `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), linear-gradient(135deg, ${accent.accent}, ${accent.accent2})`;

// Glows are applied through CSS variables so they only show under motion-safe.
const GLOW_CARD = "motion-safe:shadow-[0_12px_36px_-10px_var(--glow)]";
const GLOW_BUTTON = "motion-safe:shadow-[0_8px_32px_var(--glow)]";

const ARROW_BUTTON_CLASS =
  "w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center bg-[#0d0d1a]/90 border border-white/[0.18] hover:border-cyan-400/60 hover:bg-[#15152a] motion-safe:hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] motion-safe:transition-all motion-safe:duration-300 text-slate-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer";

function scrollToElement(el, smooth) {
  if (!el) return;
  const navbar = document.querySelector("header");
  const navbarHeight = navbar?.getBoundingClientRect().height || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
}

function ProductSlide({ product, onExplore }) {
  const accent = getAccent(product.slug);

  return (
    <div className="w-full flex flex-col items-center text-center" style={{ "--glow": accent.glow }}>
      {/* Eyebrow: the product's industry */}
      <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: textColor(accent.accent) }}>
        {product.industry}
      </p>

      {/* Gradient heading */}
      <h3
        className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 sm:mb-10 leading-[1.08] max-w-4xl break-words"
        style={{
          backgroundImage: `linear-gradient(135deg, #FFFFFF 40%, ${accent.accent} 140%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {product.name}
      </h3>

      {/* About + Covers glass cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 text-left">
        <div
          className={`p-6 sm:p-8 rounded-2xl backdrop-blur-md ${GLOW_CARD}`}
          style={{ background: "rgba(255, 255, 255, 0.03)", border: `1px solid ${accent.accent}40` }}
        >
          <div
            className="text-sm font-extrabold uppercase tracking-[0.18em] pb-3 mb-4"
            style={{ color: textColor(accent.accent), borderBottom: `1px solid ${accent.accent}30` }}
          >
            About
          </div>
          <p className="text-base leading-relaxed text-slate-200">{product.description}</p>
        </div>

        <div
          className={`p-6 sm:p-8 rounded-2xl backdrop-blur-md ${GLOW_CARD}`}
          style={{ background: "rgba(255, 255, 255, 0.03)", border: `1px solid ${accent.accent}40` }}
        >
          <div
            className="text-sm font-extrabold uppercase tracking-[0.18em] pb-3 mb-4"
            style={{ color: textColor(accent.accent), borderBottom: `1px solid ${accent.accent}30` }}
          >
            Covers
          </div>
          <ul className="space-y-3 list-none p-0 m-0">
            {product.modules.map((mod) => (
              <li key={mod} className="flex items-center gap-3 text-base text-slate-100">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 motion-safe:shadow-[0_0_10px_var(--dot)]"
                  style={{ background: accent.accent, "--dot": accent.accent }}
                  aria-hidden="true"
                />
                <span>{mod}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onExplore(product)}
        className={`group/cta inline-flex items-center gap-2.5 min-h-12 px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-[0.12em] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105 ${GLOW_BUTTON}`}
        style={{ background: buttonBackground(accent) }}
      >
        <span>Explore {product.name} details</span>
        <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/cta:translate-x-1" aria-hidden="true" />
      </button>
    </div>
  );
}

function ProductDetailDialog({ product, onClose, onBookDemo }) {
  const accent = getAccent(product.slug);
  const titleId = useId();
  const closeRef = useRef(null);

  // Move focus into the dialog, and back to where it came from on close.
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md motion-safe:animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border ${GLOW_CARD}`}
        style={{ background: "#080c16", borderColor: `${accent.accent}50`, "--glow": accent.glow }}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Close"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="mb-6 pr-12">
          <p className="text-sm font-mono font-bold uppercase tracking-wider mb-2" style={{ color: textColor(accent.accent) }}>
            {product.industry}
          </p>
          <h3 id={titleId} className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {product.name}
          </h3>
          <p className="text-base text-slate-200 mt-2 leading-relaxed">{product.description}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-mono uppercase tracking-wider text-slate-300 mb-3">Covers</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none p-0 m-0">
            {product.modules.map((m) => (
              <li
                key={m}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-base text-slate-100"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: accent.accent }} aria-hidden="true" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onBookDemo}
            className={`w-full sm:flex-1 min-h-12 py-3.5 px-6 rounded-full text-white text-base font-bold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${GLOW_BUTTON}`}
            style={{ background: buttonBackground(accent) }}
          >
            <span>Book a demo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-12 py-3.5 px-6 rounded-full text-slate-200 hover:text-white text-base font-medium border border-white/15 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogProduct, setDialogProduct] = useState(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const sectionRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchDelta = useRef({ x: 0, y: 0 });

  const total = PRODUCTS.length;
  const activeAccent = getAccent(PRODUCTS[activeIndex].slug);

  const goTo = useCallback((index) => setActiveIndex((index + total) % total), [total]);
  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

  // #product-<slug>: select that slide and bring the carousel into view.
  const showFromHash = useCallback(
    (hash, smooth) => {
      const index = PRODUCTS.findIndex((p) => `#${productAnchor(p.slug)}` === hash);
      if (index === -1) return false;
      setActiveIndex(index);
      scrollToElement(sectionRef.current, smooth);
      return true;
    },
    []
  );

  // Opening the page at a product URL, and back/forward between product URLs.
  useEffect(() => {
    // The hidden slide can't be scrolled to by the browser, so do it once the page has laid out.
    const frame = requestAnimationFrame(() => showFromHash(window.location.hash, false));
    const onHashChange = () => showFromHash(window.location.hash, !reducedMotion);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [showFromHash, reducedMotion]);

  // Any link to #product-<slug> or /#product-<slug> (industry grid, footer) selects the slide, even when the
  // URL already has that hash (which would not fire hashchange).
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#product-"], a[href^="/#product-"]');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = link.getAttribute("href");
      const hash = href.slice(href.indexOf("#"));
      if (!PRODUCTS.some((p) => `#${productAnchor(p.slug)}` === hash)) return;
      e.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      showFromHash(hash, !reducedMotion);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [showFromHash, reducedMotion]);

  // Arrow keys only while focus is inside the carousel (never while typing elsewhere on the page).
  const onKeyDown = (e) => {
    if (dialogProduct || e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  // Swipe: only a clearly horizontal swipe changes slide, so vertical scrolling is unaffected.
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = { x: 0, y: 0 };
  };
  const onTouchMove = (e) => {
    touchDelta.current = {
      x: e.touches[0].clientX - touchStart.current.x,
      y: e.touches[0].clientY - touchStart.current.y
    };
  };
  const onTouchEnd = () => {
    const { x, y } = touchDelta.current;
    if (Math.abs(x) > 50 && Math.abs(x) > 1.5 * Math.abs(y)) (x > 0 ? goPrev : goNext)();
    touchDelta.current = { x: 0, y: 0 };
  };

  const bookDemo = () => {
    setDialogProduct(null);
    scrollToElement(document.getElementById("contact"), !reducedMotion);
  };

  const counter = (
    <div className="flex items-center gap-3 select-none" aria-hidden="true">
      <span className="text-sm font-mono font-bold text-white min-w-[2ch] text-right">
        {String(activeIndex + 1).padStart(2, "0")}
      </span>
      <div className="w-20 h-1 bg-white/[0.12] relative overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full motion-safe:transition-all motion-safe:duration-500"
          style={{ width: `${((activeIndex + 1) / total) * 100}%`, background: activeAccent.accent }}
        />
      </div>
      <span className="text-sm font-mono text-slate-300 min-w-[2ch]">{String(total).padStart(2, "0")}</span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="product-details-heading"
      aria-roledescription="carousel"
      className="relative overflow-x-clip py-16 sm:py-24 bg-[#06060e] border-b border-white/[0.05]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient glow in the active product's colour (motion-safe only) */}
      <div className="absolute inset-0 pointer-events-none hidden motion-safe:block" aria-hidden="true">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[550px] rounded-full blur-[80px] lg:blur-[190px] transition-colors duration-1000"
          style={{ background: `${activeAccent.accent}14` }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="product-details-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-center mb-8 sm:mb-12"
        >
          What each product covers
        </h2>

        {/* Mobile: previous / counter / next above the slide, so they don't move between slides */}
        <div className="flex lg:hidden items-center justify-center gap-4 mb-8">
          <button type="button" onClick={goPrev} aria-label="Previous product" className={`flex ${ARROW_BUTTON_CLASS}`}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
          {counter}
          <button type="button" onClick={goNext} aria-label="Next product" className={`flex ${ARROW_BUTTON_CLASS}`}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
        </div>

        <div
          className="relative flex items-center justify-center lg:min-h-[520px] px-0 lg:px-12 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Products. Use the left and right arrow keys to move between products."
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous product"
            className={`hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next product"
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 ${ARROW_BUTTON_CLASS}`}
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Every slide is in the HTML; only the active one is displayed. */}
          <div className="w-full" aria-live="polite">
            {PRODUCTS.map((product, i) => (
              <div
                key={product.slug}
                id={productAnchor(product.slug)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${product.name}`}
                className={i === activeIndex ? undefined : "hidden"}
              >
                <ProductSlide product={product} onExplore={setDialogProduct} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:mt-12">
          <div className="hidden lg:flex">{counter}</div>
          <div className="flex justify-center flex-wrap max-w-lg">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${p.name}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className="p-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span
                  className={`block h-1.5 rounded-full motion-safe:transition-all motion-safe:duration-300 ${
                    i === activeIndex ? "w-6 motion-safe:shadow-[0_0_12px_var(--dot)]" : "w-1.5"
                  }`}
                  style={{
                    background: i === activeIndex ? activeAccent.accent : "rgba(255,255,255,0.3)",
                    "--dot": activeAccent.accent
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {dialogProduct && (
        <ProductDetailDialog product={dialogProduct} onClose={() => setDialogProduct(null)} onBookDemo={bookDemo} />
      )}
    </section>
  );
}
