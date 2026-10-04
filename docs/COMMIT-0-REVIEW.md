# Commit 0 Review: Remove Unbacked Homepage Claims

**Commit:** `510c254` on `main`, local only, **not pushed or deployed**
**Date:** 4 October 2026
**Status:** waiting for your review before deploy. The rest of the restructure has not started.
**Checks:** `npm run build`, lint and all 76 tests pass. The built homepage HTML was scanned for leftover claims.

Full line-by-line diff: [COMMIT-0-FULL-DIFF.md](COMMIT-0-FULL-DIFF.md)

---

## What changed

| Area | Change |
|---|---|
| Comparison section | **Deleted** (`ComparisonSection.jsx`). Built on unbacked features: "instant E-Way bill generation", automated low-stock alerts, P&L views, batch and expiry tracking. |
| Industries section | **Deleted** (`IndustryShowcase.jsx`). Built on unbacked features: "1-click IRN generation", "GSTR-1/3B reports", GPS logs, SMS alerts, barcode POS, bank reconciliation, parent portal. |
| Hero | Sample dashboard removed (made-up figures, "99.4% on time", IRN and e-way bill rows). The headline "Set Up for You in 14 Days." is now "Set Up for You.". Removed the ticks "Zero Double Data Entry", "GST & E-Invoicing Ready" and "Live Setup in 2 Weeks". "Dedicated Setup Support" now reads "Set up for you by our team". |
| Pricing | Removed the invented Enterprise tier (not in `lib/pricing.js`), the comparison table ("Dedicated Account Manager", "Priority Support Line", "E-Invoicing & E-Way Bills", "Custom Architect", "Unlimited Users") and the badges ("GST ITC Invoices", "14-Day Setup Target", "1-Click Data Export"). Starter and Growth remain. |
| How it works | "Typical Setup: 14 Days, Start to Finish" and "…in 14 days" now use the approved wording. "Dedicated" and "validation at every step" removed. The tag "Clean Ledgers · Role Permissions" is now "Data import · Configuration". |
| Product carousel | ZUGEE ERP / CRM no longer "replaces Standalone Tally", which contradicted "works alongside Tally". The Logistics e-way bill mention is removed. The 14-day line now uses the approved wording. |
| Final CTA | Removed "Setup in 2 weeks", "Typical Setup in 2 Weeks", "Role-Based Access" and "Built with input from Indian SME operators". |

The only setup timeline left anywhere on the homepage:

> Setup typically takes about 14 days. This is a target, not a guarantee.

**Links:** nothing linked to `#industries`. The whole codebase was searched, including legal pages and email templates. `#products`, `#how-it-works`, `#pricing`, `#faq` and `#contact` are unchanged.

---

## Not changed: needs your decision

1. **Plan features from `lib/pricing.js` still show on the homepage:** "Role-based permissions", "Automated follow-ups", "Advanced reports", and "Basic GST and business settings" in the setup list. That file is billing code, so it was not edited. They disappear when the new pricing section replaces the plan cards later in the restructure. If you want them gone in this deploy, the homepage can stop passing them in, without touching `lib/pricing.js`.
2. **The Terms page says "The product helps you produce GST invoices and reports."** That conflicts with the GST rule, because no product's module list includes GST. It is a legal page, so it was left for your decision.

---

## Readable diff

### Page, final CTA, how it works, product carousel

````diff
diff --git a/app/(marketing)/page.jsx b/app/(marketing)/page.jsx
index b5ec15b..52a39ba 100644
--- a/app/(marketing)/page.jsx
+++ b/app/(marketing)/page.jsx
@@ -5,4 +5,2 @@
 // Products → "These are the products"
-// Comparison → "This is the problem ZUGEE solves"
-// Industries → "This is how it fits my business"
 // How It Works → "This is how I use it"
@@ -17,4 +15,2 @@ import Hero from "@/components/home/Hero";
 import ProductShowcase from "@/components/home/ProductShowcase";
-import ComparisonSection from "@/components/home/ComparisonSection";
-import IndustryShowcase from "@/components/home/IndustryShowcase";
 import HowWeWork from "@/components/home/HowWeWork";
@@ -61,15 +57,9 @@ export default function HomePage() {
 
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
@@ -80,3 +70,3 @@ export default function HomePage() {
 
-      {/* 8. CTA — "I understand what I can do next" */}
+      {/* 6. CTA — "I understand what I can do next" */}
       <FinalCTA />
diff --git a/components/home/FinalCTA.jsx b/components/home/FinalCTA.jsx
index 0cb60d4..982c7ba 100644
--- a/components/home/FinalCTA.jsx
+++ b/components/home/FinalCTA.jsx
@@ -5,3 +5,3 @@ import { useState } from "react";
 import InteractiveMascot from "@/components/animations/InteractiveMascot";
-import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
+import { ArrowRight, Sparkles, Zap } from "lucide-react";
 
@@ -26,3 +26,3 @@ export default function FinalCTA() {
   const benefits = [
-    { icon: Sparkles, text: "Setup in 2 weeks" },
+    { icon: Sparkles, text: "Set up for you by our team" },
     { icon: Zap, text: "Clear quote on a short call" }
@@ -68,3 +68,3 @@ export default function FinalCTA() {
                 <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
-                  Built with input from Indian SME operators. Streamline operations, boost productivity, and scale smarter — with software designed around how Indian businesses actually work.
+                  Software designed around how Indian businesses actually work, set up for you by our team.
                 </p>
@@ -115,7 +115,2 @@ export default function FinalCTA() {
           <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
-            <div className="flex items-center gap-2">
-              <Shield className="w-4 h-4 text-cyan-400" />
-              <span>Role-Based Access</span>
-            </div>
-            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
             <div className="flex items-center gap-2">
@@ -127,7 +122,2 @@ export default function FinalCTA() {
             </div>
-            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
-            <div className="flex items-center gap-2">
-              <Sparkles className="w-4 h-4 text-cyan-400" />
-              <span>Typical Setup in 2 Weeks</span>
-            </div>
           </div>
diff --git a/components/home/HowWeWork.jsx b/components/home/HowWeWork.jsx
index 2169a6f..0667a06 100644
--- a/components/home/HowWeWork.jsx
+++ b/components/home/HowWeWork.jsx
@@ -3,3 +3,3 @@
 // responsive vertical mobile timeline, interactive hover/active states, and staggered scroll reveal.
-// Elevated to frame 14-day setup as a premier white-glove onboarding advantage.
+// The setup timeline must use the Terms wording: a target, not a guarantee.
 
@@ -32,4 +32,4 @@ const STEPS = [
     title: "White-Glove Data Migration",
-    description: "Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with validation at every step.",
-    tag: "Clean Ledgers · Role Permissions",
+    description: "Our team brings in your existing records, such as customer and item lists from Excel or Tally.",
+    tag: "Data import · Configuration",
     icon: Database,
@@ -39,4 +39,4 @@ const STEPS = [
     label: "LAUNCH",
-    title: "Go-Live & Dedicated Support",
-    description: "Your team receives guided mobile training. You begin billing and dispatching live with dedicated onboarding support.",
+    title: "Go-Live & Support",
+    description: "We train your team and you start using ZUGEE, with onboarding support from our team.",
     tag: "Live Operations · Ongoing Support",
@@ -108,3 +108,3 @@ export default function HowWeWork() {
           <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
-            You don&apos;t spend months wrestling with software configuration. Our team migrates your data and trains your staff in 14 days.
+            You don&apos;t spend months wrestling with software configuration. Our team moves your data across and trains your staff.
           </p>
@@ -248,3 +248,3 @@ export default function HowWeWork() {
               <p className="text-sm font-bold text-white">
-                Typical Setup: 14 Days, Start to Finish
+                Setup typically takes about 14 days. This is a target, not a guarantee.
               </p>
diff --git a/components/home/ProductShowcase.jsx b/components/home/ProductShowcase.jsx
index 16930ae..b1f8b7f 100644
--- a/components/home/ProductShowcase.jsx
+++ b/components/home/ProductShowcase.jsx
@@ -41,3 +41,3 @@ const SHOWCASE_PRODUCTS = [
 const PRODUCT_ACCENTS = {
-  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   label: "BUSINESS PLATFORM", icon: Cpu, replaces: "Excel + WhatsApp + Standalone Tally" },
+  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   label: "BUSINESS PLATFORM", icon: Cpu, replaces: "Excel + WhatsApp + separate billing software" },
   "transposs":     { accent: "#3B82F6", accent2: "#6366F1", glow: "rgba(59,130,246,0.25)",  label: "FLEET MANAGEMENT",  icon: Truck, replaces: "Paper logbooks + WhatsApp driver dispatch" },
@@ -51,3 +51,3 @@ const PRODUCT_ACCENTS = {
   "resort":        { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  label: "RESORT SUITE",      icon: Building, replaces: "Separate booking calendar + desk invoices" },
-  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck, replaces: "Manual E-Way bill entry + offline tracking" },
+  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  label: "LOGISTICS",         icon: Truck, replaces: "Paper delivery records + phone calls to drivers" },
   "gym":           { accent: "#10B981", accent2: "#059669", glow: "rgba(168,185,129,0.25)",  label: "FITNESS & WELLNESS", icon: Activity, replaces: "Card-based membership logs" },
@@ -313,3 +313,3 @@ function ProductDeepDiveModal({ product, onClose, onBookDemo }) {
             <Clock className="w-4 h-4" />
-            White-glove data migration &amp; live setup — typically within 14 days
+            Setup typically takes about 14 days. This is a target, not a guarantee.
           </span>
````

### Hero and pricing: lines added

These two files are mostly deletions of the blocks listed above. Only the added lines are shown here. See the full diff for everything removed.

````diff
diff --git a/components/home/Hero.jsx b/components/home/Hero.jsx
@@ -2,2 +2 @@
+// Hero. Message: specialised software for each industry, set up for you. Each ZUGEE product
@@ -6,15 +5 @@
+import { ArrowRight, CheckCircle2 } from "lucide-react";
@@ -23,56 +7,0 @@ import SmoothScrollLink from "@/components/layout/SmoothScrollLink";
@@ -80,3 +8,0 @@ export default function Hero() {
@@ -122 +48 @@ export default function Hero() {
+              Set Up for You.
@@ -157,12 +82,0 @@ export default function Hero() {
@@ -171 +85 @@ export default function Hero() {
+            Set up for you by our team
@@ -180,94 +93,0 @@ export default function Hero() {
diff --git a/components/home/PricingSection.jsx b/components/home/PricingSection.jsx
@@ -4,2 +4 @@
+// Shows what each plan includes (Starter, Growth), taken from lib/pricing.js.
@@ -14 +13 @@ import PricingCallButton from "@/components/home/PricingCallButton";
+import { Check, ChevronDown, ArrowRight, Package, Users, Building2, Wrench } from "lucide-react";
@@ -25,27 +23,0 @@ const PRICE_FACTORS = [
@@ -53,7 +24,0 @@ const COMPARISON_MATRIX = [
@@ -63 +27,0 @@ export default function PricingSection({ plans, productSetups }) {
@@ -133 +97 @@ export default function PricingSection({ plans, productSetups }) {
+            WHAT EACH PLAN INCLUDES: STARTER, GROWTH
@@ -135 +99 @@ export default function PricingSection({ plans, productSetups }) {
+        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch mb-16">
@@ -263,129 +226,0 @@ export default function PricingSection({ plans, productSetups }) {
@@ -398 +233 @@ export default function PricingSection({ plans, productSetups }) {
+              Setup is tailored to your trade
@@ -401 +236 @@ export default function PricingSection({ plans, productSetups }) {
+              During setup, our team configures workflows specific to your product:
````

---

## Next (after your go-ahead)

1. Groundwork: `availableProducts()` helper, product icon map, a `url` on each SoftwareApplication, Organization `telephone` removed.
2. Footer Contact column (email, Coimbatore, hours), with the public phone number removed from the legal pages, plus a test.
3. New Hero.
4. Find-your-industry grid and product details list (carousel removed).
5. Why Zugee (3 points).
6. How it works rewrite.
7. Pricing approach section.
8. FAQ edit and restyle.
9. Merged final CTA and contact section, plus a lead-form constraint test.
10. Cleanup: contrast and text-size fixes, reduced motion, sitemap date.
