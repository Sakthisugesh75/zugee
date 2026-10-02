-- supabase/migrations/0003_prepaid_months.sql
-- Lets a monthly payment be recorded BEFORE go-live, without dates.
--
-- WHY
--   The subscription period starts on the day the customer starts using the product (go-live,
--   subscriptions.started_at), not on the day money arrives. The first month is normally paid
--   together with the setup fee, about two weeks earlier. That payment is a "prepaid month": its
--   dates are not known until go-live, when the server fills them in (lib/subscriptions.js,
--   markGoLive).
--
--   Until now every monthly payment had to carry dates. This replaces that rule:
--     old  subscription_payments_period_shape   monthly payment => dates required
--     new  subscription_payments_period_rule    monthly payment => dates, or none yet (prepaid)
--   The constraint is renamed so that supabase/verify.sql can tell whether this file has been run.
--
-- HOW TO RUN
--   Paste into the Supabase SQL editor and run, BEFORE deploying the code that records a payment
--   before go-live. Without it, that one action is refused with a message naming this file;
--   everything else keeps working. Existing rows all satisfy the new rule. Safe to re-run.

begin;

alter table public.subscription_payments drop constraint if exists subscription_payments_period_shape;
alter table public.subscription_payments drop constraint if exists subscription_payments_period_rule;

alter table public.subscription_payments
  add constraint subscription_payments_period_rule
    check (
      -- Setup payments never have a period. A monthly payment has none while it is prepaid.
      (period_start is null and period_end is null)
      -- Only monthly payments have a period, and it must be complete.
      or (kind = 'subscription' and period_start is not null and period_end is not null
          and period_end >= period_start)
    );

-- Make the API see the change straight away.
notify pgrst, 'reload schema';

commit;
