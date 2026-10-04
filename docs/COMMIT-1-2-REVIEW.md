# Review: Step 1 (Live) and Commits 1–2 (Preview)

**Date:** 4 October 2026
**Status:** Step 1 is deployed to production. Commits 1–2 are on the Vercel **preview** only. **Waiting for your OK** before Commits 3–9.

---

## Step 1: Commits 0 and 0b, live in production

| Commit | What |
|---|---|
| `d4ad930` | Earlier GEO work: AI crawlers in robots.txt, JSON-LD, admin noindex/nofollow on every admin page, custom 404 page. This was committed earlier but had not been pushed, so it went live with this deploy. |
| `510c254` | Commit 0: unbacked claims removed. See [COMMIT-0-REVIEW.md](COMMIT-0-REVIEW.md). |
| `d594c02` | Commit 0b: plan features and setup lists no longer passed to the homepage (`lib/pricing.js` unchanged). Terms GST sentence replaced. Legal last-updated date set to 4 October 2026. |

Pushed to `main`. Vercel's production deploy reported **success**.

**Checked on https://www.getzugee.com:**
- Homepage shows "Set Up for You.", "Setup typically takes about 14 days. This is a target, not a guarantee." and "Get a Clear Quote".
- Gone from the homepage: "Set Up for You in 14 Days", the sample dashboard, "Get the Best Price", the Enterprise tier, "Dedicated Account Manager", "Live Setup in 2 Weeks".
- `/terms` shows "The product helps you manage invoices and records." and "Last updated: 4 October 2026".
- A 404 page has exactly one `<title>`.
- `/robots.txt` lists GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bingbot.

**Note:** the last-updated date is one shared value for all three legal pages, so Privacy and Refund also show 4 October 2026.

---

## Commits 1–2: preview only

Branch `homepage-restructure`. **Not merged to `main`.**

| Commit | What |
|---|---|
| `3239b02` | Commit 1: footer Contact column; no public phone number anywhere; new phone-number test. |
| `df9bf1b` | Commit 2: new text-first Hero. |

**Preview URL:** https://zugee-git-homepage-restructure-sakthisugesh75s-projects.vercel.app
(this deployment: https://zugee-jses3r1tt-sakthisugesh75s-projects.vercel.app)

> **The preview is behind Vercel's login** (Deployment Protection). You can open it while signed in to Vercel; I could not. **The screenshots below are from a local production build (`next build` + `next start`) of the same commit, `df9bf1b`**, not from the preview itself.

**Checks:** build, lint and **79 tests** pass, up from 76. No horizontal scrolling at 375 px or 1440 px.

### Commit 1: footer and phone removal

**Footer Contact column:** support@getzugee.com · Coimbatore, Tamil Nadu · Mon–Sat, 10am–6pm IST. No phone, `tel:` or `wa.me`. Footer link lists are 16 px on mobile.

**Organization structured data:** `telephone` removed; email kept.

**Every place the number appeared** (searched in `app/`, `components/`, `lib/` and `public/`, in every format):

| Where | Action |
|---|---|
| `lib/legal.js`: `COMPANY.phone`, `COMPANY.phoneHref` | **Removed** |
| `lib/structured-data.js`: `telephone` | **Removed** |
| `components/legal/LegalPage.jsx`: contact lines at the end of all three legal pages | **Removed** the Phone line (email and address kept) |
| Privacy: "How to use your rights" ("…or call +91…") | **Removed** the number; now "Email support@getzugee.com." |
| Privacy: Grievance Officer contact | **Removed** the Phone line (name, email and address kept) |
| Terms: payment-safety note ("call us on +91… before you pay") | **Reworded:** "check with us before you pay: email support@getzugee.com or call the number our team already uses with you." |
| Lead form phone placeholder `+91 98765 43210` (a dummy number) | **Changed** to "10-digit mobile number" |
| `public/` | No hits |

Support-channel wording is unchanged. For example, the Terms still say support is "by phone, email and WhatsApp".

**Not public, listed and not changed:**

| Where | What it is |
|---|---|
| `lib/email.js:104` | `wa.me` link to the **visitor's own** number, in the team's new-lead email |
| `lib/email.js:189` | `tel:` link to the **visitor's own** number, in the same email |
| `lib/supabase.js` | Development seed leads with dummy `+91 90000 0000x` numbers. Server-only. |
| `app/admin`, `components/admin`, `app/api` | No hits |

**New test** `tests/public-contact.test.mjs` fails if any of these appear in public source files, `public/` or the structured data:
- the company number in any format
- any +91 mobile number
- `tel:`, `wa.me` or other WhatsApp links

The admin pages, API routes, `lib/email.js` and `lib/supabase.js` are excluded because they handle the visitor's own number. Every format of the company number was checked against the test patterns and all were caught.

### Commit 2: new Hero

- Headline: "Industry-ready ERP & CRM for Indian businesses — set up for you, supported by a real person."
- Subline: "Based in Coimbatore, Tamil Nadu."
- One button: "Book a demo", linking to `#contact`. No WhatsApp button.
- Icon row for the 10 Available products, labelled with each product's own `industry` field from `lib/products.js`. No new copy was written for the labels.
- No dashboard, screenshot or anything resembling product screens. No glows or animation.
- Server component; only the scroll button runs in the browser. Body text is 16 px or larger on mobile.
- New `availableProducts()` helper in `lib/products.js`, used by the hero and the SoftwareApplication structured data. Coming Soon products are hidden, not deleted.

---

## Screenshots (local build of `df9bf1b`)

> The image files in `docs/review/` are kept locally and are git-ignored, so the images below only show in a local checkout.

### Mobile, 375 px

| Hero | Footer |
|---|---|
| ![Mobile hero](review/commit-2/local-mobile-hero.png) | ![Mobile footer](review/commit-2/local-mobile-footer.png) |

### Desktop, 1440 px

![Desktop hero](review/commit-2/local-desktop-hero.png)

![Desktop footer](review/commit-2/local-desktop-footer.png)

---

## Needs your decision before Commit 3

1. **"Own login" wording versus the FAQ.** Commit 3 says the "each product is separate, with its own login and data" wording must not appear anywhere. But the FAQ answer to "Can I use more than one ZUGEE product?" says *"Each ZUGEE product is separate software with its own login and its own data…"*, and an existing test requires that answer to contain "own login" and "side by side". You also said the FAQ content stays unchanged apart from the "Which products can I use today?" answer. **Options:**
   - **(a)** Rewrite that FAQ answer too and update its test. Suggested: *"Yes. You can use two or more ZUGEE products side by side, and we set up each one for you."*
   - **(b)** Keep that FAQ answer, and remove the wording only from the hero and product sections.
2. **Preview access.** Is it fine to keep reviewing from local screenshots? If you want me to screenshot the real preview, you'd need to turn off Deployment Protection for previews or share a bypass link.
3. **Footer badge "Built for Indian SMEs"** and the tagline "Industry-focused CRM, ERP, billing and operations software for Indian businesses" are unchanged. Keep them?

## After your OK: Commits 3–9

Industry grid and product details (carousel removed), Why Zugee, How it works, pricing approach, FAQ edit and restyle, merged contact section with the lead-form constraint test, and cleanup. Then a final report with preview screenshots. No production deploy until you approve.
