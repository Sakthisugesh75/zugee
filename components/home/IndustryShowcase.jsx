// components/home/IndustryShowcase.jsx
// Operational Industry Workflows & Enterprise Foundation Pillars.
// Answers: "How does ZUGEE actually operate in my business every day?"
// Differentiates clearly from the Product Ecosystem catalog.

"use client";

import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  FileCheck,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Layers,
  Truck,
  Building,
  Plane,
  School,
  Activity,
  ShoppingBag,
  Wrench,
} from "lucide-react";

// Four Core Infrastructure Pillars for Indian Enterprises
const FOUNDATION_PILLARS = [
  {
    icon: FileCheck,
    title: "GST, E-Invoicing & E-Way Bills",
    desc: "1-click IRN generation with QR codes, automated multi-tax slabs, and instant GSTR-1/3B audit-ready reports.",
    accent: "#10B981",
  },
  {
    icon: MessageSquare,
    title: "Official WhatsApp Cloud API",
    desc: "Automated payment links, booking vouchers, invoice PDFs, and dispatch alerts delivered straight to customer WhatsApp.",
    accent: "#06B6D4",
  },
  {
    icon: Smartphone,
    title: "Role-Based Mobile Field Staff",
    desc: "Drivers, site supervisors, cashiers, and teachers log tasks on simple mobile screens; management sees company-wide P&L.",
    accent: "#3B82F6",
  },
  {
    icon: ShieldCheck,
    title: "100% Indian Data Sovereignty",
    desc: "Local high-security cloud servers, strict data protection, zero foreign data leakage, and high-speed offline-resilient sync.",
    accent: "#8B5CF6",
  },
];

// Industry Day-in-the-Life Operational Workflows
const INDUSTRY_WORKFLOWS = [
  {
    id: "fleet",
    name: "Fleet & Logistics",
    icon: Truck,
    accent: "#F97316",
    product: "Transposs",
    tagline: "Commercial vehicle roster, driver dispatch & automated E-Way billing",
    steps: [
      { step: "01. Order & Route Booking", detail: "Consignment booked, vehicle assigned, and route planned with live driver availability." },
      { step: "02. Live Dispatch & GPS Logs", detail: "Driver logs trips via mobile; fuel expenses, toll slips, and odometer readings auto-tracked." },
      { step: "03. Delivery & Fast Settlement", detail: "Digital proof of delivery triggers instant GST invoice and automated WhatsApp payment link to client." },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Production",
    icon: Layers,
    accent: "#3B82F6",
    product: "ManuFlow",
    tagline: "Raw materials tracking, Bills of Materials (BOM) & finished goods",
    steps: [
      { step: "01. Work Order & BOM Creation", detail: "Sales order auto-generates bill of materials and verifies raw stock across warehouses." },
      { step: "02. Shop Floor Job Tracking", detail: "Production stages recorded in real-time; scrap percentages and labor allocations logged." },
      { step: "03. Quality Check & Packing", detail: "Batch-numbered finished goods move directly into sales inventory ready for dispatch." },
    ],
  },
  {
    id: "retail",
    name: "Retail & Distribution",
    icon: ShoppingBag,
    accent: "#10B981",
    product: "ZUGEE ERP / CRM",
    tagline: "Multi-branch point of sale, stock re-orders & vendor ledgers",
    steps: [
      { step: "01. Rapid Barcode Billing", detail: "Fast POS checkout with GST calculation, split UPI/cash payments, and digital receipts." },
      { step: "02. Central Inventory Balance", detail: "Stock deducts across outlets instantly with automated purchase triggers when stock hits re-order levels." },
      { step: "03. Supplier Ledger Sync", detail: "Vendor purchases, credit periods, and accounts payable reconciled without manual bookkeeping." },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate & Builders",
    icon: Building,
    accent: "#A855F7",
    product: "Real Estate ERP",
    tagline: "Property unit inventories, broker commissions & payment schedules",
    steps: [
      { step: "01. Inquiry & Site Visit", detail: "Buyer leads captured automatically; site visits scheduled with automated SMS/WhatsApp alerts." },
      { step: "02. Unit Blocking & KYC", detail: "Available apartment/plot inventory blocked in real-time to avoid duplicate sales by agents." },
      { step: "03. Milestone Demand Notes", detail: "Construction milestone triggers automated demand letters, payment reminders, and receipts." },
    ],
  },
  {
    id: "travel",
    name: "Travel & Tour Operators",
    icon: Plane,
    accent: "#8B5CF6",
    product: "Tours & Travels CRM",
    tagline: "Custom holiday packages, instant itineraries & client bookings",
    steps: [
      { step: "01. Dynamic Quotation", detail: "Assemble hotels, flights, and sightseeing into branded PDF itineraries in under 2 minutes." },
      { step: "02. Confirmation & Vouchers", detail: "Advance payment received unlocks instant hotel vouchers and customer confirmation package." },
      { step: "03. Vendor & Tour Settlement", detail: "Track transport vendors, guide payments, and final balance collection without paperwork." },
    ],
  },
  {
    id: "education",
    name: "Schools & Educational Institutes",
    icon: School,
    accent: "#6366F1",
    product: "School & College ERP",
    tagline: "Student lifecycle, attendance rosters & automated fee collections",
    steps: [
      { step: "01. Admissions & Enrollment", detail: "Digital student registration, roll number allocation, and parent portal profile creation." },
      { step: "02. Daily Attendance & Records", detail: "Teachers mark daily attendance on mobile; automated SMS sent to parents of absent students." },
      { step: "03. Automated Fee Management", detail: "Term fee invoices sent via WhatsApp with integrated payment links; zero cash queues at the desk." },
    ],
  },
];

export default function IndustryShowcase() {
  const [activeWorkflowId, setActiveWorkflowId] = useState("fleet");
  const activeWorkflow = INDUSTRY_WORKFLOWS.find((w) => w.id === activeWorkflowId) || INDUSTRY_WORKFLOWS[0];

  const handleConsultation = () => {
    window.dispatchEvent(new CustomEvent("zugee:select-product", { detail: { slug: activeWorkflow.id } }));
    const section = document.getElementById("contact");
    if (!section) return;
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, sectionTop - navbarHeight - 16), behavior: "smooth" });
  };

  return (
    <section id="industries" className="py-20 sm:py-28 bg-[#05070E] border-b border-white/[0.06] relative overflow-hidden scroll-mt-[80px]">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[180px] transition-colors duration-1000"
          style={{ background: `${activeWorkflow.accent}08` }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
            Engineered For India
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
            Built For The Way Indian Businesses{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #06B6D4, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Actually Operate
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From local GST compliance and WhatsApp communication to driver mobile dispatch — every workflow is tuned to Indian business realities.
          </p>
        </div>

        {/* 4 Core Foundation Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {FOUNDATION_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                      background: `${pillar.accent}15`,
                      borderColor: `${pillar.accent}35`,
                      color: pillar.accent,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            INTERACTIVE OPERATIONAL WORKFLOW SHOWCASE
           ======================================================== */}
        <div className="max-w-4xl mx-auto">
          {/* Industry Tab Triggers */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 justify-start sm:justify-center">
            {INDUSTRY_WORKFLOWS.map((wf) => {
              const isActive = wf.id === activeWorkflowId;
              const Icon = wf.icon;
              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                  style={{
                    background: isActive ? `${wf.accent}20` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `${wf.accent}60` : "rgba(255,255,255,0.08)"}`,
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    boxShadow: isActive ? `0 0 20px ${wf.accent}25` : "none",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? wf.accent : undefined }} />
                  <span>{wf.name}</span>
                </button>
              );
            })}
          </div>

          {/* Workflow Stage Container */}
          <div
            className="rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all duration-500"
            style={{
              background: "#080c16",
              border: `1px solid ${activeWorkflow.accent}45`,
              boxShadow: `0 24px 60px -15px ${activeWorkflow.accent}20, 0 0 0 1px rgba(255,255,255,0.05)`,
            }}
          >
            {/* Top highlight bar */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${activeWorkflow.accent}, transparent)` }}
            />

            {/* Workflow Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.07]">
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider block mb-1"
                  style={{ color: activeWorkflow.accent }}
                >
                  DAILY OPERATIONAL LIFECYCLE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeWorkflow.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {activeWorkflow.tagline}
                </p>
              </div>

              <div
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border"
                style={{
                  background: `${activeWorkflow.accent}15`,
                  borderColor: `${activeWorkflow.accent}40`,
                  color: activeWorkflow.accent,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by {activeWorkflow.product}</span>
              </div>
            </div>

            {/* 3-Step Connected Journey */}
            <div className="space-y-4 mb-8">
              {activeWorkflow.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
                      style={{
                        background: `${activeWorkflow.accent}20`,
                        color: activeWorkflow.accent,
                        border: `1px solid ${activeWorkflow.accent}40`,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white">{st.step}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 sm:max-w-md">
                    {st.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.07]">
              <span className="text-xs text-slate-400">
                Customized for your business structure during the 14-day setup.
              </span>
              <button
                type="button"
                onClick={handleConsultation}
                className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${activeWorkflow.accent}, ${activeWorkflow.accent}CC)`,
                  boxShadow: `0 6px 24px ${activeWorkflow.accent}40`,
                }}
              >
                <span>See {activeWorkflow.product} in Action</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
