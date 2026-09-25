-- supabase/schema.sql
-- Database schema for the Zugee marketing site.
-- Run in the Supabase SQL editor (or via `supabase db push`) before deploying.
--
-- Security model: the Next.js server talks to Supabase with the service_role key only.
-- RLS is enabled with NO policies, so the anon/public key cannot read or write these tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Sales leads (contact form, fit quiz, pricing estimator)
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  reference_id  text not null unique,
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) <= 254),
  phone         text check (phone is null or char_length(phone) <= 25),
  industry      text not null check (char_length(industry) <= 40),
  goal          text check (goal is null or char_length(goal) <= 300),
  message       text check (message is null or char_length(message) <= 2000),
  source_page   text not null default 'homepage-contact'
                check (source_page in ('homepage-contact', 'fit-quiz', 'pricing-estimator')),
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'archived'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_industry_idx on public.leads (industry);

alter table public.leads enable row level security;

-- ---------------------------------------------------------------------------
-- Newsletter subscribers (footer) — kept out of the sales lead queue
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  email        text not null unique check (char_length(email) <= 254),
  source_page  text not null default 'footer-newsletter'
);

alter table public.newsletter_subscribers enable row level security;

-- ---------------------------------------------------------------------------
-- Migrating an existing database
-- ---------------------------------------------------------------------------
-- If newsletter sign-ups were previously stored in `leads`, move them across:
--
--   insert into public.newsletter_subscribers (email, created_at)
--   select distinct on (email) email, created_at
--   from public.leads
--   where source_page = 'footer-newsletter'
--   on conflict (email) do nothing;
--
--   delete from public.leads where source_page = 'footer-newsletter';
--
-- Legacy source_page values (e.g. 'hero-cta', 'industries-tab') must be normalised
-- before adding the source_page check constraint to an existing table:
--
--   update public.leads set source_page = 'homepage-contact'
--   where source_page not in ('homepage-contact', 'fit-quiz', 'pricing-estimator');
