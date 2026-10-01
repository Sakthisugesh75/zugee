# ZUGEE — Website & Admin Portal

The ZUGEE marketing site (product catalog + "Book a demo" form) and an internal admin portal for incoming leads and subscriptions.

**This repo is not a product.** Every ZUGEE product (ZUGEE ERP / CRM, Transposs, Tours & Travels, Aqua, …) has its own separate codebase, login and database. The customer app that used to live here under `/app` and `/api/app/*` was removed on 2026-10-01.

**Background:** [`docs/ZUGEE-PLATFORM-PLAN.md`](docs/ZUGEE-PLATFORM-PLAN.md). Its sections on a customer app and single sign-on in this repo were written before that decision.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · Supabase

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values (optional for local dev)
npm run dev
```

Open http://localhost:3000.

Without Supabase credentials, the marketing site and admin portal still run in development: leads go to an in-memory store seeded with sample records, and the admin password defaults to `zugee_admin_dev`. **Production refuses to run requests without real credentials.**

`npm run build` succeeds with no environment variables set: no module creates a Supabase client when it's imported.

## Environment variables

See [`.env.example`](.env.example).

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for metadata, robots and sitemap |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only key for leads and subscriptions |
| `ADMIN_PASSWORD` | yes (≥ 12 chars) | Admin portal password |
| `ADMIN_JWT_SECRET` | yes (≥ 32 chars) | Signs admin session cookies |
| `ADMIN_NOTIFICATION_EMAIL` | yes, a company mailbox | Receives new-lead emails. No default: when unset, the team email is skipped and a warning is logged |

## Database

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates `leads`: the "Talk to our team" form (name and mobile required; email, company and requirement optional). RLS is enabled with no policies, so only the server's service-role key can access it. The bottom of the file has the SQL to migrate a database created from the previous version.

[`supabase/migrations/0002_leads_request_type.sql`](supabase/migrations/0002_leads_request_type.sql) adds `leads.request_type` (`demo` or `pricing_call`). **Run it before deploying**: without the column the demo form cannot save leads. A database created from the current `schema.sql` already has the column, and the migration is safe to re-run.

[`supabase/migrations/0001_subscriptions_setup_fee.sql`](supabase/migrations/0001_subscriptions_setup_fee.sql) creates `subscriptions` and `subscription_payments` for the admin portal (the setup fee can be recorded only once).

> **`supabase/app-schema.sql` is unused.** It was the schema for the removed customer app, and no code in this repo reads or writes its tables. The file is kept for reference only. One dependency remains: the `0001` migration still references `public.customer_profiles` and the `update_updated_at_column()` function that `app-schema.sql` defines, so on a fresh database `0001` fails unless `app-schema.sql` is run first. Remove those references from the migration before dropping the file.

## Project structure

```
app/
  (marketing)/        public site: layout (navbar + footer) and homepage
  admin/              admin login, lead dashboard, subscriptions (server-gated by session cookie)
  api/
    leads/            POST  public lead submission (rate limited, validated)
    admin/auth/       POST login · GET session · DELETE logout
    admin/leads/      GET list + stats · PATCH status (admin only)
    admin/subscriptions/  GET list · POST create · PATCH setup payment / waiver / monthly payment / status (admin only)
components/
  home/               homepage sections (hero, products, how it works, pricing + FAQ, contact)
  layout/             navbar, footer
  admin/              admin client components
  ui/                 shared primitives (MascotLogo, StatusBadge)
lib/
  products.js         product catalog + statuses (single source for site, form, admin, JSON-LD)
  pricing.js          plans: monthly price + one-time setup fee (the ONLY place prices live; not shown on the site)
  lead-request.js     demo vs pricing-call requests from the lead form
  subscriptions.js    subscription + setup-fee data layer (server-only)
  site-content.js     how-it-works steps and FAQ (also emitted as FAQPage JSON-LD)
  auth.js             admin password check + signed httpOnly session cookie
  rate-limit.js       in-memory rate limiter
  supabase.js         lead data access (Supabase, dev-only in-memory fallback)
supabase/             database schemas
docs/                 platform plan and setup notes
```

## Content rule

Every sentence on the site must pass: **"Can the product (or our team) actually do this today?"** If not, remove it or mark it Coming Soon. Product statuses live in `lib/products.js`. A product becomes "Available" only after the checklist in the platform plan, section F.

## Security notes

- Security headers on every response: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS in production, and a report-only CSP (enforced in Phase 8). See `next.config.mjs`.
- Admin sessions are HMAC-signed tokens in an `httpOnly`, `SameSite=Strict` cookie (24h).
- Login is rate limited per IP (5 failures / 15 min) and globally (100 failures / 15 min).
- Public forms are rate limited per IP and include a honeypot field.
- Rate-limit counters are **in-memory per server instance**. On serverless or multi-instance hosting, move them to a shared store (planned in Phase 1).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Pricing, subscription, email, lead-request and site-content tests (Node test runner) |
