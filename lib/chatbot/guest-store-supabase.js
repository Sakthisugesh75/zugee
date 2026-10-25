// lib/chatbot/guest-store-supabase.js
// Server-only: the chat guest-limit store on Supabase (table chat_guest_usage, created by
// supabase/migrations/0004_chat_guest_usage.sql). Implements the three atomic operations that
// lib/chatbot/guest-limits.js needs; the compare-and-swap is the `.eq("version", …)` on update.
//
// Rows hold no personal data: the key is a random guest id or a keyed hash of an IP. Rows older
// than PURGE_AFTER_DAYS are deleted now and then, so nothing is kept longer than that.

import { isSupabaseConfigured, supabaseServer } from "../supabase.js";
import { createMemoryBackend, istDay } from "./guest-limits.js";

const TABLE = "chat_guest_usage";
const PURGE_AFTER_DAYS = 2;
const PURGE_CHANCE = 0.02;

function fail(operation, error) {
  // The table is missing until the migration has been run: say so instead of a bare SQL error.
  const hint = /relation .* does not exist|could not find the table/i.test(error?.message ?? "")
    ? " (run supabase/migrations/0004_chat_guest_usage.sql)"
    : "";
  throw new Error(`chat_guest_usage ${operation} failed: ${error?.message ?? error}${hint}`);
}

const toRow = (state) => ({ day: state.day, count: state.count, recent: state.recent });

export function createSupabaseBackend(client = supabaseServer) {
  return {
    async get(key) {
      const { data, error } = await client.from(TABLE).select("day, count, recent, version").eq("key", key).maybeSingle();
      if (error) fail("read", error);
      if (!data) return null;
      return { state: { day: data.day, count: data.count, recent: (data.recent ?? []).map(Number) }, version: data.version };
    },
    async insert(key, state) {
      // ignoreDuplicates: a row that appeared meanwhile is left alone, and nothing comes back.
      const { data, error } = await client
        .from(TABLE)
        .upsert({ key, ...toRow(state), version: 1 }, { onConflict: "key", ignoreDuplicates: true })
        .select("key");
      if (error) fail("insert", error);
      return Array.isArray(data) && data.length === 1;
    },
    async update(key, state, expectedVersion) {
      const { data, error } = await client
        .from(TABLE)
        .update({ ...toRow(state), version: expectedVersion + 1, updated_at: new Date().toISOString() })
        .eq("key", key)
        .eq("version", expectedVersion)
        .select("key");
      if (error) fail("update", error);
      return Array.isArray(data) && data.length === 1;
    }
  };
}

/** Deletes rows from before yesterday (Kolkata), now and then. Never throws. */
export async function maybePurgeOldRows(client = supabaseServer, now = Date.now()) {
  if (!client || Math.random() > PURGE_CHANCE) return;
  const cutoff = istDay(now - PURGE_AFTER_DAYS * 24 * 60 * 60 * 1000);
  const { error } = await client.from(TABLE).delete().lt("day", cutoff);
  if (error) console.error("[chat] purge of old guest rows failed:", error.message);
}

let memoryFallback;
/**
 * The backend the chat route uses: Supabase when configured. Local development without Supabase
 * uses memory (one process). Production without Supabase fails closed, as the lead form does.
 */
export function guestUsageBackend() {
  if (isSupabaseConfigured) return createSupabaseBackend();
  if (process.env.NODE_ENV === "production" && !process.env.CHAT_GUEST_ALLOW_MEMORY_STORE) {
    throw new Error("Supabase is not configured: guest chat limits need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  memoryFallback ??= createMemoryBackend();
  return memoryFallback;
}
