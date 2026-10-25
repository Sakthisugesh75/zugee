-- supabase/migrations/0004_chat_guest_usage.sql
-- Daily usage counters for GUEST visitors of the "Ask ZUGEE" website chat (lib/chatbot/guest-limits.js).
--
-- WHY
--   Guests get 10 chat messages a day (reset at midnight Asia/Kolkata), with a 3-second cooldown and
--   at most 5 messages in 30 seconds; each IP also has a 30-a-day backstop. The limits must hold
--   across Vercel's serverless instances, so the counters live here, not in memory.
--
-- WHAT IS STORED
--   One row per key: "g:<random guest id>" (from a signed cookie) or "ip:<keyed hash of the IP>".
--   No names, messages or raw IP addresses. `recent` holds the times (ms since epoch) of the last few
--   messages, for the cooldown and burst checks. Rows older than two days are deleted by the app.
--
-- CONCURRENCY
--   The app updates a row only when `version` still has the value it read (compare-and-swap), so two
--   simultaneous messages can never both take the last one of the day.
--
-- HOW TO RUN
--   Paste into the Supabase SQL editor and run, BEFORE deploying the chat guest limits. Without the
--   table, guests get "chat not available" (the route fails closed); signed-in users are unaffected.
--   Safe to re-run.

begin;

create table if not exists public.chat_guest_usage (
  key text primary key check (char_length(key) between 3 and 100),
  day date not null,
  count integer not null default 0 check (count >= 0),
  recent bigint[] not null default '{}',
  version integer not null default 0 check (version >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists chat_guest_usage_day_idx on public.chat_guest_usage (day);

-- Same access rule as every other table: RLS on with no policies, so only the server's
-- service_role key can read or write it.
alter table public.chat_guest_usage enable row level security;
revoke all on public.chat_guest_usage from anon, authenticated;
grant select, insert, update, delete on public.chat_guest_usage to service_role;

-- Make the API see the new table straight away.
notify pgrst, 'reload schema';

commit;
