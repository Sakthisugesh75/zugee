# SEO upgrade: handoff

Branch: `feat/seo-upgrade`, created from `main` at `5a135ba`.
The full task brief is in the appendix at the end of this file.

## Owner decisions taken

| Question | Decision |
|---|---|
| Product naming | **Option A: "ZUGEE Fleet…"**. The site already used these names, so no visible rename is needed. |
| Unfilled owner details (founder story, team, street address, CIN/GSTIN, blog author) | **Hide until filled.** Leave a `TODO(owner):` comment in the code and don't render the section. Blog author falls back to "ZUGEE team". Never show "TODO" text on the site (CLAUDE.md rule). |
| `lib/products.ts` | The project is plain JS. Keep `lib/products.js` as the single source; don't add TypeScript. |
| Legal pages | The brief wants /privacy, /terms and /refund in the sitemap with no `noindex`. Today they are deliberately `noindex` (`lib/legal.js`, `legalMetadata`) and left out of `app/sitemap.js`. Follow the brief: make them indexable and add them to the sitemap. |

## Status (2026-10-31, second session): built and checked locally, not committed

All phases are built on `feat/seo-upgrade`. `npm test` passes (198/198), `npm run lint` is clean and `npm run build` succeeds. Nothing from this session is committed yet, and nothing has been pushed or deployed.

### What changed

- **Product names (Option A only):** the product copy files use the new names. Old names remain only in the guard regex in `tests/product-pages.test.mjs`, which stops them coming back, and in the older `docs/`.
- **Products data:** `lib/products.js` gained `linkText` (descriptive link text) and `productOgImage()`. A comment there explains where each field from the brief lives (`description`, `industry`, and the page copy in `lib/product-pages/*.js`). The project stays plain JS; there is no `products.ts`.
- **Homepage:**
  - New H1. "Specialised software… 14 days" is now a `<p>` under it.
  - "Explore All Products" links to `/products`.
  - `SmoothScrollLink` is now a real `<a href="/#…">` everywhere (it was a `<button>`).
  - Product cards say "Fleet management software" and so on.
  - Pricing cards have one merged list each (`PLAN_INCLUDES` in `lib/plan-content.js`).
  - `<TestimonialsSection />` is added, and stays hidden while `lib/features.js` has it off.
- **Share titles:** og:title and twitter:title now match the homepage title (`app/layout.jsx`).
- **Header:** Pricing links to `/pricing`.
- **Footer:**
  - Quick links: Products, How it works, Pricing, About, Blog, FAQ, Book a demo.
  - Shows `ADDRESS` from `lib/about.js` once filled, otherwise the city.
  - Logo alt text is "ZUGEE logo".
- **Product pages:**
  - Every title is "{Keyword} Software India | ZUGEE {X}". I left out "by ZUGEE" because the names already start with ZUGEE.
  - Each page has its own share image, `/og/{slug}.jpg`.
  - The breadcrumb and the 3 related products were already there; their link text is now descriptive.
- **Structured data:** Organization has `telephone`. operatingSystem is "Web, Android (browser)". Blog posts have Article and BreadcrumbList. /pricing and /about have BreadcrumbList; /pricing also has FAQPage.
- **Sitemap and indexing:** the sitemap has 20 URLs, including /pricing, /about, /blog, the post and the legal pages. The legal pages are now indexable (noindex only while `LEGAL_DRAFT`). /case-studies is noindex and not in the sitemap.
- **Redirects:** `getzugee.com` → `www.getzugee.com` in `next.config.mjs`. Vercel already handles http → https. Next.js removes trailing slashes. These redirects are 308, the permanent equivalent of 301.
- **New pages:** /pricing, /about, /blog, /blog/trip-sheet-format and /case-studies (template only).
- **Downloads and scripts:**
  - `public/downloads/trip-sheet-template.xlsx` (A4, print-ready). Rebuild with `node scripts/generate-trip-sheet-template.mjs`.
  - Share images: `npm run og:generate`.

### Checked locally (production build, `next start`)

- Every page checked has exactly one H1, the right title, a matching og:title and JSON-LD that parses. No "TODO" text is visible.
- No page scrolls sideways at 375, 768 or 1440px (Edge with device emulation). Screenshots were reviewed for home, pricing, about, blog and the fleet page.
- Lighthouse, mobile, on a local Windows machine (lab numbers; re-run on the preview with PageSpeed Insights):

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| / | 95 | 94 | 100 | 100 |
| /fleet-management-software | 71 | 100 | 100 | 100 |
| /blog/trip-sheet-format | 77 | 100 | 100 | 100 |

### Open items

- **Product page and blog performance is below 90.** Most of the cost is style/layout and script evaluation in the shared layout (about 6 s main thread under simulated phone conditions). This session changed only metadata and link text on product pages, so the cost is most likely older, but `main` was not measured to confirm it. Next step: profile the Tutu companion and chat widget, which load on every page.
- **Homepage accessibility is 94.** Two older problems cause it: low-contrast `text-slate-500`/`600` labels (the carousel counter and a footnote) and small carousel dot buttons. Fixing them changes visuals, so it needs approval.
- **Mascot at w=3840:** no current code loads a mascot through next/image. The product-page mascot is `tutu-genie.webp` at 728px. The w=3840 in the brief came from an older deploy. `zugee-mascot-cutout.webp` and `zugee-mascot-light.webp` are unused.
- **Dashboard preview** (`HeroProductPreview`) was not deferred. It is plain HTML with no images, rendered on the server so crawlers read both tabs; client-only loading would hide it from crawlers and cause layout shift.
- **`.container` overrides `max-w-*`.** The unlayered `.container` in `app/globals.css` beats Tailwind's `max-w-*`, so pages using `container max-w-3xl` are actually 1360px wide. The new pages avoid this by using `w-full max-w-3xl`. The older pages (products hub CTA, product page extra sections) were left alone to avoid visual changes.
- **Rich Results Test** needs a public URL. Run it on the Vercel preview.
- **About page:** the meta description says "Meet the team", but the team section stays hidden until `FOUNDERS` is filled.
- **Organization JSON-LD** has no street address yet. Add `streetAddress` and `postalCode` when `ADDRESS` is known.

### Remaining TODO(owner)

1. `lib/about.js` `FOUNDER_STORY`: founder story, 3–5 sentences. Shows "Why we started" on /about.
2. `lib/about.js` `FOUNDERS`: name, role, bio and photo per founder. Shows "The team".
3. `lib/about.js` `ADDRESS`: full office address. Shown on /about and in the footer, and should go into the Organization JSON-LD.
4. `lib/about.js` `CIN`, `GSTIN` (optional).
5. `lib/blog.js` trip-sheet post `author`: founder name. It reads "ZUGEE team" until then.
6. `lib/case-studies.js` / `lib/testimonials.js`: real, approved content only. Turn on `FEATURES.testimonials` once there is any.

### Next steps

1. Review the diff, then commit on `feat/seo-upgrade`.
2. Deploy a Vercel preview, run the Rich Results Test and PageSpeed Insights there, and check it visually.
3. Merge only after the owner approves the preview.

---

## Appendix: the original brief

# Task: SEO upgrade + new content for getzugee.com (Next.js)

You are working on the codebase for https://www.getzugee.com, a Next.js website for
Zugee Systems Technologies Pvt. Ltd., Salem, Tamil Nadu. The company sells 11
industry-specific CRM / ERP / GST billing products to Indian SMEs.

Complete ALL phases below. Work on a separate branch / preview deployment first.
Do NOT push to production until the owner approves the preview.

### OWNER DECISIONS
1. Product naming system: **Option A "ZUGEE Fleet…"** (decided 2026-10-31)
2. Full office address: TODO(owner)
3. Founder details: TODO(owner): name, role, 2–3 line bio and photo for each founder

Product name mapping (URLs stay exactly the same):
| URL | Option A |
|---|---|
| /erp-crm-software | ZUGEE Omni |
| /fleet-management-software | ZUGEE Fleet |
| /tours-and-travels-crm | ZUGEE Tours |
| /water-supply-erp | ZUGEE Water |
| /real-estate-crm | ZUGEE Estates |
| /garment-manufacturing-erp | ZUGEE Factory |
| /school-management-software | ZUGEE Schools |
| /college-management-software | ZUGEE Campus |
| /pg-management-software | ZUGEE Hostels |
| /resort-management-software | ZUGEE Resorts |
| /hospital-management-software | ZUGEE Care |

### DESIGN RULES
- Keep the existing visual design: colours, fonts, spacing, layout, animations and the interactive dashboard preview.
- Reuse existing components and Tailwind/CSS classes. Do not add a new UI library.
- New pages (/about, /pricing, /blog) must look like they belong to the current site, using the same header, footer, section styles, buttons and cards.
- The only visible changes allowed are: product name text, homepage H1 text, merged pricing bullet lists, product card link text, identical footer on all pages, and the new pages.
- Must stay fully responsive. Test at 375px, 768px and 1440px widths.

### PHASE 1 — Critical fixes
1.1 Single source of truth for products: slug, name, category, shortDescription, tailoredFor, replaces, modules[], metaTitle, metaDescription, ogImage, faqs[]. Homepage grid, product pages, related products, footer list, demo form dropdown and all JSON-LD read from it. Replace every hard-coded product name; confirm the unused name set appears nowhere (incl. alt text, metadata, JSON-LD).
1.2 Shared layout: ONE Header and ONE Footer on every page. Footer: Facebook, Reddit, Threads, Instagram, full address, phone (+91 96291 44648), email (support@getzugee.com), product list, quick links, legal links — identical everywhere. Header logo link text the same on all pages.
1.3 Crawling: sitemap listing /, /products, 11 product pages, /about, /pricing, /blog, published posts, /privacy, /terms, /refund with lastModified. robots: allow all, sitemap https://www.getzugee.com/sitemap.xml. No noindex on production pages. 301: non-www → www, http → https. No trailing-slash duplicates.

### PHASE 2 — Homepage
- H1: "Industry-Specific CRM, ERP & GST Billing Software for Indian Businesses"
- "Specialised software for your industry, set up for you in 14 days" → subheading <p>.
- Exactly one <h1> per page; decorative labels ("01 / 11", eyebrows) not headings.
- Title stays "ZUGEE — CRM, ERP & GST Billing Software for Indian SMEs"; og:title and twitter:title match.
- "Explore All Products" → <a href="/products">; "Book a 1-on-1 Live Demo" → <a href="/#contact">.
- Product card link text descriptive, e.g. "Fleet management software →" (all 11).
- Pricing cards: merge the two near-duplicate bullet lists into one per plan.
- Nav "Pricing" → /pricing.

### PHASE 3 — 11 product pages
- Title "{Category} Software India | {Product name} by ZUGEE"; one H1 with the main keyword (keep wording, update name); breadcrumb Home → Products → {Category}; unique OG image /og/{slug}.jpg (1200×630, name + category, brand colours); Related products: 3 with descriptive link text.

### PHASE 4 — JSON-LD (from lib/products)
- Root: Organization (name, legalName, url, logo, email, telephone, address, sameAs FB/IG/Threads/Reddit).
- Homepage: WebSite + FAQPage.
- Product pages: SoftwareApplication (BusinessApplication, operatingSystem "Web, Android (browser)", no price), FAQPage, BreadcrumbList.
- Blog posts: Article + BreadcrumbList. Must pass Rich Results Test.

### PHASE 5 — Images and performance
- Product page mascot loads at w=3840: set width/height/sizes to serve ~600–800px.
- priority only on the above-the-fold hero image; lazy-load the rest.
- Alt: footer logo "ZUGEE logo"; mascot "ZUGEE mascot" (or "" if decorative).
- WebP/AVIF. Load the interactive dashboard preview after hydration.
- Lighthouse mobile: Performance ≥ 90, SEO 100, Accessibility ≥ 95.

### PHASE 6 — New pages and content
6.1 /pricing: 3 plans, "How our pricing works", setup-fee FAQs, demo CTA. Keep /#pricing. Title "Pricing | ZUGEE Business Software for Indian SMEs".
6.2 /products: all 11 with name, category, short description, descriptive link. Title "All Products | Industry-Specific Business Software by ZUGEE".
6.3 /about: exact copy:
- SEO title: About ZUGEE | Business Software Company in Salem, Tamil Nadu
- Meta: ZUGEE builds industry-specific CRM, ERP and GST billing software for Indian SMEs. Meet the team in Salem, Tamil Nadu, and see how we work.
- H1: About ZUGEE
- H2 "Software built for the way Indian businesses actually run": Most small and medium businesses in India run on three tools: WhatsApp for updates, Excel for records and Tally for accounts. It works, until the business grows. Then the same customer details get typed three times, staff spend their day chasing updates on the phone, and the owner can't see what's happening without calling someone. / ZUGEE was started in Salem to fix that. Instead of one general software that every business has to bend itself to fit, we build a separate product for each industry — fleet operators, travel agencies, water suppliers, builders, garment units, schools, colleges, PGs, resorts and hospitals.
- H2 "Why we started": TODO(owner) founder story, 3–5 sentences.
- H2 "What makes us different": **One product per industry.** A transport owner and a school principal don't need the same screens. Each ZUGEE product has the words, fields and workflows that business already uses. / **We set it up for you.** Our team maps your workflow, moves your data across from Excel or Tally, and trains your staff. Typical setup takes 14 days. / **Your accountant keeps Tally.** ZUGEE runs your daily operations and billing. Your CA can keep using Tally for filings, and we export the data they need. / **You own your data.** Export it anytime. No lock-in. / **We tell you what's ready and what isn't.** If a feature is still being built, like WhatsApp sending, we say so.
- H2 "The team": TODO(owner) founder cards (photo, name, role, 2–3 line bio), existing card component.
- H2 "Where we are": Zugee Systems Technologies Pvt. Ltd. / TODO(owner) full address / Phone / WhatsApp: +91 96291 44648 / Email: support@getzugee.com / TODO(owner, optional) CIN and GSTIN.
- H2 "Talk to us": Not sure which ZUGEE product fits your business? Book a free demo and we'll show you the software working with your own examples. Button "Book a free demo" → /#contact.

6.4 Blog: /blog and /blog/[slug] (MDX or existing CMS — no MDX installed; use JS data). Post template: H1, author, date, category, OG image, table of contents, body, CTA box to related product page, related posts, Article JSON-LD. List: cards with title, excerpt, date, category. "Blog" in footer quick links.

6.5 First post /blog/trip-sheet-format:
- SEO title: Trip Sheet Format for Transport Businesses (Free Template)
- Meta: A simple trip sheet format for truck, tanker, cab and bus operators in India — what fields to include, a ready template, and common mistakes to avoid.
- Author: TODO(owner) founder name, ZUGEE. Category: Fleet & Transport. OG: /og/blog-trip-sheet-format.jpg ("Trip Sheet Format", brand colours).
- H1: Trip Sheet Format for Transport Businesses (Free Template)
- Intro: If you run trucks, tankers, cabs or buses, the trip sheet is the most important paper in your business. It decides what you bill, what you pay the driver, and whether a trip made money or lost it. / Yet in many transport offices, trip sheets are half-filled, collected days late, or lost in the driver's cabin. This guide gives you a clear trip sheet format you can start using today, and explains what each field is for.
- H2 What is a trip sheet?: A trip sheet is a record of one trip by one vehicle. It notes where the vehicle went, who drove it, how far it travelled, what was carried, and what was spent on the way. The office uses it to: Bill the customer correctly · Settle the driver's advance and expenses · Track fuel use and vehicle running · Work out the profit on each trip
- H2 Trip sheet format: fields to include (each H3 as a bullet list):
  1. Trip details — Trip sheet number (running, never repeated); date; booking or order reference; customer name.
  2. Vehicle and driver — Registration number; vehicle type; driver name and mobile; helper or cleaner name, if any.
  3. Route — From; to; stops in between; departure date and time; arrival date and time.
  4. Distance — Opening odometer; closing odometer; total km.
  5. Load details — Goods carried (or passengers); weight or quantity; LR / consignment note number; e-way bill number, if one was generated.
  6. Expenses during the trip — Diesel (litres and ₹); toll / FASTag; loading and unloading; driver bata; other expenses; total.
  7. Money — Advance given; expenses paid by the driver; balance to return or pay; freight amount agreed with the customer.
  8. Sign-off — Driver signature; office signature; proof of delivery received (yes/no).
- H2 Ready-to-use trip sheet template: "Copy this into Excel or Google Sheets, or print it:" then a two-column table (Field | Entry): Trip sheet no. · Date · Customer · Vehicle no. · Driver name & mobile · From → To · Departure (date/time) · Arrival (date/time) · Opening km · Closing km · Total km · Goods / passengers · Weight / quantity · LR no. · E-way bill no. · Diesel (litres / ₹) · Toll (₹) · Loading / unloading (₹) · Driver bata (₹) · Other expenses (₹) · **Total expenses (₹)** · Advance given (₹) · Balance (₹) · Freight amount (₹) · POD received? (Yes / No) · Driver signature · Office signature. Then a "Download Excel template" button → /downloads/trip-sheet-template.xlsx (same rows, formatted, print-ready on A4).
- H2 5 common trip sheet mistakes: **1. Not recording the odometer reading at the start.** Without the opening reading, you can't check the kilometres or the diesel claimed. Make the driver note it before leaving the yard. / **2. Collecting trip sheets at the end of the week.** By then, receipts are lost and details are forgotten. Collect them as soon as the trip ends. / **3. No running number.** If trip sheets aren't numbered, a missing sheet means a trip that never gets billed. Number every sheet, and check for gaps. / **4. Expenses without bills.** Ask for a photo of every fuel slip and toll receipt. It protects both the owner and an honest driver. / **5. Billing from memory.** Raise the customer's bill from the trip sheet, not from a diary or a phone call. The trip sheet is your proof.
- H2 When paper trip sheets stop working: Paper works fine with one or two vehicles. As the fleet grows, problems pile up: sheets get lost, totals are added up wrongly, and no one can say how many trips a vehicle ran this month without counting pages. / That's when transport owners move to digital trip sheets. Each trip is saved against its vehicle, driver and booking. Expenses are added as they happen, and the bill is raised straight from the trip record, so no trip is missed.
- CTA box: "Stop chasing paper trip sheets" / "{Fleet product name from lib/products} keeps every trip, vehicle, driver and bill in one place. Our team sets it up for your fleet in 14 days and moves your records across from Excel." / Button "Book a free demo" → /fleet-management-software

6.6 Case studies + testimonials (structure only): /case-studies template (industry, problem, what we set up, results, quote), out of nav and sitemap until a real one exists. Homepage testimonials section behind a feature flag, off by default.

### STRICT RULES
- Never change an existing URL; if one must change, add a 301 in next.config.
- Never invent testimonials, customer names, statistics, founder details, addresses or results. Use TODO(owner).
- Keep the honest wording that WhatsApp integration is "not yet live".
- British/Indian English ("specialised", "organisation").

### DONE CHECKLIST: report back on each
- [ ] Only the chosen product names appear anywhere in the codebase
- [ ] Shared Header and Footer on every page, with identical footers
- [ ] sitemap.xml and robots.txt live; redirects working
- [ ] One H1 per page; homepage H1 updated; pricing lists merged
- [ ] Unique OG image for each product page and the blog post
- [ ] All JSON-LD passes the Rich Results Test
- [ ] Mascot image resized; every image has alt text
- [ ] Lighthouse mobile scores for /, /fleet-management-software and /blog/trip-sheet-format
- [ ] /about, /pricing, /products, /blog and /blog/trip-sheet-format live on preview
- [ ] Excel template downloads correctly
- [ ] Visual check at 375px / 768px / 1440px; no design regressions
- [ ] A list of every remaining TODO(owner) item
