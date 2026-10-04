# Commit 0 Full Diff

Commit `510c254`: "Remove homepage claims the products can't back up". Review summary: [COMMIT-0-REVIEW.md](COMMIT-0-REVIEW.md)

8 files changed: 27 insertions, 1030 deletions. Most of the deletions are `ComparisonSection.jsx` (292 lines) and `IndustryShowcase.jsx` (346 lines), removed in full.

````diff
diff --git a/app/(marketing)/page.jsx b/app/(marketing)/page.jsx
index b5ec15b..52a39ba 100644
--- a/app/(marketing)/page.jsx
+++ b/app/(marketing)/page.jsx
@@ -3,8 +3,6 @@
 //
 // Hero → "Specialised software for each industry"
 // Products → "These are the products"
-// Comparison → "This is the problem ZUGEE solves"
-// Industries → "This is how it fits my business"
 // How It Works → "This is how I use it"
 // Pricing → "How to get a quote" (no prices are published; see below)
 // FAQ → "Common questions answered"
@@ -15,8 +13,6 @@
 
 import Hero from "@/components/home/Hero";
 import ProductShowcase from "@/components/home/ProductShowcase";
-import ComparisonSection from "@/components/home/ComparisonSection";
-import IndustryShowcase from "@/components/home/IndustryShowcase";
 import HowWeWork from "@/components/home/HowWeWork";
 import PricingSection from "@/components/home/PricingSection";
 import FinalCTA from "@/components/home/FinalCTA";
@@ -59,26 +55,20 @@ export default function HomePage() {
       {/* 2. PRODUCTS — "These are the products" */}
       <ProductShowcase />
 
-      {/* 3. COMPARISON — "This is the problem ZUGEE solves" */}
-      <ComparisonSection />
-
-      {/* 4. INDUSTRIES — "This is how it fits my business" */}
-      <IndustryShowcase />
-
-      {/* 5. HOW IT WORKS — "This is how I use it" */}
+      {/* 3. HOW IT WORKS — "This is how I use it" */}
       <HowWeWork />
 
-      {/* 6. PRICING — "How to get a quote" */}
+      {/* 4. PRICING — "How to get a quote" */}
       <PricingSection plans={PLAN_SUMMARIES} productSetups={PRODUCT_SETUPS} />
 
-      {/* 7. FAQ — "Common questions answered" */}
+      {/* 5. FAQ — "Common questions answered" */}
       <section className="section-wrapper bg-[#06090F] border-b border-white/[0.08]">
         <div className="container">
           <FAQSection />
         </div>
       </section>
 
-      {/* 8. CTA — "I understand what I can do next" */}
+      {/* 6. CTA — "I understand what I can do next" */}
       <FinalCTA />
 
       {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
diff --git a/components/home/ComparisonSection.jsx b/components/home/ComparisonSection.jsx
deleted file mode 100644
index d52c5df..0000000
--- a/components/home/ComparisonSection.jsx
+++ /dev/null
@@ -1,292 +0,0 @@
-// components/home/ComparisonSection.jsx
-// Visual transformation: "The Chaos of 5 Apps vs. Software Built for Your Trade"
-// Concrete business realities: eliminates manual double-entry, lost leads, and spreadsheet blind spots.
-// The comparison is scattered tools vs. ONE ZUGEE product; products do not share a login or data.
-// No statistics here unless we can source them.
-
-"use client";
-
-import { useState } from "react";
-import { X, CheckCircle2, AlertTriangle, ArrowRight, Zap, Database, Sparkles } from "lucide-react";
-import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
-
-const COMPARISON_CATEGORIES = [
-  {
-    id: "operations",
-    label: "Operations & Workflows",
-    legacy: {
-      title: "The Chaos of 5 Apps",
-      badge: "Fragmented Operations",
-      points: [
-        "Customer calls about an order → staff calls 3 people across departments to find status",
-        "Staff enters the same customer details into WhatsApp, Excel, and billing software",
-        "Owner has no idea which jobs are delayed without physically asking supervisors",
-      ],
-      impact: "Managers spend their week chasing status updates by phone",
-    },
-    zugee: {
-      title: "Your ZUGEE Product",
-      badge: "Built for Your Trade",
-      points: [
-        "Order created once → instantly updates warehouse, dispatch, and accounting ledgers",
-        "Role-based access: drivers and staff see only their tasks on mobile; owner sees entire P&L",
-        "Live operational dashboard reveals bottlenecks, completed jobs, and pending deliverables",
-      ],
-      impact: "Real-Time Visibility • No Phone Tag Between Departments",
-    },
-  },
-  {
-    id: "billing",
-    label: "Billing & GST",
-    legacy: {
-      title: "The Chaos of 5 Apps",
-      badge: "Disconnected Accounts",
-      points: [
-        "Billing done in standalone desktop software; customer history is locked on one PC",
-        "Outstanding payment reminders manually sent via WhatsApp one-by-one",
-        "Accountant spends days every month reconciling bank statements with cash slips",
-      ],
-      impact: "Delayed cash flow and frequent payment leakages",
-    },
-    zugee: {
-      title: "Your ZUGEE Product",
-      badge: "Built for Your Trade",
-      points: [
-        "Cloud-based GST invoicing with QR codes & instant E-Way bill generation",
-        "WhatsApp payment reminders with UPI & payment links (coming soon)",
-        "Customer ledger updates automatically the moment payment is received",
-      ],
-      impact: "Faster Invoicing • Real-Time Debtor Balance",
-    },
-  },
-  {
-    id: "customers",
-    label: "Sales & Leads",
-    legacy: {
-      title: "The Chaos of 5 Apps",
-      badge: "Scattered Inquiries",
-      points: [
-        "Leads captured across personal WhatsApp numbers, handwritten diaries, and emails",
-        "Sales reps forget follow-ups because there is no automated reminder system",
-        "When a salesperson quits, all customer relationships and conversation history walk out the door",
-      ],
-      impact: "Inbound inquiries lost to slow follow-up",
-    },
-    zugee: {
-      title: "Your ZUGEE Product",
-      badge: "Built for Your Trade",
-      points: [
-        "Centralized lead pipeline captures every inquiry into one company-owned database",
-        "Automated follow-up reminders, quotation generator, and visit scheduling",
-        "Complete customer timeline (inquiries, quotations, invoices, payments) in one view",
-      ],
-      impact: "Customer History Owned by the Company • Faster Follow-ups",
-    },
-  },
-  {
-    id: "inventory",
-    label: "Inventory & Stock",
-    legacy: {
-      title: "The Chaos of 5 Apps",
-      badge: "Blind Inventory",
-      points: [
-        "Stock counted on paper or updated into Excel only at the end of the week",
-        "Items sold out on the floor while sales reps continue promising them to clients",
-        "Dead stock and expired raw materials discovered months too late",
-      ],
-      impact: "Dead capital tied in stock + frequent customer order cancellations",
-    },
-    zugee: {
-      title: "Your ZUGEE Product",
-      badge: "Built for Your Trade",
-      points: [
-        "Live stock deduction the moment a sales bill or production work order is confirmed",
-        "Automated low-stock alerts before items run out with re-order level triggers",
-        "Multi-warehouse tracking with batch numbers, expiry dates, and transfer logs",
-      ],
-      impact: "Real-Time Stock Valuation • Zero Accidental Over-Selling",
-    },
-  },
-];
-
-export default function ComparisonSection() {
-  const [activeTabId, setActiveTabId] = useState("operations");
-  const activeCategory = COMPARISON_CATEGORIES.find((c) => c.id === activeTabId) || COMPARISON_CATEGORIES[0];
-
-  return (
-    <section className="py-20 sm:py-28 bg-[#04060C] border-b border-white/[0.06] relative overflow-hidden">
-      {/* Background ambient lighting */}
-      <div className="absolute inset-0 pointer-events-none">
-        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-rose-600/[0.03] rounded-full blur-[80px] lg:blur-[170px]" />
-        <div className="absolute top-[30%] right-[20%] w-[550px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[80px] lg:blur-[180px]" />
-      </div>
-
-      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
-        {/* Header */}
-        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
-          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
-            Why Businesses Switch
-          </p>
-          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
-            The Chaos of 5 Apps vs.{" "}
-            <span
-              style={{
-                backgroundImage: "linear-gradient(135deg, #06B6D4, #3B82F6)",
-                WebkitBackgroundClip: "text",
-                WebkitTextFillColor: "transparent",
-              }}
-            >
-              Software Built for Your Trade
-            </span>
-          </h2>
-          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
-            When customer data is in WhatsApp, stock is in Excel, and billing is in Tally, your business operates with blind spots.
-          </p>
-        </div>
-
-        {/* Category Switcher Tabs */}
-        <div className="flex justify-center mb-10 sm:mb-12">
-          <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md overflow-x-auto max-w-full">
-            {COMPARISON_CATEGORIES.map((cat) => {
-              const isActive = cat.id === activeTabId;
-              return (
-                <button
-                  key={cat.id}
-                  type="button"
-                  onClick={() => setActiveTabId(cat.id)}
-                  className="px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
-                  style={{
-                    background: isActive ? "linear-gradient(135deg, rgba(6,182,212,0.20), rgba(59,130,246,0.15))" : "transparent",
-                    color: isActive ? "#FFFFFF" : "#94A3B8",
-                    border: isActive ? "1px solid rgba(6,182,212,0.40)" : "1px solid transparent",
-                    boxShadow: isActive ? "0 0 20px rgba(6,182,212,0.15)" : "none",
-                  }}
-                >
-                  {cat.label}
-                </button>
-              );
-            })}
-          </div>
-        </div>
-
-        {/* Dual Comparison Cards */}
-        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
-          {/* LEFT: The Chaos (Scattered Apps) */}
-          <div
-            className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
-            style={{
-              background: "rgba(22, 10, 15, 0.65)",
-              border: "1px solid rgba(244, 63, 94, 0.25)",
-              boxShadow: "0 16px 40px -15px rgba(244, 63, 94, 0.12)",
-              backdropFilter: "blur(14px)",
-            }}
-          >
-            {/* Top Tag */}
-            <div>
-              <div className="flex items-center justify-between gap-3 mb-4">
-                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
-                  <AlertTriangle className="w-3.5 h-3.5" />
-                  {activeCategory.legacy.badge}
-                </span>
-                <span className="text-[11px] font-mono text-slate-500 uppercase">
-                  Legacy Pattern
-                </span>
-              </div>
-
-              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
-                {activeCategory.legacy.title}
-              </h3>
-
-              <div className="space-y-4 mb-6">
-                {activeCategory.legacy.points.map((pt, idx) => (
-                  <div key={idx} className="flex items-start gap-3">
-                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
-                      <X className="w-3 h-3 text-rose-400" />
-                    </div>
-                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
-                      {pt}
-                    </p>
-                  </div>
-                ))}
-              </div>
-            </div>
-
-            {/* Pain Point Impact Box */}
-            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium flex items-start gap-2">
-              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
-              <span>{activeCategory.legacy.impact}</span>
-            </div>
-          </div>
-
-          {/* RIGHT: One ZUGEE product */}
-          <div
-            className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
-            style={{
-              background: "rgba(8, 16, 28, 0.85)",
-              border: "1px solid rgba(6, 182, 212, 0.45)",
-              boxShadow: "0 24px 60px -15px rgba(6, 182, 212, 0.22), 0 0 0 1px rgba(255,255,255,0.06)",
-              backdropFilter: "blur(14px)",
-            }}
-          >
-            {/* Top highlight shimmer */}
-            <div
-              className="absolute top-0 left-0 right-0 h-px"
-              style={{ background: "linear-gradient(90deg, transparent, #06B6D4, transparent)" }}
-            />
-
-            <div>
-              <div className="flex items-center justify-between gap-3 mb-4">
-                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
-                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
-                  {activeCategory.zugee.badge}
-                </span>
-                <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
-                  ● Modules Work Together
-                </span>
-              </div>
-
-              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
-                {activeCategory.zugee.title}
-              </h3>
-
-              <div className="space-y-4 mb-6">
-                {activeCategory.zugee.points.map((pt, idx) => (
-                  <div key={idx} className="flex items-start gap-3">
-                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
-                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
-                    </div>
-                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
-                      {pt}
-                    </p>
-                  </div>
-                ))}
-              </div>
-            </div>
-
-            {/* ZUGEE Result Callout Box */}
-            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-medium flex items-start gap-2">
-              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
-              <span>{activeCategory.zugee.impact}</span>
-            </div>
-          </div>
-        </div>
-
-        {/* Bottom CTA & Reassurance */}
-        <div className="mt-12 text-center">
-          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:px-8 sm:py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
-            <span className="text-xs sm:text-sm text-slate-300">
-              Ready to move off scattered apps without disrupting daily operations?
-            </span>
-            <SmoothScrollLink
-              targetId="contact"
-              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
-            >
-              <span>Book a Migration Consultation</span>
-              <ArrowRight className="w-3.5 h-3.5" />
-            </SmoothScrollLink>
-          </div>
-        </div>
-      </div>
-    </section>
-  );
-}
diff --git a/components/home/FinalCTA.jsx b/components/home/FinalCTA.jsx
index 0cb60d4..982c7ba 100644
--- a/components/home/FinalCTA.jsx
+++ b/components/home/FinalCTA.jsx
@@ -3,7 +3,7 @@
 
 import { useState } from "react";
 import InteractiveMascot from "@/components/animations/InteractiveMascot";
-import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
+import { ArrowRight, Sparkles, Zap } from "lucide-react";
 
 export default function FinalCTA() {
   const [isHovering, setIsHovering] = useState(false);
@@ -24,7 +24,7 @@ export default function FinalCTA() {
   };
 
   const benefits = [
-    { icon: Sparkles, text: "Setup in 2 weeks" },
+    { icon: Sparkles, text: "Set up for you by our team" },
     { icon: Zap, text: "Clear quote on a short call" }
   ];
 
@@ -66,7 +66,7 @@ export default function FinalCTA() {
                 
                 {/* Subheading */}
                 <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
-                  Built with input from Indian SME operators. Streamline operations, boost productivity, and scale smarter — with software designed around how Indian businesses actually work.
+                  Software designed around how Indian businesses actually work, set up for you by our team.
                 </p>
 
                 {/* Benefits Grid */}
@@ -113,11 +113,6 @@ export default function FinalCTA() {
 
           {/* Bottom trust indicators */}
           <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
-            <div className="flex items-center gap-2">
-              <Shield className="w-4 h-4 text-cyan-400" />
-              <span>Role-Based Access</span>
-            </div>
-            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
             <div className="flex items-center gap-2">
               <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
@@ -125,11 +120,6 @@ export default function FinalCTA() {
               </svg>
               <span>Built for Indian SMEs</span>
             </div>
-            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
-            <div className="flex items-center gap-2">
-              <Sparkles className="w-4 h-4 text-cyan-400" />
-              <span>Typical Setup in 2 Weeks</span>
-            </div>
           </div>
         </div>
       </div>
diff --git a/components/home/Hero.jsx b/components/home/Hero.jsx
index 703884d..b4ed266 100644
--- a/components/home/Hero.jsx
+++ b/components/home/Hero.jsx
@@ -1,85 +1,11 @@
 // components/home/Hero.jsx
-// ZenXAI-inspired high-impact Hero with a simulated, clearly labelled sample dashboard.
-// Message: specialised software for each industry, set up for you in 14 days. Each ZUGEE product
+// Hero. Message: specialised software for each industry, set up for you. Each ZUGEE product
 // is separate (own login, own database), so nothing here may claim a shared login or shared data.
 
-"use client";
-
-import { useState } from "react";
-import {
-  ArrowRight,
-  Sparkles,
-  TrendingUp,
-  ShieldCheck,
-  CheckCircle2,
-  Users,
-  Truck,
-  FileText,
-  Boxes,
-  Activity,
-} from "lucide-react";
+import { ArrowRight, CheckCircle2 } from "lucide-react";
 import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
 
-// Interactive tabs for the simulated Command Center preview
-const PREVIEW_TABS = [
-  {
-    id: "crm",
-    label: "CRM & Sales",
-    icon: Users,
-    stat: "148 Active Leads",
-    trend: "+24% this week",
-    accent: "#06B6D4",
-    sampleData: [
-      { name: "Apex Builders Pvt Ltd", stage: "Site Visit Scheduled", value: "₹45,00,000", time: "10m ago" },
-      { name: "Royal Logistics Corp", stage: "Quotation Sent", value: "₹12,40,000", time: "35m ago" },
-      { name: "Sunrise Packaged Waters", stage: "Demo Completed", value: "₹3,80,000", time: "1h ago" },
-    ],
-  },
-  {
-    id: "fleet",
-    label: "Fleet Dispatch",
-    icon: Truck,
-    stat: "38 Active Trips",
-    trend: "99.4% on time",
-    accent: "#3B82F6",
-    sampleData: [
-      { name: "MH-12-RN-8840 (Volvo 40T)", stage: "In Transit → Pune Hub", value: "Fuel: 82%", time: "Live GPS" },
-      { name: "KA-01-AB-1922 (Eicher 14T)", stage: "Driver Assigned: Suresh K.", value: "Maintenance: OK", time: "Departs 15:30" },
-      { name: "DL-04-CC-9011 (Tata 407)", stage: "Unloading at Warehouse B", value: "E-Way Bill: #8821", time: "Arrived" },
-    ],
-  },
-  {
-    id: "billing",
-    label: "GST Billing",
-    icon: FileText,
-    stat: "₹28.4L Billed Today",
-    trend: "GST Compliant",
-    accent: "#10B981",
-    sampleData: [
-      { name: "INV-2026-0891 (Tax Invoice)", stage: "Paid via UPI / Bank", value: "₹1,84,500", time: "Instant Sync" },
-      { name: "INV-2026-0892 (B2B Supply)", stage: "E-Invoice QR Generated", value: "₹4,20,000", time: "IRN Active" },
-      { name: "INV-2026-0893 (Service Bill)", stage: "WhatsApp Notification (Coming Soon)", value: "₹65,000", time: "Queued" },
-    ],
-  },
-  {
-    id: "inventory",
-    label: "Inventory Sync",
-    icon: Boxes,
-    stat: "4 Warehouses Live",
-    trend: "0 Low-Stock Breaches",
-    accent: "#8B5CF6",
-    sampleData: [
-      { name: "Raw Material Batch #A44", stage: "BOM Allocated: ManuFlow", value: "1,200 Units", time: "Floor Ready" },
-      { name: "Packaged 20L Water Cans", stage: "Dispatched to Route 4", value: "480 Cans", time: "Van Loaded" },
-      { name: "Finished Product SKUs", stage: "Auto-Reconciled with Sales", value: "Stock Value: ₹48L", time: "Live" },
-    ],
-  },
-];
-
 export default function Hero() {
-  const [activeTabId, setActiveTabId] = useState("crm");
-  const activeTab = PREVIEW_TABS.find((t) => t.id === activeTabId) || PREVIEW_TABS[0];
-
   return (
     <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#06060e] border-b border-white/[0.06]">
       {/* Background ambient lighting */}
@@ -119,7 +45,7 @@ export default function Hero() {
                 WebkitTextFillColor: "transparent",
               }}
             >
-              Set Up for You in 14 Days.
+              Set Up for You.
             </span>
           </h1>
         </div>
@@ -154,21 +80,9 @@ export default function Hero() {
 
         {/* Proof Checkpoints */}
         <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-4 text-xs sm:text-sm text-slate-300">
-          <span className="flex items-center gap-1.5 font-medium">
-            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
-            Zero Double Data Entry
-          </span>
-          <span className="flex items-center gap-1.5 font-medium">
-            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
-            GST &amp; E-Invoicing Ready
-          </span>
-          <span className="flex items-center gap-1.5 font-medium">
-            <CheckCircle2 className="w-4 h-4 text-blue-400" />
-            Live Setup in 2 Weeks
-          </span>
           <span className="flex items-center gap-1.5 font-medium">
             <CheckCircle2 className="w-4 h-4 text-violet-400" />
-            Dedicated Setup Support
+            Set up for you by our team
           </span>
         </div>
 
@@ -177,100 +91,6 @@ export default function Hero() {
           Each ZUGEE product is separate software with its own login and its own data.
           Choose the one built for your business.
         </p>
-
-        {/* ========================================================
-            SAMPLE DASHBOARD PREVIEW (ILLUSTRATIVE DATA)
-           ======================================================== */}
-        <div className="max-w-4xl mx-auto">
-          <div
-            className="rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-500"
-            style={{
-              background: "rgba(13, 13, 26, 0.75)",
-              border: `1px solid ${activeTab.accent}40`,
-              boxShadow: `0 24px 70px -15px ${activeTab.accent}20, 0 0 0 1px rgba(255,255,255,0.05)`,
-              backdropFilter: "blur(16px)",
-            }}
-          >
-            {/* Top Bar: Live Status & Tabs */}
-            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
-              <div className="flex items-center gap-3">
-                <div className="w-3 h-3 rounded-full bg-slate-500" />
-                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
-                  SAMPLE DASHBOARD VIEW — ILLUSTRATIVE DATA ONLY
-                </span>
-                <span className="text-white/20">|</span>
-                <span className="text-xs font-mono text-cyan-300">
-                  {activeTab.stat}
-                </span>
-              </div>
-
-              {/* Interactive Module Switchers */}
-              <div className="flex gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
-                {PREVIEW_TABS.map((tab) => {
-                  const isActive = tab.id === activeTabId;
-                  const Icon = tab.icon;
-                  return (
-                    <button
-                      key={tab.id}
-                      type="button"
-                      onClick={() => setActiveTabId(tab.id)}
-                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
-                      style={{
-                        background: isActive ? `${tab.accent}20` : "rgba(255,255,255,0.03)",
-                        border: `1px solid ${isActive ? `${tab.accent}60` : "rgba(255,255,255,0.06)"}`,
-                        color: isActive ? "#FFFFFF" : "#94A3B8",
-                      }}
-                    >
-                      <Icon className="w-3.5 h-3.5" style={{ color: isActive ? tab.accent : undefined }} />
-                      <span>{tab.label}</span>
-                    </button>
-                  );
-                })}
-              </div>
-            </div>
-
-            {/* Dashboard Simulated Records */}
-            <div className="space-y-2.5">
-              {activeTab.sampleData.map((row, idx) => (
-                <div
-                  key={idx}
-                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-colors gap-2"
-                >
-                  <div className="flex items-center gap-3">
-                    <span
-                      className="w-2 h-2 rounded-full flex-shrink-0"
-                      style={{ background: activeTab.accent, boxShadow: `0 0 8px ${activeTab.accent}` }}
-                    />
-                    <span className="text-sm font-semibold text-white">{row.name}</span>
-                  </div>
-
-                  <div className="flex items-center gap-4 text-xs">
-                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/[0.08]">
-                      {row.stage}
-                    </span>
-                    <span className="font-mono font-bold text-slate-200 min-w-[90px] text-right">
-                      {row.value}
-                    </span>
-                    <span className="text-[11px] font-mono text-slate-500 min-w-[70px] text-right">
-                      {row.time}
-                    </span>
-                  </div>
-                </div>
-              ))}
-            </div>
-
-            {/* Bottom Sync Bar */}
-            <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
-              <div className="flex items-center gap-2">
-                <Activity className="w-3.5 h-3.5 text-cyan-400" />
-                <span>Inside each product, an update in one module shows up in the others — no re-entry.</span>
-              </div>
-              <span className="hidden sm:inline font-mono text-slate-500 font-semibold">
-                Sample Data
-              </span>
-            </div>
-          </div>
-        </div>
       </div>
     </section>
   );
diff --git a/components/home/HowWeWork.jsx b/components/home/HowWeWork.jsx
index 2169a6f..0667a06 100644
--- a/components/home/HowWeWork.jsx
+++ b/components/home/HowWeWork.jsx
@@ -1,7 +1,7 @@
 // components/home/HowWeWork.jsx
 // Complete 4-step onboarding timeline with horizontal connected desktop process,
 // responsive vertical mobile timeline, interactive hover/active states, and staggered scroll reveal.
-// Elevated to frame 14-day setup as a premier white-glove onboarding advantage.
+// The setup timeline must use the Terms wording: a target, not a guarantee.
 
 "use client";
 
@@ -30,15 +30,15 @@ const STEPS = [
     number: "03",
     label: "MIGRATION",
     title: "White-Glove Data Migration",
-    description: "Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with validation at every step.",
-    tag: "Clean Ledgers · Role Permissions",
+    description: "Our team brings in your existing records, such as customer and item lists from Excel or Tally.",
+    tag: "Data import · Configuration",
     icon: Database,
   },
   {
     number: "04",
     label: "LAUNCH",
-    title: "Go-Live & Dedicated Support",
-    description: "Your team receives guided mobile training. You begin billing and dispatching live with dedicated onboarding support.",
+    title: "Go-Live & Support",
+    description: "We train your team and you start using ZUGEE, with onboarding support from our team.",
     tag: "Live Operations · Ongoing Support",
     icon: Rocket,
   },
@@ -106,7 +106,7 @@ export default function HowWeWork() {
             </span>
           </h2>
           <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
-            You don&apos;t spend months wrestling with software configuration. Our team migrates your data and trains your staff in 14 days.
+            You don&apos;t spend months wrestling with software configuration. Our team moves your data across and trains your staff.
           </p>
         </div>
 
@@ -246,7 +246,7 @@ export default function HowWeWork() {
             <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
             <div>
               <p className="text-sm font-bold text-white">
-                Typical Setup: 14 Days, Start to Finish
+                Setup typically takes about 14 days. This is a target, not a guarantee.
               </p>
               <p className="text-xs text-slate-300">
                 Discovery, data migration, staff training and go-live — we handle it all so you don&apos;t have to.
diff --git a/components/home/IndustryShowcase.jsx b/components/home/IndustryShowcase.jsx
deleted file mode 100644
index dc4dfc6..0000000
--- a/components/home/IndustryShowcase.jsx
+++ /dev/null
@@ -1,346 +0,0 @@
-// components/home/IndustryShowcase.jsx
-// Operational Industry Workflows & Enterprise Foundation Pillars.
-// Answers: "How does ZUGEE actually operate in my business every day?"
-// Differentiates clearly from the product catalog.
-
-"use client";
-
-import { useState } from "react";
-import {
-  ArrowRight,
-  ShieldCheck,
-  MessageSquare,
-  FileCheck,
-  Smartphone,
-  CheckCircle2,
-  Sparkles,
-  Layers,
-  Truck,
-  Building,
-  Plane,
-  School,
-  Activity,
-  ShoppingBag,
-  Wrench,
-} from "lucide-react";
-
-// Four Core Infrastructure Pillars for Indian Enterprises
-const FOUNDATION_PILLARS = [
-  {
-    icon: FileCheck,
-    title: "GST, E-Invoicing & E-Way Bills",
-    desc: "1-click IRN generation with QR codes, automated multi-tax slabs, and instant GSTR-1/3B audit-ready reports.",
-    accent: "#10B981",
-  },
-  {
-    icon: MessageSquare,
-    title: "WhatsApp Cloud API",
-    badge: "Rolling Out",
-    desc: "Payment links, booking vouchers, invoice PDFs, and dispatch alerts delivered to customer WhatsApp — actively being built, not yet live.",
-    accent: "#06B6D4",
-  },
-  {
-    icon: Smartphone,
-    title: "Role-Based Mobile Field Staff",
-    desc: "Drivers, site supervisors, cashiers, and teachers log tasks on simple mobile screens; management sees company-wide P&L.",
-    accent: "#3B82F6",
-  },
-  {
-    icon: ShieldCheck,
-    title: "Secure, Role-Based Access",
-    desc: "Every user signs in with their own account and sees only what their role allows.",
-    accent: "#8B5CF6",
-  },
-];
-
-// Industry Day-in-the-Life Operational Workflows
-const INDUSTRY_WORKFLOWS = [
-  {
-    id: "fleet",
-    name: "Fleet & Logistics",
-    icon: Truck,
-    accent: "#F97316",
-    product: "Transposs",
-    tagline: "Commercial vehicle roster, driver dispatch & automated E-Way billing",
-    steps: [
-      { step: "01. Order & Route Booking", detail: "Consignment booked, vehicle assigned, and route planned with live driver availability." },
-      { step: "02. Live Dispatch & GPS Logs", detail: "Driver logs trips via mobile; fuel expenses, toll slips, and odometer readings auto-tracked." },
-      { step: "03. Delivery & Fast Settlement", detail: "Digital proof of delivery triggers instant GST invoice and automated WhatsApp payment link to client." },
-    ],
-  },
-  {
-    id: "manufacturing",
-    name: "Manufacturing & Production",
-    icon: Layers,
-    accent: "#3B82F6",
-    product: "ManuFlow",
-    tagline: "Raw materials tracking, Bills of Materials (BOM) & finished goods",
-    steps: [
-      { step: "01. Work Order & BOM Creation", detail: "Sales order auto-generates bill of materials and verifies raw stock across warehouses." },
-      { step: "02. Shop Floor Job Tracking", detail: "Production stages recorded in real-time; scrap percentages and labor allocations logged." },
-      { step: "03. Quality Check & Packing", detail: "Batch-numbered finished goods move directly into sales inventory ready for dispatch." },
-    ],
-  },
-  {
-    id: "retail",
-    name: "Retail & Distribution",
-    icon: ShoppingBag,
-    accent: "#10B981",
-    product: "ZUGEE ERP / CRM",
-    tagline: "Multi-branch point of sale, stock re-orders & vendor ledgers",
-    steps: [
-      { step: "01. Rapid Barcode Billing", detail: "Fast POS checkout with GST calculation, split UPI/cash payments, and digital receipts." },
-      { step: "02. Central Inventory Balance", detail: "Stock deducts across outlets instantly with automated purchase triggers when stock hits re-order levels." },
-      { step: "03. Supplier Ledger Sync", detail: "Vendor purchases, credit periods, and accounts payable reconciled without manual bookkeeping." },
-    ],
-  },
-  {
-    id: "real-estate",
-    name: "Real Estate & Builders",
-    icon: Building,
-    accent: "#A855F7",
-    product: "Real Estate ERP",
-    tagline: "Property unit inventories, broker commissions & payment schedules",
-    steps: [
-      { step: "01. Inquiry & Site Visit", detail: "Buyer leads captured automatically; site visits scheduled with automated SMS/WhatsApp alerts." },
-      { step: "02. Unit Blocking & KYC", detail: "Available apartment/plot inventory blocked in real-time to avoid duplicate sales by agents." },
-      { step: "03. Milestone Demand Notes", detail: "Construction milestone triggers automated demand letters, payment reminders, and receipts." },
-    ],
-  },
-  {
-    id: "travel",
-    name: "Travel & Tour Operators",
-    icon: Plane,
-    accent: "#8B5CF6",
-    product: "Tours & Travels CRM",
-    tagline: "Custom holiday packages, instant itineraries & client bookings",
-    steps: [
-      { step: "01. Dynamic Quotation", detail: "Assemble hotels, flights, and sightseeing into branded PDF itineraries in minutes." },
-      { step: "02. Confirmation & Vouchers", detail: "Advance payment received unlocks instant hotel vouchers and customer confirmation package." },
-      { step: "03. Vendor & Tour Settlement", detail: "Track transport vendors, guide payments, and final balance collection without paperwork." },
-    ],
-  },
-  {
-    id: "education",
-    name: "Schools & Educational Institutes",
-    icon: School,
-    accent: "#6366F1",
-    product: "School & College ERP",
-    tagline: "Student lifecycle, attendance rosters & automated fee collections",
-    steps: [
-      { step: "01. Admissions & Enrollment", detail: "Digital student registration, roll number allocation, and parent portal profile creation." },
-      { step: "02. Daily Attendance & Records", detail: "Teachers mark daily attendance on mobile; automated SMS sent to parents of absent students." },
-      { step: "03. Automated Fee Management", detail: "Term fee invoices with integrated payment links; digital collection reduces cash queues at the desk." },
-    ],
-  },
-];
-
-export default function IndustryShowcase() {
-  const [activeWorkflowId, setActiveWorkflowId] = useState("fleet");
-  const activeWorkflow = INDUSTRY_WORKFLOWS.find((w) => w.id === activeWorkflowId) || INDUSTRY_WORKFLOWS[0];
-
-  const handleConsultation = () => {
-    window.dispatchEvent(new CustomEvent("zugee:select-product", { detail: { slug: activeWorkflow.id } }));
-    const section = document.getElementById("contact");
-    if (!section) return;
-    const navbar = document.querySelector("header");
-    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
-    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
-    window.scrollTo({ top: Math.max(0, sectionTop - navbarHeight - 16), behavior: "smooth" });
-  };
-
-  return (
-    <section id="industries" className="py-20 sm:py-28 bg-[#05070E] border-b border-white/[0.06] relative overflow-hidden scroll-mt-[80px]">
-      {/* Background ambient glow */}
-      <div className="absolute inset-0 pointer-events-none">
-        <div
-          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[80px] lg:blur-[180px] transition-colors duration-1000"
-          style={{ background: `${activeWorkflow.accent}08` }}
-        />
-      </div>
-
-      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
-        {/* Section Header */}
-        <div className="max-w-3xl mx-auto text-center mb-16">
-          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">
-            Engineered For India
-          </p>
-          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-tight">
-            Built For The Way Indian Businesses{" "}
-            <span
-              style={{
-                backgroundImage: "linear-gradient(135deg, #06B6D4, #10B981)",
-                WebkitBackgroundClip: "text",
-                WebkitTextFillColor: "transparent",
-              }}
-            >
-              Actually Operate
-            </span>
-          </h2>
-          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
-            From local GST compliance and WhatsApp communication to driver mobile dispatch — every workflow is tuned to Indian business realities.
-          </p>
-        </div>
-
-        {/* 4 Core Foundation Pillars */}
-        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
-          {FOUNDATION_PILLARS.map((pillar) => {
-            const Icon = pillar.icon;
-            return (
-              <div
-                key={pillar.title}
-                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-colors flex flex-col justify-between"
-              >
-                <div>
-                  <div
-                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
-                    style={{
-                      background: `${pillar.accent}15`,
-                      borderColor: `${pillar.accent}35`,
-                      color: pillar.accent,
-                    }}
-                  >
-                    <Icon className="w-5 h-5" />
-                  </div>
-                  <h3 className="text-sm font-bold text-white mb-2 leading-snug flex items-center gap-2">
-                    <span>{pillar.title}</span>
-                    {pillar.badge && (
-                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
-                        {pillar.badge}
-                      </span>
-                    )}
-                  </h3>
-                  <p className="text-xs leading-relaxed text-slate-300">
-                    {pillar.desc}
-                  </p>
-                </div>
-              </div>
-            );
-          })}
-        </div>
-
-        {/* ========================================================
-            INTERACTIVE OPERATIONAL WORKFLOW SHOWCASE
-           ======================================================== */}
-        <div className="max-w-4xl mx-auto">
-          {/* Industry Tab Triggers */}
-          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 justify-start sm:justify-center">
-            {INDUSTRY_WORKFLOWS.map((wf) => {
-              const isActive = wf.id === activeWorkflowId;
-              const Icon = wf.icon;
-              return (
-                <button
-                  key={wf.id}
-                  type="button"
-                  onClick={() => setActiveWorkflowId(wf.id)}
-                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
-                  style={{
-                    background: isActive ? `${wf.accent}20` : "rgba(255,255,255,0.03)",
-                    border: `1px solid ${isActive ? `${wf.accent}60` : "rgba(255,255,255,0.08)"}`,
-                    color: isActive ? "#FFFFFF" : "#94A3B8",
-                    boxShadow: isActive ? `0 0 20px ${wf.accent}25` : "none",
-                  }}
-                >
-                  <Icon className="w-4 h-4" style={{ color: isActive ? wf.accent : undefined }} />
-                  <span>{wf.name}</span>
-                </button>
-              );
-            })}
-          </div>
-
-          {/* Workflow Stage Container */}
-          <div
-            className="rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all duration-500"
-            style={{
-              background: "#080c16",
-              border: `1px solid ${activeWorkflow.accent}45`,
-              boxShadow: `0 24px 60px -15px ${activeWorkflow.accent}20, 0 0 0 1px rgba(255,255,255,0.05)`,
-            }}
-          >
-            {/* Top highlight bar */}
-            <div
-              className="absolute top-0 left-0 right-0 h-px"
-              style={{ background: `linear-gradient(90deg, transparent, ${activeWorkflow.accent}, transparent)` }}
-            />
-
-            {/* Workflow Header */}
-            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.07]">
-              <div>
-                <span
-                  className="text-xs font-mono font-bold uppercase tracking-wider block mb-1"
-                  style={{ color: activeWorkflow.accent }}
-                >
-                  DAILY OPERATIONAL LIFECYCLE
-                </span>
-                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
-                  {activeWorkflow.name}
-                </h3>
-                <p className="text-xs sm:text-sm text-slate-300 mt-1">
-                  {activeWorkflow.tagline}
-                </p>
-              </div>
-
-              <div
-                className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border"
-                style={{
-                  background: `${activeWorkflow.accent}15`,
-                  borderColor: `${activeWorkflow.accent}40`,
-                  color: activeWorkflow.accent,
-                }}
-              >
-                <Sparkles className="w-3.5 h-3.5" />
-                <span>Powered by {activeWorkflow.product}</span>
-              </div>
-            </div>
-
-            {/* 3-Step Connected Journey */}
-            <div className="space-y-4 mb-8">
-              {activeWorkflow.steps.map((st, idx) => (
-                <div
-                  key={idx}
-                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
-                >
-                  <div className="flex items-center gap-3">
-                    <span
-                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
-                      style={{
-                        background: `${activeWorkflow.accent}20`,
-                        color: activeWorkflow.accent,
-                        border: `1px solid ${activeWorkflow.accent}40`,
-                      }}
-                    >
-                      {idx + 1}
-                    </span>
-                    <span className="text-sm font-bold text-white">{st.step}</span>
-                  </div>
-                  <p className="text-xs sm:text-sm text-slate-300 sm:max-w-md">
-                    {st.detail}
-                  </p>
-                </div>
-              ))}
-            </div>
-
-            {/* Bottom CTA */}
-            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.07]">
-              <span className="text-xs text-slate-400">
-                Customized for your business structure during the 14-day setup.
-              </span>
-              <button
-                type="button"
-                onClick={handleConsultation}
-                className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
-                style={{
-                  background: `linear-gradient(135deg, ${activeWorkflow.accent}, ${activeWorkflow.accent}CC)`,
-                  boxShadow: `0 6px 24px ${activeWorkflow.accent}40`,
-                }}
-              >
-                <span>See {activeWorkflow.product} in Action</span>
-                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
-              </button>
-            </div>
-          </div>
-        </div>
-      </div>
-    </section>
-  );
-}
diff --git a/components/home/PricingSection.jsx b/components/home/PricingSection.jsx
index 9e293bf..7160afe 100644
--- a/components/home/PricingSection.jsx
+++ b/components/home/PricingSection.jsx
@@ -1,8 +1,7 @@
 // components/home/PricingSection.jsx
 // "Get the best price for your business": no prices are shown anywhere on the site. Pricing
 // depends on the product, users, branches and setup needs, and is quoted on a short call.
-// Shows what each plan includes (Starter, Growth, Enterprise), an expandable comparison matrix,
-// and trust guarantees.
+// Shows what each plan includes (Starter, Growth), taken from lib/pricing.js.
 //
 // `plans` and `productSetups` come from the server page with the price fields stripped, so the
 // numbers in lib/pricing.js never reach this client bundle.
@@ -11,7 +10,7 @@
 
 import { useState } from "react";
 import PricingCallButton from "@/components/home/PricingCallButton";
-import { Check, ChevronDown, ArrowRight, Package, Users, Building2, Wrench, ShieldCheck, Clock, Download } from "lucide-react";
+import { Check, ChevronDown, ArrowRight, Package, Users, Building2, Wrench } from "lucide-react";
 
 // What a quote depends on
 const PRICE_FACTORS = [
@@ -22,45 +21,10 @@ const PRICE_FACTORS = [
 ];
 
 // Feature comparison matrix rows
-const COMPARISON_MATRIX = [
-  {
-    category: "Scale & Capacity",
-    features: [
-      { name: "Active User Accounts", starter: "Up to 5 Users", growth: "Up to 20 Users", enterprise: "Unlimited Users" },
-      { name: "Branches & Locations", starter: "1 Single Branch", growth: "Multiple Branches", enterprise: "Unlimited Multi-Company" },
-      { name: "Mobile Field Access", starter: "Included", growth: "Role-Based Hierarchy", enterprise: "Custom Roles & Permissions" },
-    ],
-  },
-  {
-    category: "Financials & Compliance",
-    features: [
-      { name: "GST & Tax Invoicing", starter: "Standard GST Bills", growth: "E-Invoicing & E-Way Bills", enterprise: "Multi-GSTIN & Consolidated" },
-      { name: "Customer Ledgers", starter: "Standard", growth: "Real-time Multi-Branch Sync", enterprise: "Automated Bank Reconciliation" },
-      { name: "Automated Payment Links", starter: "UPI & Bank Transfer", growth: "Automated Reminders", enterprise: "Custom Payment Gateway / Escrow" },
-    ],
-  },
-  {
-    category: "Implementation & Support",
-    features: [
-      { name: "White-Glove Setup", starter: "One-time, quoted on your call", growth: "One-time, quoted on your call", enterprise: "Custom Architect Included" },
-      { name: "Legacy Data Migration", starter: "Excel & Customer Lists", growth: "Full Tally & Ledger History", enterprise: "Custom ERP & Database Bridge" },
-      { name: "Implementation SLA", starter: "14-Day Target", growth: "14-Day Target", enterprise: "Dedicated Sprint Schedule" },
-      { name: "Support Channels", starter: "Phone, Email & WhatsApp", growth: "Priority Support Line", enterprise: "Dedicated Account Manager" },
-    ],
-  },
-];
 
-const ENTERPRISE_FEATURES = [
-  "Unlimited branches & staff accounts",
-  "Dedicated cloud database",
-  "Custom module development & API webhooks",
-  "On-site staff & management training",
-  "Priority support — direct founder line, business hours",
-];
 
 export default function PricingSection({ plans, productSetups }) {
   const [openAccordions, setOpenAccordions] = useState({ starter: false, growth: false });
-  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
 
   const starter = plans.find((p) => p.key === "starter");
   const growth = plans.find((p) => p.key === "growth");
@@ -130,9 +94,9 @@ export default function PricingSection({ plans, productSetups }) {
         </div>
 
         {/* ========================================================
-            WHAT EACH PLAN INCLUDES: STARTER, GROWTH, ENTERPRISE
+            WHAT EACH PLAN INCLUDES: STARTER, GROWTH
            ======================================================== */}
-        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch mb-16">
+        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch mb-16">
           {/* 1. STARTER PLAN */}
           <article
             className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#080C16] border border-white/[0.10] hover:border-white/[0.20] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
@@ -260,145 +224,16 @@ export default function PricingSection({ plans, productSetups }) {
               </PricingCallButton>
             </div>
           </article>
-
-          {/* 3. ENTERPRISE / SCALE */}
-          <article
-            className="relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#080C16] border border-white/[0.10] hover:border-white/[0.20] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
-          >
-            <div>
-              {/* Badge & Name */}
-              <div className="flex items-center justify-between mb-4">
-                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
-                  Enterprise
-                </h3>
-                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-[10px] font-bold tracking-wider text-violet-300 uppercase">
-                  Custom Scale
-                </span>
-              </div>
-
-              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 min-h-[40px]">
-                For corporations requiring 20+ users, custom ERP integrations, or dedicated cloud instances.
-              </p>
-
-              {/* Key Features */}
-              <ul className="space-y-3 mb-8">
-                {ENTERPRISE_FEATURES.map((f) => (
-                  <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
-                    <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
-                    <span>{f}</span>
-                  </li>
-                ))}
-              </ul>
-            </div>
-
-            <div>
-              {/* Value summary box */}
-              <div className="rounded-2xl p-4 mb-5 border border-white/[0.08] bg-white/[0.02]">
-                <div className="flex items-baseline justify-between mb-1.5">
-                  <span className="text-xs text-slate-400">Implementation Scope</span>
-                  <span className="text-sm font-bold text-white font-mono">Dedicated Architect</span>
-                </div>
-                <p className="text-[11px] text-slate-400">
-                  Full custom legacy database bridge and tailored workflow design included.
-                </p>
-              </div>
-
-              <PricingCallButton
-                planName="Enterprise"
-                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/[0.30] transition-all flex items-center justify-center gap-2 cursor-pointer"
-              >
-                <span>Talk to Founders</span>
-                <ArrowRight className="w-4 h-4" aria-hidden="true" />
-              </PricingCallButton>
-            </div>
-          </article>
-        </div>
-
-        {/* ========================================================
-            INTERACTIVE FULL FEATURE COMPARISON MATRIX
-           ======================================================== */}
-        <div className="max-w-4xl mx-auto mb-16">
-          <div className="text-center mb-6">
-            <button
-              type="button"
-              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
-              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 bg-white/[0.03] border border-white/[0.10] hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all cursor-pointer"
-            >
-              <span>{isMatrixOpen ? "Hide Detailed Feature Matrix" : "Compare All Plan Features & Limits"}</span>
-              <ChevronDown
-                className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
-                  isMatrixOpen ? "rotate-180" : ""
-                }`}
-              />
-            </button>
-          </div>
-
-          {isMatrixOpen && (
-            <div className="rounded-3xl p-6 sm:p-8 bg-[#080C16] border border-white/[0.08] shadow-2xl overflow-x-auto animate-fade-in">
-              <table className="w-full text-left text-xs sm:text-sm">
-                <thead>
-                  <tr className="border-b border-white/[0.10] text-slate-400">
-                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px]">Feature Capability</th>
-                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-slate-200">Starter</th>
-                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-cyan-300">Growth</th>
-                    <th className="pb-4 font-bold uppercase tracking-wider text-[11px] text-violet-300">Enterprise</th>
-                  </tr>
-                </thead>
-                <tbody className="divide-y divide-white/[0.06]">
-                  {COMPARISON_MATRIX.map((group) => (
-                    <tr key={group.category} className="group/row">
-                      <td colSpan={4} className="pt-6 pb-2">
-                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
-                          {group.category}
-                        </span>
-                        <div className="mt-2 space-y-2.5">
-                          {group.features.map((feat) => (
-                            <div key={feat.name} className="grid grid-cols-4 py-2 border-b border-white/[0.04] text-xs">
-                              <span className="text-slate-300 font-medium">{feat.name}</span>
-                              <span className="text-slate-400">{feat.starter}</span>
-                              <span className="text-slate-200 font-semibold">{feat.growth}</span>
-                              <span className="text-violet-300 font-semibold">{feat.enterprise}</span>
-                            </div>
-                          ))}
-                        </div>
-                      </td>
-                    </tr>
-                  ))}
-                </tbody>
-              </table>
-            </div>
-          )}
-        </div>
-
-        {/* ========================================================
-            TRUST & SECURITY GUARANTEE BADGES
-           ======================================================== */}
-        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
-          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
-            <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
-            <p className="text-xs font-bold text-white mb-0.5">GST ITC Invoices</p>
-            <p className="text-[11px] text-slate-400">GST-compliant billing</p>
-          </div>
-          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
-            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
-            <p className="text-xs font-bold text-white mb-0.5">14-Day Setup Target</p>
-            <p className="text-[11px] text-slate-400">Typical white-glove setup timeline</p>
-          </div>
-          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
-            <Download className="w-5 h-5 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
-            <p className="text-xs font-bold text-white mb-0.5">1-Click Data Export</p>
-            <p className="text-[11px] text-slate-400">Never locked in, own your data</p>
-          </div>
         </div>
 
         {/* Product Setup Focus Details */}
         {productSetups.length > 0 && (
           <div className="max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-[#0A0F1D]/80 p-6 sm:p-8">
             <h3 className="text-base font-bold text-white mb-1">
-              White-Glove Setup is Custom-Tailored to Your Trade
+              Setup is tailored to your trade
             </h3>
             <p className="text-xs sm:text-sm text-slate-400 mb-5">
-              During the 14-day onboarding, our engineers configure workflows specific to your product:
+              During setup, our team configures workflows specific to your product:
             </p>
             <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
               {productSetups.map(({ slug, name, items }) => (
diff --git a/components/home/ProductShowcase.jsx b/components/home/ProductShowcase.jsx
index 16930ae..b1f8b7f 100644
--- a/components/home/ProductShowcase.jsx
+++ b/components/home/ProductShowcase.jsx
@@ -39,7 +39,7 @@ const SHOWCASE_PRODUCTS = [
 
 // Product accent palette & category metadata inspired by ZenXAI visual tokens
 const PRODUCT_ACCENTS = {
-  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   label: "BUSINESS PLATFORM", icon: Cpu, replaces: "Excel + WhatsApp + Standalone Tally" },
+  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   label: "BUSINESS PLATFORM", icon: Cpu, replaces: "Excel + WhatsApp + separate billing software" },
   "transposs":     { accent: "#3B82F6", accent2: "#6366F1", glow: "rgba(59,130,246,0.25)",  label: "FLEET MANAGEMENT",  icon: Truck, replaces: "Paper logbooks + WhatsApp driver dispatch" },
   "tours-travels": { accent: "#8B5CF6", accent2: "#A855F7", glow: "rgba(139,92,246,0.25)",  label: "TRAVEL & TOURISM",  icon: Plane, replaces: "Word doc quotations + scattered email PDFs" },
   "aqua-erp":      { accent: "#38BDF8", accent2: "#0284C7", glow: "rgba(56,189,248,0.25)",  label: "WATER OPERATIONS",  icon: Activity, replaces: "Pocket diary route delivery records" },
@@ -49,7 +49,7 @@ const PRODUCT_ACCENTS = {
   "college":       { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)",  label: "COLLEGE ERP",       icon: School, replaces: "Legacy college servers + manual desk fees" },
   "pg-management": { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  label: "HOSPITALITY",       icon: Building, replaces: "Paper rent registers + cash deposit slips" },
   "resort":        { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  label: "RESORT SUITE",      icon: Building, replaces: "Separate booking calendar + desk invoices" },
-  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck, replaces: "Manual E-Way bill entry + offline tracking" },
+  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck, replaces: "Paper delivery records + phone calls to drivers" },
   "gym":           { accent: "#10B981", accent2: "#059669", glow: "rgba(168,185,129,0.25)",  label: "FITNESS & WELLNESS", icon: Activity, replaces: "Card-based membership logs" },
   "salon":         { accent: "#EC4899", accent2: "#DB2777", glow: "rgba(236,72,153,0.25)",  label: "BEAUTY & SALON",    icon: Users, replaces: "Paper appointment books" },
   "medical":       { accent: "#EF4444", accent2: "#DC2626", glow: "rgba(239,68,68,0.25)",   label: "HEALTHCARE",        icon: Shield, replaces: "Handwritten prescription pads + desk billing" },
@@ -311,7 +311,7 @@ function ProductDeepDiveModal({ product, onClose, onBookDemo }) {
         <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-6">
           <span className="flex items-center gap-2">
             <Clock className="w-4 h-4" />
-            White-glove data migration &amp; live setup — typically within 14 days
+            Setup typically takes about 14 days. This is a target, not a guarantee.
           </span>
           <span className="font-bold">Managed Setup</span>
         </div>
````
