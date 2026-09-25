# Zugee Project — Complete Design & Content Documentation

**Document Version:** 1.0  
**Last Updated:** 2026-09-25  
**Project:** Zugee Systems Technologies Pvt. Ltd. — Marketing Website

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What is Zugee?](#what-is-zugee)
3. [Brand Identity](#brand-identity)
4. [Design System](#design-system)
5. [Content Strategy](#content-strategy)
6. [Page Structure & Sections](#page-structure--sections)
7. [Target Verticals](#target-verticals)
8. [Technical Architecture](#technical-architecture)
9. [Component Patterns](#component-patterns)
10. [Marketing & Messaging](#marketing--messaging)

---

## 1. Project Overview

### Project Type
Marketing website with lead capture and internal admin portal for Zugee — a GST billing and inventory management SaaS platform designed for small businesses in India.

### Technology Stack
- **Framework:** Next.js 16 (App Router)
- **React:** Version 19
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 13
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Designed for Vercel/serverless hosting

### Purpose
Convert business owners from traditional tools (Tally, Excel, WhatsApp, Paper) to a unified platform that handles GST billing, inventory tracking, payment follow-ups, and customer communication.

---

## 2. What is Zugee?

### Product Definition
**Zugee** is a comprehensive business management software platform designed specifically for small to medium-sized businesses in India (5-50 employees) that currently rely on fragmented tools like:

- **Tally** for accounting
- **Excel** for inventory
- **WhatsApp** for customer communication
- **Paper receipts** for manual record-keeping

### Core Value Proposition
> "GST billing and inventory software that gets you paid on time."

Zugee consolidates billing, stock management, payment tracking, and customer communication into **one unified dashboard**.

### Primary Problem Solved
Business owners struggle with:
- Scattered financial data across multiple tools
- Manual reconciliation taking hours/days
- Lost receipts and untracked payments
- Delayed customer payment follow-ups
- Complex GST compliance calculations

### Solution Delivered
- **Unified Dashboard:** One screen shows sales, GST payable, stock levels, and outstanding payments
- **Automated GST:** CGST, SGST, and IGST calculated automatically on every bill
- **WhatsApp Integration:** Invoices, payment links, and reminders sent directly from business number
- **Real-time Sync:** Payment gateway reconciliation happens instantly
- **CA-Ready Reports:** GSTR-1 ready monthly reports for chartered accountants

---

## 3. Brand Identity

### Brand Name
**Zugee Systems Technologies Pvt. Ltd.**

### Tagline
> "Engineered for operational precision."

### Brand Personality
- **Professional:** Enterprise-grade reliability
- **Modern:** Cutting-edge technology and design
- **Trustworthy:** Secure, compliant, and transparent
- **Accessible:** Built for business owners, not tech experts
- **Indian:** GST-native, built for Indian business workflows

### Visual Identity

#### Mascot (current logo)
- **Character:** A friendly blue genie-robot with a visor face, arms crossed, a glowing "Z" on its chest, and a flowing tail instead of legs
- **Personality:** Helpful, reliable, futuristic, approachable
- **Design Style:** 3D glossy, rounded forms with glowing cyan accents, on a pure black background
- **Animation:** Subtle floating/levitating motion (`.animate-mascot-float`, off under reduced motion)
- **Usage:**
  - **Logo icon** everywhere (navbar, footer, app sidebar, auth, admin): head + chest crop in `public/zugee-mascot-icon.png`, on a black rounded tile so the crop edge disappears
  - **Favicon:** head crop in `app/favicon.ico` (16/32px), `public/icon-192.png` and `public/apple-touch-icon.png`
  - **Full figure:** `public/zugee-mascot-cutout.webp`, shown beside the final CTA form on desktop; its black background is converted to transparency
  - Not in the hero. The hero stays focused on the headline and CTA

#### Logo
- **Wordmark:** "ZUG" in white + "EE" in a white → cyan gradient, heavy sans-serif
- **Icon:** The mascot crop (see above). The earlier ribbon "Z" SVG mark is retired
- **Full Lockup:** Mascot icon + wordmark + company name + tagline (`components/ui/MascotLogo.jsx`)
- **Still on the old mark:** `public/zugee-brand-banner.png` (Open Graph / Twitter image) and `public/og-image.png`. TODO: regenerate with the mascot

#### Color Palette

**Primary Colors:**
- **Royal Blue:** `#1B6FF8` — Primary brand color, represents trust and technology
- **Neon Cyan:** `#00F0FF` — Accent color, represents innovation and precision
- **Deep Obsidian:** `#06090F` — Canvas background, creates depth

**Secondary Colors:**
- **Surface Dark:** `#0B111E` — Card backgrounds
- **Elevated Surface:** `#0D1527` — Raised elements
- **Slate Grays:** `#94A3B8`, `#64748B`, `#475569` — Text hierarchy

**Accent Colors:**
- **Light Blue:** `#38BDF8` — Hover states and highlights
- **Emerald:** `#10B981` — Success indicators
- **Amber:** `#F59E0B` — Warning/attention

#### Typography

**Font Family:**
- **Primary:** Plus Jakarta Sans (`next/font/google`, CSS variable `--font-sans`)
- **Monospace:** JetBrains Mono (`--font-mono`), used for metrics, badges, technical labels

**Type Scale:**
```css
Hero Headline:     48-64px, font-weight: 800
Section Heading:   32-48px, font-weight: 800
Subsection:        20-24px, font-weight: 700
Body Large:        16-20px, font-weight: 400
Body:              14-16px, font-weight: 400
Small/Label:       12-13px, font-weight: 600
Micro/Mono:        11px,    font-weight: 600
```

**Letter Spacing:**
- Headings: `-0.025em` (tight tracking)
- Uppercase labels: `0.1em` (wide tracking)
- Body: Normal

---

## 4. Design System

### Design Philosophy
Inspired by enterprise SaaS leaders:
- **Linear:** Clean interfaces, precise spacing
- **Stripe:** Sophisticated gradients, subtle animations
- **Supabase:** Developer-friendly dark themes
- **Vercel:** Minimal, fast-loading, performance-focused

### Visual Language

#### Depth & Elevation
Uses layered cards with subtle borders and backdrop blur to create a sense of depth:

```css
Z-Index Layers:
- Canvas:    0  (bg-[#06090F])
- Surface:   1  (bg-[#0B111E])
- Card:      2  (bg-[#0D1527]/80)
- Elevated:  3  (border + shadow)
- Floating:  4  (glass panel + glow)
```

#### Lighting Model
- **Ambient Radial Glows:** Soft blue/cyan gradients behind sections
- **Specular Highlights:** Subtle white inset border on top edges
- **Shadow Depth:** Multi-layer box-shadows with blur
- **Glow Effects:** Color-matched glow on hover states

#### Border Strategy
- **Subtle:** `rgba(255,255,255,0.08)` — Default card borders
- **Medium:** `rgba(255,255,255,0.12)` — Elevated elements
- **Focus:** `#00F0FF` with `0.4` opacity — Interactive states

#### Animation Principles
- **Duration:** 200-300ms for micro-interactions
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — "Ease-out-expo" feel
- **Transform:** Prefer GPU-accelerated properties (transform, opacity)
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce`

### Key Visual Elements

#### Glass Panels
Frosted glass aesthetic with:
- Background: `rgba(11,18,34,0.82)`
- Backdrop blur: `20px`
- Border: Subtle white with gradient
- Inset highlight for depth
- Hover: Cyan border glow

#### Gradient Text
Multiple gradient patterns:
- **Blue-Cyan Spectrum:** White → Cyan → Blue (hero headlines)
- **Cyan Gradient:** Cyan → Light Blue (accents)
- **Blue Gradient:** Royal Blue → Sky Blue (emphasis)

#### Cyber Grid
Background pattern: 
- Semi-transparent white grid lines
- 48px × 48px cell size
- Creates technical, precise aesthetic

#### Button System

**Primary Button:**
- Gradient: Cyan → Blue
- Cyan border with glow
- Dark text (high contrast)
- Lifts on hover with increased glow
- Shadow: `0 0 30px rgba(0,240,255,0.4)`

**Secondary Button:**
- Translucent white background
- White border
- Backdrop blur
- Cyan accent on hover

---

## 5. Content Strategy

### Content Philosophy
**Strict Honesty Principles:**
1. ❌ Zero fabricated company names, customer names, or client testimonials
2. ❌ No made-up metrics or claimed results
3. ✅ All dashboard examples use generic category labels
4. ✅ All metrics are explicitly labeled as "targets" or "sample data"
5. ✅ Claims are either verifiable or marked TODO for founder confirmation

### Tone of Voice

**Writing Principles:**
- **Direct:** No fluff or marketing jargon
- **Conversational:** "Your bills live in Tally" (not "Businesses utilize Tally")
- **Benefit-Focused:** Lead with outcomes, not features
- **Honest:** If we can't verify it, we don't claim it
- **Relatable:** Speak to the daily frustrations of business owners

**What to Avoid:**
- ❌ "AI-powered" (not in product description)
- ❌ "Revolutionary," "game-changing," exaggerated claims
- ❌ Fake customer names or company testimonials
- ❌ Fabricated success metrics

### Voice Examples

**Bad (Generic SaaS):**
> "Leverage our cutting-edge AI-powered platform to revolutionize your business operations and achieve unprecedented growth."

**Good (Zugee):**
> "Your bills live in Tally, your stock in Excel and your customer follow-ups in WhatsApp. Zugee puts all three in one place, so nothing gets missed."

---

## 6. Page Structure & Sections

The homepage follows a six-section structure optimized for conversion:

### Section 1: Hero
**Goal:** Immediate clarity on what Zugee does and who it's for

**Elements:**
- Primary headline with gradient text emphasis
- Clear value proposition (gets you paid on time)
- Problem statement (Tally + Excel + WhatsApp)
- Dual CTAs: Primary (Book Call) + Secondary (How it works)
- Pricing teaser: "From ₹1,999/month · Free 2-week setup with your real data"
- Visual comparison: "Today" (4 tools) vs "With Zugee" (1 platform)

**Copy Pattern:**
```
[Product Category] that [Primary Outcome]
[Relatable Problem] → [Simple Solution]
[Low-friction CTA]
```

### Section 2: Proof
**Goal:** Build trust through social proof

**Elements:**
- Customer testimonials (TODO: real customer quotes)
- Success metrics banner (TODO: verified data)
- Trust indicators (security, compliance badges)

**Status:** Placeholder content pending real testimonials

### Section 3: Product
**Goal:** Show the actual dashboard and core outcomes

**Elements:**
- **Dashboard Preview:** Live-looking mockup with sample data
- **Four Core Outcomes:**
  1. Send GST invoices in under a minute
  2. Know exact stock before promising customers
  3. See outstanding payments and send reminders
  4. Hand CA ready reports, not paper

**Dashboard KPIs Shown:**
- Sales today: ₹42,300 (18 bills)
- GST payable this month: ₹31,860
- Low-stock items: 6
- Pending payments: ₹1,18,500 (14 customers)

**Activity Feed:**
- "Invoice #0231 paid via UPI — matched to bank"
- "WhatsApp reminder sent — due in 2 days"

### Section 4: Why Zugee
**Goal:** Differentiate from competitors (especially Tally)

**Three Differentiators:**

1. **WhatsApp from Business Number**
   - Invoices and reminders from your business, not staff phones
   - Message history stays with you when staff leave

2. **GST Built In**
   - CGST, SGST, IGST calculated automatically
   - GSTR-1 ready data at month-end

3. **One Login**
   - No copying numbers between Tally, Excel, WhatsApp
   - Everything in one place

### Section 5: Pricing
**Goal:** Remove buying objections and capture leads

**Two Tiers:**

| Feature | Starter | Growth |
|---------|---------|--------|
| Price | ₹1,999/month | ₹4,099/month |
| Users | Up to 5 | Up to 20 |
| Branches | Single | Multiple |
| Support | Email + WhatsApp | Priority + Onboarding |

**Both Include:**
- GST invoicing & e-invoice
- Stock tracking with alerts
- WhatsApp payment reminders
- Tally XML export
- Free 2-week setup with the customer's real data after the discovery call (the marketing site makes no self-serve free-trial claim)

**FAQ Section:**
Six real buying objections answered:
1. Can I move data from Tally?
2. Does Zugee file GST returns?
3. How much does it cost? (answer mentions the free 2-week setup, not a trial)
4. Does it work without internet?
5. Is my data safe?
6. How long does setup take?

### Section 6: Contact / Final CTA
**Goal:** Capture qualified leads through discovery call booking

**Elements:**
- Lead capture form, with the floating mascot beside it on desktop
- Industry selector (11 verticals)
- Final CTA: "Book a Discovery Call"
- Trust reinforcement (company name, security indicators)

---

## 7. Target Verticals

Zugee serves **11 specific verticals**, each with customized positioning. The "Planning target" lines are goals, not achieved results. They must never be published without the word "Target".

### 1. Education (K-12 & Higher Education)
**Problem:** Scattered fee receipts, manual WhatsApp follow-ups, multi-week reconciliation delays  
**Solution:** Unified fee ledgers, automated payment notices, instant 80G tax receipts  
**Key Feature:** Multi-tier fee structures (tuition, transport, lab, installments)

### 2. Hospitality (Resorts, Boutique Hotels)
**Problem:** Fragmented bookings, manual ID scanning, unbilled restaurant tabs  
**Solution:** Digital WhatsApp check-in, real-time room folios, instant GST invoices  
**Planning target:** 4-minute paperless guest check-ins

### 3. Real Estate (Commercial Property)
**Problem:** Rent collection spreadsheets, missed lease escalations, complex CAM math  
**Solution:** Automated rent roll with escalations, CAM/utility billing, TDS tracking  
**Planning target:** 100% automated monthly rent roll generation

### 4. Logistics (Warehousing & Fleet)
**Problem:** Truck drivers stuck waiting for e-way bills, lost delivery receipts  
**Solution:** Instant e-way bill generation via NIC API, WhatsApp driver bot, photo POD  
**Planning target:** zero manual e-way bill bottlenecks

### 5. Healthcare (Clinics, Diagnostic Labs)
**Problem:** Long reception queues, lost lab reports, missed appointments  
**Solution:** OPD token system, automated PDF lab reports via WhatsApp  
**Planning target:** 5-minute diagnostic report turnaround

### 6. Professional Services (CA, Legal Firms)
**Problem:** Untracked billable hours, scope creep, missed statutory filing dates  
**Solution:** Retainer billing, compliance calendar, WhatsApp document collection  
**Planning target:** zero unbilled hours or untracked retainers

### 7. Manufacturing (Job-Shop Fabrication)
**Problem:** Raw material stockouts, lost job cards, untracked scrap percentages  
**Solution:** Multi-level BOM, digital job cards, job-work challan tracking  
**Planning target:** real-time BOM reconciliation

### 8. Retail (Multi-Outlet Franchises)
**Problem:** Inventory stuck at one branch while another runs out  
**Solution:** Multi-store inventory sync, inter-branch transfers, paperless receipts  
**Planning target:** same-day inter-branch stock rebalancing

### 9. Fitness (Gyms, Wellness Studios)
**Problem:** Expired members accessing facilities, manual PT session tracking  
**Solution:** Turnstile access sync, automated renewal sequences, PT redemption  
**Planning target:** 95%+ timely renewal conversion

### 10. Facility Management (Field Services)
**Problem:** Technicians missing SLA windows, unverified site visits  
**Solution:** GPS-verified dispatch, digital sign-offs, preventive maintenance scheduler  
**Planning target:** 100% SLA compliance on high-priority tickets

### 11. Events (Equipment Rental, AV Production)
**Problem:** Double-booked audio/lighting gear, missing flight cases, disputed damages  
**Solution:** Equipment booking calendar, barcoded case tracking, crew call sheets  
**Planning target:** zero double-booking of high-value gear

---

## 8. Technical Architecture

### File Structure
```
zugee/
├── app/
│   ├── (marketing)/           # Public homepage
│   │   ├── layout.jsx         # Navbar + Footer wrapper
│   │   └── page.jsx           # Six-section homepage
│   ├── admin/                 # Protected admin portal
│   │   ├── layout.jsx         # Admin-only layout
│   │   ├── page.jsx           # Login redirect
│   │   └── dashboard/         # Lead management
│   ├── api/                   # Backend routes
│   │   ├── leads/             # POST lead submissions
│   │   ├── subscribe/         # POST newsletter
│   │   └── admin/             # Auth + admin data
│   ├── globals.css            # Design system CSS
│   ├── layout.jsx             # Root layout
│   └── favicon.ico
├── components/
│   ├── home/                  # Homepage sections
│   │   ├── Hero.jsx
│   │   ├── ProofSection.jsx
│   │   ├── ProductSection.jsx
│   │   ├── WhyZugee.jsx
│   │   ├── PricingSection.jsx
│   │   └── ContactSection.jsx
│   ├── layout/
│   │   ├── Navbar.jsx         # Fixed header with scroll effect
│   │   └── Footer.jsx         # Newsletter + links
│   ├── admin/
│   │   └── AdminLoginForm.jsx
│   └── ui/                    # Reusable primitives
│       ├── MascotLogo.jsx     # Brand lockup (mascot icon + wordmark)
│       ├── MotionProvider.jsx # Framer Motion wrapper
│       ├── MotionReveal.jsx   # Scroll animation
│       ├── PrecisionIcons.jsx # Custom icons
│       ├── SpotlightCard.jsx  # Hover effect card
│       └── StatusBadge.jsx    # Live indicator
├── lib/
│   ├── auth.js                # Admin session management
│   ├── rate-limit.js          # In-memory rate limiter
│   ├── supabase.js            # Database client
│   └── verticals.js           # ⭐ SINGLE SOURCE OF TRUTH
├── supabase/
│   └── schema.sql             # Database schema
├── public/                    # Static assets
│   ├── zugee-mascot-cutout.webp # Full mascot, transparent (final CTA)
│   ├── zugee-mascot-icon.png  # Logo icon crop
│   ├── icon-192.png           # Favicon (PNG)
│   ├── apple-touch-icon.png
│   ├── zugee-brand-banner.png # OG image (old mark, TODO)
│   └── og-image.png
└── package.json
```

### Single Source of Truth: `lib/verticals.js`

**Critical Design Principle:**  
All content lives in **one file** to prevent drift between:
- Homepage section copy
- Structured data (Schema.org JSON-LD)
- Admin vertical labels
- Future industry-specific landing pages

**What's in verticals.js:**
- 11 vertical definitions (problems, solutions, mockup data)
- Pricing tiers with exact prices
- FAQ items (rendered on page AND in FAQPage schema)
- All copy claims are either verifiable or marked TODO(founder)

### Rendering Strategy

**Server Components (Default):**
- All homepage sections render on server
- No JavaScript needed for initial paint
- Fast Time to First Byte (TTFB)

**Client Components (Selective):**
- Navbar (scroll effect, mobile menu)
- Motion animations (Framer Motion)
- Forms with validation states
- Admin dashboard interactions

### Data Flow

**Public Lead Submission:**
```
Form Submit → /api/leads → Rate Limit Check → Validation → Supabase Insert → Success
```

**Admin Authentication:**
```
Login → /api/admin/auth → Password Check → JWT Cookie (httpOnly, 24h) → Dashboard
```

**Lead Management:**
```
Dashboard → /api/admin/leads (GET) → Supabase Query → Render Table
```

---

## 9. Component Patterns

### Navbar Pattern
- **Fixed Position:** Stays at top on scroll
- **Scroll Effect:** Background blur + border appears after 20px scroll
- **Mobile Menu:** Animated drawer with smooth transitions
- **Responsive Lockup:** Shows/hides subline based on breakpoint
- **CTA Visibility:** Primary CTA always visible

### Card Pattern
```jsx
<div className="glass-panel rounded-3xl p-6 hover:border-cyan-primary">
  {/* Icon in colored container */}
  <div className="w-11 h-11 rounded-2xl bg-cyan-primary/10 border border-cyan-primary/30">
    <Icon />
  </div>
  
  {/* Heading + Body */}
  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
  <p className="text-sm text-slate-300">{body}</p>
</div>
```

### Motion Reveal Pattern
```jsx
<MotionReveal delay={0.1}>
  {/* Content fades in + slides up on scroll into view */}
</MotionReveal>
```

### Dashboard Mockup Pattern
```jsx
<div className="glass-panel">
  {/* Browser chrome with traffic lights */}
  <div className="bg-surface border-b px-5 py-3">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-red-500/80" />
      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
      <span className="text-xs font-mono text-slate-300">Zugee · Dashboard</span>
    </div>
    <span className="text-xs font-mono text-slate-400">Sample data</span>
  </div>
  
  {/* KPI Grid */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6">
    {kpis.map(kpi => (
      <div className="bg-card rounded-2xl p-4">
        <span className="text-xs font-mono text-slate-400">{kpi.label}</span>
        <div className="text-2xl font-bold font-mono">{kpi.value}</div>
        <span className="text-xs text-cyan-primary">{kpi.sub}</span>
      </div>
    ))}
  </div>
</div>
```

### Button Hierarchy
1. **Primary:** Gradient cyan-blue, dark text, max glow (CTA)
2. **Secondary:** Translucent white, white text, subtle border (Learn more)
3. **Tertiary:** Text-only link with cyan hover (Footer links)

---

## 10. Marketing & Messaging

### Positioning Statement
> "Zugee is business management software for small businesses in India that consolidates GST billing, inventory tracking, and payment follow-ups into one login — replacing the fragmented workflow of Tally, Excel, and WhatsApp."

### Key Messages

#### Message 1: Unified Platform
**Headline:** One dashboard for bills, stock and payments  
**Support:** No more copying numbers between Tally, Excel and WhatsApp

#### Message 2: Time Savings
**Headline:** Send a GST invoice in under a minute  
**Support:** Tax already applied, no manual calculation

#### Message 3: Get Paid Faster
**Headline:** See who owes you money and send a reminder in one tap  
**Support:** Automated WhatsApp payment links from your business number

#### Message 4: GST Compliance
**Headline:** GST is built in, not bolted on  
**Support:** CGST, SGST, IGST calculated on every bill; GSTR-1 ready reports

#### Message 5: CA-Ready Reporting
**Headline:** Hand your CA ready reports, not a shoebox of paper  
**Support:** Tally XML export for seamless handoff

### Competitor Comparison

| Aspect | Tally | Excel + WhatsApp | **Zugee** |
|--------|-------|------------------|-----------|
| **Platform** | Desktop software | Multiple tools | Cloud (browser) |
| **GST** | Manual setup | Manual calculation | **Automatic** |
| **Inventory** | Yes | Manual tracking | **Real-time sync** |
| **WhatsApp** | No integration | Personal phones | **Business number** |
| **Payment Follow-ups** | Manual | Manual | **Automated** |
| **Multi-user** | Limited | No coordination | **Role-based** |
| **Mobile Access** | No | Limited | **Full access** |
| **Pricing** | TODO(founder): verify current Tally price | Free (labor cost) | **₹1,999/month** |

### Objection Handling

**"We already use Tally"**
→ Keep using Tally for your CA. Zugee exports to Tally XML. Use Zugee for daily billing and stock, Tally for year-end accounts.

**"WhatsApp works fine"**
→ What happens when your billing clerk leaves? All those customer chats are on their personal phone. With Zugee, messages come from your business number.

**"We can't afford another subscription"**
→ How many hours do you spend each month reconciling bills, chasing payments, and updating stock? Zugee pays for itself if it saves you 3 hours of work per month.

**"Is our data safe?"**
→ Encrypted in transit and at rest. Only people you add can see your data. More secure than Excel files on shared computers.
TODO(founder): add "automatic backups" (here and in FAQ #5 in `lib/verticals.js`) only once backups are confirmed configured, and name the hosting region.

**"We need GST compliance"**
→ That's exactly why Zugee exists. GST is calculated automatically on every bill (CGST, SGST, IGST). Your GSTR-1 data is ready at month-end.

**"Setup sounds complicated"**
→ Single-branch businesses start billing within a week. We import your Tally data during onboarding. You get a personal onboarding call with Growth plan.

---

## Design Patterns Summary

### Typography Scale
```
Hero:       4xl-6xl   (36-64px)
Section:    3xl-4xl   (30-48px)
Card Title: lg        (18px)
Body:       sm-base   (14-16px)
Label:      xs        (12px)
Micro:      [11px]    (11px mono)
```

### Spacing Scale
```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   12px  (0.75rem)
base: 16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  48px  (3rem)
3xl:  64px  (4rem)
```

### Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Z-Index Scale
```
header:  50
modal:   100
toast:   200
```

---

## Content Audit Checklist

Before publishing any new content, verify:

- [ ] No fabricated customer names or companies
- [ ] All metrics labeled as "targets" or "sample data"
- [ ] Claims are verifiable or marked TODO(founder)
- [ ] No "AI-powered" unless actually using AI
- [ ] GST terminology is accurate (CGST, SGST, IGST)
- [ ] Pricing matches verticals.js
- [ ] FAQ answers match FAQPage schema
- [ ] Industry examples use generic category labels
- [ ] "WhatsApp" capitalized correctly
- [ ] Rupee symbol formatted consistently: ₹1,999

---

## Design System Quick Reference

### Colors (CSS Variables)
```css
--bg-canvas:        #06090F   /* Page background */
--bg-surface:       #0B111E   /* Card background */
--blue-primary:     #1B6FF8   /* Brand blue */
--cyan-primary:     #00F0FF   /* Brand cyan */
--text-primary:     #FFFFFF   /* Headings */
--text-secondary:   #94A3B8   /* Body */
--border-subtle:    rgba(255,255,255,0.08)
```

### Key CSS Classes
```css
.container          /* Max-width container with padding */
.section-wrapper    /* Vertical section spacing */
.glass-panel        /* Frosted glass card */
.btn-primary        /* Primary CTA button */
.btn-secondary      /* Secondary button */
.eyebrow            /* Small uppercase label */
.blue-cyan-gradient-text  /* Gradient text effect */
```

### Animation Classes
```css
.animate-fade-in          /* CSS entrance animation */
.animate-mascot-float     /* Mascot levitation */
.laser-dot                /* Pulsing indicator */
.marquee-track            /* Infinite scroll */
```

---

## Next Steps & TODOs

### Content
- [ ] Add real customer testimonials to ProofSection
- [ ] Verify "typical onboarding time" with actual data
- [ ] Confirm user limits (5 vs 20) for pricing tiers
- [ ] Get founder approval on all TODO(founder) items in verticals.js

### Design
- [ ] Add industry-specific landing pages (/industries/education, etc.)
- [ ] Create OG images for each vertical
- [ ] Design admin dashboard improvements

### Technical
- [ ] Move rate limiter to Redis (Upstash) for multi-instance support
- [ ] Add analytics (PostHog or Vercel Analytics)
- [ ] Set up transactional email (Resend or SendGrid)
- [ ] Configure WAF rules for production

### Marketing
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Configure WhatsApp Business API integration
- [ ] Create demo video for hero section

---

**Document Maintained By:** Zugee Development Team  
**Questions:** Refer to `/lib/verticals.js` for all content claims  
**Updates:** This document should be updated whenever design patterns or content strategy changes.
