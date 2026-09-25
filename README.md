# Zugee — Marketing Site & Lead Queue

Marketing site for Zugee Systems Technologies, with lead capture and a small internal admin portal.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · framer-motion · Supabase

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values (optional for local dev)
npm run dev
```

Open http://localhost:3000.

Without Supabase credentials, the marketing site and admin portal still run in development: leads go to an in-memory store seeded with sample records, and the admin password defaults to `zugee_admin_dev`. **Production refuses to run requests without real credentials.**

The customer product under `/app/*` (dashboard, CRM, ads, GST, reports, back office) has no dev fallback. It needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus the tables in `supabase/app-schema.sql`, or every `/app` page returns a 500 (`Missing env.SUPABASE_URL`). Ad integrations and AI insights need further variables; see [`docs/OAUTH_SETUP.md`](docs/OAUTH_SETUP.md) and [`docs/AI_INSIGHTS_SETUP.md`](docs/AI_INSIGHTS_SETUP.md).

## Environment variables

See [`.env.example`](.env.example).

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for metadata, robots and sitemap |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only key for writing leads |
| `ADMIN_PASSWORD` | yes (≥ 12 chars) | Admin portal password |
| `ADMIN_JWT_SECRET` | yes (≥ 32 chars) | Signs admin session cookies |

## Database

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates:

<<<<<<< Updated upstream
- `leads` — contact form, fit quiz and pricing estimator submissions
- `newsletter_subscribers` — footer sign-ups (kept out of the sales queue)

Both tables have row-level security enabled with no policies, so only the service-role key used by the server can access them.
=======
[`supabase/app-schema.sql`](supabase/app-schema.sql) is the interim schema for `/app`. Then run [`supabase/migrations/0001_subscriptions_setup_fee.sql`](supabase/migrations/0001_subscriptions_setup_fee.sql). It creates `subscriptions` and `subscription_payments` (the setup fee can be recorded only once, and customers can only read their own rows), and backfills existing customers with the setup fee waived. Phase 2 replaces it with numbered migrations and the organization model.
>>>>>>> Stashed changes

## Project structure

```
app/
  (marketing)/        public site: layout (navbar + footer) and homepage
<<<<<<< Updated upstream
  admin/              admin login + dashboard (server-gated by session cookie)
=======
  admin/              admin login, lead dashboard, subscriptions (server-gated by session cookie)
  app/                signed-in product (CRM works; other modules show Coming Soon)
>>>>>>> Stashed changes
  api/
    leads/            POST  public lead submission (rate limited, validated)
    subscribe/        POST  newsletter subscription
    admin/auth/       POST login · GET session · DELETE logout
    admin/leads/      GET list + stats · PATCH status (admin only)
<<<<<<< Updated upstream
=======
    admin/subscriptions/  GET list · POST create · PATCH setup payment / waiver / monthly payment / status (admin only)
    app/              product APIs (auth, dashboard, CRM leads)
>>>>>>> Stashed changes
components/
  home/               homepage sections
  layout/             navbar, footer
  admin/              admin client components
  ui/                 shared UI primitives
lib/
<<<<<<< Updated upstream
=======
  products.js         product catalog + statuses (single source for site, form, admin, JSON-LD)
  pricing.js          plans: monthly price + one-time setup fee (the ONLY place prices live)
  subscriptions.js    subscription + setup-fee data layer (server-only)
  site-content.js     how-it-works steps and FAQ (also emitted as FAQPage JSON-LD)
>>>>>>> Stashed changes
  auth.js             admin password check + signed httpOnly session cookie
  rate-limit.js       in-memory rate limiter
  supabase.js         data access (Supabase, dev-only in-memory fallback)
  verticals.js        all site copy: industries, agents, pricing, FAQ
supabase/schema.sql   database schema
```

## Security notes

- Admin sessions are HMAC-signed tokens in an `httpOnly`, `SameSite=Strict` cookie (24h).
- Login is rate limited per IP (5 failures / 15 min) and globally (100 failures / 15 min).
- Public forms are rate limited per IP and include a honeypot field.
- Rate-limit counters are **in-memory per server instance**. On serverless or multi-instance hosting, move them to a shared store (e.g. Upstash Redis) for strict enforcement.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Pricing and subscription tests (Node test runner) |
