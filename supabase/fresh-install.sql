-- supabase/fresh-install.sql
-- The whole ZUGEE database, built from scratch on an EMPTY database, in one transaction.
--
-- It is these three files combined, in this order:
--   1. supabase/schema.sql                              leads
--   2. supabase/migrations/0002_leads_request_type.sql  leads.request_type (folded into the table)
--   3. supabase/migrations/0001_subscriptions_setup_fee.sql  subscriptions, subscription_payments
--
-- HOW TO RUN
--   Paste the whole file into the Supabase SQL editor and run it once, then run
--   supabase/verify.sql. It is NOT re-runnable: it fails with "already exists" if a table is
--   there, and because it is one transaction a failure leaves nothing behind.
--   To change a database that already has these tables, write a new numbered migration instead.
--
-- SECURITY MODEL
--   The Next.js server talks to Supabase with the service_role key only. RLS is enabled with NO
--   policies and the anon / authenticated roles have no privileges, so the public keys cannot
--   read or write any of these tables.

begin;

create extension if not exists pgcrypto;

-- ===========================================================================
-- 1. leads: the "Talk to our team" form
-- ===========================================================================
-- `industry` holds the business type: a product slug from lib/products.js, or 'other'.
-- `request_type` is what the visitor asked for: 'demo' or 'pricing_call' (lib/lead-request.js).
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  reference_id  text not null unique,
  name          text not null check (char_length(name) between 2 and 120),
  phone         text not null check (char_length(phone) between 7 and 25),
  email         text check (email is null or char_length(email) <= 254),
  company_name  text check (company_name is null or char_length(company_name) <= 160),
  industry      text not null check (char_length(industry) <= 40),
  request_type  text not null default 'demo'
                constraint leads_request_type_check check (request_type in ('demo', 'pricing_call')),
  goal          text check (goal is null or char_length(goal) <= 300), -- legacy; no longer collected
  message       text check (message is null or char_length(message) <= 2000),
  source_page   text not null default 'homepage-contact'
                check (source_page in ('homepage-contact')),
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'archived'))
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_industry_idx on public.leads (industry);
create index leads_request_type_idx on public.leads (request_type);

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;

-- ===========================================================================
-- 2. updated_at trigger function
-- ===========================================================================
-- "or replace" on the two functions in this file: dropping a table does not drop the functions
-- its triggers used, so they may still exist in a database whose tables were dropped.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- 3. subscriptions: one row per business per product
-- ===========================================================================
-- Business rules (lib/pricing.js is the source of every price):
--   * The monthly price RECURS. The setup fee is ONE-TIME per business per product; renewals never
--     include it.
--   * Prices are SNAPSHOTTED onto the row when it is created, so a later change in lib/pricing.js
--     never affects an existing subscription. The guard trigger below makes the snapshot immutable.
--   * setup_fee_status: pending -> paid | waived, and paid -> refunded. Never back to pending.
--   * A subscription is tied to a business through lead_id. Phase 2 adds organization_id.
create table public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- Who
  lead_id              uuid null references public.leads(id) on delete set null,
  business_name        text not null check (char_length(business_name) between 2 and 200),
  contact_phone        text check (contact_phone is null or char_length(contact_phone) <= 25),
  contact_email        text check (contact_email is null or char_length(contact_email) <= 254),

  -- What (plan_key / product_slug are validated by the server against lib/pricing.js and lib/products.js)
  product_slug         text not null check (char_length(product_slug) between 1 and 60),
  plan_key             text not null check (char_length(plan_key) between 1 and 40),

  -- Price snapshot, whole rupees excluding GST
  monthly_price        integer not null check (monthly_price >= 0),
  setup_fee            integer not null check (setup_fee >= 0),
  setup_discount       integer not null default 0,

  -- One-time setup fee
  setup_fee_status     text not null default 'pending'
                       check (setup_fee_status in ('pending', 'paid', 'waived', 'refunded')),
  setup_waiver_reason  text null
                       check (setup_waiver_reason is null or setup_waiver_reason in (
                         'early_customer', 'promotional_offer', 'partner_referral',
                         'enterprise_deal', 'manual_admin_waiver', 'existing_customer'
                       )),
  setup_waived_by      text check (setup_waived_by is null or char_length(setup_waived_by) <= 100),
  setup_waived_at      timestamptz,
  setup_paid_at        timestamptz,

  -- Recurring subscription
  subscription_status  text not null default 'pending'
                       check (subscription_status in ('pending', 'active', 'past_due', 'cancelled')),
  billing_cycle        text not null default 'monthly' check (billing_cycle in ('monthly')),
  started_at           date,
  renewal_date         date,
  notes                text check (notes is null or char_length(notes) <= 1000),

  constraint subscriptions_setup_discount_range
    check (setup_discount between 0 and setup_fee),
  -- Waived <=> a reason is recorded, and a waiver always covers the whole setup fee.
  constraint subscriptions_waiver_consistent
    check (
      (setup_fee_status = 'waived' and setup_waiver_reason is not null and setup_discount = setup_fee)
      or (setup_fee_status <> 'waived' and setup_waiver_reason is null)
    )
);

-- One subscription per lead per product: the setup fee is charged once per business per product.
create unique index subscriptions_lead_product_key
  on public.subscriptions (lead_id, product_slug) where lead_id is not null;

-- Admin listing
create index subscriptions_created_at_idx on public.subscriptions (created_at desc);
create index subscriptions_status_idx on public.subscriptions (subscription_status, created_at desc);
create index subscriptions_setup_status_idx on public.subscriptions (setup_fee_status);
create index subscriptions_renewal_date_idx on public.subscriptions (renewal_date);

-- ===========================================================================
-- 4. subscription_payments: payments the team collected (UPI / bank transfer today)
-- ===========================================================================
create table public.subscription_payments (
  id               uuid primary key default gen_random_uuid(),
  subscription_id  uuid not null references public.subscriptions(id) on delete cascade,
  kind             text not null check (kind in ('setup', 'subscription')),
  amount           integer not null check (amount >= 0),
  period_start     date,
  period_end       date,
  method           text check (method is null or char_length(method) <= 40),
  reference        text check (reference is null or char_length(reference) <= 120),
  recorded_by      text check (recorded_by is null or char_length(recorded_by) <= 100),
  paid_at          timestamptz not null default now(),

  -- Setup payments are not tied to a billing period; subscription payments always are.
  constraint subscription_payments_period_shape
    check (
      (kind = 'setup' and period_start is null and period_end is null)
      or (kind = 'subscription' and period_start is not null and period_end is not null
          and period_end >= period_start)
    )
);

-- The setup fee can physically be recorded only once per subscription.
create unique index subscription_payments_one_setup_key
  on public.subscription_payments (subscription_id) where kind = 'setup';
-- Each monthly period can be paid only once.
create unique index subscription_payments_period_key
  on public.subscription_payments (subscription_id, period_start) where kind = 'subscription';

create index subscription_payments_subscription_idx
  on public.subscription_payments (subscription_id, paid_at desc);

-- ===========================================================================
-- 5. Triggers on subscriptions
-- ===========================================================================
create or replace function public.subscriptions_guard_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- The price snapshot never changes after creation.
  if new.monthly_price <> old.monthly_price or new.setup_fee <> old.setup_fee then
    raise exception 'Subscription prices are snapshotted at creation and cannot be changed.';
  end if;

  -- Allowed setup-fee transitions: pending -> paid | waived, paid -> refunded.
  if new.setup_fee_status <> old.setup_fee_status then
    if not (
      (old.setup_fee_status = 'pending' and new.setup_fee_status in ('paid', 'waived'))
      or (old.setup_fee_status = 'paid' and new.setup_fee_status = 'refunded')
    ) then
      raise exception 'Setup fee status cannot change from % to %.', old.setup_fee_status, new.setup_fee_status;
    end if;
  end if;

  return new;
end;
$$;

create trigger subscriptions_guard_update before update on public.subscriptions
  for each row execute function public.subscriptions_guard_update();

create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

-- ===========================================================================
-- 6. Row level security: no policies, so only the service role can read or write.
-- ===========================================================================
alter table public.subscriptions enable row level security;
alter table public.subscription_payments enable row level security;

revoke all on public.subscriptions from anon, authenticated;
revoke all on public.subscription_payments from anon, authenticated;

-- Make the API see the new tables straight away (delivered when the transaction commits).
notify pgrst, 'reload schema';

commit;
