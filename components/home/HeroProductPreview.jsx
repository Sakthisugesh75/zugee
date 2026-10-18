// components/home/HeroProductPreview.jsx
// Hero visual: a two-tab, pure-Tailwind preview of one business (a ZUGEE Fleet transport operator).
// Tab 1 is what the owner sees in the office; tab 2 is what a driver sees on their phone.
// No images. Both panels stay in the DOM (the inactive one is `hidden`) so crawlers read both.
//
// Tally export is "Coming Soon" in docs/ZUGEE-PLATFORM-PLAN.md, so the status strip says so.

"use client";

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Fuel,
  IndianRupee,
  LayoutDashboard,
  Lock,
  MapPin,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";

const TABS = [
  { id: "owner", label: "Owner View (Live Ops & P&L)", shortLabel: "Owner View", icon: LayoutDashboard },
  { id: "field", label: "Field Staff Mobile View", shortLabel: "Field Staff View", icon: Smartphone },
];

const KPIS = [
  { label: "Today's Billing", value: "₹1,84,500", icon: IndianRupee },
  { label: "Active Dispatches", value: "08 Trips", icon: Truck },
  { label: "Pending Approvals", value: "02", icon: ClipboardCheck },
];

const ACTIVITY = [
  {
    icon: FileText,
    source: "Trip #TR-408 (Coimbatore → Chennai)",
    event: "POD Uploaded by Driver",
    result: "GST Invoice #INV-892 Ready",
  },
  {
    icon: Fuel,
    source: "Vehicle TN 38 BZ 4920",
    event: "Diesel & Toll Logged (₹3,400)",
    result: "Synced to Trip Ledger",
  },
  {
    icon: Wallet,
    source: "Sri Vari Traders",
    event: "Payment Received",
    result: "Customer Ledger & Outstanding Updated",
  },
];

export default function HeroProductPreview() {
  const [activeTab, setActiveTab] = useState("owner");
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  return (
    <div
      className="rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 75%, transparent)",
        border: "1px solid rgba(6,182,212,0.25)",
        boxShadow:
          "0 24px 70px -15px rgba(6,182,212,0.12), 0 0 0 1px color-mix(in srgb, var(--color-ink) 5%, transparent), var(--theme-shadow-card-raised)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Tab switcher */}
      <div role="tablist" aria-label="Product preview" className="grid grid-cols-2 gap-2 mb-6">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`hero-preview-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`hero-preview-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? "bg-cyan-500/15 border-cyan-400/50 text-fg"
                  : "bg-ink/[0.03] border-ink/[0.06] text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : ""}`} aria-hidden="true" />
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Tab 1: Owner view ---------- */}
      <div
        id="hero-preview-panel-owner"
        role="tabpanel"
        aria-labelledby="hero-preview-tab-owner"
        hidden={activeTab !== "owner"}
      >
        {/* Status strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pb-4 mb-5 border-b border-ink/[0.08] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync Active
          </span>
          <span className="text-ink/20" aria-hidden="true">•</span>
          <span className="text-slate-400">Tally Export Coming Soon</span>
        </div>

        {/* KPI boxes */}
        <dl className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="p-3 sm:p-4 rounded-xl bg-card border border-line shadow-card">
                <dt className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                  <span>{kpi.label}</span>
                </dt>
                <dd className="text-base sm:text-xl font-black font-mono text-fg">{kpi.value}</dd>
              </div>
            );
          })}
        </dl>

        {/* Live activity: field updates flowing into office billing */}
        <ul className="space-y-2.5">
          {ACTIVITY.map((row) => {
            const Icon = row.icon;
            return (
              <li
                key={row.source}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-line shadow-card"
              >
                <span className="w-8 h-8 rounded-lg bg-tint-cyan border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-xs sm:text-sm leading-relaxed">
                  <p className="font-semibold text-fg">{row.source}</p>
                  <p className="text-slate-300">
                    {row.event} <span className="text-cyan-400" aria-hidden="true">→</span>{" "}
                    <span className="font-semibold text-emerald-400">{row.result}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Tab 2: Field staff mobile view ---------- */}
      <div
        id="hero-preview-panel-field"
        role="tabpanel"
        aria-labelledby="hero-preview-tab-field"
        hidden={activeTab !== "field"}
      >
        <div className="max-w-[310px] mx-auto rounded-[2rem] border-4 border-ink/[0.15] bg-canvas p-3 shadow-card-raised">
          {/* Phone notch */}
          <div className="w-20 h-1.5 rounded-full bg-ink/[0.15] mx-auto mb-3" aria-hidden="true" />

          {/* Role badge */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-violet-500/10 border border-violet-400/30 mb-3">
            <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] leading-snug text-slate-200">
              <span className="font-bold">Logged in as: Driver / Field Staff</span>
              <span className="text-slate-400"> • Role-Restricted (No P&amp;L Access)</span>
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-card border border-line shadow-card">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Today&apos;s Assigned Route
              </p>
              <p className="text-sm font-semibold text-fg">Coimbatore → Tiruppur</p>
              <p className="text-xs text-slate-400">Vehicle: TN 38 BZ 4920</p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-line shadow-card">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                <Fuel className="w-3.5 h-3.5" aria-hidden="true" />
                Quick Expense Entry
              </p>
              <p className="text-sm font-semibold text-fg">Fuel / Fastag Toll: ₹3,400</p>
              <p className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Bill Photo Attached
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeliveryConfirmed((v) => !v)}
              aria-pressed={deliveryConfirmed}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                deliveryConfirmed
                  ? "bg-emerald-500/15 border border-emerald-400/50 text-emerald-400"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:scale-[1.02]"
              }`}
            >
              {deliveryConfirmed ? "✓ Synced to Owner Dashboard Instantly" : "Confirm Delivery & Notify Office"}
            </button>
          </div>

          {/* Home indicator */}
          <div className="w-24 h-1 rounded-full bg-ink/[0.15] mx-auto mt-4" aria-hidden="true" />
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-5 pt-3.5 border-t border-ink/[0.06] flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
        <div className="flex items-start sm:items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span>What the driver taps on the phone shows up in the office — no re-entry.</span>
        </div>
        <span className="hidden sm:inline font-mono text-slate-500 font-semibold shrink-0">Sample Data</span>
      </div>
    </div>
  );
}
