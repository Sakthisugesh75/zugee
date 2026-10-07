// components/home/Hero.jsx
// ZenXAI-inspired high-impact Hero with a simulated, clearly labelled sample dashboard.
// Message: specialised software for each industry, set up for you in 14 days. Each ZUGEE product
// is separate (own login, own database), so nothing here may claim a shared login or shared data.

"use client";

import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Truck,
  FileText,
  Boxes,
  Activity,
} from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

// Interactive tabs for the simulated Command Center preview
const PREVIEW_TABS = [
  {
    id: "crm",
    label: "CRM & Sales",
    icon: Users,
    stat: "148 Active Leads",
    trend: "+24% this week",
    accent: "#06B6D4",
    sampleData: [
      { name: "Apex Builders Pvt Ltd", stage: "Site Visit Scheduled", value: "₹45,00,000", time: "10m ago" },
      { name: "Royal Logistics Corp", stage: "Quotation Sent", value: "₹12,40,000", time: "35m ago" },
      { name: "Sunrise Packaged Waters", stage: "Demo Completed", value: "₹3,80,000", time: "1h ago" },
    ],
  },
  {
    id: "fleet",
    label: "Fleet Dispatch",
    icon: Truck,
    stat: "38 Active Trips",
    trend: "99.4% on time",
    accent: "#3B82F6",
    sampleData: [
      { name: "MH-12-RN-8840 (Volvo 40T)", stage: "In Transit → Pune Hub", value: "Fuel: 82%", time: "Live GPS" },
      { name: "KA-01-AB-1922 (Eicher 14T)", stage: "Driver Assigned: Suresh K.", value: "Maintenance: OK", time: "Departs 15:30" },
    ],
  },
  {
    id: "billing",
    label: "GST Billing",
    icon: FileText,
    stat: "₹28.4L Billed Today",
    trend: "GST Compliant",
    accent: "#10B981",
    sampleData: [
      { name: "INV-2026-0891 (Tax Invoice)", stage: "Paid via UPI / Bank", value: "₹1,84,500", time: "Instant Sync" },
      { name: "INV-2026-0893 (Service Bill)", stage: "WhatsApp Notification (Coming Soon)", value: "₹65,000", time: "Queued" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory Sync",
    icon: Boxes,
    stat: "4 Warehouses Live",
    trend: "0 Low-Stock Breaches",
    accent: "#8B5CF6",
    sampleData: [
      { name: "Raw Material Batch #A44", stage: "BOM Allocated: ManuFlow", value: "1,200 Units", time: "Floor Ready" },
      { name: "Packaged 20L Water Cans", stage: "Dispatched to Route 4", value: "480 Cans", time: "Van Loaded" },
      { name: "Finished Product SKUs", stage: "Auto-Reconciled with Sales", value: "Stock Value: ₹48L", time: "Live" },
    ],
  },
];

export default function Hero() {
  const [activeTabId, setActiveTabId] = useState("crm");
  const activeTab = PREVIEW_TABS.find((t) => t.id === activeTabId) || PREVIEW_TABS[0];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full ambient-glow lg:blur-[180px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[400px] bg-violet-600/[0.04] rounded-full ambient-glow lg:blur-[160px]" />
        {/* Subtle cyber grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 6%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink/[0.03] border border-cyan-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-300">
              INDUSTRY-SPECIFIC BUSINESS SOFTWARE
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight text-fg leading-[1.08] uppercase">
            Specialised Software for Your Industry,{" "}
            <span
              className="inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4 20%, #3B82F6 60%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Set Up for You in 14 Days.
            </span>
          </h1>
        </div>

        {/* Subhead Value Proposition */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto text-center leading-relaxed mb-8">
          Running your business on WhatsApp, Excel and Tally means re-entering the same details and chasing staff for updates.
          ZUGEE makes a separate product for each industry — fleet, travel, water supply, real estate, manufacturing, schools and more.
          Our team sets yours up, moves your data across and trains your staff.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <SmoothScrollLink
            targetId="products"
            className="group/btn w-full sm:w-auto px-8 py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-[0_8px_32px_rgba(6,182,212,0.35)] hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
            }}
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </SmoothScrollLink>

          <SmoothScrollLink
            targetId="contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-slate-200 hover:text-fg text-sm font-semibold tracking-wide inline-flex items-center justify-center bg-ink/[0.04] light:bg-surface light:shadow-card border border-ink/[0.12] hover:border-cyan-400/40 hover:bg-ink/[0.08] transition-all duration-300"
          >
            Book a 1-on-1 Live Demo
          </SmoothScrollLink>
        </div>

        {/* Proof Checkpoints */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-8 mb-5 text-sm text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Zero Double Data Entry
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Live Setup in 2 Weeks
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            Dedicated Setup Support
          </span>
        </div>

        {/* Each product is separate: own login, own database */}
        <p className="text-center text-sm text-slate-400 leading-relaxed mb-12 max-w-xl mx-auto">
          Each ZUGEE product is separate software with its own login and its own data.
          Choose the one built for your business.
        </p>

        {/* ========================================================
            SAMPLE DASHBOARD PREVIEW (ILLUSTRATIVE DATA)
           ======================================================== */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-500"
            style={{
              background: "color-mix(in srgb, var(--color-surface) 75%, transparent)",
              border: `1px solid ${activeTab.accent}40`,
              boxShadow: `0 24px 70px -15px ${activeTab.accent}20, 0 0 0 1px color-mix(in srgb, var(--color-ink) 5%, transparent), var(--theme-shadow-card-raised)`,
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Top Bar: Live Status & Tabs */}
            <div className="pb-4 border-b border-ink/[0.08] mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-3 gap-y-1.5">
                <span className="flex items-start sm:items-center gap-2.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  <span className="w-2.5 h-2.5 mt-[3px] sm:mt-0 rounded-full bg-slate-500 shrink-0" />
                  SAMPLE DASHBOARD VIEW — ILLUSTRATIVE DATA ONLY
                </span>
                <span className="hidden sm:inline text-ink/20">|</span>
                <span className="text-xs sm:text-sm font-mono text-cyan-300">
                  {activeTab.stat}
                </span>
              </div>

              {/* Interactive Module Switchers: a grid, so every module is visible at every width */}
              <div role="tablist" aria-label="Sample modules" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PREVIEW_TABS.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTabId(tab.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
                      style={{
                        background: isActive ? `${tab.accent}20` : "color-mix(in srgb, var(--color-ink) 3%, transparent)",
                        border: `1px solid ${isActive ? `${tab.accent}60` : "color-mix(in srgb, var(--color-ink) 6%, transparent)"}`,
                        color: isActive ? "var(--color-fg)" : "var(--color-slate-400)",
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? tab.accent : undefined }} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dashboard Simulated Records */}
            <div className="space-y-2.5">
              {activeTab.sampleData.map((row, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-card border border-line shadow-card hover:border-ink/[0.12] transition-colors gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: activeTab.accent, boxShadow: `0 0 8px ${activeTab.accent}` }}
                    />
                    <span className="text-sm sm:text-base font-semibold text-fg">{row.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-5 sm:pl-0 text-xs sm:text-sm">
                    <span className="px-2 py-0.5 rounded-md bg-ink/[0.05] text-slate-300 border border-ink/[0.08]">
                      {row.stage}
                    </span>
                    <span className="font-mono font-bold text-slate-200 sm:min-w-[100px] sm:text-right">
                      {row.value}
                    </span>
                    <span className="text-xs font-mono text-slate-500 sm:min-w-[80px] sm:text-right">
                      {row.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sync Bar */}
            <div className="mt-5 pt-3.5 border-t border-ink/[0.06] flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start sm:items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
                <span>Inside each product, an update in one module shows up in the others — no re-entry.</span>
              </div>
              <span className="hidden sm:inline font-mono text-slate-500 font-semibold">
                Sample Data
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
