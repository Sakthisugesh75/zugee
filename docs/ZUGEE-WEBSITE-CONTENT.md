# ZUGEE Website Content — Complete Record

**Date:** 2026-10-01 · **Source:** the code in this repository at commit `07bb83a`

This document records every piece of text the ZUGEE website shows, from the top of the homepage to the admin portal, exactly as it is written in the code. Text in quotation marks or in tables is verbatim. Where the site has no content for something (for example an About Us page), that is stated.

## Contents

1. Company and brand
2. Search and sharing text
3. Navigation bar
4. Homepage section 1: Hero
5. Homepage section 2: Product Ecosystem
6. Product details (all 17 products)
7. Homepage section 3: Why Businesses Switch
8. Homepage section 4: Engineered For India
9. Homepage section 5: How We Onboard You
10. Homepage section 6: Pricing
11. Homepage section 7: Frequently Asked Questions
12. Homepage section 8: Final call to action
13. Homepage section 9: Book a demo
14. Footer
15. Emails sent by the website
16. Customer app (`/app`)
17. Admin portal (`/admin`)
18. Content the website does not have

---

## 1. Company and brand

| Item | Content |
| --- | --- |
| Brand name | ZUGEE |
| Legal name shown | Zugee Systems Technologies Pvt. Ltd. |
| Logo | Mascot icon with the wordmark "ZUGEE" and the line "Systems Technologies Pvt. Ltd." beneath it |
| Main tagline | "Industry-focused CRM, ERP, billing and operations software for Indian businesses." |
| Positioning line (hero badge) | "UNIFIED BUSINESS OPERATING SYSTEM" |
| Headline | "Replace 5 Disconnected Tools with One Operating System." |
| Website address | `https://www.getzugee.com` |
| Copyright line | "© 2026 Zugee Systems Technologies Pvt. Ltd. All rights reserved." |
| Footer badge | "Built for Indian SMEs" |

**About ZUGEE.** The website has no About Us page or section. The closest text to a company description is:

- "Industry-focused CRM, ERP, billing and operations software for Indian businesses." (footer and share description)
- "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more." (search description)
- "ZUGEE connects CRM, billing, inventory, and dispatch in one central database — built for Indian businesses." (hero)
- "Built with input from Indian SME operators. Streamline operations, boost productivity, and scale smarter — with software designed around how Indian businesses actually work." (final call to action)

## 2. Search and sharing text

| Item | Content |
| --- | --- |
| Browser title | "ZUGEE — Business Software for Indian Businesses" |
| Title pattern for other pages | "{Page} \| ZUGEE" |
| Search description | "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more." |
| Share title (WhatsApp, LinkedIn, X) | "ZUGEE — Business software built for the way your business operates" |
| Share description | "Industry-focused CRM, ERP, billing and operations software for Indian businesses." |
| Share image | `/og.jpg`, 1200 × 630 |
| Author | Zugee Systems Technologies Pvt. Ltd. |
| Language and locale | English (India), `en-IN` |
| Structured data | Organization (name ZUGEE, legal name, logo) and the full FAQ |
| Search engines may index | The homepage only; `/admin`, `/app` and `/api` are blocked |

"Skip to content" is the first link on every page, for keyboard users.

## 3. Navigation bar

| Element | Text | Goes to |
| --- | --- | --- |
| Logo | ZUGEE · Systems Technologies Pvt. Ltd. | Top of the homepage |
| Link | Products | Product Ecosystem section |
| Link | How it works | How We Onboard You section |
| Link | Pricing | Pricing section |
| Link | FAQ | FAQ section |
| Button | Book a Demo | Contact form |
| Mobile menu footer | Zugee Systems Technologies Pvt. Ltd. | — |

---

## 4. Homepage section 1: Hero

**Badge:** UNIFIED BUSINESS OPERATING SYSTEM

**Headline:** Replace 5 Disconnected Tools with One Operating System.

**Paragraph:** "Your staff re-enters the same customer into WhatsApp, Excel, and Tally. Orders slip through cracks. Nobody knows job status without calling 3 people. ZUGEE connects CRM, billing, inventory, and dispatch in one central database — built for Indian businesses."

**Buttons:**

- "Explore All Products" (goes to the product section)
- "Book a 1-on-1 Live Demo" (goes to the contact form)

**Four checkmarks:**

- Zero Double Data Entry
- GST & E-Invoicing Ready
- Live Setup in 2 Weeks
- Data Stored in India

**Small note:** "Today, each ZUGEE product runs as its own connected system. A single login across all products is coming soon."

**Dashboard preview.** Labelled "SAMPLE DASHBOARD VIEW — ILLUSTRATIVE DATA ONLY", with four tabs. The footer of the preview reads "Single Central Database: Updates in {tab name} automatically reflect across Ledgers and Inventory." and "Sample Data".

Tab 1: **CRM & Sales** — "148 Active Leads" · "+24% this week"

| Name | Stage | Value | Time |
| --- | --- | --- | --- |
| Apex Builders Pvt Ltd | Site Visit Scheduled | ₹45,00,000 | 10m ago |
| Royal Logistics Corp | Quotation Sent | ₹12,40,000 | 35m ago |
| Sunrise Packaged Waters | Demo Completed | ₹3,80,000 | 1h ago |

Tab 2: **Fleet Dispatch** — "38 Active Trips" · "99.4% on time"

| Name | Stage | Value | Time |
| --- | --- | --- | --- |
| MH-12-RN-8840 (Volvo 40T) | In Transit → Pune Hub | Fuel: 82% | Live GPS |
| KA-01-AB-1922 (Eicher 14T) | Driver Assigned: Suresh K. | Maintenance: OK | Departs 15:30 |
| DL-04-CC-9011 (Tata 407) | Unloading at Warehouse B | E-Way Bill: #8821 | Arrived |

Tab 3: **GST Billing** — "₹28.4L Billed Today" · "GST Compliant"

| Name | Stage | Value | Time |
| --- | --- | --- | --- |
| INV-2026-0891 (Tax Invoice) | Paid via UPI / Bank | ₹1,84,500 | Instant Sync |
| INV-2026-0892 (B2B Supply) | E-Invoice QR Generated | ₹4,20,000 | IRN Active |
| INV-2026-0893 (Service Bill) | WhatsApp Notification (Coming Soon) | ₹65,000 | Queued |

Tab 4: **Inventory Sync** — "4 Warehouses Live" · "0 Low-Stock Breaches"

| Name | Stage | Value | Time |
| --- | --- | --- | --- |
| Raw Material Batch #A44 | BOM Allocated: ManuFlow | 1,200 Units | Floor Ready |
| Packaged 20L Water Cans | Dispatched to Route 4 | 480 Cans | Van Loaded |
| Finished Product SKUs | Auto-Reconciled with Sales | Stock Value: ₹48L | Live |

---

## 5. Homepage section 2: Product Ecosystem

**Small heading:** Product Ecosystem

**Heading:** Software built around your business

**Paragraph:** "From CRM and billing to fleet, travel, education and operations — ZUGEE connects the tools your business needs."

**Legend:** "Available Now" · "In Development / Coming Soon"

**How the section works.** One product is shown at a time, rotating every 7.5 seconds, with left and right arrows and a counter such as "01 / 17". Available products are shown first, then Coming Soon products. Each product card shows:

- Category label and status chip ("Available" or "Coming Soon")
- Product name as a large heading
- An **About** card: the product description, "Tailored for {industry}", and "Replaces: {old tools}"
- A **Key Capabilities** card: up to five modules, and the line "Integrated with unified ZUGEE Core database"
- A button: "Explore {product name} Details"

The button opens a details window containing: the category label, "Industry: {industry}", the name and description, a "Replaces Legacy Tools" box, an "Included Functional Modules" grid with every module, the line "White-glove data migration & live setup — typically within 14 days" with the tag "Managed Setup", and two buttons: "Book Live Demo for {product name}" and "Close".

## 6. Product details (all 17 products)

Product groups: **Business Management** and **Industry Solutions**.

### Available products

#### 6.1 ZUGEE ERP / CRM

| Field | Content |
| --- | --- |
| Category label | BUSINESS PLATFORM |
| Group | Business Management |
| Status | Available |
| Industry | Any business |
| About | "Customers, leads, products, sales, billing, payments and inventory for a general business." |
| Modules | Customers · Leads · Products · Sales & billing · Payments · Inventory |
| Replaces | "Excel + WhatsApp + Standalone Tally" |
| Lead form option | "Any business — ZUGEE ERP / CRM" |

#### 6.2 Transposs

| Field | Content |
| --- | --- |
| Category label | FLEET MANAGEMENT |
| Group | Industry Solutions |
| Status | Available |
| Industry | Fleet & transport |
| About | "Manage vehicles, drivers, bookings, trips, maintenance and fleet expenses." |
| Modules | Vehicles · Drivers · Bookings · Trips · Maintenance · Billing |
| Replaces | "Paper logbooks + WhatsApp driver dispatch" |
| Setup focus | Fleet configuration · Vehicle setup · Driver setup · Trip settings |
| Lead form option | "Fleet & transport — Transposs" |

#### 6.3 Tours & Travels CRM

| Field | Content |
| --- | --- |
| Category label | TRAVEL & TOURISM |
| Group | Industry Solutions |
| Status | Available |
| Industry | Travel agencies |
| About | "Take an enquiry through follow-up, package, quotation and booking to payment." |
| Modules | Enquiries · Leads · Packages · Quotations · Bookings · Payments |
| Replaces | "Word doc quotations + scattered email PDFs" |
| Setup focus | Travel business configuration · Package configuration · Vendor setup · Currency setup · Booking workflow |
| Lead form option | "Travel agencies — Tours & Travels CRM" |

#### 6.4 Aqua ERP

| Field | Content |
| --- | --- |
| Category label | WATER OPERATIONS |
| Group | Industry Solutions |
| Status | Available |
| Industry | Packaged drinking water |
| About | "Orders, can deliveries, routes, drivers and outstanding payments for water businesses." |
| Modules | Customers · Orders · Deliveries · Routes · Payments · Outstanding |
| Replaces | "Pocket diary route delivery records" |
| Lead form option | "Packaged drinking water — Aqua ERP" |

#### 6.5 Real Estate ERP

| Field | Content |
| --- | --- |
| Category label | REAL ESTATE |
| Group | Industry Solutions |
| Status | Available |
| Industry | Real estate |
| About | "Projects, properties, leads, site visits, follow-ups and bookings in one place." |
| Modules | Projects · Properties · Leads · Site visits · Bookings · Payments |
| Replaces | "Fragmented spreadsheets + broker chats" |
| Lead form option | "Real estate — Real Estate ERP" |

#### 6.6 ManuFlow

| Field | Content |
| --- | --- |
| Category label | MANUFACTURING |
| Group | Industry Solutions |
| Status | Available |
| Industry | Manufacturing |
| About | "Raw materials, bills of materials, work orders, production and finished goods." |
| Modules | Raw materials · BOM · Work orders · Production · Inventory · Sales |
| Replaces | "Manual job cards + offline inventory logs" |
| Lead form option | "Manufacturing — ManuFlow" |

#### 6.7 School ERP

| Field | Content |
| --- | --- |
| Category label | EDUCATION |
| Group | Industry Solutions |
| Status | Available |
| Industry | Schools |
| About | "Students, classes, attendance, fees, exams and parent communication." |
| Modules | Students · Attendance · Fees · Exams · Timetable |
| Replaces | "Paper attendance sheets + manual fee receipts" |
| Lead form option | "Schools — School ERP" |

#### 6.8 College Management

| Field | Content |
| --- | --- |
| Category label | COLLEGE ERP |
| Group | Industry Solutions |
| Status | Available |
| Industry | Colleges |
| About | "Departments, courses, faculty, attendance, fees and exams." |
| Modules | Departments · Courses · Attendance · Fees · Exams |
| Replaces | "Legacy college servers + manual desk fees" |
| Lead form option | "Colleges — College Management" |

#### 6.9 PG Management

| Field | Content |
| --- | --- |
| Category label | HOSPITALITY |
| Group | Industry Solutions |
| Status | Available |
| Industry | PGs & hostels |
| About | "Rooms, beds, tenants, rent, deposits and complaints for PG operators." |
| Modules | Rooms & beds · Tenants · Rent · Deposits · Complaints |
| Replaces | "Paper rent registers + cash deposit slips" |
| Lead form option | "PGs & hostels — PG Management" |

#### 6.10 Resort Management

| Field | Content |
| --- | --- |
| Category label | RESORT SUITE |
| Group | Industry Solutions |
| Status | Available |
| Industry | Resorts |
| About | "Rooms, bookings, guests, check-in, check-out and services." |
| Modules | Rooms · Bookings · Guests · Check-in/out · Payments |
| Replaces | "Separate booking calendar + desk invoices" |
| Setup focus | Property configuration · Room setup · Booking settings · Payment configuration |
| Lead form option | "Resorts — Resort Management" |

### Coming Soon products

#### 6.11 Logistics Management

| Field | Content |
| --- | --- |
| Category label | LOGISTICS |
| Group | Industry Solutions |
| Status | Coming Soon |
| Industry | Logistics & delivery |
| About | "Shipments, pickups, dispatch, delivery tracking and proof of delivery." |
| Modules | Shipments · Dispatch · Delivery status · Proof of delivery |
| Replaces | "Manual E-Way bill entry + offline tracking" |
| Lead form option | "Logistics & delivery — Logistics Management" |

#### 6.12 Gym CRM & ERP

| Field | Content |
| --- | --- |
| Category label | FITNESS & WELLNESS |
| Status | Coming Soon |
| Industry | Gyms & fitness |
| About | "Members, renewals, trainers and payments for gyms and studios." |
| Modules | None listed yet |
| Replaces | "Card-based membership logs" |
| Lead form option | "Gyms & fitness — Gym CRM & ERP" |

#### 6.13 Salon CRM & ERP

| Field | Content |
| --- | --- |
| Category label | BEAUTY & SALON |
| Status | Coming Soon |
| Industry | Salons & spas |
| About | "Appointments, customers, services and staff for salons." |
| Modules | None listed yet |
| Replaces | "Paper appointment books" |
| Lead form option | "Salons & spas — Salon CRM & ERP" |

#### 6.14 Medical CRM

| Field | Content |
| --- | --- |
| Category label | HEALTHCARE |
| Status | Coming Soon |
| Industry | Clinics |
| About | "Patients, appointments and follow-ups for clinics." |
| Modules | None listed yet |
| Replaces | "Handwritten prescription pads + desk billing" |
| Lead form option | "Clinics — Medical CRM" |

#### 6.15 Civil Construction Management

| Field | Content |
| --- | --- |
| Category label | CONSTRUCTION |
| Status | Coming Soon |
| Industry | Construction |
| About | "Projects, sites, materials and contractor payments." |
| Modules | None listed yet |
| Replaces | "Site notebook muster rolls" |
| Lead form option | "Construction — Civil Construction Management" |

#### 6.16 Warehouse Management

| Field | Content |
| --- | --- |
| Category label | WAREHOUSING |
| Status | Coming Soon |
| Industry | Warehousing |
| About | "Stock locations, inward, outward and transfers." |
| Modules | None listed yet |
| Replaces | "Bin cards + manual tallying" |
| Lead form option | "Warehousing — Warehouse Management" |

#### 6.17 Task Management

| Field | Content |
| --- | --- |
| Category label | PRODUCTIVITY |
| Group | Business Management |
| Status | Coming Soon |
| Industry | Any team |
| About | "Assign, track and follow up on work across your team." |
| Modules | None listed yet |
| Replaces | "Scattered WhatsApp task reminders" |
| Lead form option | "Any team — Task Management" |

### Product summary

| # | Product | Industry | Status |
| --- | --- | --- | --- |
| 1 | ZUGEE ERP / CRM | Any business | Available |
| 2 | Transposs | Fleet & transport | Available |
| 3 | Tours & Travels CRM | Travel agencies | Available |
| 4 | Aqua ERP | Packaged drinking water | Available |
| 5 | Real Estate ERP | Real estate | Available |
| 6 | ManuFlow | Manufacturing | Available |
| 7 | School ERP | Schools | Available |
| 8 | College Management | Colleges | Available |
| 9 | PG Management | PGs & hostels | Available |
| 10 | Resort Management | Resorts | Available |
| 11 | Logistics Management | Logistics & delivery | Coming Soon |
| 12 | Gym CRM & ERP | Gyms & fitness | Coming Soon |
| 13 | Salon CRM & ERP | Salons & spas | Coming Soon |
| 14 | Medical CRM | Clinics | Coming Soon |
| 15 | Civil Construction Management | Construction | Coming Soon |
| 16 | Warehouse Management | Warehousing | Coming Soon |
| 17 | Task Management | Any team | Coming Soon |

---

## 7. Homepage section 3: Why Businesses Switch

**Small heading:** Why Businesses Switch

**Heading:** The Chaos of 5 Apps vs. The ZUGEE Single Engine

**Paragraph:** "When customer data is in WhatsApp, stock is in Excel, and billing is in Tally, your business operates with blind spots."

The section has four tabs. Each tab shows two cards side by side: the left card is titled "The Chaos of 5 Apps" with the tag "Legacy Pattern"; the right card is titled "The ZUGEE Unified Engine" with the tags "Connected Platform" and "● 1 Central Database".

### Tab 1: Operations & Workflows

| | The Chaos of 5 Apps (badge: Fragmented Operations) | The ZUGEE Unified Engine |
| --- | --- | --- |
| Point 1 | Customer calls about an order → staff calls 3 people across departments to find status | Order created once → instantly updates warehouse, dispatch, and accounting ledgers |
| Point 2 | Staff enters the same customer details into WhatsApp, Excel, and billing software | Role-based access: drivers and staff see only their tasks on mobile; owner sees entire P&L |
| Point 3 | Owner has no idea which jobs are delayed without physically asking supervisors | Live operational dashboard reveals bottlenecks, completed jobs, and pending deliverables |
| Result line | ⚠️ 14+ hours lost weekly per manager in manual status checks | ✨ 100% Real-Time Visibility • Zero Phone Tag Between Departments |

### Tab 2: Billing & GST

| | The Chaos of 5 Apps (badge: Disconnected Accounts) | The ZUGEE Unified Engine |
| --- | --- | --- |
| Point 1 | Billing done in standalone desktop software; customer history is locked on one PC | Cloud-based GST invoicing with QR codes & instant E-Way bill generation |
| Point 2 | Outstanding payment reminders manually sent via WhatsApp one-by-one | WhatsApp payment reminders with UPI & payment links (coming soon) |
| Point 3 | Accountant spends 4 days every month reconciling bank statements with cash slips | Customer ledger updates automatically the moment payment is received |
| Result line | ⚠️ Delayed cash flow and frequent payment leakages | ✨ 90% Faster Invoicing • Real-Time Debtor Balance |

### Tab 3: Sales & Leads

| | The Chaos of 5 Apps (badge: Scattered Inquiries) | The ZUGEE Unified Engine |
| --- | --- | --- |
| Point 1 | Leads captured across personal WhatsApp numbers, handwritten diaries, and emails | Centralized lead pipeline captures every inquiry into one company-owned database |
| Point 2 | Sales reps forget follow-ups because there is no automated reminder system | Automated follow-up reminders, quotation generator, and visit scheduling |
| Point 3 | When a salesperson quits, all customer relationships and conversation history walk out the door | Complete customer timeline (inquiries, quotations, invoices, payments) in one view |
| Result line | ⚠️ Up to 35% of inbound inquiries lost to competitor delays | ✨ 100% Customer History Owned by Company • 2x Follow-up Speed |

### Tab 4: Inventory & Stock

| | The Chaos of 5 Apps (badge: Blind Inventory) | The ZUGEE Unified Engine |
| --- | --- | --- |
| Point 1 | Stock counted on paper or updated into Excel only at the end of the week | Live stock deduction the moment a sales bill or production work order is confirmed |
| Point 2 | Items sold out on the floor while sales reps continue promising them to clients | Automated low-stock alerts before items run out with re-order level triggers |
| Point 3 | Dead stock and expired raw materials discovered months too late | Multi-warehouse tracking with batch numbers, expiry dates, and transfer logs |
| Result line | ⚠️ Dead capital tied in stock + frequent customer order cancellations | ✨ Real-Time Stock Valuation • Zero Accidental Over-Selling |

**Closing line:** "Ready to unify your business workflows without disrupting daily operations?"

**Button:** "Book a Migration Consultation"

---

## 8. Homepage section 4: Engineered For India

**Small heading:** Engineered For India

**Heading:** Built For The Way Indian Businesses Actually Operate

**Paragraph:** "From local GST compliance and WhatsApp communication to driver mobile dispatch — every workflow is tuned to Indian business realities."

### Four foundation pillars

| Pillar | Description |
| --- | --- |
| GST, E-Invoicing & E-Way Bills | "1-click IRN generation with QR codes, automated multi-tax slabs, and instant GSTR-1/3B audit-ready reports." |
| WhatsApp Cloud API (badge: Rolling Out) | "Payment links, booking vouchers, invoice PDFs, and dispatch alerts delivered to customer WhatsApp — actively being built, not yet live." |
| Role-Based Mobile Field Staff | "Drivers, site supervisors, cashiers, and teachers log tasks on simple mobile screens; management sees company-wide P&L." |
| Indian Data Sovereignty | "Cloud servers located within India, role-based access controls, encrypted storage, and high-speed offline-resilient sync." |

### Industry workflows

Six tabs. Each shows the label "DAILY OPERATIONAL LIFECYCLE", the industry name, a tagline, "Powered by {product}", three numbered steps, the line "Customized for your business structure during the 14-day setup." and a button "See {product} in Action".

**Fleet & Logistics** — Powered by Transposs
Tagline: "Commercial vehicle roster, driver dispatch & automated E-Way billing"

| Step | Detail |
| --- | --- |
| 01. Order & Route Booking | Consignment booked, vehicle assigned, and route planned with live driver availability. |
| 02. Live Dispatch & GPS Logs | Driver logs trips via mobile; fuel expenses, toll slips, and odometer readings auto-tracked. |
| 03. Delivery & Fast Settlement | Digital proof of delivery triggers instant GST invoice and automated WhatsApp payment link to client. |

**Manufacturing & Production** — Powered by ManuFlow
Tagline: "Raw materials tracking, Bills of Materials (BOM) & finished goods"

| Step | Detail |
| --- | --- |
| 01. Work Order & BOM Creation | Sales order auto-generates bill of materials and verifies raw stock across warehouses. |
| 02. Shop Floor Job Tracking | Production stages recorded in real-time; scrap percentages and labor allocations logged. |
| 03. Quality Check & Packing | Batch-numbered finished goods move directly into sales inventory ready for dispatch. |

**Retail & Distribution** — Powered by ZUGEE ERP / CRM
Tagline: "Multi-branch point of sale, stock re-orders & vendor ledgers"

| Step | Detail |
| --- | --- |
| 01. Rapid Barcode Billing | Fast POS checkout with GST calculation, split UPI/cash payments, and digital receipts. |
| 02. Central Inventory Balance | Stock deducts across outlets instantly with automated purchase triggers when stock hits re-order levels. |
| 03. Supplier Ledger Sync | Vendor purchases, credit periods, and accounts payable reconciled without manual bookkeeping. |

**Real Estate & Builders** — Powered by Real Estate ERP
Tagline: "Property unit inventories, broker commissions & payment schedules"

| Step | Detail |
| --- | --- |
| 01. Inquiry & Site Visit | Buyer leads captured automatically; site visits scheduled with automated SMS/WhatsApp alerts. |
| 02. Unit Blocking & KYC | Available apartment/plot inventory blocked in real-time to avoid duplicate sales by agents. |
| 03. Milestone Demand Notes | Construction milestone triggers automated demand letters, payment reminders, and receipts. |

**Travel & Tour Operators** — Powered by Tours & Travels CRM
Tagline: "Custom holiday packages, instant itineraries & client bookings"

| Step | Detail |
| --- | --- |
| 01. Dynamic Quotation | Assemble hotels, flights, and sightseeing into branded PDF itineraries in under 2 minutes. |
| 02. Confirmation & Vouchers | Advance payment received unlocks instant hotel vouchers and customer confirmation package. |
| 03. Vendor & Tour Settlement | Track transport vendors, guide payments, and final balance collection without paperwork. |

**Schools & Educational Institutes** — Powered by School & College ERP
Tagline: "Student lifecycle, attendance rosters & automated fee collections"

| Step | Detail |
| --- | --- |
| 01. Admissions & Enrollment | Digital student registration, roll number allocation, and parent portal profile creation. |
| 02. Daily Attendance & Records | Teachers mark daily attendance on mobile; automated SMS sent to parents of absent students. |
| 03. Automated Fee Management | Term fee invoices with integrated payment links; digital collection reduces cash queues at the desk. |

---

## 9. Homepage section 5: How We Onboard You

**Small heading:** White-Glove Implementation

**Heading:** No Disruption. No Headaches. How We Onboard You.

**Paragraph:** "You don't spend months wrestling with software configuration. Our team migrates your data and trains your staff in 14 days."

| No. | Label | Title | Description | Tag |
| --- | --- | --- | --- | --- |
| 01 | DISCOVERY | Discovery & Workflow Mapping | We map your daily business operations, branches, and staff roles to eliminate spreadsheet bottlenecks. | Workflow Audit · Custom Rules |
| 02 | WALKTHROUGH | Interactive Live Demo | Experience your specialized ZUGEE product populated with your own trade structure and real business examples. | Custom Demo · Live Validation |
| 03 | MIGRATION | White-Glove Data Migration | Our engineers import your legacy customer ledgers, inventory SKUs, and balances from Excel or Tally with backups and validation at every step. | Clean Ledgers · Role Permissions |
| 04 | LAUNCH | Go-Live & Dedicated Support | Your team receives guided mobile training. You begin billing and dispatching live with dedicated onboarding support. | Live Operations · Ongoing Support |

**Banner:** "Typical Setup: 14 Days, Start to Finish" — "Discovery, data migration, staff training and go-live — we handle it all so you don't have to."

**Button:** "Start Your Onboarding"

---

## 10. Homepage section 6: Pricing

**Small heading:** Transparent Investment

**Heading:** Predictable Plans. Zero Hidden Surprises.

**Paragraph:** "Choose monthly flexibility or unlock 20% savings + 100% free white-glove onboarding with an annual subscription."

**Billing switch:** "Annual Billing — Save 20% + Free Setup" (selected by default) · "Monthly Billing"

### Starter Plan

| Field | Annual billing | Monthly billing |
| --- | --- | --- |
| Tag | Single Branch | Single Branch |
| Price | ₹1,599 / month | ₹1,999 / month |
| Under the price | + GST as applicable | + GST as applicable |
| Setup line | Billed annually (₹19,188/yr) • Setup Fee 100% Waived! | + ₹4,999 one-time white-glove setup |
| Summary box label | Annual commitment | First month payment |
| Summary box amount | ₹19,188 | ₹6,998 |
| Summary box note | Includes 12 months full cloud access + ₹0 setup fee | Includes ₹4,999 white-glove setup + ₹1,999 month 1 |

Description: "For independent businesses getting started with connected workflows."

Features:

- 1 branch
- Up to 5 users
- Core business management
- Customer management
- Basic reports
- Basic support

"What white-glove setup covers" (the page shows the first five):

1. Business profile configuration
2. Basic GST and business settings
3. Initial user setup
4. Branch configuration
5. Help setting up your first customers and products
6. Basic data import
7. Initial system configuration
8. Product walkthrough
9. Basic onboarding support

Button: "Get Started"

### Growth Plan

Badge: "Most Popular Choice"

| Field | Annual billing | Monthly billing |
| --- | --- | --- |
| Tag | Multi-Branch | Multi-Branch |
| Price | ₹3,299 / month | ₹4,099 / month |
| Under the price | + GST as applicable | + GST as applicable |
| Setup line | Billed annually (₹39,588/yr) • Setup Fee 100% Waived! | + ₹9,999 one-time white-glove setup |
| Summary box label | Annual commitment | First month payment |
| Summary box amount | ₹39,588 | ₹14,098 |
| Summary box note | Includes 12 months full cloud access + ₹0 setup fee (Save ₹9,999) | Includes ₹9,999 white-glove setup + ₹4,099 month 1 |

Description: "For expanding businesses with multiple branches, dispatch operations, or teams."

Features:

- Multiple branches
- Up to 20 users
- Role-based permissions
- Automated follow-ups
- Advanced reports
- Business configuration

"What white-glove setup covers" (the page shows the first six):

1. Everything in Starter setup
2. Multi-branch configuration
3. Multiple user setup
4. Role and permission configuration
5. Help migrating your existing data
6. Workflow configuration
7. Admin training
8. Business-specific onboarding
9. Advanced configuration support

Button: "Get Started"

### Enterprise

| Field | Content |
| --- | --- |
| Tag | Custom Scale |
| Price | Custom |
| Under the price | Tailored to your legal entities & fleet volume |
| Description | For corporations requiring 20+ users, custom ERP integrations, or dedicated cloud instances. |
| Summary box | Implementation Scope: Dedicated Architect — "Full custom legacy database bridge and tailored workflow design included." |
| Button | Talk to Founders |

Features:

- Unlimited branches & staff accounts
- Dedicated cloud database & high-speed backup
- Custom module development & API webhooks
- On-site staff & management training
- 24/7 Dedicated SLA & direct founder hotline
- Sovereign data hosting with custom compliance

### Feature matrix

Opened by the button "Compare All Plan Features & Limits" (closes with "Hide Detailed Feature Matrix"). Column headings: Feature Capability · Starter · Growth (Popular) · Enterprise.

**Scale & Capacity**

| Feature Capability | Starter | Growth (Popular) | Enterprise |
| --- | --- | --- | --- |
| Active User Accounts | Up to 5 Users | Up to 20 Users | Unlimited Users |
| Branches & Locations | 1 Single Branch | Multiple Branches | Unlimited Multi-Company |
| Mobile Field Access | Included | Role-Based Hierarchy | Custom Roles & Permissions |

**Financials & Compliance**

| Feature Capability | Starter | Growth (Popular) | Enterprise |
| --- | --- | --- | --- |
| GST & Tax Invoicing | Standard GST Bills | E-Invoicing & E-Way Bills | Multi-GSTIN & Consolidated |
| Customer Ledgers | Standard | Real-time Multi-Branch Sync | Automated Bank Reconciliation |
| Automated Payment Links | UPI & Bank Transfer | Automated Reminders | Custom Payment Gateway / Escrow |

**Implementation & Support**

| Feature Capability | Starter | Growth (Popular) | Enterprise |
| --- | --- | --- | --- |
| White-Glove Setup | ₹4,999 (FREE on Annual) | ₹9,999 (FREE on Annual) | Custom Architect Included |
| Legacy Data Migration | Excel & Customer Lists | Full Tally & Ledger History | Custom ERP & Database Bridge |
| Implementation SLA | 14-Day Target | 14-Day Target | Dedicated Sprint Schedule |
| Support Channels | Email & Chat Support | Priority Support Line | Dedicated Account Manager |

### Trust badges

| Badge | Line under it |
| --- | --- |
| 🇮🇳 Indian Data Sovereignty | Data never leaves Indian soil |
| 🛡️ GST ITC Invoices | GST-compliant billing |
| ⏱️ 14-Day Setup Target | Typical white-glove setup timeline |
| 🔄 1-Click Data Export | Never locked in, own your data |

### Setup by product

**Heading:** White-Glove Setup is Custom-Tailored to Your Trade

**Line:** "During the 14-day onboarding, our engineers configure workflows specific to your product:"

| Product | Setup items |
| --- | --- |
| Tours & Travels CRM | Travel business configuration · Package configuration · Vendor setup · Currency setup · Booking workflow |
| Transposs | Fleet configuration · Vehicle setup · Driver setup · Trip settings |
| Resort Management | Property configuration · Room setup · Booking settings · Payment configuration |

---

## 11. Homepage section 7: Frequently Asked Questions

**Heading:** Frequently Asked Questions

**Line under it:** "Everything you need to know about ZUGEE"

**1. Which ZUGEE products can I use today?**
Every product marked Available is ready to use today. Book a demo and we will arrange a meeting to show you the product working before you decide. Products marked Coming Soon are still being built.

**2. Can I use more than one ZUGEE product?**
Yes. Today each product is set up as its own connected system with separate logins. A unified ZUGEE account that opens all your products with shared users and branches is actively being built and coming soon.

**3. What is the one-time setup fee?**
It covers setting up ZUGEE around your business: your business profile, users, branches, workflows and first data, plus a walkthrough and onboarding support. It's ₹4,999 on Starter and ₹9,999 on Growth, paid once with your first month (for example ₹6,998 to start on Starter).

**4. Do I pay the setup fee again every month?**
No. The setup fee is charged once per product. After that you only pay the monthly subscription: ₹1,999/month on Starter or ₹4,099/month on Growth. Prices exclude GST.

**5. My industry isn't listed. Can ZUGEE still help?**
Choose "Something else" in the form and tell us what you need. We will tell you honestly whether one of our products fits.

**6. Can I still use Tally alongside ZUGEE?**
Yes. ZUGEE handles your daily operations, billing and customer management. Your chartered accountant can continue using Tally for statutory filings and audits. We can export the data your accountant needs in a format they can work with.

**7. Where is my business data stored?**
All ZUGEE data is stored on secure cloud servers located within India. We do not store business data outside the country. Your data is backed up and accessible only by authorised users in your organisation.

**8. Does ZUGEE support WhatsApp notifications?**
WhatsApp Cloud API integration is currently rolling out. Once live, ZUGEE will send invoices, payment reminders, booking confirmations and dispatch alerts directly to your customers on WhatsApp. This feature is actively being built but not yet available. Book a demo and we will share the latest timeline.

**Under the list:** "Feature roadmap updated September 2026" · "Still have questions?" · link "Get in touch with us"

---

## 12. Homepage section 8: Final call to action

**Heading:** Ready to transform your business?

**Paragraph:** "Built with input from Indian SME operators. Streamline operations, boost productivity, and scale smarter — with software designed around how Indian businesses actually work."

**Three benefits:**

- Setup in 2 weeks
- Data stays in India
- Plans from ₹1,599/mo + GST

**Button:** "Book Your Free Demo"

**Under the button:** "No credit card required · Free consultation"

**Trust line:** Enterprise-Grade Security · Built for Indian SMEs · Typical Setup in 2 Weeks

---

## 13. Homepage section 9: Book a demo

**Heading:** Book a demo

**Paragraph:** "Tell us about your business. We'll call or WhatsApp you to fix a time and show you the product live."

### Form fields

| Label | Required | Placeholder or options |
| --- | --- | --- |
| Your name * | Yes | — |
| Mobile / WhatsApp * | Yes | +91 98765 43210 |
| Business type * | Yes | "Choose your business type…", then the 17 products as "{industry} — {product}", then "Something else" |
| Email (optional) | No | — |
| Company name (optional) | No | — |
| What do you need? (optional) | No | "For example: we run 3 branches and track stock in Excel" |

**Button:** "Book a Demo" (shows "Sending…" while submitting)

**Under the button:** "We only use these details to contact you about ZUGEE."

Choosing a plan in the pricing section fills the message with "I'm interested in the {plan name} plan." Choosing a product fills the business type.

### Messages the visitor can see

| Situation | Message |
| --- | --- |
| Success | "Thanks, {name}." · "We'll contact you on {phone} to arrange your demo." · "Your reference: ZUG-XXXXXX" · link "Send another request" |
| Name missing or too short | "Please provide a valid full name." |
| Phone invalid | "Please enter a valid mobile or WhatsApp number." |
| Business type not chosen | "Please choose your business type." |
| Email invalid | "Please check your email address, or leave it blank." |
| Company too long | "Company name must be under 160 characters." |
| Message too long | "Message must be under 2000 characters." |
| Too many submissions | "Too many submissions. Please try again in {n} minute(s)." |
| Server problem | "We couldn't save your details. Please try again in a few minutes." |
| No connection | "We couldn't reach our server. Please check your connection and try again." |

---

## 14. Footer

| Column | Content |
| --- | --- |
| Brand | ZUGEE logo · "Industry-focused CRM, ERP, billing and operations software for Indian businesses." · badge "Built for Indian SMEs" |
| Quick Links | Products · How it works · Pricing · FAQ · Book a demo |
| Products | ZUGEE ERP / CRM · Transposs · Tours & Travels CRM · Aqua ERP · Real Estate ERP · ManuFlow · "View all products →" |
| Bottom line | "© 2026 Zugee Systems Technologies Pvt. Ltd. All rights reserved." · button "Back to top" |

---

## 15. Emails sent by the website

### Email to the ZUGEE team when a demo is requested

| Part | Content |
| --- | --- |
| Subject | "🚀 New Demo Request: {name} - {business type} ({reference})" |
| Badge | Live Demo Notification |
| Heading | New Demo Request Received |
| Details shown | Reference ID · Full Name · Mobile / WhatsApp · Product / Business · Email Address · Company Name · Requirements / Notes |
| Buttons | "Chat on WhatsApp" · "View in Admin Portal" |
| Footer | "Sent automatically by Zugee Platform • {date and time, IST}" |

### Confirmation email to the visitor (only if they gave an email)

| Part | Content |
| --- | --- |
| Subject | "Your Demo Request with Zugee ({reference})" |
| Heading | Demo Request Received |
| Body | "Hi {name}," · "Thank you for requesting a live demo of {product}." · "Our team will contact you on {phone} via call or WhatsApp to schedule a convenient time for your 1-on-1 walkthrough." |
| Box | "Your Reference Number: {reference}" |
| Note | "If you have any urgent queries, feel free to reply directly to this email." |
| Footer | "© {year} Zugee. All rights reserved." |

Plain-text version of the confirmation:

> Hi {name},
>
> Thank you for your interest in {product}!
>
> We have received your demo request (Reference: {reference}).
>
> Our product team will connect with you on {phone} shortly to arrange your live interactive walkthrough and answer any questions.
>
> Best regards,
> The Zugee Team
> https://www.getzugee.com

---

## 16. Customer app (`/app`)

Login to this area does not work yet, so customers cannot currently see these screens. The text is recorded here because it is written and ready.

### Sign-in page (`/app/auth`)

**Left panel:** "Your business, in one place" · "Sign in to track your leads, their status and your next follow-ups." · feature card "Lead tracking — Keep every enquiry with its status, priority, notes and next follow-up date."

**Page footer:** "© 2026 Zugee Systems Technologies Pvt. Ltd. All rights reserved."

| Mode | Heading | Line under it | Fields | Button |
| --- | --- | --- | --- | --- |
| Sign in | Welcome back | Sign in to your Zugee dashboard | Email, Password | Sign In |
| Sign up | Create your account | Set up your Zugee dashboard | Business Name, Business Type, State, Phone (Optional), Email, Password ("Minimum 8 characters") | Create account |
| Magic link | Sign in with magic link | We'll email you a link to sign in | Email | Send Magic Link |
| Reset | Reset your password | We'll email you a link to reset your password | Email | Send Reset Link |

Links: "Sign in with magic link instead" · "Don't have an account? Create account" · "Forgot password?" · "Already have an account? Sign in" · "← Back to sign in"

Placeholders: "you@company.com" · "Your Business Pvt Ltd" · "Retail, Manufacturing, Services, etc." · "Select your state" · "+91 98765 43210"

Under the sign-up form: "By signing up, you agree to our Terms of Service and Privacy Policy"

Success messages: "Account created! Check your email to verify your account." · "Check your email for the magic link to sign in!" · "Check your email for the password reset link!"

State list (28): Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal.

### Menu

| Group | Items |
| --- | --- |
| Main | Dashboard · CRM · Ads (Coming Soon) · GST (Coming Soon) |
| Back Office | Billing · Inventory (Coming Soon) · Employees (Coming Soon) · Reports (Coming Soon) |
| Bottom | Sign Out |

### Dashboard

Title "Dashboard" · subtitle "Your leads at a glance" or "Welcome back, {business name}" · button "Refresh"

| Card | Line under the number |
| --- | --- |
| Total Leads | All leads in your CRM |
| New Today | Added since midnight (IST) |
| Follow-ups Due | Due today or overdue |
| Converted | Leads marked converted |

Card: "Work your leads" — "Update status, priority, follow-up dates and notes in the CRM." — button "Open CRM"

Error state: "Unable to load dashboard" — button "Try Again"

### CRM

Title "CRM" · subtitle "Track your leads and follow-ups"

- Search box: "Search leads..."
- Filter: All Leads, New, Hot, Follow-up, Contacted, Qualified, Converted, Lost
- Empty list: "No leads found" — "Try adjusting your filters or add a new lead"
- Nothing selected: "Select a lead to view details" — "Choose a lead from the list to see their information and update their status."
- Lead form fields: Name, Email, Phone, Company, Status, Priority (Low, Medium, High), Source, Estimated value, Next Follow-up, Notes ("Add notes about this lead...")
- Timeline labels: Created, First Contact, Last Contact, Next Follow-up

### Billing

Title "Billing" · subtitle "Your ZUGEE subscription, invoices and payments"

- Section heading: "Subscription"
- No subscription: "No active subscription yet — our team sets this up after your demo."
- Load failure: "We couldn't load your subscription right now. Please try again in a moment."
- Coming Soon box: "Invoices for your customers" — "Create GST invoices, record payments and see who still owes you money."

### Coming Soon screens

| Page | Title | Subtitle | Coming Soon text |
| --- | --- | --- | --- |
| Ads | Ads | Meta and Google ad performance | Connect your Meta and Google ad accounts to see spend and the leads each campaign brings in. |
| GST | GST | GST reporting for your business | GST summaries and return-ready reports built from the invoices you create in Zugee. |
| Inventory | Inventory | Products and stock levels | Keep a list of your products and track stock as you buy and sell. |
| Employees | Employees | Staff records | Keep your staff records in one place, with attendance and payroll to follow. |
| Reports | Reports | Business reports and data exports | Download sales, outstanding and stock reports for any period, built from your own records. |

---

## 17. Admin portal (`/admin`)

For the ZUGEE team only. Not visible to the public or to search engines.

### Login

- Heading: "Administrator Access Portal"
- Field: "Admin Master Password" — placeholder "Enter admin password..."
- Button: "Authenticate Session" ("Verifying Credentials..." while checking)
- Notes: "Secure httpOnly session" · link "Return to Site"
- Errors: "Invalid administrator password. {n} attempt(s) remaining before temporary lockout." · "Too many failed login attempts. Try again in {n} minute(s)." · "Remaining attempts before lockout: {n}"

### Lead dashboard

- Search box: "Name, phone, email, company or ref ID..."
- Filters: status (new, contacted, qualified, archived) and "All business types"
- Table columns: Ref ID · Date · Lead Contact · Industry · Status · Actions
- Detail panel: Full Name · Email · Phone / WhatsApp · Business type · Company · What they need · Logged Timestamp
- Buttons: Refresh Leads · Log Out · View Details · export to CSV
- CSV columns: Reference ID, Date, Name, Phone, Email, Company, Business type, Status, Goal (older form), Message, Source Page

### Subscriptions

- Search box: "Business name, phone or email..."
- Table columns: Customer · Product · Plan · Monthly fee · Setup fee · Setup status · Subscription · Start date · Renewal date · Actions
- "New subscription" form: Business name, Phone, Email, Product ("Choose a product"), Plan, customer account ID ("Only if they already have a ZUGEE login"), waiver reason ("Choose a reason"), Notes
- Subscription panel: Setup fee · Subscription · Waive setup fee · Change subscription status ("Choose a status") · Payments recorded · Notes · payment reference field "UTR / reference"
- Subscription statuses: Pending · Active · Past due · Cancelled
- Setup fee statuses: Pending · Completed · Waived · Refunded
- Payment methods: UPI · Bank transfer · Cash · Cheque · Card (offline) · Other
- Waiver reasons: Early customer · Promotional offer · Partner referral · Enterprise deal · Manual admin waiver · Existing customer (before setup fee)

---

## 18. Content the website does not have

These are commonly expected on a business website and are absent from the code today:

| Missing content | Notes |
| --- | --- |
| About Us page or section | No company story, founding year, team or founder names anywhere |
| Contact details | No phone number, WhatsApp number, email address or office address |
| Privacy Policy | Referred to on the sign-up form; no page exists |
| Terms of Service | Referred to on the sign-up form; no page exists |
| Refund policy | Not present |
| Individual product pages | Products appear only inside the homepage showcase |
| Customer names, testimonials, case studies | None |
| Company registration details (CIN, GSTIN) | None |
| Blog, news or careers | None |
| Social media links | None |

A note in the footer code says the trust details (address, phone, WhatsApp, support email, founder and team names, and links to privacy, terms and refund pages) are waiting on real details from the founder.
