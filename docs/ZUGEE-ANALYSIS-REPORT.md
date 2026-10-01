# ZUGEE Project Analysis Report

**Date:** 2026-10-01 · **Scope:** this repository at commit `07bb83a` (28 Sep 2026)

## Summary

The marketing site, lead capture and admin portal work and are well built. The customer app under `/app` cannot be logged into, and the homepage makes claims the code does not back up.

Four things matter most:

1. **Customer login never succeeds.** The server reads the session without cookies, so every `/app` page redirects back to the sign-in screen.
2. **Signup is open and unthrottled**, and creates accounts that can never be used.
3. **The homepage states features and numbers as fact** that the project's own rules say must be labelled "Coming Soon": e-invoicing, GSTR reports, India-only hosting, backups, "90% Faster Invoicing".
4. **Annual billing is advertised as the default** but the database and admin tool only support monthly.

This report is based on reading the code, schema and docs, then running tests, lint, audit and a production build.

## What the project is

ZUGEE is a single Next.js application with three surfaces: a public marketing homepage, an internal admin portal, and the start of a customer app.

| Item | Detail |
| --- | --- |
| Framework | Next.js 16.3.5 (App Router, Turbopack), React 19.2.8 |
| Styling | Tailwind CSS 4, fonts Plus Jakarta Sans and JetBrains Mono |
| Data | Supabase Postgres via `@supabase/supabase-js` 2.x |
| Email | nodemailer 10 (Gmail or any SMTP) |
| Icons | lucide-react |
| Language | Plain JavaScript (JSX), no TypeScript |
| Tests | Node's built-in test runner, 3 test files |
| Size | 123 tracked files, about 14,400 lines of code and SQL |
| History | 12 commits, 25 to 28 Sep 2026, one author; 9 of 12 messages are "push" |
| Branches | `main`, plus `origin/phase-0-truth` |
| Remote | `github.com/Sakthisugesh75/zugee` |

**Folder structure**

| Path | Contents |
| --- | --- |
| `app/(marketing)/` | Public layout (navbar, footer) and the homepage |
| `app/admin/` | Admin login, lead dashboard, subscriptions |
| `app/app/` | Customer app: auth pages and the dashboard group |
| `app/api/` | 12 route handlers: 1 public, 4 admin, 7 customer |
| `components/home/` | 15 homepage section components |
| `components/admin/` | Login form, nav, subscriptions manager |
| `components/app/` | Sidebar, top bar, auth form, KPI card, CRM list and detail |
| `components/animations/`, `layout/`, `ui/` | Mascot, scroll helpers, navbar, footer, logo, status badge |
| `lib/` | 12 modules: auth, data access, pricing, products, email, rate limit |
| `supabase/` | `schema.sql`, `app-schema.sql`, one migration |
| `tests/` | `pricing`, `subscriptions`, `email` |
| `docs/` | Platform plan plus three setup and UI notes |

The governing document is `docs/ZUGEE-PLATFORM-PLAN.md`. It defines eight phases; Phase 0 (truth and cleanup) is marked done, Phase 1 (authentication) is next, and Phase 6 (billing) was started early.

## Check results

Tests and the production build pass; lint fails with 5 errors and the dependency audit reports one critical advisory.

| Check | Result |
| --- | --- |
| `npm test` | 30 of 30 pass |
| `next build` with no environment variables | Passes; 30 routes generated |
| `eslint .` | 5 errors, 2 warnings, in 4 files |
| `npm audit --omit=dev` | 1 critical advisory on `next` 16.3.5 (remote code execution in `next/og` ImageResponse), fixed in 16.3.8 |
| Secrets in git history | None found; only placeholders in `.env.example` and `setup-admin.ps1` |

The project does not import `next/og`, so the advisory is unlikely to be exploitable here, but the fix is a patch upgrade.

**Lint errors**

| File | Problem |
| --- | --- |
| `components/animations/AnimatedSection.jsx` | `setState` called directly in an effect; stale ref in cleanup (warning) |
| `components/animations/StaggeredGroup.jsx` | Same two problems |
| `components/animations/InteractiveMascot.jsx` | `setState` called directly in an effect |
| `components/home/IndustryProductsSection.jsx` | Two unescaped apostrophes |

Three of these four files have no importers, so deleting dead code clears four of the five errors.

**What the 30 tests cover**

| File | Tests | Covers |
| --- | --- | --- |
| `tests/pricing.test.mjs` | 9 | Published prices, first payment, waivers, discount limits, rupee formatting |
| `tests/subscriptions.test.mjs` | 13 | Create, setup fee paid once, waive rules, monthly payments, duplicates, month-end dates |
| `tests/email.test.mjs` | 8 | Payload building, WhatsApp number cleaning, behaviour with no SMTP configured |

Nothing tests the API routes, lead validation, admin auth or customer auth. There is no CI configuration in the repository.

## Public website content

The public site is one page at `/` with nine sections, a navbar and a footer. `robots.txt` blocks `/admin`, `/app` and `/api`; the sitemap lists only the homepage.

**Page metadata**

- Title: "ZUGEE — Business Software for Indian Businesses"
- Description: "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more."
- Share title: "ZUGEE — Business software built for the way your business operates"
- Legal name used: "Zugee Systems Technologies Pvt. Ltd."
- Structured data: Organization and FAQPage, generated from the same FAQ list the page renders

**Navbar:** Products, How it works, Pricing, FAQ, and a "Book a Demo" button. All links scroll within the page.

### 1. Hero

- Badge: "UNIFIED BUSINESS OPERATING SYSTEM"
- Headline: "Replace 5 Disconnected Tools with One Operating System."
- Subhead: "Your staff re-enters the same customer into WhatsApp, Excel, and Tally. Orders slip through cracks. Nobody knows job status without calling 3 people. ZUGEE connects CRM, billing, inventory, and dispatch in one central database — built for Indian businesses."
- Button: "Book a 1-on-1 Live Demo"
- Four badges: "Zero Double Data Entry", "GST & E-Invoicing Ready", "Live Setup in 2 Weeks", "Data Stored in India"
- Note: "Today, each ZUGEE product runs as its own connected system. A single login across all products is coming soon."
- A tabbed dashboard preview labelled "SAMPLE DASHBOARD VIEW — ILLUSTRATIVE DATA ONLY"

| Preview tab | Headline stat | Sample rows |
| --- | --- | --- |
| CRM & Sales | 148 Active Leads, +24% this week | Apex Builders, Royal Logistics, Sunrise Packaged Waters |
| Fleet Dispatch | 38 Active Trips, 99.4% on time | Three vehicles with "Live GPS", fuel and e-way bill details |
| GST Billing | ₹28.4L Billed Today, GST Compliant | Three invoices, including "E-Invoice QR Generated" and "IRN Active" |
| Inventory Sync | 4 Warehouses Live, 0 Low-Stock Breaches | Raw material batch, water cans, finished SKUs |

### 2. Product showcase

Heading "Product Ecosystem — Software built around your business". One product is shown at a time with its status chip, description, "Key Capabilities", "Included Functional Modules" and a "Replaces Legacy Tools" line. Available products come first, then Coming Soon. The full catalog is in the Product catalog section below.

### 3. Comparison: "The Chaos of 5 Apps" against "The ZUGEE Unified Engine"

| Tab | Claimed cost of the old way | Claimed ZUGEE result |
| --- | --- | --- |
| Operations & Workflows | "14+ hours lost weekly per manager in manual status checks" | "100% Real-Time Visibility • Zero Phone Tag Between Departments" |
| Billing & GST | "Delayed cash flow and frequent payment leakages" | "90% Faster Invoicing • Real-Time Debtor Balance" |
| Sales & Leads | "Up to 35% of inbound inquiries lost to competitor delays" | "100% Customer History Owned by Company • 2x Follow-up Speed" |
| Inventory & Stock | "Dead capital tied in stock + frequent customer order cancellations" | "Real-Time Stock Valuation • Zero Accidental Over-Selling" |

Each tab lists three pain points and three ZUGEE features. The features include "Cloud-based GST invoicing with QR codes & instant E-Way bill generation", "Automated low-stock alerts", and "Multi-warehouse tracking with batch numbers, expiry dates, and transfer logs". WhatsApp payment reminders are marked "coming soon".

### 4. Industry showcase

Four "foundation pillars":

| Pillar | Text |
| --- | --- |
| GST, E-Invoicing & E-Way Bills | "1-click IRN generation with QR codes, automated multi-tax slabs, and instant GSTR-1/3B audit-ready reports." |
| WhatsApp Cloud API (badge: Rolling Out) | "Payment links, booking vouchers, invoice PDFs, and dispatch alerts delivered to customer WhatsApp — actively being built, not yet live." |
| Role-Based Mobile Field Staff | "Drivers, site supervisors, cashiers, and teachers log tasks on simple mobile screens; management sees company-wide P&L." |
| Indian Data Sovereignty | "Cloud servers located within India, role-based access controls, encrypted storage, and high-speed offline-resilient sync." |

Six three-step "day in the life" workflows:

| Industry | Product | Steps |
| --- | --- | --- |
| Fleet & Logistics | Transposs | Order and route booking; live dispatch and GPS logs; delivery and settlement |
| Manufacturing & Production | ManuFlow | Work order and BOM; shop floor job tracking; quality check and packing |
| Retail & Distribution | ZUGEE ERP / CRM | Barcode billing; central inventory balance; supplier ledger sync |
| Real Estate & Builders | Real Estate ERP | Inquiry and site visit; unit blocking and KYC; milestone demand notes |
| Travel & Tour Operators | Tours & Travels CRM | Dynamic quotation; confirmation and vouchers; vendor settlement |
| Schools & Educational Institutes | School & College ERP | Admissions; daily attendance; automated fee management |

### 5. How we work

| Step | Title | Text |
| --- | --- | --- |
| 01 Discovery | Discovery & Workflow Mapping | "We map your daily business operations, branches, and staff roles to eliminate spreadsheet bottlenecks." |
| 02 Walkthrough | Interactive Live Demo | "Experience your specialized ZUGEE product populated with your own trade structure and real business examples." |
| 03 Migration | White-Glove Data Migration | "Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with backups and validation at every step." |
| 04 Launch | Go-Live & Dedicated Support | "Your team receives guided mobile training. You begin billing and dispatching live with dedicated onboarding support." |

Banner: "Typical Setup: 14 Days, Start to Finish".

### 6. Pricing

Heading "Predictable Plans. Zero Hidden Surprises." Covered in full in the Pricing and plans section below.

### 7. FAQ

Eight questions, reproduced in full in the FAQ content section below.

### 8. Final call to action

- Headline: "Ready to transform your business?"
- Text: "Built with input from Indian SME operators. Streamline operations, boost productivity, and scale smarter — with software designed around how Indian businesses actually work."
- Benefits: "Data stays in India", "Plans from ₹1,599/mo + GST"
- Small print: "No credit card required · Free consultation"
- Trust line: "Enterprise-Grade Security", "Built for Indian SMEs", "Typical Setup in 2 Weeks"

### 9. Contact form: "Book a demo"

Intro: "Tell us about your business. We'll call or WhatsApp you to fix a time and show you the product live."

| Field | Required | Limit |
| --- | --- | --- |
| Your name | Yes | 2 to 120 characters |
| Mobile / WhatsApp | Yes | 7 to 25 characters, digits and `+ ( ) -` |
| Business type | Yes | One of the 17 products, or "Something else" |
| Email | No | 254 characters |
| Company name | No | 160 characters |
| What do you need? | No | 2,000 characters |

A hidden "Company website" field acts as a bot trap. On success the visitor sees "Thanks, {name}" and a reference such as `ZUG-ABC234`. Footnote: "We only use these details to contact you about ZUGEE."

**Footer:** tagline "Industry-focused CRM, ERP, billing and operations software for Indian businesses.", a "Built for Indian SMEs" badge, quick links, the first six available products, and the copyright line. There is no address, phone number, email, privacy policy or terms link; a code comment marks these as waiting on founder-supplied details.

## Product catalog

The catalog lists 17 products: 10 marked Available and 7 Coming Soon. It lives in `lib/products.js` and feeds the product grid, the lead form, the admin filter and the emails.

| Product | Industry | Status | Description | Modules listed |
| --- | --- | --- | --- | --- |
| ZUGEE ERP / CRM | Any business | Available | Customers, leads, products, sales, billing, payments and inventory for a general business. | Customers, Leads, Products, Sales & billing, Payments, Inventory |
| Transposs | Fleet & transport | Available | Manage vehicles, drivers, bookings, trips, maintenance and fleet expenses. | Vehicles, Drivers, Bookings, Trips, Maintenance, Billing |
| Tours & Travels CRM | Travel agencies | Available | Take an enquiry through follow-up, package, quotation and booking to payment. | Enquiries, Leads, Packages, Quotations, Bookings, Payments |
| Aqua ERP | Packaged drinking water | Available | Orders, can deliveries, routes, drivers and outstanding payments for water businesses. | Customers, Orders, Deliveries, Routes, Payments, Outstanding |
| Real Estate ERP | Real estate | Available | Projects, properties, leads, site visits, follow-ups and bookings in one place. | Projects, Properties, Leads, Site visits, Bookings, Payments |
| ManuFlow | Manufacturing | Available | Raw materials, bills of materials, work orders, production and finished goods. | Raw materials, BOM, Work orders, Production, Inventory, Sales |
| School ERP | Schools | Available | Students, classes, attendance, fees, exams and parent communication. | Students, Attendance, Fees, Exams, Timetable |
| College Management | Colleges | Available | Departments, courses, faculty, attendance, fees and exams. | Departments, Courses, Attendance, Fees, Exams |
| PG Management | PGs & hostels | Available | Rooms, beds, tenants, rent, deposits and complaints for PG operators. | Rooms & beds, Tenants, Rent, Deposits, Complaints |
| Resort Management | Resorts | Available | Rooms, bookings, guests, check-in, check-out and services. | Rooms, Bookings, Guests, Check-in/out, Payments |
| Logistics Management | Logistics & delivery | Coming Soon | Shipments, pickups, dispatch, delivery tracking and proof of delivery. | Shipments, Dispatch, Delivery status, Proof of delivery |
| Gym CRM & ERP | Gyms & fitness | Coming Soon | Members, renewals, trainers and payments for gyms and studios. | None listed |
| Salon CRM & ERP | Salons & spas | Coming Soon | Appointments, customers, services and staff for salons. | None listed |
| Medical CRM | Clinics | Coming Soon | Patients, appointments and follow-ups for clinics. | None listed |
| Civil Construction Management | Construction | Coming Soon | Projects, sites, materials and contractor payments. | None listed |
| Warehouse Management | Warehousing | Coming Soon | Stock locations, inward, outward and transfers. | None listed |
| Task Management | Any team | Coming Soon | Assign, track and follow up on work across your team. | None listed |

**How the statuses were decided.** The platform plan records that on 25 Sep 2026 the founder confirmed every product in the "existing / ready" list as ready and sold through a live demo. The same plan's engineering view is more cautious: it found School ERP's folder empty and no code at all for College, PG and Resort on the machine it reviewed.

**ZUGEE ERP / CRM in this repository.** The product is marked Available with six modules. The `/app` area in this repo implements only lead tracking; Billing, Inventory, GST, Reports, Ads and Employees show "Coming Soon". If the Available product is a different codebase, that is consistent; if it is meant to be this one, the card overstates it.

Only the product codebases named in the plan can confirm any of this; none of them are in this repository.

## Pricing and plans

Two priced plans and a custom Enterprise tier are shown. Prices are whole rupees and exclude GST.

| | Starter | Growth | Enterprise |
| --- | --- | --- | --- |
| Monthly price | ₹1,999 | ₹4,099 | Custom |
| Annual price shown | ₹1,599/month, billed ₹19,188/year | ₹3,299/month, billed ₹39,588/year | Custom |
| One-time setup fee | ₹4,999 | ₹9,999 | "Custom Architect Included" |
| First payment, monthly | ₹6,998 | ₹14,098 | — |
| First payment, annual | ₹19,188 (setup shown as waived) | ₹39,588 (setup shown as waived) | — |
| Users | Up to 5 | Up to 20 | Unlimited |
| Branches | 1 | Multiple | Unlimited multi-company |
| Button | Get Started (fills the contact form) | Get Started | Talk to Founders |

**Plan features as listed**

- **Starter:** 1 branch, up to 5 users, core business management, customer management, basic reports, basic support.
- **Growth (featured):** multiple branches, up to 20 users, role-based permissions, automated follow-ups, advanced reports, business configuration.
- **Enterprise:** unlimited branches and staff accounts; dedicated cloud database and high-speed backup; custom module development and API webhooks; on-site staff and management training; 24/7 dedicated SLA and direct founder hotline; sovereign data hosting with custom compliance.

**What the setup fee covers**

- **Starter:** business profile configuration, basic GST and business settings, initial user setup, branch configuration, help setting up first customers and products, basic data import, initial system configuration, product walkthrough, basic onboarding support.
- **Growth:** everything in Starter, plus multi-branch configuration, multiple user setup, role and permission configuration, help migrating existing data, workflow configuration, admin training, business-specific onboarding, advanced configuration support.

**Product-specific setup focus**

| Product | Setup items |
| --- | --- |
| Tours & Travels CRM | Travel business configuration, package configuration, vendor setup, currency setup, booking workflow |
| Transposs | Fleet configuration, vehicle setup, driver setup, trip settings |
| Resort Management | Property configuration, room setup, booking settings, payment configuration |

**Comparison matrix shown on the page**

| Row | Starter | Growth | Enterprise |
| --- | --- | --- | --- |
| Mobile field access | Included | Role-based hierarchy | Custom roles and permissions |
| GST and tax invoicing | Standard GST bills | E-invoicing and e-way bills | Multi-GSTIN and consolidated |
| Customer ledgers | Standard | Real-time multi-branch sync | Automated bank reconciliation |
| Automated payment links | UPI and bank transfer | Automated reminders | Custom payment gateway / escrow |
| White-glove setup | ₹4,999 (free on annual) | ₹9,999 (free on annual) | Custom architect included |
| Legacy data migration | Excel and customer lists | Full Tally and ledger history | Custom ERP and database bridge |
| Implementation SLA | 14-day target | 14-day target | Dedicated sprint schedule |
| Support channels | Email and chat support | Priority support line | Dedicated account manager |

**Trust badges under the plans:** "Indian Data Sovereignty — Data never leaves Indian soil", "GST ITC Invoices — GST-compliant billing", "14-Day Setup Target", "1-Click Data Export — Never locked in, own your data".

**Billing rules in the code**

- The setup fee is charged once per business per product; renewals are the monthly price only.
- Prices are copied onto the subscription when it is created, so later price changes never affect existing customers. A database trigger makes the copy immutable.
- Setup fee status moves only from pending to paid or waived, and from paid to refunded.
- An admin may waive the setup fee for one of six reasons: early customer, promotional offer, partner referral, enterprise deal, manual admin waiver, existing customer.
- No payment gateway exists. The admin records payments the team collected by UPI, bank transfer, cash, cheque or offline card.

**Where the page and the code disagree**

- The annual figures exist in `lib/pricing.js`, but subscriptions can only be monthly: the database check allows `billing_cycle = 'monthly'` and nothing else.
- The page hardcodes ₹1,599, ₹19,188, ₹6,998 and the other amounts instead of reading them from `lib/pricing.js`, against that file's own instruction.
- "20% savings" is exact for Starter and 19.5% for Growth.

## FAQ content

The site publishes eight questions from `lib/site-content.js`, both on the page and as search-engine structured data. The two pricing answers are generated from `lib/pricing.js`.

| # | Question | Answer as published |
| --- | --- | --- |
| 1 | Which ZUGEE products can I use today? | Every product marked Available is ready to use today. Book a demo and we will arrange a meeting to show you the product working before you decide. Products marked Coming Soon are still being built. |
| 2 | Can I use more than one ZUGEE product? | Yes. Today each product is set up as its own connected system with separate logins. A unified ZUGEE account that opens all your products with shared users and branches is actively being built and coming soon. |
| 3 | What is the one-time setup fee? | It covers setting up ZUGEE around your business: your business profile, users, branches, workflows and first data, plus a walkthrough and onboarding support. It's ₹4,999 on Starter and ₹9,999 on Growth, paid once with your first month (for example ₹6,998 to start on Starter). |
| 4 | Do I pay the setup fee again every month? | No. The setup fee is charged once per product. After that you only pay the monthly subscription: ₹1,999/month on Starter or ₹4,099/month on Growth. Prices exclude GST. |
| 5 | My industry isn't listed. Can ZUGEE still help? | Choose "Something else" in the form and tell us what you need. We will tell you honestly whether one of our products fits. |
| 6 | Can I still use Tally alongside ZUGEE? | Yes. ZUGEE handles your daily operations, billing and customer management. Your chartered accountant can continue using Tally for statutory filings and audits. We can export the data your accountant needs in a format they can work with. |
| 7 | Where is my business data stored? | All ZUGEE data is stored on secure cloud servers located within India. We do not store business data outside the country. Your data is backed up and accessible only by authorised users in your organisation. |
| 8 | Does ZUGEE support WhatsApp notifications? | WhatsApp Cloud API integration is currently rolling out. Once live, ZUGEE will send invoices, payment reminders, booking confirmations and dispatch alerts directly to your customers on WhatsApp. This feature is actively being built but not yet available. Book a demo and we will share the latest timeline. |

Answers 3 and 4 describe monthly billing only and do not mention the annual offer shown in the pricing section. Answer 7 makes hosting and backup claims that the platform plan defers until they are verified (Phase 8). Answer 6 promises a data export that nothing in this repository implements.

## Admin portal

The admin portal works and is the best-built part of the project. It has three pages, all hidden from search engines and gated on the server.

| Page | What it does |
| --- | --- |
| `/admin` | Password login ("Administrator Access Portal"). A signed-in admin is sent straight to the dashboard. |
| `/admin/dashboard` | Lead queue from the demo form |
| `/admin/subscriptions` | Subscriptions and the one-time setup fee |

**Login and session**

- One shared password from `ADMIN_PASSWORD`, compared in constant time.
- A successful login sets an httpOnly, SameSite=Strict cookie holding an HMAC-SHA256 signed token valid for 24 hours.
- Five failed attempts per IP in 15 minutes lock that IP out; 100 failed attempts across all IPs lock everyone out.
- In production, a missing or short password (under 12 characters) or secret (under 32) makes every request fail rather than fall back.
- In development with no configuration, the password is `zugee_admin_dev` and a console warning is printed.

**Lead dashboard**

- Counts by status: total, new, contacted, qualified, archived.
- Search across name, phone, email, company and reference ID; filters by status and business type.
- 25 leads per page, 100 maximum.
- Change a lead's status from the table; open a detail panel with all fields and the logged timestamp.
- Export the filtered list to CSV. Cells starting with `=`, `+`, `-` or `@` are neutralised so a spreadsheet will not run them as formulas.
- A link from a lead opens the new-subscription form with that lead's details filled in.

**Subscriptions manager**

- List with status filter and search by business name, phone or email; up to 500 rows.
- Columns: customer, product, plan, monthly fee, setup fee, setup status, subscription status, start date, renewal date.
- Create a subscription: business name, phone, email, product, plan, optional customer account ID, optional waiver reason, notes. The server sets every price; a request that includes a price is rejected.
- Record the setup payment (method and reference), allowed once and only while pending.
- Waive the setup fee with a reason, only while pending.
- Record a monthly payment. The first one starts the subscription; each one moves the renewal date on by one month.
- Change status: pending, active, past due, cancelled.
- View the payment history for each subscription.

**Limits of the current design**

- There is one shared identity, so every payment and waiver is recorded as "admin".
- Logging out clears the cookie but the token itself stays valid until it expires.
- Without Supabase configured, development uses an in-memory store with three sample leads; production refuses to run that way.

## Customer app under /app

Nobody can reach the customer app today: the session check always fails, so every page redirects to the sign-in screen. The screens below exist in code and are described as built.

| Page | State | Content |
| --- | --- | --- |
| `/app/auth` | Renders; sign-in does not persist | Sign in, create account, magic link and password reset modes. Left panel: "Your business, in one place" and "Sign in to track your leads, their status and your next follow-ups." |
| `/app/auth/callback` | Broken | Meant to complete magic-link sign-in; always redirects without exchanging the code |
| `/app/dashboard` | Built, unreachable | Four counts from the customer's own leads: Total Leads, New Today (since midnight IST), Follow-ups Due, Converted. A "Work your leads" card links to the CRM. |
| `/app/crm` | Built, unreachable | Lead list with search and status filter; detail form for name, email, phone, company, status, priority, estimated value, next follow-up and notes |
| `/app/back-office/billing` | Built, unreachable | Read-only view of the customer's ZUGEE subscription, plus Coming Soon: "Create GST invoices, record payments and see who still owes you money." |
| `/app/ads` | Coming Soon | "Connect your Meta and Google ad accounts to see spend and the leads each campaign brings in." |
| `/app/gst` | Coming Soon | "GST summaries and return-ready reports built from the invoices you create in Zugee." |
| `/app/back-office/erp` | Coming Soon | Inventory: "Keep a list of your products and track stock as you buy and sell." |
| `/app/back-office/hr` | Coming Soon | Employees: "Keep your staff records in one place, with attendance and payroll to follow." |
| `/app/reports` | Coming Soon | "Download sales, outstanding and stock reports for any period, built from your own records." |

**Signup form fields:** email, password (8 characters minimum), business name, business type, state (a list of 28 Indian states), phone. Under the form: "By signing up, you agree to our Terms of Service and Privacy Policy". Neither document exists.

**CRM values**

| Field | Allowed values |
| --- | --- |
| Status | new, hot, follow_up, contacted, qualified, converted, lost |
| Priority | low, medium, high |
| Source | meta_ads, google_ads, direct, whatsapp, website, referral, other |

**Why login fails**

1. `lib/app-auth.js` builds a new Supabase client on every call and asks it for the session. That client has no access to the browser's cookies, so the answer is always "no session".
2. The sign-in route returns the access token in the response body and sets no cookie.
3. The magic-link callback reads `searchParams` without awaiting it. In Next.js 16 that value is a Promise, and the page is prerendered as static, so the exchange never runs.
4. The reset email links to `/app/auth/reset-password`, a page that does not exist.
5. Signup creates the auth user, then fails to create the profile: `customer_profiles` has no insert policy and there is no database trigger to create it.

The failure is safe: pages redirect and the API returns 401, so no customer data is exposed. The "Coming Soon" screens are honest placeholders with no sample numbers.

## API routes

There are 12 route files. The public and admin routes are sound; the seven customer routes are either non-functional or unprotected against abuse.

| Route | Methods | Access | What it does | State |
| --- | --- | --- | --- | --- |
| `/api/leads` | POST | Public | Validates and saves a demo request, then emails the team and the visitor | Works |
| `/api/admin/auth` | POST, GET, DELETE | Public (login), cookie | Login, session check, logout | Works |
| `/api/admin/leads` | GET, PATCH | Admin cookie | List with stats; change a lead's status | Works |
| `/api/admin/subscriptions` | GET, POST | Admin cookie | List and create subscriptions | Works |
| `/api/admin/subscriptions/[id]` | GET, PATCH | Admin cookie | One subscription with payments; record payment, waive, change status | Works |
| `/api/app/auth/signup` | POST | Public | Creates a Supabase auth user and tries to create a profile | Creates unusable accounts |
| `/api/app/auth/signin` | POST | Public | Checks the password and returns a token in the body | Does not sign anyone in |
| `/api/app/auth/signout` | POST | Public | Calls sign-out on a client that has no session | No effect |
| `/api/app/auth/magic-link` | POST | Public | Asks Supabase to email a sign-in link | Link leads to a broken callback |
| `/api/app/auth/reset-password` | POST | Public | Asks Supabase to email a reset link | Link leads to a missing page |
| `/api/app/dashboard` | GET | Customer session | Four lead counts | Always returns 401 |
| `/api/app/crm/leads` | GET, POST, PATCH | Customer session | List, create and edit the customer's leads | Always returns 401 |

**`/api/leads` in detail**

- Rate limit: 5 submissions per IP per 10 minutes.
- Bot trap: a filled `company_website` field gets a fake success and nothing is saved.
- Validation: name 2 to 120 characters; phone must match a digits-and-punctuation pattern; business type must be in the catalog; email, company and message are optional with length limits.
- The reference ID is `ZUG-` plus six characters from an alphabet without 0, O, 1 or I, retried on collision.
- Both emails are sent before the response returns. An email failure is logged and does not fail the request.

**Admin routes in detail**

- Every handler checks the session cookie first and returns 401 without it.
- Search input is stripped of characters that carry meaning in Supabase filter syntax, so it can only be a literal substring.
- Subscription writes are limited to 60 per IP per minute. Price and status fields in a request body cause a 400.
- IDs are checked as UUIDs before any query.

**Customer routes in detail**

- The five auth routes have no rate limit.
- Signup, magic-link and reset return Supabase's raw error message, which can reveal whether an email is registered.
- The CRM PATCH accepts only eleven named fields and validates each; the CRM POST validates source and priority but passes the other fields through unchecked.
- Both data routes filter by the signed-in user's ID and rely on row-level security as a second check.

## Database

Three SQL files define 14 tables; the application code uses 5 of them. They are run by hand in the Supabase SQL editor, in the order below.

| File | Tables | Quality |
| --- | --- | --- |
| `supabase/schema.sql` | `leads` | Good; safe to re-run |
| `supabase/app-schema.sql` | 11 customer-app tables | Interim; fails if run twice |
| `supabase/migrations/0001_subscriptions_setup_fee.sql` | `subscriptions`, `subscription_payments` | Good; safe to re-run |

**All tables**

| Table | Purpose | Row-level security | Used by code |
| --- | --- | --- | --- |
| `leads` | Demo requests from the website | On, no policies: server key only | Yes |
| `subscriptions` | One per business per product; price snapshot and setup fee state | Customers read their own; server writes | Yes |
| `subscription_payments` | Setup and monthly payments recorded by the team | Customers read their own; server writes | Yes |
| `customer_profiles` | Business details for a signed-in customer | Read and update own row; no insert policy | Yes (login path) |
| `crm_leads` | A customer's own sales leads | Full access to own rows | Yes |
| `ad_accounts` | Connected Meta and Google ad accounts | Own rows | No |
| `ad_campaigns` | Campaign spend and lead counts | Read own rows | No |
| `invoices` | GST invoices, header only, no line items | Own rows | No |
| `gst_configurations` | GSTIN and default tax rate | Own rows | No |
| `products` | Inventory items with stock level | Own rows | No |
| `employees` | Staff records and salary | Own rows | No |
| `ai_insights` | Computed alerts | Read and dismiss own rows | No |
| `generated_reports` | Report files | Read and insert own rows | No |
| `audit_log` | Action history | Read own rows | No |

**What is well done**

- `leads` has length checks on every column, a unique reference ID and a fixed status list.
- The setup fee can be recorded once only: a unique partial index allows one setup payment per subscription.
- Each billing month can be paid once only: a unique index on subscription and period start.
- A trigger blocks any change to the price snapshot and any setup-status move other than the allowed ones.
- Customers cannot change their own plan, subscription status or trial end date: update rights on `customer_profiles` are granted column by column.
- The earlier dashboard views that bypassed row-level security are dropped.

**Problems**

- `app-schema.sql` uses bare `create policy`, `create trigger` and `add constraint`, so a second run stops with an error.
- `customer_profiles` has no insert policy and no trigger on new auth users, so signup cannot create a profile.
- Tenancy is one user per business (`customer_id = auth.uid()`). It cannot support teams, branches or roles; the plan replaces it with organizations in Phase 2.
- A subscription created with neither a lead nor a customer ID is not covered by the uniqueness indexes, so the same business can be entered twice.
- `billing_cycle` allows only `monthly`.
- Only one file sits in `supabase/migrations`; the other two are outside it, so there is no single ordered history.
- `gst_configurations` requires a GSTIN, so an unregistered business cannot be stored.

## Configuration

The app needs six environment variables in production; `.env.example` lists seven more for features that no longer exist.

**Environment variables**

| Variable | Needed | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata, robots, sitemap and email links; defaults to `https://www.zugee.in` |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only key for leads and subscriptions |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For `/app` | Key that respects row-level security |
| `ADMIN_PASSWORD` | Yes, 12+ characters | Admin portal password |
| `ADMIN_JWT_SECRET` | Yes, 32+ characters | Signs admin session cookies; rotating it signs everyone out |
| `ADMIN_NOTIFICATION_EMAIL` | Should be set | Where new-lead emails go; falls back to a personal Gmail address hardcoded in `lib/email.js` |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | One email method | Gmail sending |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | One email method | Any SMTP provider |
| `OAUTH_ENCRYPTION_SECRET` | Unused | For ad-account tokens; feature removed |
| `META_APP_ID`, `META_APP_SECRET` | Unused | Meta Ads; feature removed |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN` | Unused | Google Ads; feature removed |
| `INSIGHTS_COMPUTE_SECRET` | Unused | AI insights cron; feature removed |

With no email variables set, lead emails are skipped and the details are written to the server log instead.

**Security headers** (`next.config.mjs`, applied to every path)

| Header | Value |
| --- | --- |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera, microphone, geolocation, payment and usb all disabled |
| Content-Security-Policy-Report-Only | Self-only policy allowing inline scripts and styles, Supabase connections, no framing |
| Strict-Transport-Security | One year, production only |

The content security policy is report-only and names no reporting endpoint, so violations show only in a visitor's browser console. The `X-Powered-By` header is turned off.

**Scripts**

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run dev:mobile` | Development server on port 3001, reachable from phones on the same Wi-Fi |
| `npm run build`, `npm start` | Production build and server |
| `npm run lint` | ESLint with the Next.js core-web-vitals rules |
| `npm test` | Node test runner over `tests/**/*.test.mjs` |
| `scripts/smoke-test.sh` | Eight post-deploy checks: homepage, robots, sitemap, crawler access, no `noindex`, title present |
| `setup-admin.ps1` | Interactive script that writes `.env.local` with an admin password and a generated secret |

**Documentation in the repository**

| File | Lines | Content | Current? |
| --- | --- | --- | --- |
| `docs/ZUGEE-PLATFORM-PLAN.md` | 463 | Architecture audit, target design, eight-phase plan | Yes; the homepage has since drifted from its Phase 0 status |
| `ZUGEE-PROJECT-DOCUMENTATION.md` | 196 | Brand, content and website guide | Partly; its design rules are not followed by the current hero |
| `README.md` | 96 | Setup, variables, database, structure | Yes |
| `CHANGELOG.md` | 219 | Change history | Yes |
| `ADMIN_SETUP.md` | 106 | Admin portal quick setup | Yes |
| `ROUTES.md`, `ROUTE_CHECKLIST.md`, `NAVIGATION.md` | 429 | Route and navigation notes | Partly |
| `NAVIGATION_FIX_COMPLETE.md`, `SCROLL_FIX_SUMMARY.md` | 174 | Logs of two past fixes | Historical only |
| `docs/UI_IMPROVEMENTS.md` | 249 | Log of UI changes | Historical only |
| `docs/OAUTH_SETUP.md` | 288 | Meta and Google ad integration setup | No; the feature was removed |
| `docs/AI_INSIGHTS_SETUP.md` | 410 | AI insights cron setup | No; the feature was removed |
| `AGENTS.md`, `CLAUDE.md` | 12 | Instructions for coding agents | Yes |

## Findings

There are 4 critical, 5 high, 8 medium and 3 low findings. None exposes customer data today.

### Critical

| # | Finding | Where | Effect |
| --- | --- | --- | --- |
| C1 | Customer login never succeeds | `lib/app-auth.js` lines 65 to 76 and 102 to 133; `app/api/app/auth/signin/route.js`; `app/app/auth/callback/page.jsx` | The whole customer app is unreachable |
| C2 | Signup is public, has no rate limit, and creates accounts that cannot log in | `app/api/app/auth/signup/route.js`; `lib/app-auth.js` lines 143 to 196 | Anyone can fill Supabase Auth with orphan users and trigger its emails |
| C3 | The homepage states unbuilt features and unproven numbers as fact | See the list below | Breaks the project rule in `CLAUDE.md` and the plan's Phase 0 exit condition |
| C4 | Annual billing is the default on the pricing page but cannot be recorded | `components/home/PricingSection.jsx`; `supabase/migrations/0001_subscriptions_setup_fee.sql` line 67 | A customer who takes the annual offer cannot be entered correctly |

**C3 in detail: claims with nothing behind them in this repository**

| Claim | Location |
| --- | --- |
| "GST & E-Invoicing Ready", "Data Stored in India", "Live Setup in 2 Weeks" | Hero badges |
| "1-click IRN generation", "instant GSTR-1/3B audit-ready reports" | Industry showcase pillar |
| "encrypted storage", "offline-resilient sync" | Industry showcase pillar |
| "90% Faster Invoicing", "2x Follow-up Speed", "Up to 35% of inbound inquiries lost", "14+ hours lost weekly" | Comparison section |
| "E-Invoicing & E-Way Bills", "Automated Bank Reconciliation", "24/7 Dedicated SLA" | Pricing matrix and Enterprise card |
| "Data never leaves Indian soil", "1-Click Data Export" | Pricing trust badges |
| "Enterprise-Grade Security", "Built with input from Indian SME operators" | Final call to action |
| Hosting in India, backups, accountant export | FAQ answers 6 and 7 |

The plan itself says GSTR-1, e-invoice and Tally export stay "Coming Soon" until built and checked with a chartered accountant, and that backups may be claimed only after they are verified. The hero's dashboard preview is labelled "illustrative data only", which is acceptable, though it depicts e-invoice and GPS features as if they exist.

### High

| # | Finding | Where | Effect |
| --- | --- | --- | --- |
| H1 | Lead emails insert the visitor's name, company and message into HTML without escaping | `lib/email.js` lines 146 to 173 and 253 | The confirmation email goes to any address the visitor types, so the form can send attacker-written HTML from the company's mailbox |
| H2 | The "View in Admin Portal" link in every lead email points to `/admin/leads` | `lib/email.js` line 78 | The link returns 404; the page is `/admin/dashboard` |
| H3 | New-lead emails default to a personal Gmail address written into the code | `lib/email.js` line 8 | Customer contact details leave the company unless the variable is set |
| H4 | Rate limits are kept in server memory | `lib/rate-limit.js` | On serverless hosting each instance counts separately, so the lead-form and admin-login limits are weaker than they look |
| H5 | The signup form cites a Terms of Service and Privacy Policy that do not exist | `components/app/AuthForm.jsx` line 351 | Legal exposure; the footer also has no address, phone or policy links |

### Medium

| # | Finding | Where |
| --- | --- | --- |
| M1 | One shared admin password; all payments and waivers are recorded as "admin" | `lib/auth.js`; `app/api/admin/subscriptions/[id]/route.js` line 31 |
| M2 | Admin logout does not revoke the token; it stays valid for up to 24 hours | `lib/auth.js` |
| M3 | 100 failed logins from anywhere lock out the real admin for 15 minutes | `app/api/admin/auth/route.js` lines 20 to 46 |
| M4 | Prices are typed into the pricing section instead of read from `lib/pricing.js`; "20% savings" is 19.5% on Growth | `components/home/PricingSection.jsx` |
| M5 | `app-schema.sql` cannot be run twice, and 9 of its 11 tables are unused | `supabase/app-schema.sql` |
| M6 | Subscriptions with no lead and no customer ID can be duplicated | Migration lines 83 to 86 |
| M7 | Eight of nine homepage sections are client components, so a static page ships a large amount of JavaScript | `components/home/` |
| M8 | No CI, and no tests for API routes, validation or auth | Repository |

### Low

| # | Finding | Where |
| --- | --- | --- |
| L1 | `next` 16.3.5 carries a critical advisory in `next/og`, which this project does not use | `package.json` |
| L2 | Content security policy is report-only with no reporting endpoint | `next.config.mjs` |
| L3 | Nine of twelve commit messages are "push" or "pish" | Git history |

### What is done well

- Lead validation, bot trap and search sanitising.
- Admin session design: signed cookie, constant-time checks, server-side page gating, production fails closed.
- Subscription rules enforced in both code and database, with 13 tests.
- The build works with no secrets present.
- "Coming Soon" screens in `/app` show no sample numbers.
- Structured data is generated from the same content the page renders.

## Dead code and stale documentation

Seven source files have no importers, and two setup guides describe features that were removed.

| Item | Lines | Why it is dead |
| --- | --- | --- |
| `lib/oauth-encryption.js` | 88 | Encrypted ad-account tokens; the ad integration was removed |
| `components/animations/AnimatedCard.jsx` | — | No importers |
| `components/animations/AnimatedSection.jsx` | 65 | No importers; has a lint error |
| `components/animations/StaggeredGroup.jsx` | 67 | No importers; has a lint error |
| `components/home/IndustrySection.jsx` | 224 | No importers |
| `components/home/IndustryProductsSection.jsx` | 180 | No importers; has two lint errors |
| `components/home/ProductsSection.jsx` | 121 | No importers |
| Six exports in `lib/app-auth.js` | about 120 | `updatePassword`, `updateCustomerProfile`, `completeOnboarding`, `validateSession`, `refreshSession`, `createTestAccount` are never called |
| Nine tables in `app-schema.sql` | about 400 | No code reads or writes them |
| `docs/OAUTH_SETUP.md`, `docs/AI_INSIGHTS_SETUP.md` | 698 | Document removed features |
| Seven variables in `.env.example` | — | Belong to the removed features |

`lib/industries.js`, `PremiumProductCard.jsx`, `ProductInterestButton.jsx` and `PlanButton.jsx` may be used only by the dead components above; check each before deleting.

The brand guide says to avoid "neon glows as decoration, cyber grids, monospace everywhere". The current hero uses a glow, a grid background and monospace uppercase labels, so either the guide or the hero needs to change.

## Recommended order of work

Fix what visitors and the team see first, then close the abuse paths, then rebuild login.

| Order | Work | Addresses | Size |
| --- | --- | --- | --- |
| 1 | Remove or relabel the unbacked homepage claims; decide whether annual billing is real and make the page, FAQ and database agree | C3, C4, M4 | Small |
| 2 | Escape HTML in both emails, fix the admin link, set `ADMIN_NOTIFICATION_EMAIL` to a company address | H1, H2, H3 | Small |
| 3 | Disable the five `/api/app/auth/*` routes until login is rebuilt; remove the Terms and Privacy line or publish the pages | C2, H5 | Small |
| 4 | Upgrade `next` to 16.3.8; delete the dead files, docs and variables so lint passes | L1, dead code | Small |
| 5 | Rebuild authentication as the plan's Phase 1: `@supabase/ssr`, cookie sessions, a `proxy.js`, a callback route handler, a profile trigger | C1 | Medium |
| 6 | Move rate limiting to Postgres or Upstash; add CI that runs build, lint and tests; add tests for the lead and admin routes | H4, M8 | Medium |
| 7 | Give each admin their own login so payments and waivers are attributable | M1, M2, M3 | Medium |
| 8 | Replace `app-schema.sql` with numbered migrations and the organization model (plan Phase 2) | M5, M6 | Large |

Open questions for the founder, carried over from the plan and still unanswered in the repository:

- [ ] Is the Available "ZUGEE ERP / CRM" this repository's `/app`, or a separate codebase?
- [ ] Where is ZUGEE's data actually hosted, and are backups verified?
- [ ] Is annual billing with a waived setup fee a real offer?
- [ ] What are the registered address, phone, support email and policy texts for the footer?
