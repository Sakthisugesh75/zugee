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

Without Supabase credentials, development uses an in-memory lead store seeded with sample records, and the admin password defaults to `zugee_admin_dev`. **Production refuses to run requests without real credentials.**

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

- `leads` — contact form, fit quiz and pricing estimator submissions
- `newsletter_subscribers` — footer sign-ups (kept out of the sales queue)

Both tables have row-level security enabled with no policies, so only the service-role key used by the server can access them.

## Project structure

```
app/
  (marketing)/        public site: layout (navbar + footer) and homepage
  admin/              admin login + dashboard (server-gated by session cookie)
  api/
    leads/            POST  public lead submission (rate limited, validated)
    subscribe/        POST  newsletter subscription
    admin/auth/       POST login · GET session · DELETE logout
    admin/leads/      GET list + stats · PATCH status (admin only)
components/
  home/               homepage sections
  layout/             navbar, footer
  admin/              admin client components
  ui/                 shared UI primitives
lib/
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
