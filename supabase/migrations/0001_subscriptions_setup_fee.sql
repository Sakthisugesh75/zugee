-- supabase/migrations/0001_subscriptions_setup_fee.sql
-- ZUGEE subscriptions with a one-time "Setup & Onboarding" fee.
--
-- HOW TO RUN
--   Run AFTER supabase/schema.sql (creates public.leads) and supabase/app-schema.sql (creates
--   public.customer_profiles and the update_updated_at_column() trigger function), in the Supabase
--   SQL editor or with `supabase db push`. Safe to re-run: tables, indexes, policies, triggers and
--   the backfill are all written to be idempotent.
--
-- BUSINESS RULES (lib/pricing.js is the source of every price)
--   * The monthly price RECURS. The setup fee is ONE-TIME per business per product; renewals never
--     include it.
--   * Prices are SNAPSHOTTED onto the subscription row when it is created, so a later change in
--     lib/pricing.js never affects an existing subscription. A trigger below makes the snapshot
--     immutable.
--   * setup_fee_status: pending -> paid | waived, and paid -> refunded. Never back to pending.
--     The setup fee can be recorded as paid only once (unique partial index on payments).
--   * Customers can only READ their own rows. Every write goes through the Next.js server with the
--     service-role key (admin portal today; Razorpay webhooks in Phase 6).
--
-- TENANCY
--   customer_id points at customer_profiles(id) for now and is NULL until the business has a ZUGEE
--   login (sales is demo-led: deals are recorded from marketing leads). Phase 2 re-keys customer_id
--   to organization_id (docs/ZUGEE-PLATFORM-PLAN.md §C3, §D).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- Who
  customer_id          uuid null references public.customer_profiles(id) on delete set null,
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

-- One subscription per business per product: the setup fee is charged once per business per product.
create unique index if not exists subscriptions_customer_product_key
  on public.subscriptions (customer_id, product_slug) where customer_id is not null;
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
  for each row execute function update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Row level security: customers read their own rows; nobody but the service role writes.
-- ---------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.subscription_payments enable row level security;

revoke all on public.subscriptions from anon;
revoke all on public.subscription_payments from anon;
revoke insert, update, delete, truncate on public.subscriptions from anon, authenticated;
revoke insert, update, delete, truncate on public.subscription_payments from anon, authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.subscription_payments to authenticated;

drop policy if exists "Customers can view own subscriptions" on public.subscriptions;
create policy "Customers can view own subscriptions"
  on public.subscriptions for select
  to authenticated
  using (customer_id = auth.uid());

drop policy if exists "Customers can view own subscription payments" on public.subscription_payments;
create policy "Customers can view own subscription payments"
  on public.subscription_payments for select
  to authenticated
  using (
    exists (
      select 1 from public.subscriptions s
      where s.id = subscription_payments.subscription_id
        and s.customer_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Backfill: existing customers never pay the new setup fee.
-- Every existing customer_profiles row on a paid plan gets a subscription for the product the
-- /app dashboard serves (ZUGEE ERP / CRM, slug 'core-erp') with the setup fee WAIVED as
-- 'existing_customer'. Rows that already exist are skipped.
-- Prices below mirror lib/pricing.js at time of writing (2026-09-25). Do not update them later:
-- they are the snapshot these customers are billed at.
-- ---------------------------------------------------------------------------
insert into public.subscriptions (
  customer_id, business_name, contact_phone, product_slug, plan_key,
  monthly_price, setup_fee, setup_discount,
  setup_fee_status, setup_waiver_reason, setup_waived_by, setup_waived_at,
  subscription_status, started_at, notes
)
select
  cp.id,
  cp.business_name,
  cp.phone,
  'core-erp',
  cp.plan_tier,
  prices.monthly_price,
  prices.setup_fee,
  prices.setup_fee,               -- waived: discount = full setup fee
  'waived',
  'existing_customer',
  'migration 0001',
  now(),
  case cp.subscription_status
    when 'active' then 'active'
    when 'suspended' then 'past_due'
    when 'cancelled' then 'cancelled'
    else 'pending'                -- 'trial'
  end,
  case when cp.subscription_status = 'active' then cp.created_at::date else null end,
  'Backfilled by migration 0001: customer existed before the setup fee.'
from public.customer_profiles cp
join (
  -- mirror lib/pricing.js at time of writing
  values ('starter', 1999, 4999),
         ('growth',  4099, 9999)
) as prices(plan_key, monthly_price, setup_fee)
  on prices.plan_key = cp.plan_tier
where not exists (
  select 1 from public.subscriptions s
  where s.customer_id = cp.id and s.product_slug = 'core-erp'
);
