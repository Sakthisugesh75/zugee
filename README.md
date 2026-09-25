# ZUGEE — Website, Lead Queue & Platform (in progress)

The ZUGEE marketing site (product catalog + "Talk to our team" form), an internal admin portal for incoming leads, and the start of the ZUGEE platform under `/app`.

**Where this is going:** [`docs/ZUGEE-PLATFORM-PLAN.md`](docs/ZUGEE-PLATFORM-PLAN.md): one ZUGEE account, organizations with branches, users and roles, and the industry products (Transposs, Tours & Travels, Aqua, …) connected by SSO. Phase 0 (truth & cleanup) is done; Phase 1 (authentication) is next.

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

The signed-in product under `/app/*` needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus the tables in `supabase/app-schema.sql`. **Customer login doesn't work yet.** It's rebuilt in Phase 1. Modules that aren't built show a "Coming Soon" screen rather than sample numbers.

## Environment variables

See [`.env.example`](.env.example).

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for metadata, robots and sitemap |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only key for writing leads |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for `/app` | Client-safe key (respects RLS) |
| `ADMIN_PASSWORD` | yes (≥ 12 chars) | Admin portal password |
| `ADMIN_JWT_SECRET` | yes (≥ 32 chars) | Signs admin session cookies |

## Database

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates `leads`: the "Talk to our team" form (name and mobile required; email, company and requirement optional). RLS is enabled with no policies, so only the server's service-role key can access it. The bottom of the file has the SQL to migrate a database created from the previous version.

[`supabase/app-schema.sql`](supabase/app-schema.sql) is the interim schema for `/app`. Phase 2 replaces it with numbered migrations and the organization model.

## Project structure

```
app/
  (marketing)/        public site: layout (navbar + footer) and homepage
  admin/              admin login + lead dashboard (server-gated by session cookie)
  app/                signed-in product (CRM works; other modules show Coming Soon)
  api/
    leads/            POST  public lead submission (rate limited, validated)
    admin/auth/       POST login · GET session · DELETE logout
    admin/leads/      GET list + stats · PATCH status (admin only)
    app/              product APIs (auth, dashboard, CRM leads)
components/
  home/               homepage sections (hero, products, how it works, pricing + FAQ, contact)
  layout/             navbar, footer
  admin/              admin client components
  app/                product UI kit (KPICard, EmptyState, ComingSoon, …)
  ui/                 shared primitives (MascotLogo, StatusBadge)
lib/
  products.js         product catalog + statuses (single source for site, form, admin, JSON-LD)
  site-content.js     how-it-works steps and FAQ (also emitted as FAQPage JSON-LD)
  auth.js             admin password check + signed httpOnly session cookie
  app-auth.js         product auth helpers (rebuilt in Phase 1)
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
