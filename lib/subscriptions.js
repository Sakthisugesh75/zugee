// lib/subscriptions.js
// Server-only data layer for ZUGEE subscriptions and the one-time Setup & Onboarding fee.
// Never import this file from client components (it uses the Supabase service_role key).
//
// Rules (also enforced in supabase/migrations/0001_subscriptions_setup_fee.sql):
// - Prices are snapshotted from lib/pricing.js when a subscription is created. Later price changes
//   never touch existing subscriptions.
// - The setup fee is ONE-TIME: pending -> paid | waived, recorded at most once. Renewals are the
//   monthly price only.
// - Only the server (admin portal today, Razorpay webhooks in Phase 6) writes. Customers read.
//
// There is no payment gateway yet: "record" functions log payments the team collected by
// UPI / bank transfer. They never move money.
//
// Relative imports (not "@/…") so `node --test` can load this file without a bundler.

import crypto from "crypto";
import { isSupabaseConfigured, sanitizeSearch, supabaseServer } from "./supabase.js";
import { SETUP_WAIVER_REASONS, calculateCharges, getPlan } from "./pricing.js";
import { PRODUCTS, getProduct } from "./products.js";
import { PAYMENT_METHODS, SUBSCRIPTION_STATUSES } from "./subscription-options.js";

export { PAYMENT_METHODS, SUBSCRIPTION_STATUSES };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIST_LIMIT = 500;

/** Errors whose message is safe to show to the admin. `code` maps to an HTTP status in the API. */
export class SubscriptionError extends Error {
  constructor(message, code = "invalid") {
    super(message);
    this.name = "SubscriptionError";
    this.code = code; // invalid | not_found | conflict
  }
}

export function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

// ---------------------------------------------------------------------------
// Storage selection (same rule as lib/supabase.js)
// ---------------------------------------------------------------------------

function shouldUseLocalStore() {
  if (isSupabaseConfigured) return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return true;
}

// Development-only in-memory store. Starts EMPTY. Kept on globalThis so every route handler and
// page in the dev server (and hot reloads) share one copy.
function localStore() {
  if (!globalThis.__zugeeDevSubscriptions) {
    globalThis.__zugeeDevSubscriptions = { subscriptions: [], payments: [] };
  }
  return globalThis.__zugeeDevSubscriptions;
}

/** Test helper: empties the dev store. Refuses to run against a real database. */
export function resetLocalStoreForTests() {
  if (!shouldUseLocalStore()) throw new Error("Only available with the in-memory development store.");
  globalThis.__zugeeDevSubscriptions = { subscriptions: [], payments: [] };
}

function dbError(action, error) {
  return new Error(`Supabase ${action} failed: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Dates (billing dates are calendar dates in India)
// ---------------------------------------------------------------------------

function todayIST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

/** "2026-01-31" + 1 month -> "2026-02-28". Always computed from the original start date so days never drift. */
export function addMonths(isoDate, months) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const targetMonthIndex = m - 1 + months;
  const year = y + Math.floor(targetMonthIndex / 12);
  const month = ((targetMonthIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(d, lastDay))).toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Input normalisation
// ---------------------------------------------------------------------------

function optionalText(value, name, max) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new SubscriptionError(`${name} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) throw new SubscriptionError(`${name} must be at most ${max} characters.`);
  return trimmed;
}

function requiredText(value, name, min, max) {
  const text = optionalText(value, name, max);
  if (!text || text.length < min) throw new SubscriptionError(`${name} is required.`);
  return text;
}

function normalizePayment({ method, reference, recordedBy } = {}) {
  if (!Object.prototype.hasOwnProperty.call(PAYMENT_METHODS, method)) {
    throw new SubscriptionError("Choose how the payment was received.");
  }
  return {
    method,
    reference: optionalText(reference, "Payment reference", 120),
    recorded_by: optionalText(recordedBy, "Recorded by", 100) || "admin"
  };
}

/** Adds the computed charges and display names. Returns a copy. */
function decorate(row) {
  if (!row) return null;
  return {
    ...row,
    product_name: getProduct(row.product_slug)?.name || row.product_slug,
    plan_name: getPlan(row.plan_key, row.product_slug)?.name || row.plan_key,
    charges: calculateCharges({
      monthlyPrice: row.monthly_price,
      setupFee: row.setup_fee,
      setupFeeStatus: row.setup_fee_status,
      setupDiscount: row.setup_discount
    })
  };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function listSubscriptions({ status = "all", search = "" } = {}) {
  if (status !== "all" && !SUBSCRIPTION_STATUSES.includes(status)) {
    throw new SubscriptionError("Invalid status filter.");
  }
  const safeSearch = sanitizeSearch(search);

  if (shouldUseLocalStore()) {
    let rows = [...localStore().subscriptions];
    if (status !== "all") rows = rows.filter((s) => s.subscription_status === status);
    if (safeSearch) {
      const q = safeSearch.toLowerCase();
      rows = rows.filter((s) =>
        [s.business_name, s.contact_phone, s.contact_email].some((f) => f && f.toLowerCase().includes(q))
      );
    }
    rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return rows.slice(0, LIST_LIMIT).map(decorate);
  }

  let query = supabaseServer
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (status !== "all") query = query.eq("subscription_status", status);
  if (safeSearch) {
    const pattern = `%${safeSearch}%`;
    query = query.or(`business_name.ilike.${pattern},contact_phone.ilike.${pattern},contact_email.ilike.${pattern}`);
  }
  const { data, error } = await query;
  if (error) throw dbError("query", error);
  return (data || []).map(decorate);
}

async function fetchRow(id) {
  if (!isUuid(id)) throw new SubscriptionError("Subscription not found.", "not_found");

  if (shouldUseLocalStore()) {
    const row = localStore().subscriptions.find((s) => s.id === id);
    if (!row) throw new SubscriptionError("Subscription not found.", "not_found");
    return row;
  }

  const { data, error } = await supabaseServer.from("subscriptions").select("*").eq("id", id).maybeSingle();
  if (error) throw dbError("query", error);
  if (!data) throw new SubscriptionError("Subscription not found.", "not_found");
  return data;
}

async function fetchPayments(subscriptionId) {
  if (shouldUseLocalStore()) {
    return localStore()
      .payments.filter((p) => p.subscription_id === subscriptionId)
      .sort((a, b) => b.paid_at.localeCompare(a.paid_at))
      .map((p) => ({ ...p }));
  }
  const { data, error } = await supabaseServer
    .from("subscription_payments")
    .select("*")
    .eq("subscription_id", subscriptionId)
    .order("paid_at", { ascending: false });
  if (error) throw dbError("query", error);
  return data || [];
}

/** One subscription with its payment history. */
export async function getSubscription(id) {
  const row = await fetchRow(id);
  return { ...decorate(row), payments: await fetchPayments(row.id) };
}

/** A signed-in customer's own subscriptions (read-only view for /app billing). */
export async function getCustomerSubscriptions(customerId) {
  if (!isUuid(customerId)) return [];

  if (shouldUseLocalStore()) {
    return localStore()
      .subscriptions.filter((s) => s.customer_id === customerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(decorate);
  }

  const { data, error } = await supabaseServer
    .from("subscriptions")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw dbError("query", error);
  return (data || []).map(decorate);
}

// ---------------------------------------------------------------------------
// Writes (admin only — callers must check the admin session)
// ---------------------------------------------------------------------------

/**
 * Record a new subscription. Prices come from lib/pricing.js — never from the caller.
 * `waive: { reason, waivedBy }` waives the setup fee at creation.
 */
export async function createSubscription(input = {}) {
  const businessName = requiredText(input.business_name, "Business name", 2, 200);
  const contactPhone = optionalText(input.contact_phone, "Phone", 25);
  const contactEmail = optionalText(input.contact_email, "Email", 254);
  if (contactEmail && !EMAIL_PATTERN.test(contactEmail)) throw new SubscriptionError("Enter a valid email address.");
  const notes = optionalText(input.notes, "Notes", 1000);

  const productSlug = input.product_slug;
  if (typeof productSlug !== "string" || !PRODUCTS.some((p) => p.slug === productSlug)) {
    throw new SubscriptionError("Unknown product.");
  }
  const plan = typeof input.plan_key === "string" ? getPlan(input.plan_key, productSlug) : null;
  if (!plan) throw new SubscriptionError("Unknown plan.");

  const leadId = input.lead_id ?? null;
  if (leadId !== null && !isUuid(leadId)) throw new SubscriptionError("Invalid lead reference.");
  const customerId = input.customer_id ?? null;
  if (customerId !== null && !isUuid(customerId)) throw new SubscriptionError("Invalid customer account ID.");

  let waiver = null;
  if (input.waive) {
    const reason = input.waive.reason;
    if (!Object.prototype.hasOwnProperty.call(SETUP_WAIVER_REASONS, reason)) {
      throw new SubscriptionError("Choose a valid reason for waiving the setup fee.");
    }
    waiver = {
      setup_fee_status: "waived",
      setup_discount: plan.setupFee,
      setup_waiver_reason: reason,
      setup_waived_by: optionalText(input.waive.waivedBy, "Waived by", 100) || "admin",
      setup_waived_at: new Date().toISOString()
    };
  }

  const record = {
    customer_id: customerId,
    lead_id: leadId,
    business_name: businessName,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    product_slug: productSlug,
    plan_key: plan.key,
    // Price snapshot
    monthly_price: plan.monthlyPrice,
    setup_fee: plan.setupFee,
    setup_discount: 0,
    setup_fee_status: "pending",
    setup_waiver_reason: null,
    setup_waived_by: null,
    setup_waived_at: null,
    setup_paid_at: null,
    subscription_status: "pending",
    billing_cycle: "monthly",
    started_at: null,
    renewal_date: null,
    notes,
    ...waiver
  };

  const duplicate = new SubscriptionError(
    "This business already has a subscription for this product. Update that one instead.",
    "conflict"
  );

  if (shouldUseLocalStore()) {
    const store = localStore();
    const exists = store.subscriptions.some(
      (s) =>
        s.product_slug === productSlug &&
        ((customerId && s.customer_id === customerId) || (leadId && s.lead_id === leadId))
    );
    if (exists) throw duplicate;
    const now = new Date().toISOString();
    const row = { id: crypto.randomUUID(), created_at: now, updated_at: now, ...record };
    store.subscriptions.push(row);
    return decorate(row);
  }

  const { data, error } = await supabaseServer.from("subscriptions").insert([record]).select().single();
  if (error) {
    if (error.code === "23505") throw duplicate; // unique (customer|lead, product)
    if (error.code === "23503") throw new SubscriptionError("The linked lead or customer account does not exist.");
    throw dbError("insert", error);
  }
  return decorate(data);
}

function assertSetupPending(row) {
  if (row.setup_fee_status !== "pending") {
    const state = { paid: "already been paid", waived: "already been waived", refunded: "been refunded" }[
      row.setup_fee_status
    ];
    throw new SubscriptionError(`The setup fee has ${state}. It is charged only once.`, "conflict");
  }
}

/** Record the one-time setup fee as collected (manual: UPI / bank transfer). */
export async function recordSetupPayment(id, payment = {}) {
  const details = normalizePayment(payment);
  const row = await fetchRow(id);
  assertSetupPending(row);

  const paidAt = new Date().toISOString();
  const paymentRow = {
    subscription_id: row.id,
    kind: "setup",
    amount: row.setup_fee - row.setup_discount,
    period_start: null,
    period_end: null,
    ...details,
    paid_at: paidAt
  };

  if (shouldUseLocalStore()) {
    const store = localStore();
    if (store.payments.some((p) => p.subscription_id === row.id && p.kind === "setup")) {
      throw new SubscriptionError("The setup fee has already been paid. It is charged only once.", "conflict");
    }
    store.payments.push({ id: crypto.randomUUID(), ...paymentRow });
    Object.assign(row, { setup_fee_status: "paid", setup_paid_at: paidAt, updated_at: paidAt });
    return getSubscription(row.id);
  }

  // 1. The unique index on (subscription_id) where kind = 'setup' allows only one setup payment.
  const { data: inserted, error: insertError } = await supabaseServer
    .from("subscription_payments")
    .insert([paymentRow])
    .select("id")
    .single();
  if (insertError) {
    if (insertError.code === "23505") {
      throw new SubscriptionError("The setup fee has already been paid. It is charged only once.", "conflict");
    }
    throw dbError("insert", insertError);
  }

  // 2. Flip the status only if it is still pending (guards against a concurrent waiver).
  const { data: updated, error: updateError } = await supabaseServer
    .from("subscriptions")
    .update({ setup_fee_status: "paid", setup_paid_at: paidAt })
    .eq("id", row.id)
    .eq("setup_fee_status", "pending")
    .select("id")
    .maybeSingle();
  if (updateError || !updated) {
    await supabaseServer.from("subscription_payments").delete().eq("id", inserted.id);
    if (updateError) throw dbError("update", updateError);
    throw new SubscriptionError("The setup fee is no longer pending.", "conflict");
  }
  return getSubscription(row.id);
}

/** Waive the one-time setup fee (authorised admin only). */
export async function waiveSetupFee(id, { reason, waivedBy } = {}) {
  if (!Object.prototype.hasOwnProperty.call(SETUP_WAIVER_REASONS, reason)) {
    throw new SubscriptionError("Choose a valid reason for waiving the setup fee.");
  }
  const by = optionalText(waivedBy, "Waived by", 100) || "admin";
  const row = await fetchRow(id);
  assertSetupPending(row);

  const now = new Date().toISOString();
  const changes = {
    setup_fee_status: "waived",
    setup_discount: row.setup_fee,
    setup_waiver_reason: reason,
    setup_waived_by: by,
    setup_waived_at: now
  };

  if (shouldUseLocalStore()) {
    Object.assign(row, changes, { updated_at: now });
    return getSubscription(row.id);
  }

  const { data, error } = await supabaseServer
    .from("subscriptions")
    .update(changes)
    .eq("id", row.id)
    .eq("setup_fee_status", "pending")
    .select("id")
    .maybeSingle();
  if (error) throw dbError("update", error);
  if (!data) throw new SubscriptionError("The setup fee is no longer pending.", "conflict");
  return getSubscription(row.id);
}

/**
 * Record one month's subscription payment (manual: UPI / bank transfer). Always the snapshotted
 * monthly price — never the setup fee. The first payment starts the subscription today; each
 * payment covers the next unpaid month and moves renewal_date one month on.
 */
export async function recordMonthlyPayment(id, payment = {}) {
  const details = normalizePayment(payment);
  const row = await fetchRow(id);

  if (row.subscription_status === "cancelled") {
    throw new SubscriptionError("This subscription is cancelled. Reactivate it before recording a payment.", "conflict");
  }
  if (row.setup_fee_status === "pending") {
    throw new SubscriptionError(
      "The first payment includes the one-time setup fee. Record the setup payment or waive it first.",
      "conflict"
    );
  }

  const existing = await fetchPayments(row.id);
  const paidMonths = existing.filter((p) => p.kind === "subscription").length;
  const startedAt = row.started_at || todayIST();
  const periodStart = addMonths(startedAt, paidMonths);
  const nextRenewal = addMonths(startedAt, paidMonths + 1);
  const paidAt = new Date().toISOString();

  const paymentRow = {
    subscription_id: row.id,
    kind: "subscription",
    amount: row.monthly_price,
    period_start: periodStart,
    period_end: addDays(nextRenewal, -1),
    ...details,
    paid_at: paidAt
  };
  const changes = { started_at: startedAt, renewal_date: nextRenewal, subscription_status: "active" };

  if (shouldUseLocalStore()) {
    const store = localStore();
    if (store.payments.some((p) => p.subscription_id === row.id && p.kind === "subscription" && p.period_start === periodStart)) {
      throw new SubscriptionError("This month has already been recorded.", "conflict");
    }
    store.payments.push({ id: crypto.randomUUID(), ...paymentRow });
    Object.assign(row, changes, { updated_at: paidAt });
    return getSubscription(row.id);
  }

  // Unique (subscription_id, period_start) stops the same month being recorded twice.
  const { error: insertError } = await supabaseServer.from("subscription_payments").insert([paymentRow]);
  if (insertError) {
    if (insertError.code === "23505") throw new SubscriptionError("This month has already been recorded.", "conflict");
    throw dbError("insert", insertError);
  }
  // renewal_date is derived from the payment count, so a failure here self-corrects on the next payment.
  const { error: updateError } = await supabaseServer.from("subscriptions").update(changes).eq("id", row.id);
  if (updateError) throw dbError("update", updateError);
  return getSubscription(row.id);
}

/** Change the recurring subscription status (admin only). Never touches prices or the setup fee. */
export async function setSubscriptionStatus(id, status) {
  if (!SUBSCRIPTION_STATUSES.includes(status)) throw new SubscriptionError("Invalid subscription status.");
  const row = await fetchRow(id);

  if (shouldUseLocalStore()) {
    Object.assign(row, { subscription_status: status, updated_at: new Date().toISOString() });
    return getSubscription(row.id);
  }

  const { error } = await supabaseServer.from("subscriptions").update({ subscription_status: status }).eq("id", row.id);
  if (error) throw dbError("update", error);
  return getSubscription(row.id);
}
