-- supabase/schema.sql
-- Database schema for the ZUGEE marketing site (lead form).
-- Run in the Supabase SQL editor (or via `supabase db push`) before deploying.
--
-- Security model: the Next.js server talks to Supabase with the service_role key only.
-- RLS is enabled with NO policies, so the anon/public key cannot read or write these tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Sales leads ("Talk to our team" form)
-- `industry` holds the business type: a product slug from lib/products.js, or 'other'.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  reference_id  text not null unique,
  name          text not null check (char_length(name) between 2 and 120),
  phone         text not null check (char_length(phone) between 7 and 25),
  email         text check (email is null or char_length(email) <= 254),
  company_name  text check (company_name is null or char_length(company_name) <= 160),
  industry      text not null check (char_length(industry) <= 40),
  goal          text check (goal is null or char_length(goal) <= 300), -- legacy; no longer collected
  message       text check (message is null or char_length(message) <= 2000),
  source_page   text not null default 'homepage-contact'
                check (source_page in ('homepage-contact')),
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'archived'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_industry_idx on public.leads (industry);

alter table public.leads enable row level security;

-- ---------------------------------------------------------------------------
-- Migrating an existing database (Phase 0, 2026-09-25)
-- ---------------------------------------------------------------------------
-- Run once on a database created from the previous version of this file:
--
--   alter table public.leads add column if not exists company_name text
--     check (company_name is null or char_length(company_name) <= 160);
--   alter table public.leads alter column email drop not null;
--
--   -- Phone becomes required. Old leads without a phone keep a placeholder so the constraint holds.
--   update public.leads set phone = 'not-given' where phone is null;
--   alter table public.leads alter column phone set not null;
--
--   -- The fit quiz and pricing estimator no longer exist.
--   update public.leads set source_page = 'homepage-contact' where source_page <> 'homepage-contact';
--   alter table public.leads drop constraint if exists leads_source_page_check;
--   alter table public.leads add constraint leads_source_page_check check (source_page in ('homepage-contact'));
--
--   -- The footer newsletter was removed. Export the list first if you want to keep it.
--   drop table if exists public.newsletter_subscribers;
