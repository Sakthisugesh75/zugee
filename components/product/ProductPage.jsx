// components/product/ProductPage.jsx
// One template for every product landing page (/fleet-management-software and so on). A server
// component: all copy is in the HTML, and only the demo form (ContactSection) ships JavaScript.
// Copy comes from lib/product-pages.js, product facts from lib/products.js, colours and icon from
// lib/product-accents.js. Styling reuses the homepage's tokens, cards and section patterns.
//
// Sections, in order: breadcrumb, hero (with an illustrative sample card), problem vs solution,
// features (#features), demo call-out, how it works, who it's for, 14-day setup, extra sections
// (if any), FAQ (#faq), demo form (#demo), related products. The footer comes from the layout.
//
// No product screenshots (founder, 2026-10-10). The hero card is built in code from made-up sample
// rows, in the style of the homepage's "Sample dashboard view — illustrative data only" card.

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BedDouble,
  Boxes,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Contact,
  Database,
  DoorOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  House,
  IndianRupee,
  KeyRound,
  Layers,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Package,
  Receipt,
  Rocket,
  Route,
  ScanLine,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wallet,
  Wrench,
  X
} from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import FAQSection from "@/components/home/FAQSection";
import ProductCard from "@/components/product/ProductCard";
import { getAccent } from "@/lib/product-accents";
import { DEMO_FORM_BUSINESS_TYPES, PRODUCTS, productFullName } from "@/lib/products";

// Feature card icons, by the name used in lib/product-pages.js.
const FEATURE_ICONS = {
  BedDouble, Boxes, Briefcase, Building, Building2, Calculator, CalendarCheck, CalendarDays, ClipboardCheck,
  ClipboardList, Clock, Contact, DoorOpen, FileText, FlaskConical, GraduationCap, Handshake, House, IndianRupee,
  KeyRound, Layers, LayoutGrid, Map: MapIcon, MapPin, MessageSquare, MessagesSquare, Package, Receipt, Route, ScanLine,
  Scissors, ShieldCheck, Stethoscope, Truck, UserCheck, UserPlus, Users, Utensils, Wallet, Wrench
};

// The 14-day setup, the same four steps as the homepage's "How we onboard you". Each product page
// supplies its own line for each step.
const SETUP_STEPS = [
  { title: "Discovery", icon: Building2 },
  { title: "Live demo", icon: Calendar },
  { title: "Data migration from Excel / Tally", icon: Database },
  { title: "Training & go-live", icon: Rocket }
];

const EYEBROW = "text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3";
const H2 = "text-3xl sm:text-4xl font-extrabold text-fg tracking-tight leading-tight";
const CARD = "rounded-2xl bg-card border border-line shadow-card";

// Small text in a product accent colour. Mixing in the theme's text colour lightens it on dark and
// darkens it on light, so even the darkest accent (indigo) clears 4.5:1 at 11–12px in both themes.
const accentText = (accent) => `color-mix(in oklab, ${accent} 72%, var(--color-fg))`;

function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={`${H2} mb-4`}>{title}</h2>
      {children && <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{children}</p>}
    </div>
  );
}

/** The products behind a page's related page slugs. */
function relatedProducts(pageSlugs) {
  return pageSlugs.map((pageSlug) => PRODUCTS.find((p) => p.pageSlug === pageSlug)).filter(Boolean);
}

/** The hero's sample card: the homepage Hero's sample dashboard, with this product's fake rows. */
function SampleCard({ product, rows, accent }) {
  return (
    <div
      className="rounded-3xl p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 75%, transparent)",
        border: `1px solid ${accent}40`,
        boxShadow: `0 24px 70px -15px ${accent}20, 0 0 0 1px color-mix(in srgb, var(--color-ink) 5%, transparent), var(--theme-shadow-card-raised)`
      }}
    >
      <div className="pb-4 border-b border-ink/[0.08] mb-5 flex flex-col gap-1.5">
        <p className="flex items-start sm:items-center gap-2.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <span className="w-2.5 h-2.5 mt-[3px] sm:mt-0 rounded-full bg-slate-500 shrink-0" aria-hidden="true" />
          Sample view — illustrative data only
        </p>
        <p className="text-xs sm:text-sm font-mono" style={{ color: accentText(accent) }}>
          {productFullName(product)}
        </p>
      </div>

      <ul className="space-y-2.5 list-none p-0 m-0">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-card border border-line shadow-card gap-2"
          >
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} aria-hidden="true" />
              <span className="text-sm font-semibold text-fg">{row.name}</span>
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-5 sm:pl-0 text-xs sm:text-sm">
              <span className="px-2 py-0.5 rounded-md bg-ink/[0.05] text-slate-300 border border-ink/[0.08]">{row.stage}</span>
              <span className="font-mono font-bold text-slate-200">{row.value}</span>
              <span className="text-xs font-mono text-slate-400">{row.time}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 pt-3.5 border-t border-ink/[0.06] flex items-start gap-2 text-xs sm:text-sm text-slate-400">
        <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Sample data. Your own records go in during setup.</span>
      </p>
    </div>
  );
}

/**
 * @param {{ product: (typeof PRODUCTS)[number], page: object }} props  page: an entry of lib/product-pages.js
 */
export default function ProductPage({ product, page }) {
  const { accent, accent2, glow, icon: ProductIcon } = getAccent(product.slug);
  const ink = accentText(accent);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] rounded-full ambient-glow lg:blur-[180px]"
            style={{ background: `${accent}12` }}
          />
        </div>

        <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li>
                <Link href="/products" className="hover:text-brand transition-colors">Products</Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li aria-current="page" className="text-slate-200 font-medium">{product.categoryLabel}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink/[0.03] border mb-6"
                style={{ borderColor: `${accent}55` }}
              >
                <ProductIcon className="w-3.5 h-3.5" style={{ color: ink }} aria-hidden="true" />
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em]" style={{ color: ink }}>
                  {productFullName(product)} · {product.categoryLabel}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-fg leading-[1.08] mb-6">
                {page.h1}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">{page.intro}</p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
                <a
                  href="#demo"
                  className="group/btn px-7 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-[0.08em] inline-flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})`, boxShadow: `0 8px 32px ${glow}` }}
                >
                  <span>Book a free {product.name} demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href="#features"
                  className="px-7 py-3.5 rounded-full text-slate-200 hover:text-fg text-sm font-semibold tracking-wide inline-flex items-center justify-center bg-ink/[0.04] light:bg-surface light:shadow-card border border-ink/[0.12] hover:border-cyan-400/40 hover:bg-ink/[0.08] transition-all duration-300"
                >
                  See features
                </a>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300 list-none p-0 m-0 mb-5">
                {["Set up for you in 14 days", "Your data moved from Excel or Tally", "Staff trained before go-live"].map((tick) => (
                  <li key={tick} className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                    {tick}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-slate-400 leading-relaxed">
                {product.name} is separate software with its own login and its own data.
              </p>
            </div>

            <SampleCard product={product} rows={page.sampleRows} accent={accent} />
          </div>
        </div>
      </section>

      {/* ================= PROBLEM VS SOLUTION ================= */}
      <section className="py-20 sm:py-28 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Why businesses switch" title={page.problemsHeading}>
            {product.name} replaces {product.replaces.charAt(0).toLowerCase() + product.replaces.slice(1)}.
          </SectionHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div
              className="rounded-3xl p-6 sm:p-8"
              style={{
                background: "color-mix(in srgb, #F43F5E 7%, var(--color-surface))",
                border: "1px solid rgba(244, 63, 94, 0.25)",
                boxShadow: "var(--theme-shadow-card)"
              }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-fg mb-6">Without {product.name}</h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {page.problems.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-rose-400" aria-hidden="true" />
                    </span>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
              style={{
                background: "color-mix(in srgb, var(--color-surface) 85%, transparent)",
                border: `1px solid ${accent}70`,
                boxShadow: `0 24px 60px -15px ${glow}, var(--theme-shadow-card-raised)`
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
              <h3 className="text-xl sm:text-2xl font-bold text-fg mb-6">With {product.name}</h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {page.solutions.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    </span>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 sm:py-28 bg-canvas border-b border-ink/[0.06] scroll-mt-[80px]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow={`${product.name} features`} title={page.featuresHeading} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {page.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon] || ProductIcon;
              return (
                <div key={feature.title} className={`${CARD} h-full p-6`}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border mb-4"
                    style={{ background: `${accent}15`, borderColor: `${accent}35`, color: ink }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-fg mb-2 leading-snug">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Modules included</p>
            <ul className="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
              {product.modules.map((module) => (
                <li key={module} className="px-3.5 py-1.5 rounded-full text-sm text-slate-200 bg-ink/[0.04] border border-ink/[0.12]">
                  {module}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= DEMO CALL-OUT ================= */}
      {/* Always dark: data-theme re-themes this subtree (app/globals.css), so only theme colours
          (text-fg, bg-canvas-alt) are used inside; the slate scale is remapped for light mode only. */}
      <section data-theme="dark" className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full ambient-glow lg:blur-[140px]"
            style={{ background: `${accent}1F` }}
          />
        </div>
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className={`${H2} mb-4`}>See {product.name} live in a 1-on-1 demo</h2>
          <p className="text-base sm:text-lg text-fg/80 leading-relaxed mb-8">
            We show the product working with your own business setup on a short call.
          </p>
          <a href="#demo" className="btn-primary text-base !py-3.5 !px-8">
            <span>Book a free {product.name} demo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 sm:py-28 bg-canvas border-b border-ink/[0.06]">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="How it works" title={page.workflowHeading} />
          <ol className="space-y-4 list-none p-0 m-0">
            {page.workflow.map((step, idx) => (
              <li key={step.title} className={`${CARD} p-5 sm:p-6 flex items-start gap-4`}>
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0"
                  style={{ background: `${accent}20`, color: ink, border: `1px solid ${accent}40` }}
                >
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-fg mb-1.5">{step.title}</h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= WHO IT'S FOR ================= */}
      <section className="py-20 sm:py-24 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className={EYEBROW}>Who it&apos;s for</p>
          <h2 className={`${H2} mb-4`}>Who {product.name} is for</h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">{page.audienceIntro}</p>
          <ul className="flex flex-wrap justify-center gap-3 list-none p-0 m-0">
            {page.audiences.map((audience) => (
              <li
                key={audience}
                className="px-4 py-2 rounded-full text-sm sm:text-base font-medium text-fg border"
                style={{ background: `${accent}12`, borderColor: `${accent}40` }}
              >
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= 14-DAY SETUP ================= */}
      <section className="py-20 sm:py-28 bg-canvas border-b border-ink/[0.06]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="14-day setup" title={`Live on ${product.name} in 14 days`}>
            Our team does the setup work, so your business keeps running while you switch.
          </SectionHeader>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 list-none p-0 m-0">
            {SETUP_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className={`${CARD} p-5 flex flex-col`}>
                  <span className="w-10 h-10 rounded-xl bg-tint-cyan border border-cyan-400/40 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-fg mb-2 leading-snug">
                    <span className="font-mono text-cyan-400 mr-1.5">{String(idx + 1).padStart(2, "0")}</span>
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{page.setup[idx]}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= EXTRA SECTIONS (e.g. data security) ================= */}
      {/* A draft section (facts still to confirm) is not rendered at all. */}
      {page.extraSections?.filter((section) => !section.draft).map((section) => (
        <section key={section.id} id={section.id} className="py-20 sm:py-24 bg-canvas-alt border-b border-ink/[0.06] scroll-mt-[80px]">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-7 h-7 text-cyan-400 shrink-0" aria-hidden="true" />
              <h2 className={H2}>{section.heading}</h2>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.points && (
                <ul className="space-y-3 list-none p-0 m-0">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.link && (
                <p>
                  <Link href={section.link.href} className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                    {section.link.label}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ================= FAQ ================= */}
      <section className="section-wrapper bg-canvas border-b border-ink/[0.08]">
        <div className="container">
          <FAQSection
            items={page.faqs}
            title={`${product.name} questions, answered`}
            subtitle={page.faqSubtitle}
            showRoadmapNote={false}
          />
        </div>
      </section>

      {/* ================= DEMO FORM ================= */}
      {/* #demo is this page's anchor; ContactSection keeps #contact, which the navbar's Book a Demo uses. */}
      <div id="demo" className="scroll-mt-[80px]">
        <ContactSection
          businessTypes={DEMO_FORM_BUSINESS_TYPES}
          initialIndustry={product.slug}
          title={`Book a free ${product.name} demo`}
          intro={`Tell us about your business. We'll call or WhatsApp you to fix a time and show you ${product.name} working, with your own examples.`}
        />
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      <section className="py-20 sm:py-24 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="More from ZUGEE" title="Related ZUGEE products" />
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
            {relatedProducts(page.related).map((related) => (
              <li key={related.slug}>
                <ProductCard product={related} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
