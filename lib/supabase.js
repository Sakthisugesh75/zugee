// lib/supabase.js
// Server-side data access using the Supabase service_role key.
// Never import this file from client components.

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

export const supabaseServer = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export const LEAD_STATUSES = ["new", "contacted", "qualified", "archived"];
export const MAX_PAGE_SIZE = 100;

/**
 * The in-memory store exists only so local development works before Supabase keys are configured.
 * In production a missing configuration is an error: silently keeping leads in memory would lose them.
 */
function shouldUseLocalStore() {
  if (isSupabaseConfigured) return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return true;
}

// Development-only sample data (never served in production).
const localLeadsStore = [
  {
    id: "d3b07384-d113-4a16-a192-349089ef01a1",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: "Sample Lead (Fleet)",
    phone: "+91 90000 00001",
    email: "sample.fleet@example.com",
    company_name: "Sample Transport Co.",
    industry: "transposs",
    message: "Development sample record.",
    source_page: "homepage-contact",
    status: "new",
    reference_id: "ZUG-DEV001"
  },
  {
    id: "f82a9912-4011-4200-8451-281093bc22e4",
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    name: "Sample Lead (Travel)",
    phone: "+91 90000 00002",
    email: null,
    company_name: null,
    industry: "tours-travels",
    message: "Development sample record.",
    source_page: "homepage-contact",
    status: "contacted",
    reference_id: "ZUG-DEV002"
  },
  {
    id: "e104bc78-9a3b-4682-8210-918234857643",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    name: "Sample Lead (Legacy vertical)",
    phone: "+91 90000 00003",
    email: "sample.legacy@example.com",
    company_name: null,
    industry: "logistics",
    message: "Development sample record from before the product catalog.",
    source_page: "homepage-contact",
    status: "qualified",
    reference_id: "ZUG-DEV003"
  }
];

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

export function generateReferenceId() {
  const bytes = crypto.randomBytes(6);
  let suffix = "";
  for (const byte of bytes) suffix += REF_ALPHABET[byte % REF_ALPHABET.length];
  return `ZUG-${suffix}`;
}

/**
 * Insert a lead. Generates the reference ID here so a (very unlikely) unique-constraint
 * collision can be retried transparently.
 */
export async function insertLead(leadData) {
  if (shouldUseLocalStore()) {
    const simulatedLead = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: "new",
      reference_id: generateReferenceId(),
      ...leadData
    };
    localLeadsStore.unshift(simulatedLead);
    return simulatedLead;
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabaseServer
      .from("leads")
      .insert([{ ...leadData, status: "new", reference_id: generateReferenceId() }])
      .select()
      .single();

    if (!error) return data;
    // 23505 = unique_violation (reference_id collision) -> retry with a new ID
    if (error.code !== "23505") {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }
  }
  throw new Error("Supabase insert failed: could not allocate a unique reference ID.");
}

/**
 * Strip characters that carry meaning in PostgREST filter syntax (`,` `(` `)` `"` `\`)
 * and LIKE wildcards (`%` `*`), so user input can only ever be a literal substring.
 */
export function sanitizeSearch(search) {
  if (typeof search !== "string") return "";
  return search.replace(/[,()"\\%*]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

export async function getLeadsList({ page = 1, limit = 25, status = "all", industry = "all", search = "" } = {}) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), MAX_PAGE_SIZE) : 25;
  const safeSearch = sanitizeSearch(search);

  if (shouldUseLocalStore()) {
    let filtered = [...localLeadsStore];

    if (status && status !== "all") {
      filtered = filtered.filter((l) => l.status === status);
    }
    if (industry && industry !== "all") {
      filtered = filtered.filter((l) => l.industry === industry);
    }
    if (safeSearch) {
      const q = safeSearch.toLowerCase();
      filtered = filtered.filter((l) =>
        [l.name, l.email, l.phone, l.company_name, l.reference_id].some((field) => field && field.toLowerCase().includes(q))
      );
    }

    const start = (safePage - 1) * safeLimit;
    return {
      leads: filtered.slice(start, start + safeLimit),
      total: filtered.length,
      page: safePage,
      limit: safeLimit
    };
  }

  let query = supabaseServer
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (industry && industry !== "all") {
    query = query.eq("industry", industry);
  }
  if (safeSearch) {
    const pattern = `%${safeSearch}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},company_name.ilike.${pattern},reference_id.ilike.${pattern}`
    );
  }

  const from = (safePage - 1) * safeLimit;
  const { data, count, error } = await query.range(from, from + safeLimit - 1);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return { leads: data || [], total: count || 0, page: safePage, limit: safeLimit };
}

export async function updateLeadStatus(id, newStatus) {
  if (!LEAD_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  if (shouldUseLocalStore()) {
    const lead = localLeadsStore.find((l) => l.id === id);
    if (!lead) return null;
    lead.status = newStatus;
    return lead;
  }

  const { data, error } = await supabaseServer
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
  return data;
}

/**
 * Per-status counts. Uses exact HEAD counts so totals stay correct beyond
 * PostgREST's default 1,000-row response limit.
 */
export async function getLeadsStats() {
  if (shouldUseLocalStore()) {
    const stats = { total: localLeadsStore.length, new: 0, contacted: 0, qualified: 0, archived: 0 };
    localLeadsStore.forEach((item) => {
      if (stats[item.status] !== undefined) stats[item.status]++;
    });
    return stats;
  }

  const countFor = async (status) => {
    let query = supabaseServer.from("leads").select("id", { count: "exact", head: true });
    if (status) query = query.eq("status", status);
    const { count, error } = await query;
    if (error) throw new Error(`Supabase count failed: ${error.message}`);
    return count || 0;
  };

  const [total, ...byStatus] = await Promise.all([null, ...LEAD_STATUSES].map(countFor));
  const stats = { total };
  LEAD_STATUSES.forEach((status, idx) => {
    stats[status] = byStatus[idx];
  });
  return stats;
}
