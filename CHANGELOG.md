# Changelog

All notable changes to the ZUGEE website and platform. Newest first.

**Branches**
<<<<<<< Updated upstream
- **`phase-0-truth`** (pushed to `origin/phase-0-truth`) has the latest work: the new product-catalog homepage and the Phase 0 cleanup. **Not merged into `main` yet.**
=======
- **`phase-0-truth`** (pushed to `origin/phase-0-truth`) has the latest work: the new product-catalog homepage, the Phase 0 cleanup, and the pricing and setup fee (not committed yet). **Not merged into `main` yet.**
>>>>>>> Stashed changes
- **`main`** still serves the older GST-billing homepage (the 2026-09-25 18:18 entry below).

After switching branches, run `npm install`, because the two branches have different dependencies (`main` still uses framer-motion).

---

<<<<<<< Updated upstream
=======
## [Pricing & one-time setup fee] — 2026-09-25 · branch `phase-0-truth` · not committed yet

> **Pay once to get your business set up. Pay monthly to keep using ZUGEE.**

Monthly prices are **unchanged**. A separate **one-time Setup & Onboarding fee** was added.

| Plan | Monthly (recurring) | One-time setup | Starting today | Then |
|---|---|---|---|---|
| Starter | ₹1,999 | ₹4,999 | ₹6,998 | ₹1,999/month |
| Growth | ₹4,099 | ₹9,999 | ₹14,098 | ₹4,099/month |

Prices exclude GST (to be confirmed by the founder).

### Added
- **`lib/pricing.js`:** the only place prices live.
  - Both plans with monthly price, setup fee, features and what setup includes.
  - Product-specific overrides (`PRODUCT_PLAN_OVERRIDES`) and setup focus (`PRODUCT_SETUP_FOCUS`: Tours & Travels, Transposs, Resort).
  - Setup waiver reasons.
  - `calculateCharges`: first payment vs recurring.
- **Website pricing section:**
  - Starter and Growth cards show the monthly price with "+ ₹X one-time setup" directly underneath.
  - A "Starting today" total with its breakdown, then "Then ₹X/month".
  - A "What the setup includes" list, and "Get Started", which pre-fills the chosen plan in the demo form (`PlanButton.jsx`).
  - A "Setup is tailored to your product" block.
- **FAQ:** "What is the one-time setup fee?" and "Do I pay the setup fee again every month?" The numbers are read from `lib/pricing.js`.
- **`supabase/migrations/0001_subscriptions_setup_fee.sql`:**
  - `subscriptions` (prices copied at creation; setup status pending/paid/waived/refunded; waiver reason, who and when; start and renewal dates).
  - `subscription_payments` (setup and monthly payments as separate rows).
  - The database allows only **one** setup payment per subscription.
  - Setup status can't go backwards, and prices can't be edited after creation.
  - Customers can only view their own rows; no customer writes at all.
  - Existing customers are backfilled with the setup fee **waived (existing customer)**, so nobody is charged unexpectedly.
- **`lib/subscriptions.js`:** server-only data layer with the same rules enforced in code: setup charged once, renewals at the monthly price only, waivers only while setup is pending. It has an in-memory dev store that starts empty.
- **Admin, `/admin/subscriptions`:**
  - List with customer, product, plan, monthly fee, setup fee, setup status, subscription status, start and renewal dates.
  - "New subscription" form showing the first payment and "Then ₹X/month".
  - Actions: record setup payment, waive setup fee (with reason), record monthly payment, change status.
  - "Create subscription" link on each lead.
  - Leads / Subscriptions navigation.
  - API: `/api/admin/subscriptions` and `/api/admin/subscriptions/[id]` (admin session required; prices and statuses can never be sent by the client).
- **Customer billing, `/app/back-office/billing`:**
  - Plan and monthly price.
  - Setup shown as Pending, ✓ Completed or Waived.
  - The initial payment appears only while setup is pending; next renewal at the monthly price.
  - Component: `components/app/SubscriptionSummary.jsx`.
- **Tests:** `npm test` runs 22 tests (Node's built-in runner) across `tests/pricing.test.mjs` and `tests/subscriptions.test.mjs`.

### Changed
- **Homepage pricing:** replaced the "quote depends on…" block with the two plan cards.
- **Demo form:** "Get Started" on a plan pre-fills "I'm interested in the … plan" in the demo form.
- **Docs:**
  - `ZUGEE-PROJECT-DOCUMENTATION.md` gained section 6a (pricing rules, where pricing appears, the demo-led sales flow).
  - `README.md` covers the migration run order, the new routes and `npm test`.
  - `docs/ZUGEE-PLATFORM-PLAN.md` records Phase 6 progress.
  - `docs/UI_IMPROVEMENTS.md` covers the billing summary.

### Not built yet
- **Online checkout or payment gateway:** Razorpay is Phase 6. Until then, admins record payments the team collects (UPI or bank transfer).
- **Invoices** with separate "Setup" and "Subscription" line items.
- **Customer access to the billing page:** customer login is still broken (Phase 1).
- **Real-database test of the migration:** it hasn't been run against a real Supabase database yet, so test it on a copy first.

### Verified
- `npm test`: 22/22 pass.
- `eslint` is clean.
- `npm run build` passes with no env vars.
- Over the API:
  - no admin session returns 401
  - Growth's first payment is ₹14,098
  - a waiver makes the setup payable ₹0
  - a second setup payment is refused (409)
  - a monthly payment records ₹4,099 only and moves the renewal date forward one month

---

>>>>>>> Stashed changes
## [Phase 0 — Truth & cleanup] — 2026-09-25 · commit `eba54fa` · branch `phase-0-truth`

The site was restructured from a single "GST billing software" product into the **ZUGEE multi-product platform**, following the Product Suite Restructuring brief. Anything that wasn't true or didn't work was removed or marked Coming Soon. 83 files changed (+2,220 / −7,492 lines).

### Added
- **`docs/ZUGEE-PLATFORM-PLAN.md`:** the architecture audit and roadmap:
  - current architecture and problems found
  - target platform (one ZUGEE account, organizations, branches, roles, products connected by SSO)
  - database and API changes
  - phases 0–8
- **`lib/products.js`:** single product catalog with statuses. It feeds the homepage, the lead form, the admin filter and the search engine data.
  - **Available** (confirmed ready by the founder; sold through a live demo): ZUGEE ERP/CRM, Transposs, Tours & Travels CRM, Aqua ERP, Real Estate ERP, ManuFlow, School ERP, College Management, PG Management, Resort Management.
  - **Coming Soon:** Logistics, Gym, Salon, Medical CRM, Civil Construction, Warehouse, Task Management.
- **New homepage sections:**
  - Products grid (`ProductsSection.jsx`)
  - How it works (`HowWeWork.jsx`)
  - "Book a demo" button on each product card that pre-selects the product in the form (`ProductInterestButton.jsx`)
- **`lib/site-content.js`:** "How it works" steps and the FAQ (also used for the FAQ search-engine data).
- **`components/app/ComingSoon.jsx`:** shared "Coming Soon" screen for unfinished app modules.
- **`public/og.jpg`:** new 1200×630 share image (51 KB) with the mascot and the new headline.
- **Security headers** on every page:
  - X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
  - HSTS in production
  - a report-only Content Security Policy
  - `X-Powered-By` removed

### Changed
- **Homepage:**
  - New hero: "Business software built for the way your business operates."
  - Buttons: **Explore Products** and **Book a Demo**.
  - Every call to action now says **Book a Demo**. After a form is sent, the team calls or WhatsApps to arrange a demo meeting.
- **Pricing:** no fixed plans; explains what a quote depends on and has a "Get a quote" button.
- **FAQ:** rewritten to four honest questions.
- **Lead form:**
  - Required: name, **mobile/WhatsApp** and business type.
  - Optional: email, company and requirement.
  - The "corporate email" rejection is gone; Gmail is accepted.
- **Lead database (`supabase/schema.sql`):**
  - Phone is required, email is optional, and a `company_name` column was added.
  - The migration SQL for an existing database is at the bottom of the file.
- **Admin portal:**
  - Filters by the new business types and shows company and phone.
  - Older leads keep a "(legacy)" label.
- **Navbar and footer:**
  - New links: Products, How it works, Pricing, FAQ.
  - The footer is now a lighter server component and lists the Available products.
- **Logo:**
  - The fake "Core Online" pulsing dot and the "Engineered for operational precision" tagline are removed.
  - Only the navbar logo preloads (using Next 16's `preload` prop).
- **Site metadata:**
  - New title, description and share image.
  - Language set to `en-IN`.
  - robots.txt hides `/app`.
  - The sitemap uses a fixed date.
- **Product app (`/app`):**
  - GST, Reports, Ads, Billing, Inventory and Employees show **Coming Soon** instead of fake screens.
  - The dashboard shows only real CRM lead counts: total, new today, follow-ups due, converted.
  - CRM editing only accepts allowed fields, and a bug where switching leads mid-edit overwrote the previous lead is fixed.
  - The top bar no longer shows a fake "System Live" badge, notification dot, or buttons that do nothing.
  - Sign-up pages no longer promise a free trial or WhatsApp features.
- **`supabase/app-schema.sql`:**
  - Runs on a fresh database.
  - The dashboard views that leaked every customer's figures are removed.
  - Customers can no longer change their own plan or trial dates.
- **`lib/app-auth.js`:** no longer crashes on import, so **`npm run build` now passes with no environment variables**.
- **Docs:**
  - `ZUGEE-PROJECT-DOCUMENTATION.md` rewritten as v2.0 (brand, voice, claim rule, site structure).
  - `README.md` and `docs/UI_IMPROVEMENTS.md` updated.
  - `docs/AI_INSIGHTS_SETUP.md` and `docs/OAUTH_SETUP.md` marked as removed and to be rebuilt.

### Removed
- **False or unbuilt claims:**
  - GST invoicing, e-invoice, Tally export, GSTR-1 and WhatsApp reminders
  - "backed up automatically"
  - the 14-day free trial
  - fixed prices of ₹1,999 and ₹4,099
  - the "Results from real customers" section, which had no customers
  - the sample GST dashboard
  - the "Why owners switch" section
- **Fake numbers in `/app`:**
  - GST input credit calculated as tax × 0.6
  - hardcoded trends (+12%, +8%…)
  - a fixed marketing funnel
  - "AI insights" with invented statistics
  - the placeholder customer ID `customer-uuid-here`
- **Unsafe API routes:**
  - reports: no login check, and any customer's data could be read
  - ad-account OAuth: could be hijacked
  - insights compute
  - GST
  - ads campaigns
- **Newsletter:** the footer signup and the `/api/subscribe` route.
- **framer-motion:** the mobile menu now uses a CSS fade.
- **Dead code:** `lib/verticals.js`, `MotionReveal`, `MotionProvider`, `PrecisionIcons`, `SpotlightCard`, and unused CSS (marquee, laser dot, eyebrow, glow classes).
- **About 2.2 MB of unused images:** `og-image.png`, `zugee-brand-banner.png`, `zugee-mascot-3d.png`, `mascot.svg`.

### Still to do
- **Rotate the OmniCore SSO secret:** it's committed in `omnicore-git/SSO-CONNECT.md`, a separate repo.
- **Add real trust details:** phone, WhatsApp, address, founder names, plus `/privacy` and `/terms` pages. The sign-up form already refers to terms that don't exist yet.
- **Confirm the module tags** on each product card match what the demo shows (`lib/products.js`).
- **Decide Logistics' status:** the brief lists it as both ready and future.
- **Phase 1:** rebuild customer login (it doesn't work yet), with a Supabase project in `.env.local`.
- **Check the site on a real phone.**

---

## [Mascot logo & app UI pass] — 2026-09-25 18:18 · commit `d88800c` · branch `main`

40 files changed (+805 / −720 lines).

### Added
- **Mascot as the logo everywhere:**
  - Head and chest crop (`public/zugee-mascot-icon.png`) in the navbar, footer, admin, app sidebar and sign-in pages.
  - New favicon set: `app/favicon.ico`, `icon-192.png`, `apple-touch-icon.png`.
  - Full floating mascot with a transparent background (`public/zugee-mascot-cutout.webp`) beside the contact form on desktop.

### Changed
- **In-app UI consistency pass** (from `docs/UI_IMPROVEMENTS.md`): CRM, Ads, GST, Reports, Back Office, the KPI card, empty states, the loading spinner and the top bar. It covers spacing, rounded cards, focus rings and screen-reader labels.
- **Marketing copy:** the "14-day free trial" line was replaced with "Free 2-week setup with your real data".
- **Docs:**
  - `ZUGEE-PROJECT-DOCUMENTATION.md` updated for the mascot and fonts, with the IGST typo fixed.
  - `README.md` explains that `/app` needs Supabase.
  - `CLAUDE.md` points to the project documentation.

### Removed
- The old ribbon "Z" SVG logo and `public/favicon.svg`.

---

## [Initial import] — 2026-09-25 06:20 · commit `e8f2d6e`

Cloned from `github.com/Sakthisugesh75/zugee`. It had the GST-billing marketing site, the lead form and admin portal, and a partially built `/app` product (CRM, ads, GST, reports).
