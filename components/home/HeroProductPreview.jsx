// components/home/HeroProductPreview.jsx
// Hero visual: a two-tab, pure-Tailwind preview of one business (a ZUGEE Fleet transport operator).
// Tab 1 is what the owner sees in the office; tab 2 is what a driver sees on their phone.
// No images and no animation library: React state plus Tailwind transitions only.
// Both panels stay in the DOM (the inactive one is `hidden`) so crawlers read both.
//
// The tabs share state: confirming the delivery on the phone raises the owner's billing total,
// so switching back shows the two views are connected.
// "CA Tally export" means the billing-data export for the accountant that the FAQ and product
// pages promise today; Tally XML is still "Coming Soon" (docs/ZUGEE-PLATFORM-PLAN.md), so never
// say XML here.

"use client";

import { useState } from "react";
import TutuPerch from "@/components/chat/TutuPerch";
import {
  Activity,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Fuel,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";

const TABS = [
  { id: "owner", label: "Owner View (Live Ops & P&L)", shortLabel: "Owner View", icon: LayoutDashboard },
  { id: "field", label: "Field Staff Mobile View", shortLabel: "Field Staff View", icon: Smartphone },
];

// Amount tones and pill tones, as full class strings so Tailwind keeps them.
const AMOUNT_TONE = {
  credit: "text-fg",
  expense: "text-amber-400",
  receipt: "text-emerald-400",
};
const PILL_TONE = {
  green: "bg-emerald-500/15 border-emerald-400/40 text-emerald-400",
  cyan: "bg-cyan-500/15 border-cyan-400/40 text-cyan-400",
};

const ACTIVITY = [
  {
    icon: FileText,
    source: "Trip #TR-408 (Salem → Chennai)",
    event: "POD Uploaded by Driver",
    result: "GST Invoice #INV-892 Ready",
    amount: "+ ₹42,000",
    amountTone: "credit",
    pill: "Billed",
    pillTone: "green",
    time: "2m ago",
    chain: ["Driver Mobile (Ramesh K.)", "Dispatch Module", "GST Sales Register (#INV-892)"],
    chainNote: "0 manual entries",
  },
  {
    icon: Fuel,
    source: "Vehicle TN 38 BZ 4920",
    event: "Diesel & Toll Logged (₹3,400)",
    result: "Synced to Trip Ledger",
    amount: "- ₹3,400",
    amountTone: "expense",
    pill: "Voucher Attached",
    pillTone: "cyan",
    time: "14m ago",
    chain: ["Fastag & Fuel Slip Photo", "Vehicle Expense Ledger", "Trip #TR-408 Margin Updated"],
  },
  {
    icon: Wallet,
    source: "Sri Vari Traders",
    event: "Payment Received",
    result: "Customer Ledger & Outstanding Updated",
    amount: "+ ₹1,42,500",
    amountTone: "receipt",
    pill: "Settled via UPI",
    pillTone: "green",
    time: "28m ago",
    chain: ["Receipt Entry", "Customer Outstanding Reduced", "Daybook & Cash/Bank Ledger Synced"],
  },
];

const OFFICE_IMPACT = [
  {
    emoji: "🔒",
    title: "Strict Role Privacy:",
    text: "Driver only sees assigned trip tasks—never your company P&L, full client list, or rates.",
  },
  {
    emoji: "⚡",
    title: "Auto-Ledger Posting:",
    text: "₹3,400 fuel slip goes straight into the vehicle expense ledger without WhatsApp chasing.",
  },
  {
    emoji: "📄",
    title: "Instant Invoice Trigger:",
    text: 'Tapping "Confirm Delivery" on the phone immediately updates the Owner View billing total (+₹12,000) and queues the GST invoice.',
  },
];

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

export default function HeroProductPreview() {
  const [activeTab, setActiveTab] = useState("owner");
  const [selectedRow, setSelectedRow] = useState(0);
  // Shared by both tabs: the driver's tap on the phone updates the owner's numbers.
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  const kpis = [
    { label: "Today's Billing", value: deliveryConfirmed ? "₹1,96,500" : "₹1,84,500", icon: IndianRupee, updated: deliveryConfirmed },
    { label: "Active Dispatches", value: deliveryConfirmed ? "09 Trips" : "08 Trips", icon: Truck, updated: deliveryConfirmed },
    { label: "Pending Approvals", value: "02", icon: ClipboardCheck, updated: false },
  ];

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
      {/* Live mascot perch: in the right gutter beside the card's top */}
      <TutuPerch gutter say="Vanakkam! I'm Tutu. Click any row to see how it works." mood="happy" style={{ right: "-110px", top: "80px" }} />
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
        {/* The separator dot is desktop-only, so a wrapped second line never leaves it orphaned. */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3 pb-4 mb-5 border-b border-ink/[0.08] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2 text-emerald-400">
            <LiveDot />
            Live Sync Active
          </span>
          <span className="hidden sm:inline text-ink/20" aria-hidden="true">•</span>
          {/* The icon separates the two labels on phones, where the dot is hidden. */}
          <span className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5 sm:hidden" aria-hidden="true" />
            CA Tally Export Ready
          </span>
        </div>

        {/* KPI boxes */}
        {/* Phones: billing spans the full width on top, the other two sit side by side below it. */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5" aria-live="polite">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className={`p-3 sm:p-4 rounded-xl bg-card border shadow-card transition-colors duration-500 ${
                  index === 0 ? "col-span-2 sm:col-span-1" : ""
                } ${kpi.updated ? "border-emerald-400/50" : "border-line"}`}
              >
                <dt className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                  <span>{kpi.label}</span>
                </dt>
                <dd className={`text-base sm:text-xl font-black font-mono whitespace-nowrap tabular-nums transition-colors duration-500 ${kpi.updated ? "text-emerald-400" : "text-fg"}`}>
                  {kpi.value}
                </dd>
                {kpi.updated && (
                  <dd className="mt-1.5 inline-flex px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-[10px] font-semibold text-emerald-400">
                    Updated just now
                  </dd>
                )}
              </div>
            );
          })}
        </dl>

        {/* Live activity: click a row to see how the entry travelled between modules */}
        <ul className="space-y-2.5">
          {ACTIVITY.map((row, index) => {
            const Icon = row.icon;
            const isOpen = selectedRow === index;
            return (
              <li key={row.source}>
                <button
                  type="button"
                  onClick={() => setSelectedRow(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`hero-activity-detail-${index}`}
                  className={`w-full text-left p-3.5 rounded-xl bg-card border shadow-card transition-colors duration-200 cursor-pointer ${
                    isOpen ? "border-cyan-400/50" : "border-line hover:border-ink/[0.15]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
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
                    </div>

                    {/* Right-aligned metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pl-11 sm:pl-0 shrink-0 text-xs">
                      <span className={`font-mono font-semibold text-sm whitespace-nowrap tabular-nums ${AMOUNT_TONE[row.amountTone]}`}>{row.amount}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${PILL_TONE[row.pillTone]}`}>
                        {row.pill}
                      </span>
                      <span className="font-mono text-slate-500 whitespace-nowrap">{row.time}</span>
                    </div>
                  </div>

                  {/* Sync chain: grid-rows 0fr → 1fr gives a smooth CSS height transition */}
                  <div
                    id={`hero-activity-detail-${index}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 ml-0 sm:ml-11 px-3 py-2 rounded-lg bg-cyan-500/[0.07] border border-cyan-400/20 text-[11px] sm:text-xs font-mono text-slate-300 leading-relaxed">
                        {row.chain.map((step, i) => (
                          <span key={step}>
                            {i > 0 && <span className="text-cyan-400" aria-hidden="true"> → </span>}
                            {/* Each step wraps as a unit, so "#INV-892" never splits at the hyphen. */}
                            <span className="whitespace-nowrap">{step}</span>
                          </span>
                        ))}
                        {row.chainNote && <span className="text-emerald-400 font-semibold"> • <span className="whitespace-nowrap">{row.chainNote}</span></span>}
                      </p>
                    </div>
                  </div>
                </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: the phone */}
          <div className="lg:col-span-5">
            <div className="max-w-[310px] mx-auto rounded-[2rem] border-4 border-ink/[0.15] bg-canvas p-3 shadow-card-raised">
              {/* Status bar */}
              <div className="flex items-center justify-between px-2 mb-3 text-[10px] font-mono font-semibold text-slate-400" aria-hidden="true">
                <span>9:41 AM</span>
                <span className="w-16 h-1.5 rounded-full bg-ink/[0.15]" />
                <span>5G</span>
              </div>

              {/* Driver header */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-500/10 border border-violet-400/30 mb-3">
                <span className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-[11px] font-bold text-violet-300 shrink-0" aria-hidden="true">
                  RK
                </span>
                <div className="min-w-0 leading-snug">
                  <p className="text-xs font-bold text-fg">Ramesh K. • TN 38 BZ 4920</p>
                  <p className="text-[10px] text-slate-400">Driver • Role-Restricted (No P&amp;L Access)</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-card border border-line shadow-card">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    Today&apos;s Route
                  </p>
                  <p className="text-sm font-semibold text-fg">Salem → Tiruppur</p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-line shadow-card">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    <Fuel className="w-3.5 h-3.5" aria-hidden="true" />
                    Expense
                  </p>
                  <p className="text-sm font-semibold text-fg">Fuel/Toll: ₹3,400</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Bill Attached
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeliveryConfirmed((v) => !v)}
                  aria-pressed={deliveryConfirmed}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                    deliveryConfirmed
                      ? "bg-emerald-500/15 border border-emerald-400/50 text-emerald-400"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:scale-[1.02]"
                  }`}
                >
                  {deliveryConfirmed ? "✓ Synced to Office Ledger (+₹12,000)" : "Confirm Delivery & Notify Office"}
                </button>
              </div>

              {/* Home indicator */}
              <div className="w-24 h-1 rounded-full bg-ink/[0.15] mx-auto mt-4" aria-hidden="true" />
            </div>
          </div>

          {/* Right: what the office gets from each tap */}
          <div className="lg:col-span-7">
            <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Instant Office Impact
            </p>
            <ul className="space-y-3">
              {OFFICE_IMPACT.map((card, index) => {
                // The invoice card lights up once the delivery is confirmed on the phone.
                const isLit = index === 2 && deliveryConfirmed;
                return (
                  <li
                    key={card.title}
                    className={`p-4 rounded-xl bg-card border shadow-card text-sm leading-relaxed transition-colors duration-500 ${
                      isLit ? "border-emerald-400/50" : "border-line"
                    }`}
                  >
                    <p className="text-slate-300">
                      <span className="mr-1.5" aria-hidden="true">{card.emoji}</span>
                      <strong className="font-bold text-fg">{card.title}</strong> {card.text}
                    </p>
                    {isLit && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Owner View updated — switch tabs to see it
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-ink/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-slate-400">
        <div className="flex items-start sm:items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span>What the driver taps on the phone shows up in the office — no re-entry.</span>
        </div>
        <span className="font-mono text-slate-500 font-semibold shrink-0">Interactive Preview — Click any row or tab</span>
      </div>
    </div>
  );
}
