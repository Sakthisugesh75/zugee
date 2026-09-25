# ZUGEE — Brand, Content & Website Guide

**Version:** 2.0 · **Last updated:** 2026-09-25 · **Company:** Zugee Systems Technologies Pvt. Ltd.

Architecture, product statuses and the build roadmap live in [docs/ZUGEE-PLATFORM-PLAN.md](docs/ZUGEE-PLATFORM-PLAN.md). This guide covers how ZUGEE looks, speaks and presents itself. Version 1.0 described a single GST-billing product with 11 verticals. That positioning has been replaced.

---

## 1. What ZUGEE is

> **ZUGEE — Business Software Built for Real-World Operations**

ZUGEE makes industry-focused business software for Indian SMBs, enterprises and industry-specific businesses:
- **ZUGEE ERP/CRM** for general businesses.
- **Industry products:** Transposs (fleet), Tours & Travels CRM, Aqua ERP, Real Estate ERP, ManuFlow (manufacturing), and more coming.

**Where it's heading:** one ZUGEE account → one business workspace → multiple products, branches and users with role-based permissions. That shared account is being built, so the website must not claim it yet.

The product list and each product's status: `lib/products.js`.

---

## 2. The claim rule (non-negotiable)

Every statement on the site, in the product UI, in sales decks and in ads must pass:

> **"Can the current production product actually do this?"**

- **Yes:** publish it.
- **No:** remove it, or label it **Coming Soon**.

Never publish:
- invented statistics, customers, testimonials, logos or ratings
- fake dashboards or sample numbers presented as real results
- "AI" features that aren't real AI on real data
- tax figures not calculated from configured tax data
- future features described as if they exist
- company details (CIN, GSTIN, address, phone) that aren't real

A product may be marked **Available** only after the checklist in the platform plan, section F.

---

## 3. Voice

Write for a shop owner, fleet operator, school administrator or manufacturer, not for developers.

| Do | Don't |
|---|---|
| Plain business words: bills, stock, payments due, bookings, customers | Jargon: "operational precision", "lead queue", "SLA window", "ingestion", "ROAS" |
| Short sentences that say what happens | "Leverage our cutting-edge platform to revolutionise…" |
| "Book a Demo", "Get a quote", "Notify me" | "Book a Discovery Call", "Initiate", "Request access" |
| Say "Coming Soon" plainly | Imply a date, a beta or a waitlist that doesn't exist |
| Ask for mobile/WhatsApp first; email optional | Require a "corporate" email |

**Primary CTA:** Explore Products. **Conversion CTA:** Book a Demo. Sales run through a live demo meeting the team arranges after the form is submitted. **Pricing CTA:** Get a quote.

---

## 4. Brand identity

### Mascot (logo)
A friendly blue genie-robot: visor face, arms crossed, a glowing "Z" on its chest, a flowing tail instead of legs. Glossy 3D, cyan glow.

| Use | File |
|---|---|
| Logo icon (navbar, footer, admin, app sidebar, auth) | `public/zugee-mascot-icon.png`, head + chest crop on a black rounded tile (`components/ui/MascotLogo.jsx`) |
| Favicon | `app/favicon.ico` (16/32), `public/icon-192.png`, `public/apple-touch-icon.png` |
| Full figure | `public/zugee-mascot-cutout.webp` (transparent), beside the contact form on desktop, gentle float animation |
| Share image | `public/og.jpg`, 1200×630, under 60 KB |

### Wordmark
"ZUG" in white + "EE" in a white → cyan gradient, extra-bold sans. Subline: "Systems Technologies Pvt. Ltd." There's no tagline under the logo, and no "live" status dot.

### Colour
| Token | Hex | Use |
|---|---|---|
| Royal Blue | `#1B6FF8` | Brand, gradients |
| Cyan | `#00F0FF` | Accents, focus rings, primary buttons |
| Sky | `#38BDF8` | Secondary accents, industry labels |
| Canvas | `#06090F` | Page background (current dark theme) |
| Surface | `#0A0F1D` | Cards |
| Emerald | `#10B981` | "Available" status |
| Slate 200–400 | `#E2E8F0`–`#94A3B8` | Text. Don't use slate-500 or darker for small text on the dark background (fails contrast) |

### Type
Plus Jakarta Sans (`--font-sans`) for everything. JetBrains Mono (`--font-mono`) only for reference numbers and code-like values, never for headings, buttons or labels.

---

## 5. Design direction

The brief asks for a **professional, trustworthy, modern, Indian-SMB-friendly** look: premium but approachable.

- **Now (after Phase 0):** the dark theme is kept, but the terminal feel is gone: no monospace uppercase labels or CTAs, no fake status indicators, no newsletter, no marquee or "laser" effects.
- **Phase 3 redesign:** move the marketing site to a **light theme**, add real product screenshots once products are verified, and use restrained blue/cyan accents. The in-app UI (`/app`) already uses the light slate theme described in `docs/UI_IMPROVEMENTS.md`.

Avoid: neon glows as decoration, cyber grids, monospace everywhere, technical language, anything that looks like a crypto or developer tool.

Every dashboard must answer three questions with **numbers from real records**:
1. What is happening?
2. What needs attention?
3. What should I do next?

---

## 6. Website structure (current)

Single page, `app/(marketing)/page.jsx`:

| # | Section | Component | Content source |
|---|---|---|---|
| 1 | Hero: H1 "Business software built for the way your business operates." + Explore Products / Book a Demo | `Hero.jsx` | inline copy |
| 2 | Products: cards by category with honest status badges; Coming Soon list | `ProductsSection.jsx` | `lib/products.js` |
| 3 | How it works: 3 steps | `HowWeWork.jsx` | `lib/site-content.js` |
| 4 | Pricing: what a quote depends on (no price list until plans are set) + FAQ | `PricingSection.jsx`, `FAQSection.jsx` | `lib/site-content.js` |
| 5 | Book a demo: short form + mascot | `ContactSection.jsx` | `BUSINESS_TYPES` from `lib/products.js` |

**Navigation:** Products · How it works · Pricing · FAQ · [Book a Demo].

**Planned navigation (Phase 3):** Products (dropdown) · Industries · Solutions · Pricing · Resources · About · Contact · [Get Started]. Only pages that exist get a link.

**Lead form:**
- Required: name, mobile/WhatsApp, business type.
- Optional: email, company, requirement.
- Product cards pre-select the business type.
- Stored in `leads` (see `supabase/schema.sql`), shown in `/admin`.

**Structured data:** Organization + FAQPage JSON-LD, generated from the same data the page renders. No SoftwareApplication/Offer schema until real prices exist; no AggregateRating ever without real reviews.

---

## 7. Trust elements (founder to supply)

Add these only with real values. The footer has a `TODO(founder)` marking the spot.
- Founder / team names and photo
- Registered business address
- Phone and WhatsApp number
- Support email
- `/privacy`, `/terms`, `/refund` pages (Phase 3)
- CIN / GSTIN: only if real, and only if you want them public

---

## 8. Publishing checklist

Before any page, ad or deck goes out:

- [ ] Every claim passes the claim rule (section 2)
- [ ] Product statuses match `lib/products.js`, and nothing says Available without the checklist
- [ ] No numbers that aren't from real records, or clearly labelled "Demo Data"
- [ ] No invented names, companies, testimonials or logos
- [ ] Plain business language; CTA labels from section 3
- [ ] Mobile layout checked at 375 px; no horizontal scroll
- [ ] Images compressed (share image < 200 KB)
- [ ] FAQ text matches the FAQPage JSON-LD (automatic if edited in `lib/site-content.js`)
