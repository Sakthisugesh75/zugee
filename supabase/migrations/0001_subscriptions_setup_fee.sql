-- supabase/migrations/0001_subscriptions_setup_fee.sql
-- ZUGEE subscriptions with a one-time "Setup & Onboarding" fee.
-- Creates everything the admin subscriptions page (/admin/subscriptions) needs, and nothing else.
--
-- HOW TO RUN
--   Paste the whole file into the Supabase SQL editor and run it. The only thing it needs to exist
--   already is public.leads (supabase/schema.sql). It does NOT need supabase/app-schema.sql.
--   Safe to re-run: every statement is idempotent, and the whole file is one transaction, so a
--   failure leaves nothing half-created.
--
-- BUSINESS RULES (lib/pricing.js is the source of every price)
--   * The monthly price RECURS. The setup fee is ONE-TIME per business per product; renewals never
--     include it.
--   * Prices are SNAPSHOTTED onto the subscription row when it is created, so a later change in
--     lib/pricing.js never affects an existing subscription. A trigger below makes the snapshot
--     immutable.
--   * setup_fee_status: pending -> paid | waived, and paid -> refunded. Never back to pending.
--     The setup fee can be recorded as paid only once (unique partial index on payments).
--
-- SECURITY MODEL (same as public.leads)
--   RLS is enabled with NO policies, so the anon and authenticated keys cannot read or write these
--   tables. Every read and write goes through the Next.js server with the service-role key.
--
-- NO customer_id
--   An earlier version of this file had subscriptions.customer_id, a foreign key to
--   customer_profiles from the removed customer app. Nothing read it. A subscription is tied to a
--   business through lead_id; Phase 2 adds organization_id (docs/ZUGEE-PLATFORM-PLAN.md).

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
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
create unique index if not exists subscriptions_lead_product_key
  on public.subscriptions (lead_id, product_slug) where lead_id is not null;

-- Admin listing
create index if not exists subscriptions_created_at_idx on public.subscriptions (created_at desc);
create index if not exists subscriptions_status_idx on public.subscriptions (subscription_status, created_at desc);
create index if not exists subscriptions_setup_status_idx on public.subscriptions (setup_fee_status);
create index if not exists subscriptions_renewal_date_idx on public.subscriptions (renewal_date);

-- ---------------------------------------------------------------------------
-- subscription_payments: payments the team collected (UPI / bank transfer today, Razorpay in Phase 6)
-- ---------------------------------------------------------------------------
create table if not exists public.subscription_payments (
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
create unique index if not exists subscription_payments_one_setup_key
  on public.subscription_payments (subscription_id) where kind = 'setup';
-- Each monthly period can be paid only once.
create unique index if not exists subscription_payments_period_key
  on public.subscription_payments (subscription_id, period_start) where kind = 'subscription';

create index if not exists subscription_payments_subscription_idx
  on public.subscription_payments (subscription_id, paid_at desc);

-- ---------------------------------------------------------------------------
-- Guard rails on updates
-- ---------------------------------------------------------------------------
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

drop trigger if exists subscriptions_guard_update on public.subscriptions;
create trigger subscriptions_guard_update before update on public.subscriptions
  for each row execute function public.subscriptions_guard_update();

drop trigger if exists update_subscriptions_updated_at on public.subscriptions;
create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Row level security: no policies, so only the service role can read or write.
-- ---------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.subscription_payments enable row level security;

revoke all on public.subscriptions from anon, authenticated;
revoke all on public.subscription_payments from anon, authenticated;

-- Never rely on the project's default privileges: the server's role is granted what it uses,
-- explicitly. Without this the API fails with "permission denied".
grant select, insert, update, delete on public.subscriptions to service_role;
grant select, insert, update, delete on public.subscription_payments to service_role;

-- ---------------------------------------------------------------------------
-- Databases that ran the earlier version of this file
-- ---------------------------------------------------------------------------
-- That version had customer_id and two "customers can view own rows" policies built on it.
-- These statements remove them, and do nothing on a database that never had them.
-- NOTE: this deletes whatever is stored in subscriptions.customer_id.
drop policy if exists "Customers can view own subscriptions" on public.subscriptions;
drop policy if exists "Customers can view own subscription payments" on public.subscription_payments;
alter table public.subscriptions drop column if exists customer_id;

-- Make the API see the new tables straight away.
notify pgrst, 'reload schema';

commit;
