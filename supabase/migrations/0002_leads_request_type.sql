-- supabase/migrations/0002_leads_request_type.sql
-- Adds leads.request_type: what the visitor asked for on the demo form.
--   'demo'          a product demo (the default; every existing lead becomes this)
--   'pricing_call'  a call to get a price quote
--
-- HOW TO RUN
--   Run in the Supabase SQL editor (or with `supabase db push`) BEFORE deploying the code that
--   writes this column. Until it has been run, the demo form cannot save leads.
--   Safe to re-run.

alter table public.leads
  add column if not exists request_type text not null default 'demo';

alter table public.leads drop constraint if exists leads_request_type_check;
alter table public.leads
  add constraint leads_request_type_check check (request_type in ('demo', 'pricing_call'));

create index if not exists leads_request_type_idx on public.leads (request_type);

-- Make the API see the new column straight away.
notify pgrst, 'reload schema';
