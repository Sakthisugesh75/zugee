-- supabase/verify.sql
-- Confirms that supabase/fresh-install.sql landed completely: every table, column, index,
-- constraint, trigger and function, plus the security settings.
--
-- HOW TO RUN
--   Paste into the Supabase SQL editor and run. Read-only: it changes nothing.
--
-- HOW TO READ THE RESULT
--   The first row is the summary. It must say "0 problems".
--   Every other row is one object, with status:
--     OK          it exists and matches
--     MISSING     the install did not create it
--     DIFFERENT   it exists but is not what the install creates (compare expected with actual)
--     UNEXPECTED  it is on one of the three tables but the install does not create it
--   Problems are listed first. For indexes, constraints and triggers the "actual" column shows the
--   definition in the database.
--
-- Expected checks (120): 3 tables, 45 columns, 16 indexes, 37 constraints, 2 triggers,
-- 2 functions, row level security on each of the 3 tables, and 12 grants: service_role can
-- select, insert, update and delete on each table.
-- Plus: no policies, and no privileges for the anon / authenticated roles.
--
-- This checks that the schema is right. It does not prove the app works: after it passes, submit
-- one lead on the live form and open /admin/dashboard and /admin/subscriptions.
--
-- Columns are compared on type, nullability and default. If a column shows DIFFERENT but the
-- expected and actual text mean the same thing, that is the Postgres version formatting it
-- differently, not a fault.
--
-- Keep this file in step with fresh-install.sql and with every later migration.

with expected (kind, name, expected) as (
  values
    ('table', 'leads', ''),
    ('table', 'subscriptions', ''),
    ('table', 'subscription_payments', ''),
    ('column', 'leads.id', 'uuid | not null | default gen_random_uuid()'),
    ('column', 'leads.created_at', 'timestamp with time zone | not null | default now()'),
    ('column', 'leads.reference_id', 'text | not null'),
    ('column', 'leads.name', 'text | not null'),
    ('column', 'leads.phone', 'text | not null'),
    ('column', 'leads.email', 'text | nullable'),
    ('column', 'leads.company_name', 'text | nullable'),
    ('column', 'leads.industry', 'text | not null'),
    ('column', 'leads.request_type', 'text | not null | default ''demo''::text'),
    ('column', 'leads.goal', 'text | nullable'),
    ('column', 'leads.message', 'text | nullable'),
    ('column', 'leads.source_page', 'text | not null | default ''homepage-contact''::text'),
    ('column', 'leads.status', 'text | not null | default ''new''::text'),
    ('column', 'subscription_payments.id', 'uuid | not null | default gen_random_uuid()'),
    ('column', 'subscription_payments.subscription_id', 'uuid | not null'),
    ('column', 'subscription_payments.kind', 'text | not null'),
    ('column', 'subscription_payments.amount', 'integer | not null'),
    ('column', 'subscription_payments.period_start', 'date | nullable'),
    ('column', 'subscription_payments.period_end', 'date | nullable'),
    ('column', 'subscription_payments.method', 'text | nullable'),
    ('column', 'subscription_payments.reference', 'text | nullable'),
    ('column', 'subscription_payments.recorded_by', 'text | nullable'),
    ('column', 'subscription_payments.paid_at', 'timestamp with time zone | not null | default now()'),
    ('column', 'subscriptions.id', 'uuid | not null | default gen_random_uuid()'),
    ('column', 'subscriptions.created_at', 'timestamp with time zone | not null | default now()'),
    ('column', 'subscriptions.updated_at', 'timestamp with time zone | not null | default now()'),
    ('column', 'subscriptions.lead_id', 'uuid | nullable'),
    ('column', 'subscriptions.business_name', 'text | not null'),
    ('column', 'subscriptions.contact_phone', 'text | nullable'),
    ('column', 'subscriptions.contact_email', 'text | nullable'),
    ('column', 'subscriptions.product_slug', 'text | not null'),
    ('column', 'subscriptions.plan_key', 'text | not null'),
    ('column', 'subscriptions.monthly_price', 'integer | not null'),
    ('column', 'subscriptions.setup_fee', 'integer | not null'),
    ('column', 'subscriptions.setup_discount', 'integer | not null | default 0'),
    ('column', 'subscriptions.setup_fee_status', 'text | not null | default ''pending''::text'),
    ('column', 'subscriptions.setup_waiver_reason', 'text | nullable'),
    ('column', 'subscriptions.setup_waived_by', 'text | nullable'),
    ('column', 'subscriptions.setup_waived_at', 'timestamp with time zone | nullable'),
    ('column', 'subscriptions.setup_paid_at', 'timestamp with time zone | nullable'),
    ('column', 'subscriptions.subscription_status', 'text | not null | default ''pending''::text'),
    ('column', 'subscriptions.billing_cycle', 'text | not null | default ''monthly''::text'),
    ('column', 'subscriptions.started_at', 'date | nullable'),
    ('column', 'subscriptions.renewal_date', 'date | nullable'),
    ('column', 'subscriptions.notes', 'text | nullable'),
    ('index', 'leads_created_at_idx', ''),
    ('index', 'leads_industry_idx', ''),
    ('index', 'leads_pkey', ''),
    ('index', 'leads_reference_id_key', ''),
    ('index', 'leads_request_type_idx', ''),
    ('index', 'leads_status_idx', ''),
    ('index', 'subscription_payments_one_setup_key', ''),
    ('index', 'subscription_payments_period_key', ''),
    ('index', 'subscription_payments_pkey', ''),
    ('index', 'subscription_payments_subscription_idx', ''),
    ('index', 'subscriptions_created_at_idx', ''),
    ('index', 'subscriptions_lead_product_key', ''),
    ('index', 'subscriptions_pkey', ''),
    ('index', 'subscriptions_renewal_date_idx', ''),
    ('index', 'subscriptions_setup_status_idx', ''),
    ('index', 'subscriptions_status_idx', ''),
    ('constraint', 'leads.leads_company_name_check', 'check'),
    ('constraint', 'leads.leads_email_check', 'check'),
    ('constraint', 'leads.leads_goal_check', 'check'),
    ('constraint', 'leads.leads_industry_check', 'check'),
    ('constraint', 'leads.leads_message_check', 'check'),
    ('constraint', 'leads.leads_name_check', 'check'),
    ('constraint', 'leads.leads_phone_check', 'check'),
    ('constraint', 'leads.leads_pkey', 'primary key'),
    ('constraint', 'leads.leads_reference_id_key', 'unique'),
    ('constraint', 'leads.leads_request_type_check', 'check'),
    ('constraint', 'leads.leads_source_page_check', 'check'),
    ('constraint', 'leads.leads_status_check', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_amount_check', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_kind_check', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_method_check', 'check'),
    -- Named _period_rule by migrations/0003_prepaid_months.sql. If this is MISSING and
    -- subscription_payments_period_shape is UNEXPECTED, that migration has not been run.
    ('constraint', 'subscription_payments.subscription_payments_period_rule', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_pkey', 'primary key'),
    ('constraint', 'subscription_payments.subscription_payments_recorded_by_check', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_reference_check', 'check'),
    ('constraint', 'subscription_payments.subscription_payments_subscription_id_fkey', 'foreign key'),
    ('constraint', 'subscriptions.subscriptions_billing_cycle_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_business_name_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_contact_email_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_contact_phone_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_lead_id_fkey', 'foreign key'),
    ('constraint', 'subscriptions.subscriptions_monthly_price_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_notes_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_pkey', 'primary key'),
    ('constraint', 'subscriptions.subscriptions_plan_key_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_product_slug_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_setup_discount_range', 'check'),
    ('constraint', 'subscriptions.subscriptions_setup_fee_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_setup_fee_status_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_setup_waived_by_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_setup_waiver_reason_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_subscription_status_check', 'check'),
    ('constraint', 'subscriptions.subscriptions_waiver_consistent', 'check'),
    ('trigger', 'subscriptions.subscriptions_guard_update', ''),
    ('trigger', 'subscriptions.update_subscriptions_updated_at', ''),
    ('function', 'subscriptions_guard_update', ''),
    ('function', 'update_updated_at_column', ''),
    ('rls', 'leads', 'enabled'),
    ('rls', 'subscriptions', 'enabled'),
    ('rls', 'subscription_payments', 'enabled'),
    -- What the server (service_role key) must be able to do. Without these every API call fails.
    ('grant', 'leads: service_role SELECT', 'granted'),
    ('grant', 'leads: service_role INSERT', 'granted'),
    ('grant', 'leads: service_role UPDATE', 'granted'),
    ('grant', 'leads: service_role DELETE', 'granted'),
    ('grant', 'subscriptions: service_role SELECT', 'granted'),
    ('grant', 'subscriptions: service_role INSERT', 'granted'),
    ('grant', 'subscriptions: service_role UPDATE', 'granted'),
    ('grant', 'subscriptions: service_role DELETE', 'granted'),
    ('grant', 'subscription_payments: service_role SELECT', 'granted'),
    ('grant', 'subscription_payments: service_role INSERT', 'granted'),
    ('grant', 'subscription_payments: service_role UPDATE', 'granted'),
    ('grant', 'subscription_payments: service_role DELETE', 'granted')
),
actual (kind, name, actual, compare) as (
  select 'table', c.relname::text, '', ''
    from pg_class c
   where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
     and c.relname in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'column', table_name || '.' || column_name, '',
         data_type || ' | ' || case when is_nullable = 'NO' then 'not null' else 'nullable' end
           || coalesce(' | default ' || column_default, '')
    from information_schema.columns
   where table_schema = 'public' and table_name in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'index', indexname::text, indexdef, ''
    from pg_indexes
   where schemaname = 'public' and tablename in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'constraint', c.conrelid::regclass::text || '.' || c.conname, pg_get_constraintdef(c.oid),
         case c.contype when 'p' then 'primary key' when 'u' then 'unique' when 'f' then 'foreign key' when 'c' then 'check' else c.contype::text end
    from pg_constraint c
   where c.connamespace = 'public'::regnamespace
     and c.contype in ('p', 'u', 'f', 'c')
     and c.conrelid::regclass::text in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'trigger', t.tgrelid::regclass::text || '.' || t.tgname, pg_get_triggerdef(t.oid),
         case when t.tgenabled = 'D' then 'DISABLED' else '' end
    from pg_trigger t
   where not t.tgisinternal and t.tgrelid::regclass::text in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'function', p.proname::text, '', ''
    from pg_proc p
   where p.pronamespace = 'public'::regnamespace
     and p.proname in ('update_updated_at_column', 'subscriptions_guard_update')
  union all
  select 'rls', c.relname::text, '', case when c.relrowsecurity then 'enabled' else 'DISABLED' end
    from pg_class c
   where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
     and c.relname in ('leads', 'subscriptions', 'subscription_payments')
  union all
  -- has_table_privilege answers "can this role actually do it", whether the privilege was granted
  -- directly, through PUBLIC or through a role it belongs to.
  select 'grant', c.relname::text || ': service_role ' || p.privilege, '',
         case when has_table_privilege('service_role', c.oid, p.privilege) then 'granted' else 'NOT GRANTED' end
    from pg_class c
   cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE')) as p (privilege)
   where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
     and c.relname in ('leads', 'subscriptions', 'subscription_payments')
),
objects as (
  select coalesce(e.kind, a.kind) as kind,
         coalesce(e.name, a.name) as name,
         case
           when a.name is null then 'MISSING'
           when e.name is null then 'UNEXPECTED'
           when a.compare <> '' and a.compare <> e.expected then 'DIFFERENT'
           else 'OK'
         end as status,
         coalesce(e.expected, '') as expected,
         case when coalesce(a.compare, '') <> '' then a.compare else coalesce(a.actual, '') end as actual
    from expected e
    full join actual a on a.kind = e.kind and a.name = e.name
),
security as (
  select 'policy' as kind, tablename || '.' || policyname as name, 'UNEXPECTED' as status,
         'no policies' as expected, 'a policy exists' as actual
    from pg_policies
   where schemaname = 'public' and tablename in ('leads', 'subscriptions', 'subscription_payments')
  union all
  select 'privilege', table_name || ' -> ' || grantee, 'UNEXPECTED',
         'no privileges', string_agg(privilege_type, ', ' order by privilege_type)
    from information_schema.role_table_grants
   where table_schema = 'public' and table_name in ('leads', 'subscriptions', 'subscription_payments')
     and grantee in ('anon', 'authenticated')
   group by table_name, grantee
),
checks as (
  select * from objects
  union all
  select * from security
)
select 0 as "#", 'SUMMARY' as kind,
       count(*) filter (where status <> 'OK') || ' problems' as name,
       case when count(*) filter (where status <> 'OK') = 0 then 'OK' else 'FAILED' end as status,
       '120 checks expected' as expected,
       count(*) filter (where status = 'OK') || ' OK' as actual
  from checks
union all
select (row_number() over (order by (status = 'OK'), kind, name))::int, kind, name, status, expected, actual
  from checks
order by 1;
