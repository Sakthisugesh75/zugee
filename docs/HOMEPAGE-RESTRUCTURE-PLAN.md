# Homepage Restructure: Phase 1 Audit and Plan

**Status:** Implemented, 4 October 2026, with these later decisions overriding parts of this plan: no founder section; no WhatsApp buttons or sticky button; no public phone number anywhere; Why ZUGEE has four points; the FAQ "more than one product" answer was rewritten. See [COMMIT-1-2-REVIEW.md](COMMIT-1-2-REVIEW.md) and the git log for what shipped.

**Original status:** Plan only. No code had changed.
**Date:** 4 October 2026

**Goal:** Visitors are small and medium business owners (40s–50s, mostly on mobile, Tamil Nadu). The page should feel like a dependable local software company, not a tech demo.

**Positioning:** "Industry-ready software, set up for you, supported by a real person."

**Brief changes already applied:** no product screenshots, dashboards or demo videos anywhere on the public site. The Hero is text first, with lucide industry icons. The screenshots section is dropped. The sample dashboard is removed. "See the software live — book a free demo." goes near the CTA.

**Two decisions block Phase 2:** the GST / E-Invoice / E-Way bill claim (section C, item 3) and the product carousel (section B, "Product details").

---

## A. Current homepage, top to bottom

Page file: [`app/(marketing)/page.jsx`](../app/(marketing)/page.jsx)

| # | Section | File | Anchor |
|---|---|---|---|
| 1 | Hero, with the "Sample dashboard view — illustrative data only" panel | [`Hero.jsx`](../components/home/Hero.jsx) | — |
| 2 | Product carousel: one product at a time, auto-rotates on desktop, plus a detail pop-up | [`ProductShowcase.jsx`](../components/home/ProductShowcase.jsx) | `#products` |
| 3 | "Chaos of 5 apps" before/after comparison | [`ComparisonSection.jsx`](../components/home/ComparisonSection.jsx) | — |
| 4 | Industry workflows and feature pillars (holds the WhatsApp Cloud API "Rolling Out" card) | [`IndustryShowcase.jsx`](../components/home/IndustryShowcase.jsx) | `#industries` |
| 5 | 4-step onboarding timeline | [`HowWeWork.jsx`](../components/home/HowWeWork.jsx) | `#how-it-works` |
| 6 | Starter / Growth / Enterprise plans and comparison table | [`PricingSection.jsx`](../components/home/PricingSection.jsx), [`PricingCallButton.jsx`](../components/home/PricingCallButton.jsx) | `#pricing` |
| 7 | FAQ | [`FAQSection.jsx`](../components/home/FAQSection.jsx) | `#faq` |
| 8 | Final CTA with the mascot | [`FinalCTA.jsx`](../components/home/FinalCTA.jsx) | — |
| 9 | Demo request form | [`ContactSection.jsx`](../components/home/ContactSection.jsx) | `#contact` |

- The navbar and footer come from [`Navbar.jsx`](../components/layout/Navbar.jsx) and [`Footer.jsx`](../components/layout/Footer.jsx).
- The footer already shows "© Zugee Systems Technologies Pvt. Ltd." and lists only products that are not Coming Soon.
- Every homepage section is currently a client component.
- **Removing the sample dashboard breaks nothing.** Its made-up data lives only inside `Hero.jsx`, and nothing else uses it.
- The share image (`public/og.jpg`) shows the mascot and text, with no dashboard, so it can stay.

---

## B. Target section → component

| Target section | Action | Notes |
|---|---|---|
| 1. Hero | **Rewrite** `Hero.jsx` | Text first: headline, subline, "Book a demo" (to `#contact`) and "WhatsApp us" (a wa.me link). Below that, a row of lucide icons with short labels for the Available products. The sample dashboard, the "Zero Double Data Entry" / "Live Setup in 2 Weeks" ticks and the gradient text are removed. Can be a server component. |
| 2. Find your industry | **New** `IndustryGrid.jsx` | Available products only. 2 columns on mobile, 3–4 on desktop. Keeps the `#products` anchor. Coming Soon products are filtered out by status, not deleted. The grid, the product details and the structured data all read from one new `availableProducts()` helper in `lib/products.js`, so they can never drift apart. |
| 2b. Product details | **Decision needed** | **Recommendation: remove the carousel** and replace it with a plain list, **new** `ProductDetails.jsx`: one block per product (anchor `#product-<slug>`) with name, industry, description and modules. Each grid card jumps to its block. Reasons: the carousel shows one product at a time, auto-rotates and carries about 25 glow effects. A static list reads well on a phone and needs no JavaScript. Its anchors match the `@id` values the product structured data already uses, so each SoftwareApplication can link to its own block. **Alternative:** keep the carousel and make a card click select its slide. That needs shared state and keeps the heaviest part of the page. |
| 3. Why Zugee | **New** `WhyZugee.jsx`, light background | 3–4 points. See section C, items 1 and 3. |
| ~~4. Screenshots / demo video~~ | **Dropped** | Per the brief change: no screenshots, video or placeholder slot. |
| 5. How it works | **Rewrite** `HowWeWork.jsx` | Demo → Setup → Go-live → Support. The copy moves into the `HOW_WE_WORK` list in `lib/site-content.js`. That list is unused today (the component carries its own copy) but is already covered by the no-price test. Keeps `#how-it-works`. |
| 6. Founder | **New** `FounderSection.jsx` | Shows an initials circle until the photo arrives, then `next/image`, lazy-loaded with a fixed size. Sakthisugesh R, Director (the same name already appears in the Privacy Policy). |
| 7. Pricing approach | **Replace** `PricingSection.jsx` with a short **new** server component | Quote on a call, plus "Your monthly price is fixed for the life of your subscription." (the exact Terms wording). Keeps `#pricing`. The page stops sending plan summaries. `lib/pricing.js` is not touched, because admin billing uses it. |
| 8. FAQ | **Restyle only** | Same `FAQ_ITEMS` list, light background, larger text. The FAQPage structured data is built from the same list, so it stays an exact match. |
| 9. Final CTA and contact | **Recommendation: merge** `FinalCTA` into `ContactSection` | Two CTAs in a row is redundant on a phone. The merged section opens with "See the software live — book a free demo." and keeps the form at `#contact`. Your call. |
| Footer | **Modify** `Footer.jsx` | New Contact column: support@getzugee.com, the company phone number (`tel:` and wa.me links), Coimbatore, Tamil Nadu, Mon–Sat 10am–6pm IST. The Terms page already confirms these hours. |
| Sticky WhatsApp button | **New** `StickyWhatsApp.jsx` | Mobile only, kept clear of the phone's bottom edge. It hides while the contact form is on screen, so it never covers the Submit button. |
| Removed | `ComparisonSection`, `IndustryShowcase`, `ProductShowcase`, `PricingSection`, `PricingCallButton`, `FinalCTA` | These hold claims the code can't back up, for example "1-click IRN generation", "GSTR-1/3B reports", "Dedicated Account Manager" and "Priority Support Line". |

---

## C. Items to confirm, and assets

Until each is answered, it is left out of the page or shown as [CONFIRM].

1. **Support languages** for the "Direct founder support" point (Tamil? English? others?).
2. **Founder text**, 2–3 lines. Also: is the founder's phone/WhatsApp the same as the company number?
3. **"GST / E-Invoice / E-Way bill built in". Blocking.** [`docs/ZUGEE-PLATFORM-PLAN.md`](ZUGEE-PLATFORM-PLAN.md) (line 407) says e-invoice stays "Coming Soon" until it is built and checked with a CA. None of the product module lists in `lib/products.js` mention e-invoice or e-way bills. **Which products do this today?** If not all, the point will be worded per product or dropped, and Why Zugee will run with 3 points.
4. **Timelines for How it works.** The Terms page says: "Setup typically takes 14 days. This is a target, not a guarantee." Should the homepage use that exact wording, or show no number? The current site states it more strongly ("Set Up for You in 14 Days", "Live Setup in 2 Weeks").
5. **Founding-customer offer terms**, if you want the note. The Terms page has no such offer, so adding one may also mean updating the Terms.
6. **"Tamil Nadu businesses" in the headline.** The page title, meta description, Organization structured data and share image all say "Indian businesses". Change them to Tamil Nadu, or keep India in the metadata?
7. **The FAQ answer to "Which ZUGEE products can I use today?"** says "Products marked Coming Soon are still being built." Once Coming Soon products are hidden, that refers to nothing on the page. Options: edit that answer (it is part of the list you asked to keep), or add a one-line plain-text list of upcoming products.
8. **WhatsApp Cloud API "Rolling Out" badge.** It appears only in `IndustryShowcase`, which is being removed. Afterwards, "rolling out" survives only in the FAQ and the Terms page. Is that enough, or should a line stay elsewhere?
9. **Sticky WhatsApp button:** homepage only, or also on the legal pages?

**Assets to supply:** only the **founder photo** (square, at least 400×400 px, JPG or WebP). Nothing else is needed now that screenshots and video are out.

---

## D. Risks

**Structured data**
- The product grid and the SoftwareApplication data must stay in sync. The shared `availableProducts()` helper, plus an extra test that the grid anchors match the structured-data `@id`s, covers this.
- The FAQPage data stays an exact match as long as `FAQSection` keeps rendering `FAQ_ITEMS` as plain text. The restyle changes only classes.
- The Organization data is not affected.

**Tests**
- The banned-claims tests scan every file in `app/`, `components/` and `lib/`. New copy must avoid wording about data being hosted in India, backups, "enterprise-grade" or "bank-grade", and offline use.
- "Fixed for the life of your subscription" is safe.
- The Tally point must say "alongside", matching the existing FAQ. Never "sync" or "integration".
- The existing FAQ tests pin specific answers. The FAQ content stays unchanged, apart from item 7 in section C if you approve that edit.

**Navigation**
- The navbar and footer link to `#products`, `#how-it-works`, `#pricing`, `#faq` and `#contact`, and the legal pages go to `/#…`. Every new section must keep its id. Otherwise those links silently land at the top of the page.

**Mobile layout**
- On iPhones, keeping the sticky button clear of the bottom edge has no effect until the root layout sets `viewport-fit=cover`. That is a one-line change.
- The 2-column grid at 320 px wide needs product names that wrap and cards of equal height.
- The sticky button must not cover the form's Submit button or the footer's last row.

**Light sections**
- The whole site runs in dark mode on a dark page background. Light sections need explicit text colours. The FAQ's shared card style and white text would be invisible on a white background.

**Contrast, text size and motion**
- `text-slate-500` and `text-slate-600` on the near-black background fail WCAG AA (4.5:1).
- There are about 100 uses of `text-xs` or `text-[11px]` across the homepage, 37 of them in `PricingSection` alone. Most disappear with the removed sections. The rest will be raised to at least 16 px for body text on mobile.
- `globals.css` has only one reduced-motion rule. New animation will use motion-safe variants only, so it respects `prefers-reduced-motion`.

**Sitemap**
- `HOMEPAGE_UPDATED` in `app/sitemap.js` needs bumping in the final commit.

**Out of bounds (not touched)**
- `/admin`, billing code (`lib/pricing.js`, `lib/subscriptions.js`) and the database.

---

## E. Order of work

Each commit builds, passes lint and all tests, and can be deployed on its own.

1. **Groundwork, no visible change:** `availableProducts()` helper, a product icon map, a `url` added to each SoftwareApplication, and tests.
2. **Footer Contact column and sticky mobile WhatsApp button**, including `viewport-fit=cover`.
3. **New Hero:** text first, icon row, two buttons. The sample dashboard is removed. Title and meta description update if item 6 is approved.
4. **Find your industry grid and product details list**, replacing the carousel (if approved).
5. **Why Zugee** (light section). Ships with 3 points if item 3 isn't confirmed.
6. **How it works rewrite.**
7. **Founder section**, with the initials placeholder.
8. **Pricing approach section**, replacing the plans.
9. **FAQ restyle** (light), content unchanged.
10. **Merged final CTA and contact section**, with "See the software live — book a free demo."
11. **Clean-up:** remove the comparison and industry sections and unused components, apply the contrast and 16 px text fixes, check reduced motion, bump the sitemap date.

Commits 2, 7 and 9 don't depend on anything else and can go in any order.
