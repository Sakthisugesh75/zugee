// components/home/ComparisonSection.jsx
// Visual transformation: "The Chaos of 5 Apps vs. The Unified ZUGEE Engine"
// Concrete business realities: eliminates manual double-entry, lost leads, and spreadsheet blind spots.

"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, ArrowRight, Zap, Database } from "lucide-react";
import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

const COMPARISON_CATEGORIES = [
  {
    id: "operations",
    label: "Operations & Workflows",
    legacy: {
      title: "The Chaos of 5 Apps",
      badge: "Fragmented Operations",
      points: [
        "Customer calls about an order → staff calls 3 people across departments to find status",
        "Staff enters the same customer details into WhatsApp, Excel, and billing software",
        "Owner has no idea which jobs are delayed without physically asking supervisors",
      ],
      impact: "14+ hours lost weekly per manager in manual status checks",
    },
    zugee: {
      title: "The ZUGEE Unified Engine",
      badge: "Connected Platform",
      points: [
        "Order created once → instantly updates warehouse, dispatch, and accounting ledgers",
        "Role-based access: drivers and staff see only their tasks on mobile; owner sees entire P&L",
        "Live operational dashboard reveals bottlenecks, completed jobs, and pending deliverables",
      ],
      impact: "100% Real-Time Visibility • Zero Phone Tag Between Departments",
    },
  },
  {
    id: "billing",
    label: "Billing & GST",
    legacy: {
      title: "The Chaos of 5 Apps",
      badge: "Disconnected Accounts",
      points: [
        "Billing done in standalone desktop software; customer history is locked on one PC",
        "Outstanding payment reminders manually sent via WhatsApp one-by-one",
        "Accountant spends 4 days every month reconciling bank statements with cash slips",
      ],
      impact: "Delayed cash flow and frequent payment leakages",
    },
    zugee: {
      title: "The ZUGEE Unified Engine",
      badge: "Connected Platform",
      points: [
        "Cloud-based GST invoicing with QR codes & instant E-Way bill generation",
        "Automated WhatsApp payment reminders with integrated UPI & payment links",
        "Customer ledger updates automatically the moment payment is received",
      ],
      impact: "90% Faster Invoicing • Real-Time Debtor Balance",
    },
  },
  {
    id: "customers",
    label: "Sales & Leads",
    legacy: {
      title: "The Chaos of 5 Apps",
      badge: "Scattered Inquiries",
      points: [
        "Leads captured across personal WhatsApp numbers, handwritten diaries, and emails",
        "Sales reps forget follow-ups because there is no automated reminder system",
        "When a salesperson quits, all customer relationships and conversation history walk out the door",
      ],
      impact: "Up to 35% of inbound inquiries lost to competitor delays",
    },
    zugee: {
      title: "The ZUGEE Unified Engine",
      badge: "Connected Platform",
      points: [
        "Centralized lead pipeline captures every inquiry into one company-owned database",
        "Automated follow-up reminders, quotation generator, and visit scheduling",
        "Complete customer timeline (inquiries, quotations, invoices, payments) in one view",
      ],
      impact: "100% Customer History Owned by Company • 2x Follow-up Speed",
    },
  },
  {
    id: "inventory",
    label: "Inventory & Stock",
    legacy: {
      title: "The Chaos of 5 Apps",
      badge: "Blind Inventory",
      points: [
        "Stock counted on paper or updated into Excel only at the end of the week",
        "Items sold out on the floor while sales reps continue promising them to clients",
        "Dead stock and expired raw materials discovered months too late",
      ],
      impact: "Dead capital tied in stock + frequent customer order cancellations",
    },
    zugee: {
      title: "The ZUGEE Unified Engine",
      badge: "Connected Platform",
      points: [
        "Live stock deduction the moment a sales bill or production work order is confirmed",
        "Automated low-stock alerts before items run out with re-order level triggers",
        "Multi-warehouse tracking with batch numbers, expiry dates, and transfer logs",
      ],
      impact: "Real-Time Stock Valuation • Zero Accidental Over-Selling",
    },
  },
];

export default function ComparisonSection() {
  const [activeTabId, setActiveTabId] = useState("operations");
  const activeCategory = COMPARISON_CATEGORIES.find((c) => c.id === activeTabId) || COMPARISON_CATEGORIES[0];

  return (
    <section className="py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-rose-600/[0.03] rounded-full blur-[170px]" />
        <div className="absolute top-[30%] right-[20%] w-[550px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[180px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Why Businesses Switch
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
            The Chaos of 5 Apps vs.{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              The ZUGEE Single Engine
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            When customer data is in WhatsApp, stock is in Excel, and billing is in Tally, your business operates with blind spots.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md overflow-x-auto max-w-full">
            {COMPARISON_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeTabId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTabId(cat.id)}
                  className="px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                  style={{
                    background: isActive ? "linear-gradient(135deg, rgba(6,182,212,0.20), rgba(59,130,246,0.15))" : "transparent",
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    border: isActive ? "1px solid rgba(6,182,212,0.40)" : "1px solid transparent",
                    boxShadow: isActive ? "0 0 20px rgba(6,182,212,0.15)" : "none",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* LEFT: The Chaos (Scattered Apps) */}
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            style={{
              background: "rgba(22, 10, 15, 0.65)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              boxShadow: "0 16px 40px -15px rgba(244, 63, 94, 0.12)",
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Top Tag */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {activeCategory.legacy.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  Legacy Pattern
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {activeCategory.legacy.title}
              </h3>

              <div className="space-y-4 mb-6">
                {activeCategory.legacy.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-rose-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pain Point Impact Box */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium">
              ⚠️ {activeCategory.legacy.impact}
            </div>
          </div>

          {/* RIGHT: The ZUGEE Unified Engine */}
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            style={{
              background: "rgba(8, 16, 28, 0.85)",
              border: "1px solid rgba(6, 182, 212, 0.45)",
              boxShadow: "0 24px 60px -15px rgba(6, 182, 212, 0.22), 0 0 0 1px rgba(255,255,255,0.06)",
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Top highlight shimmer */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #06B6D4, transparent)" }}
            />

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  {activeCategory.zugee.badge}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                  ● 1 Central Database
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {activeCategory.zugee.title}
              </h3>

              <div className="space-y-4 mb-6">
                {activeCategory.zugee.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ZUGEE Result Callout Box */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-medium">
              ✨ {activeCategory.zugee.impact}
            </div>
          </div>
        </div>

        {/* Bottom CTA & Reassurance */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:px-8 sm:py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs sm:text-sm text-slate-300">
              Ready to unify your business workflows without disrupting daily operations?
            </span>
            <SmoothScrollLink
              targetId="contact"
              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
            >
              <span>Book a Migration Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </SmoothScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
}
