-- supabase/app-schema.sql
-- Database schema for the Zugee PRODUCT APPLICATION (customer-facing dashboard)
-- This is SEPARATE from the marketing site schema (schema.sql)
-- 
-- Security model: Multi-tenant with Row Level Security (RLS)
-- Each customer account can ONLY access their own data
--
-- Run this AFTER schema.sql in the Supabase SQL editor
--
-- PHASE 0 NOTE (see docs/ZUGEE-PLATFORM-PLAN.md): this file received only minimal
-- safety fixes in Phase 0 (fresh-DB order, no RLS-bypassing views, billing columns
-- not client-writable). Phase 2 (multi-tenancy & RBAC) replaces this whole file
-- with versioned migrations. Do not build new features on these tables.

-- ---------------------------------------------------------------------------
-- Customer Accounts (using Supabase Auth)
-- ---------------------------------------------------------------------------
-- This extends Supabase's built-in auth.users table
-- The auth.users table is managed by Supabase Auth
-- We create a customer_profiles table for business-specific data

create table if not exists public.customer_profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Business Information
  business_name     text not null check (char_length(business_name) between 2 and 200),
  business_type     text not null check (char_length(business_type) <= 100),
  gst_number        text check (gst_number is null or char_length(gst_number) = 15),
  pan_number        text check (pan_number is null or char_length(pan_number) = 10),
  
  -- Address & Location
  state             text not null check (char_length(state) <= 100),
  city              text check (city is null or char_length(city) <= 100),
  address           text check (address is null or char_length(address) <= 500),
  
  -- Contact
  phone             text check (phone is null or char_length(phone) <= 25),
  
  -- Plan & Status
  plan_tier         text not null default 'starter' 
                    check (plan_tier in ('starter', 'growth', 'enterprise')),
  subscription_status text not null default 'trial'
                    check (subscription_status in ('trial', 'active', 'suspended', 'cancelled')),
  trial_ends_at     timestamptz,
  
  -- Settings
  timezone          text not null default 'Asia/Kolkata',
  currency          text not null default 'INR',
  
  -- Onboarding
  onboarding_completed boolean not null default false,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

create index if not exists customer_profiles_business_name_idx on public.customer_profiles (business_name);
create index if not exists customer_profiles_subscription_status_idx on public.customer_profiles (subscription_status);

alter table public.customer_profiles enable row level security;

-- RLS Policy: Users can only see their own profile
create policy "Users can view own profile"
  on public.customer_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.customer_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Billing/plan columns (plan_tier, subscription_status, trial_ends_at) must only be
-- changed by the server (service role). The row policy above cannot restrict columns,
-- so clients get UPDATE on the safe columns only.
revoke update on public.customer_profiles from anon, authenticated;
grant update (
  updated_at,
  business_name,
  business_type,
  gst_number,
  pan_number,
  state,
  city,
  address,
  phone,
  timezone,
  currency,
  onboarding_completed
) on public.customer_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- CRM: Customer Leads (PRODUCT leads, not marketing leads)
-- ---------------------------------------------------------------------------
create table if not exists public.crm_leads (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Lead Information
  name              text not null check (char_length(name) between 2 and 120),
  email             text check (email is null or char_length(email) <= 254),
  phone             text check (phone is null or char_length(phone) <= 25),
  company           text check (company is null or char_length(company) <= 200),
  
  -- Lead Source & Status
  source            text not null default 'direct'
                    check (source in ('meta_ads', 'google_ads', 'direct', 'whatsapp', 
                                      'website', 'referral', 'other')),
  -- FK to ad_campaigns is added after that table is created (see below),
  -- so this script runs on a fresh database.
  source_campaign_id uuid,
  status            text not null default 'new'
                    check (status in ('new', 'hot', 'follow_up', 'contacted', 
                                      'qualified', 'converted', 'lost')),
  priority          text not null default 'medium'
                    check (priority in ('low', 'medium', 'high')),
  
  -- Lead Tracking
  first_contact_at  timestamptz,
  last_contact_at   timestamptz,
  next_follow_up_at timestamptz,
  
  -- Lead Details
  notes             text check (notes is null or char_length(notes) <= 5000),
  estimated_value   numeric(15,2) check (estimated_value is null or estimated_value >= 0),
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

create index if not exists crm_leads_customer_id_idx on public.crm_leads (customer_id);
create index if not exists crm_leads_created_at_idx on public.crm_leads (created_at desc);
create index if not exists crm_leads_status_idx on public.crm_leads (status);
create index if not exists crm_leads_source_idx on public.crm_leads (source);
create index if not exists crm_leads_next_follow_up_idx on public.crm_leads (next_follow_up_at) 
  where next_follow_up_at is not null;

alter table public.crm_leads enable row level security;

-- RLS Policy: Customers can only see their own leads
create policy "Customers can view own leads"
  on public.crm_leads for select
  using (customer_id = auth.uid());

create policy "Customers can insert own leads"
  on public.crm_leads for insert
  with check (customer_id = auth.uid());

create policy "Customers can update own leads"
  on public.crm_leads for update
  using (customer_id = auth.uid());

create policy "Customers can delete own leads"
  on public.crm_leads for delete
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Ad Integration: Connected Ad Accounts
-- ---------------------------------------------------------------------------
create table if not exists public.ad_accounts (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Platform
  platform          text not null check (platform in ('meta_ads', 'google_ads')),
  
  -- OAuth Credentials (encrypted)
  account_id        text not null, -- Platform's account ID
  access_token      text not null, -- Encrypted access token
  refresh_token     text,          -- Encrypted refresh token
  token_expires_at  timestamptz,
  
  -- Account Details
  account_name      text check (account_name is null or char_length(account_name) <= 200),
  
  -- Status
  is_active         boolean not null default true,
  last_sync_at      timestamptz,
  sync_status       text not null default 'pending'
                    check (sync_status in ('pending', 'syncing', 'success', 'error')),
  sync_error        text,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb,
  
  unique(customer_id, platform, account_id)
);

create index if not exists ad_accounts_customer_id_idx on public.ad_accounts (customer_id);
create index if not exists ad_accounts_platform_idx on public.ad_accounts (platform);

alter table public.ad_accounts enable row level security;

-- RLS Policy: Customers can only see their own ad accounts
create policy "Customers can view own ad accounts"
  on public.ad_accounts for select
  using (customer_id = auth.uid());

create policy "Customers can manage own ad accounts"
  on public.ad_accounts for all
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Ad Campaigns
-- ---------------------------------------------------------------------------
create table if not exists public.ad_campaigns (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  ad_account_id     uuid not null references public.ad_accounts(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Campaign Identity
  platform_campaign_id text not null, -- ID from Meta/Google
  campaign_name     text not null check (char_length(campaign_name) <= 300),
  
  -- Campaign Status
  status            text not null default 'active'
                    check (status in ('active', 'paused', 'completed', 'deleted')),
  
  -- Campaign Performance (synced from platform)
  ad_spend          numeric(15,2) not null default 0 check (ad_spend >= 0),
  leads_count       integer not null default 0 check (leads_count >= 0),
  conversions       integer not null default 0 check (conversions >= 0),
  impressions       bigint not null default 0 check (impressions >= 0),
  clicks            bigint not null default 0 check (clicks >= 0),
  
  -- Computed Metrics
  cpl               numeric(15,2) check (cpl is null or cpl >= 0), -- Cost per lead
  roas              numeric(10,4) check (roas is null or roas >= 0), -- Return on ad spend
  
  -- Tracking
  campaign_start_date date,
  campaign_end_date   date,
  last_synced_at    timestamptz,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb,
  
  unique(ad_account_id, platform_campaign_id)
);

create index if not exists ad_campaigns_customer_id_idx on public.ad_campaigns (customer_id);
create index if not exists ad_campaigns_ad_account_id_idx on public.ad_campaigns (ad_account_id);
create index if not exists ad_campaigns_status_idx on public.ad_campaigns (status);

alter table public.ad_campaigns enable row level security;

-- RLS Policy: Customers can only see their own campaigns
create policy "Customers can view own campaigns"
  on public.ad_campaigns for select
  using (customer_id = auth.uid());

-- Deferred from crm_leads: ad_campaigns did not exist yet when crm_leads was created
alter table public.crm_leads
  add constraint crm_leads_source_campaign_id_fkey
  foreign key (source_campaign_id) references public.ad_campaigns(id) on delete set null;

-- ---------------------------------------------------------------------------
-- GST & Billing: Invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Invoice Identity
  invoice_number    text not null,
  invoice_date      date not null default current_date,
  due_date          date,
  
  -- Customer/Client Details
  client_name       text not null check (char_length(client_name) between 2 and 200),
  client_gst        text check (client_gst is null or char_length(client_gst) = 15),
  client_address    text check (client_address is null or char_length(client_address) <= 500),
  client_state      text check (client_state is null or char_length(client_state) <= 100),
  
  -- Amounts
  subtotal          numeric(15,2) not null check (subtotal >= 0),
  
  -- GST Breakdown
  cgst_amount       numeric(15,2) not null default 0 check (cgst_amount >= 0),
  sgst_amount       numeric(15,2) not null default 0 check (sgst_amount >= 0),
  igst_amount       numeric(15,2) not null default 0 check (igst_amount >= 0),
  
  -- Total
  total_amount      numeric(15,2) not null check (total_amount >= 0),
  
  -- Payment
  payment_status    text not null default 'unpaid'
                    check (payment_status in ('unpaid', 'partial', 'paid', 'overdue')),
  paid_amount       numeric(15,2) not null default 0 check (paid_amount >= 0),
  payment_date      date,
  
  -- Invoice Type
  invoice_type      text not null default 'b2b'
                    check (invoice_type in ('b2b', 'b2c', 'export')),
  
  -- E-Invoice
  irn               text, -- Invoice Reference Number for e-invoice
  ack_number        text, -- Acknowledgement number from GST portal
  
  -- Metadata
  notes             text check (notes is null or char_length(notes) <= 2000),
  metadata          jsonb default '{}'::jsonb,
  
  unique(customer_id, invoice_number)
);

create index if not exists invoices_customer_id_idx on public.invoices (customer_id);
create index if not exists invoices_invoice_date_idx on public.invoices (invoice_date desc);
create index if not exists invoices_payment_status_idx on public.invoices (payment_status);
create index if not exists invoices_due_date_idx on public.invoices (due_date) 
  where payment_status in ('unpaid', 'partial');

alter table public.invoices enable row level security;

-- RLS Policy: Customers can only see their own invoices
create policy "Customers can view own invoices"
  on public.invoices for select
  using (customer_id = auth.uid());

create policy "Customers can manage own invoices"
  on public.invoices for all
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- GST: Tax Configuration
-- ---------------------------------------------------------------------------
create table if not exists public.gst_configurations (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Tax Registration
  gst_number        text not null check (char_length(gst_number) = 15),
  registered_state  text not null check (char_length(registered_state) <= 100),
  
  -- Tax Engine Version
  engine_version    text not null default 'v2.0',
  
  -- Default Settings
  default_gst_rate  numeric(5,2) not null default 18.00 
                    check (default_gst_rate >= 0 and default_gst_rate <= 100),
  
  -- Threshold Settings
  composition_scheme boolean not null default false,
  reverse_charge    boolean not null default false,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

alter table public.gst_configurations enable row level security;

-- RLS Policy: Customers can only see their own GST config
create policy "Customers can view own GST config"
  on public.gst_configurations for select
  using (customer_id = auth.uid());

create policy "Customers can manage own GST config"
  on public.gst_configurations for all
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Inventory: Products/Services
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Product Details
  product_code      text not null,
  product_name      text not null check (char_length(product_name) between 1 and 300),
  description       text check (description is null or char_length(description) <= 1000),
  
  -- Type
  product_type      text not null default 'goods'
                    check (product_type in ('goods', 'services')),
  
  -- Pricing
  unit_price        numeric(15,2) not null check (unit_price >= 0),
  unit              text not null default 'pcs' check (char_length(unit) <= 20),
  
  -- GST
  hsn_code          text check (hsn_code is null or char_length(hsn_code) <= 10),
  gst_rate          numeric(5,2) not null default 18.00 
                    check (gst_rate >= 0 and gst_rate <= 100),
  
  -- Inventory (for goods)
  current_stock     numeric(15,3) check (current_stock is null or current_stock >= 0),
  low_stock_threshold numeric(15,3) check (low_stock_threshold is null or low_stock_threshold >= 0),
  
  -- Status
  is_active         boolean not null default true,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb,
  
  unique(customer_id, product_code)
);

create index if not exists products_customer_id_idx on public.products (customer_id);
create index if not exists products_is_active_idx on public.products (is_active);

alter table public.products enable row level security;

-- RLS Policy: Customers can only see their own products
create policy "Customers can view own products"
  on public.products for select
  using (customer_id = auth.uid());

create policy "Customers can manage own products"
  on public.products for all
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- HR: Employees
-- ---------------------------------------------------------------------------
create table if not exists public.employees (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  
  -- Employee Details
  employee_code     text not null,
  first_name        text not null check (char_length(first_name) between 1 and 100),
  last_name         text check (last_name is null or char_length(last_name) <= 100),
  email             text check (email is null or char_length(email) <= 254),
  phone             text check (phone is null or char_length(phone) <= 25),
  
  -- Employment
  designation       text check (designation is null or char_length(designation) <= 150),
  department        text check (department is null or char_length(department) <= 100),
  date_of_joining   date,
  employment_type   text not null default 'full_time'
                    check (employment_type in ('full_time', 'part_time', 'contract', 'intern')),
  
  -- Status
  status            text not null default 'active'
                    check (status in ('active', 'on_leave', 'resigned', 'terminated')),
  
  -- Salary (encrypted or reference to separate payroll table)
  monthly_salary    numeric(15,2) check (monthly_salary is null or monthly_salary >= 0),
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb,
  
  unique(customer_id, employee_code)
);

create index if not exists employees_customer_id_idx on public.employees (customer_id);
create index if not exists employees_status_idx on public.employees (status);

alter table public.employees enable row level security;

-- RLS Policy: Customers can only see their own employees
create policy "Customers can view own employees"
  on public.employees for select
  using (customer_id = auth.uid());

create policy "Customers can manage own employees"
  on public.employees for all
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- AI Insights: Computed Alerts
-- ---------------------------------------------------------------------------
create table if not exists public.ai_insights (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  
  -- Insight Type
  insight_type      text not null
                    check (insight_type in ('wasted_ad_spend', 'lead_decay', 'low_stock', 
                                            'overdue_payment', 'gst_anomaly', 'other')),
  
  -- Severity
  severity          text not null default 'medium'
                    check (severity in ('low', 'medium', 'high', 'critical')),
  
  -- Content
  title             text not null check (char_length(title) between 5 and 200),
  description       text not null check (char_length(description) between 10 and 1000),
  
  -- Related Entity
  related_entity_type text check (related_entity_type in ('campaign', 'lead', 'invoice', 'product')),
  related_entity_id uuid,
  
  -- Action
  action_url        text check (action_url is null or char_length(action_url) <= 500),
  action_label      text check (action_label is null or char_length(action_label) <= 100),
  
  -- Status
  is_dismissed      boolean not null default false,
  dismissed_at      timestamptz,
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

create index if not exists ai_insights_customer_id_idx on public.ai_insights (customer_id);
create index if not exists ai_insights_created_at_idx on public.ai_insights (created_at desc);
create index if not exists ai_insights_is_dismissed_idx on public.ai_insights (is_dismissed);
create index if not exists ai_insights_severity_idx on public.ai_insights (severity);

alter table public.ai_insights enable row level security;

-- RLS Policy: Customers can only see their own insights
create policy "Customers can view own insights"
  on public.ai_insights for select
  using (customer_id = auth.uid());

create policy "Customers can dismiss own insights"
  on public.ai_insights for update
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Reports: Generated Reports
-- ---------------------------------------------------------------------------
create table if not exists public.generated_reports (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customer_profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  
  -- Report Details
  report_type       text not null
                    check (report_type in ('daily_business', 'monthly_gst', 'sales_summary', 
                                          'inventory_report', 'payroll', 'custom')),
  report_name       text not null check (char_length(report_name) between 5 and 200),
  
  -- Time Period
  period_start      date not null,
  period_end        date not null,
  
  -- File
  file_format       text not null check (file_format in ('pdf', 'csv', 'excel', 'json')),
  file_url          text check (file_url is null or char_length(file_url) <= 1000),
  file_size_bytes   bigint check (file_size_bytes is null or file_size_bytes > 0),
  
  -- Status
  generation_status text not null default 'generating'
                    check (generation_status in ('generating', 'completed', 'failed')),
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

create index if not exists generated_reports_customer_id_idx on public.generated_reports (customer_id);
create index if not exists generated_reports_created_at_idx on public.generated_reports (created_at desc);
create index if not exists generated_reports_report_type_idx on public.generated_reports (report_type);

alter table public.generated_reports enable row level security;

-- RLS Policy: Customers can only see their own reports
create policy "Customers can view own reports"
  on public.generated_reports for select
  using (customer_id = auth.uid());

create policy "Customers can generate reports"
  on public.generated_reports for insert
  with check (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Audit Log (optional but recommended)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  customer_id       uuid references public.customer_profiles(id) on delete set null,
  user_id           uuid references auth.users(id) on delete set null,
  
  -- Action
  action            text not null check (char_length(action) <= 100),
  entity_type       text not null check (char_length(entity_type) <= 100),
  entity_id         uuid,
  
  -- Details
  ip_address        inet,
  user_agent        text check (user_agent is null or char_length(user_agent) <= 500),
  
  -- Metadata
  metadata          jsonb default '{}'::jsonb
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_customer_id_idx on public.audit_log (customer_id);
create index if not exists audit_log_entity_idx on public.audit_log (entity_type, entity_id);

alter table public.audit_log enable row level security;

-- RLS Policy: Customers can only see their own audit logs
create policy "Customers can view own audit logs"
  on public.audit_log for select
  using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Functions: Update timestamp trigger
-- ---------------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to all tables with updated_at
create trigger update_customer_profiles_updated_at before update on public.customer_profiles
  for each row execute function update_updated_at_column();

create trigger update_crm_leads_updated_at before update on public.crm_leads
  for each row execute function update_updated_at_column();

create trigger update_ad_accounts_updated_at before update on public.ad_accounts
  for each row execute function update_updated_at_column();

create trigger update_ad_campaigns_updated_at before update on public.ad_campaigns
  for each row execute function update_updated_at_column();

create trigger update_invoices_updated_at before update on public.invoices
  for each row execute function update_updated_at_column();

create trigger update_gst_configurations_updated_at before update on public.gst_configurations
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on public.products
  for each row execute function update_updated_at_column();

create trigger update_employees_updated_at before update on public.employees
  for each row execute function update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Views: Dashboard Aggregates - REMOVED in Phase 0
-- ---------------------------------------------------------------------------
-- The previous views ran with the owner's rights, so they bypassed RLS and exposed
-- every tenant's leads, revenue and GST to any signed-in user. Nothing reads them;
-- the dashboard queries crm_leads directly under RLS. Drop them if they exist.
drop view if exists public.dashboard_today_metrics;
drop view if exists public.dashboard_monthly_revenue;
drop view if exists public.dashboard_monthly_ad_spend;

-- ---------------------------------------------------------------------------
-- Sample Data Seeding (Development Only - REMOVE FOR PRODUCTION)
-- ---------------------------------------------------------------------------

-- This section is for development/testing only
-- DO NOT run in production

-- Example: Create a test customer account
-- INSERT INTO auth.users (id, email) VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', 'test@zugee.com');
-- 
-- INSERT INTO public.customer_profiles (id, business_name, business_type, state, plan_tier) VALUES
--   ('550e8400-e29b-41d4-a716-446655440000', 'Test Business Pvt Ltd', 'Retail', 'Tamil Nadu', 'growth');

