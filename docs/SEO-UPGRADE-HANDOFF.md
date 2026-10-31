# SEO upgrade: handoff (paused 2026-10-31)

Branch: `feat/seo-upgrade`, created from `main` at `5a135ba`. Nothing has been committed on this branch yet.
The full task brief is in the appendix at the end of this file.

## Owner decisions taken

| Question | Decision |
|---|---|
| Product naming | **Option A: "ZUGEE Fleet…"**. The site already used these names, so no visible rename is needed. |
| Unfilled owner details (founder story, team, street address, CIN/GSTIN, blog author) | **Hide until filled.** Leave a `TODO(owner):` comment in the code and don't render the section. Blog author falls back to "ZUGEE team". Never show "TODO" text on the site (CLAUDE.md rule). |
| `lib/products.ts` | The project is plain JS. Keep `lib/products.js` as the single source; don't add TypeScript. |
| Legal pages | The brief wants /privacy, /terms and /refund in the sitemap with no `noindex`. Today they are deliberately `noindex` (`lib/legal.js`, `legalMetadata`) and left out of `app/sitemap.js`. Follow the brief: make them indexable and add them to the sitemap. |

## Done (uncommitted, on the branch)

- The internal product-copy files lost their old Option B names, with `git mv`:
  `lib/product-pages/{fleetova,tourvana,aqurix,estatova,fabrova,scholora,campora,roomora,resortique,clinivance}.js`
  became `{fleet,tours,water,estates,factory,schools,campus,hostels,resorts,care}.js`.
  The imports in `lib/product-pages.js`, the `page("…")` references in `lib/chatbot/capabilities.js`
  and the `pageFile` map in `tests/chatbot.test.mjs` all point to the new names.
- `npm test`: 181 of 181 pass after the rename.

### Old names still left in the code

- `tests/product-pages.test.mjs:316-317`: a local variable called `fabrova`. Rename it to `factory`.
- `lib/products.js:15-27`: history comments mention the old names. Reword them without the names.
- `tests/product-pages.test.mjs:236`: the "retired names" guard regex lists them. **Keep it**: this test stops the names coming back.
- `docs/*`: older planning docs, which are history. Mention them in the final report; don't edit them.

## Not done: the three helper tasks were stopped with nothing saved

1. **Blog**: `lib/blog.js`, `app/(marketing)/blog/page.jsx`, `app/(marketing)/blog/[slug]/page.jsx`,
   `components/blog/*`, the trip-sheet post (copy in the appendix, section 6.5), the generator
   `scripts/generate-trip-sheet-template.mjs` and its output `public/downloads/trip-sheet-template.xlsx`
   (A4, print-ready; no xlsx library is installed, so hand-write the OOXML or add `exceljs` as a dev
   dependency), and `tests/blog.test.mjs`. The CTA box must read the product name from `lib/products.js`.
2. **About and case studies**:
   - About page: `lib/about.js` holds the owner data. While a constant is empty or null, its section is hidden. Page at `app/(marketing)/about/page.jsx`, with BreadcrumbList JSON-LD.
   - Case studies: `lib/case-studies.js` (empty) and `app/(marketing)/case-studies/` (list and `[slug]`). `noindex` while there are none, and no nav, footer or sitemap link.
   - Testimonials: `lib/features.js` (`testimonials: false`), `lib/testimonials.js` (empty), and `components/home/TestimonialsSection.jsx`, which renders nothing unless the flag is on and testimonials exist.
   - `tests/about.test.mjs`.
3. **Share images**: `scripts/generate-og-images.mjs` uses sharp (already a dev dependency) to turn SVGs into JPEGs:
   - `public/og/{pageSlug}.jpg`, one per product, 11 in all.
   - `public/og/blog-trip-sheet-format.jpg`.
   - Each 1200×630 and under about 60 KB.
   - Add the npm script `og:generate`.

## Not started: the lead's own part (shared files; do these yourself, not in parallel)

Phase 1
- `lib/products.js`: add `shortDescription`, `tailoredFor`, `metaTitle`, `metaDescription`, `ogImage` and `faqs` where they are missing. Today the page copy, title and FAQs live in `lib/product-pages/*.js`; derive from those rather than duplicating them.
- Check that the homepage grid, product pages, related products, footer list, demo dropdown (`DEMO_FORM_BUSINESS_TYPES`) and JSON-LD all read from `lib/products.js`. Most already do.
- The Navbar and Footer are already shared through `app/(marketing)/layout.jsx`. Footer changes:
  - add a "Blog" quick link;
  - point "Pricing" at `/pricing`;
  - show the full address when `lib/about.js` has one, otherwise keep `LOCATION_DISPLAY`;
  - footer logo alt text: "ZUGEE logo" (check `components/ui/MascotLogo`).
- `app/sitemap.js`: add /about, /pricing, /blog, the published posts and the legal pages, each with a fixed `lastModified`. `app/robots.js` is already fine.
- Redirects (`next.config.mjs`): non-www to www, and http to https. Check how the host handles this before adding rules, because a wrong rule can cause a redirect loop. Check for duplicate URLs with and without a trailing slash.

Phase 2: homepage
- `components/home/Hero.jsx`: H1 becomes "Industry-Specific CRM, ERP & GST Billing Software for Indian Businesses". The current H1 text "Specialised software for your industry, set up for you in 14 days" moves into a `<p>` subheading.
- "Explore All Products" becomes a real link to `/products`. "Book a 1-on-1 Live Demo" becomes a real link to `/#contact`. Both are currently `SmoothScrollLink`.
- Homepage title stays as it is. In `app/layout.jsx` and the homepage metadata, set `og:title` and `twitter:title` to "ZUGEE — CRM, ERP & GST Billing Software for Indian SMEs". Today `SHARE_TITLE` differs.
- Product cards in `ProductShowcase.jsx` / `IndustryShowcase.jsx`: descriptive link text such as "Fleet management software →".
- Find decorative "01 / 11" and eyebrow text that uses heading tags and change it to non-heading tags.
- `PricingSection.jsx`: merge the two near-duplicate bullet lists per plan (`features` and `setupIncludes`, from `lib/pricing.js` and `lib/plan-content.js`).
- `Navbar.jsx`: the "Pricing" link goes to `/pricing`.
- Add `<TestimonialsSection />` to the homepage. It renders nothing while the flag is off.

Phase 3: product pages (`app/(marketing)/[slug]/page.jsx`, `components/product/ProductPage.jsx`, `lib/product-pages/*.js`)
- Title: "{Category} Software India | {Product name} by ZUGEE". Check the ≤60-character rule in `tests/product-pages.test.mjs`.
- Use `/og/{slug}.jpg` in openGraph and twitter (today it's `/og.jpg`).
- A visible breadcrumb: Home → Products → Category.
- Related products: 3 links with descriptive link text.

Phase 4: structured data (`lib/structured-data.js`)
- Organization: add `telephone` (`PHONE_E164`), and the street address once it's known.
- The product `operatingSystem` should be "Web, Android (browser)". Today it's "Web, Android, iOS", both on the homepage and on product pages. Omit price.
- Blog: Article and BreadcrumbList. The homepage already has WebSite and FAQPage.
- Update `tests/structured-data.test.mjs` to match.

Phase 5: images and performance
- Product page mascot image (served at w=3840): give `next/image` proper width, height and `sizes` so it loads at about 600–800px. Use `priority` only on the hero.
- Alt text: "ZUGEE mascot", or "" if the image is decorative.
- Load `HeroProductPreview` after hydration (dynamic import).

Phase 6
- `/pricing` page: reuse `PricingSection` and the pricing FAQs, add a demo CTA. Title "Pricing | ZUGEE Business Software for Indian SMEs". Keep `/#pricing` on the homepage.
- `/products` already exists. Set its title to "All Products | Industry-Specific Business Software by ZUGEE" and check the link text.

Finish
- Run `npm test`, `npm run lint` and `npm run build`.
- Check visually at 375, 768 and 1440px widths, in dark and light themes.
- Run Lighthouse (mobile) on /, /fleet-management-software and /blog/trip-sheet-format.
- The Rich Results Test needs a public preview URL, so the owner has to run it after deploying the preview.
- Report against the brief's DONE checklist, with a list of every `TODO(owner)`.
- Don't push to production until the owner approves the preview.

## How to resume

1. `git checkout feat/seo-upgrade`, then `git status`: the rename should show as staged or modified.
2. Do the "Not started" list first (the shared files).
3. Then do the three helper tasks. They only touch new files, so they can run in parallel safely.
4. Last, wire their output into the sitemap, footer and homepage.

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
