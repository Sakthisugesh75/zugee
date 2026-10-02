// tests/subscriptions.test.mjs
// lib/subscriptions.js in dev-fallback mode (in-memory store, no Supabase). Run with `npm test`.

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

process.env.NODE_ENV = "test";
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

const { SETUP_FEE_STATUSES, SETUP_WAIVER_REASONS, getPlan } = await import("../lib/pricing.js");
const subs = await import("../lib/subscriptions.js");

const PRODUCT = "transposs";

beforeEach(() => subs.resetLocalStoreForTests());

function newSub(overrides = {}) {
  return subs.createSubscription({
    business_name: "Test Fleet Pvt Ltd",
    contact_phone: "+91 90000 00000",
    product_slug: PRODUCT,
    plan_key: "starter",
    ...overrides
  });
}

const PAYMENT = { method: "upi", reference: "UTR123", recordedBy: "admin" };

test("create: setup pending, first payment = monthly + setup, prices snapshotted", async () => {
  const plan = getPlan("growth", PRODUCT);
  const sub = await newSub({ plan_key: "growth" });

  assert.equal(sub.setup_fee_status, "pending");
  assert.equal(sub.subscription_status, "pending");
  assert.equal(sub.monthly_price, plan.monthlyPrice);
  assert.equal(sub.setup_fee, plan.setupFee);
  assert.equal(sub.setup_discount, 0);
  assert.equal(sub.charges.setupPayable, plan.setupFee);
  assert.equal(sub.charges.firstPayment, plan.monthlyPrice + plan.setupFee);
  assert.equal(sub.charges.recurringPayment, plan.monthlyPrice);

  const stored = await subs.getSubscription(sub.id);
  assert.equal(stored.monthly_price, plan.monthlyPrice);
  assert.equal(stored.setup_fee, plan.setupFee);
});

test("recordSetupPayment twice: second attempt throws, only one setup payment exists", async () => {
  const sub = await newSub();
  const paid = await subs.recordSetupPayment(sub.id, PAYMENT);
  assert.equal(paid.setup_fee_status, "paid");
  assert.ok(paid.setup_paid_at);
  assert.equal(paid.charges.setupPayable, 0);
  assert.equal(paid.charges.firstPayment, paid.monthly_price);

  await assert.rejects(() => subs.recordSetupPayment(sub.id, PAYMENT), { name: "SubscriptionError", code: "conflict" });

  const after = await subs.getSubscription(sub.id);
  const setupPayments = after.payments.filter((p) => p.kind === "setup");
  assert.equal(setupPayments.length, 1);
  assert.equal(setupPayments[0].amount, sub.setup_fee);
});

test("waive after paid throws", async () => {
  const sub = await newSub();
  await subs.recordSetupPayment(sub.id, PAYMENT);
  await assert.rejects(() => subs.waiveSetupFee(sub.id, { reason: "early_customer", waivedBy: "admin" }), {
    code: "conflict"
  });
  assert.equal((await subs.getSubscription(sub.id)).setup_fee_status, "paid");
});

test("waive: setup payable 0, first payment = monthly; paying after waiver throws", async () => {
  const sub = await newSub();
  const waived = await subs.waiveSetupFee(sub.id, { reason: "promotional_offer", waivedBy: "admin" });
  assert.equal(waived.setup_fee_status, "waived");
  assert.equal(waived.setup_waiver_reason, "promotional_offer");
  assert.equal(waived.setup_waived_by, "admin");
  assert.ok(waived.setup_waived_at);
  assert.equal(waived.setup_discount, waived.setup_fee);
  assert.equal(waived.charges.setupPayable, 0);
  assert.equal(waived.charges.firstPayment, waived.monthly_price);

  await assert.rejects(() => subs.recordSetupPayment(sub.id, PAYMENT), { code: "conflict" });
  await assert.rejects(() => subs.waiveSetupFee(sub.id, { reason: "early_customer" }), { code: "conflict" });
});

test("waive rejects unknown reasons", async () => {
  const sub = await newSub();
  await assert.rejects(() => subs.waiveSetupFee(sub.id, { reason: "because" }), { code: "invalid" });
});

const GO_LIVE = "2026-09-16";
const monthlyPayments = (sub) =>
  sub.payments.filter((p) => p.kind === "subscription").sort((a, b) => String(a.period_start).localeCompare(String(b.period_start)));

test("a month paid before go-live is prepaid: it starts nothing and has no dates", async () => {
  const sub = await newSub();
  await subs.recordSetupPayment(sub.id, PAYMENT);

  const prepaid = await subs.recordMonthlyPayment(sub.id, PAYMENT);
  assert.equal(prepaid.started_at, null, "paying must not start the subscription period");
  assert.equal(prepaid.renewal_date, null);
  assert.equal(prepaid.subscription_status, "pending");

  const [month] = monthlyPayments(prepaid);
  assert.equal(month.amount, sub.monthly_price);
  assert.equal(month.period_start, null);
  assert.equal(month.period_end, null);
});

test("go-live starts the subscription period and dates the prepaid month from that day", async () => {
  const sub = await newSub();
  await subs.recordSetupPayment(sub.id, PAYMENT);
  await subs.recordMonthlyPayment(sub.id, PAYMENT);

  const live = await subs.markGoLive(sub.id, { date: GO_LIVE });
  assert.equal(live.started_at, GO_LIVE);
  assert.equal(live.subscription_status, "active");
  assert.equal(live.renewal_date, "2026-10-16", "the prepaid month runs from go-live, not from the payment date");

  const [month] = monthlyPayments(live);
  assert.equal(month.period_start, GO_LIVE);
  assert.equal(month.period_end, "2026-10-15");
});

test("after go-live each payment covers the next month: monthly price only, never setup", async () => {
  const sub = await newSub();
  await subs.recordSetupPayment(sub.id, PAYMENT);
  await subs.recordMonthlyPayment(sub.id, PAYMENT);
  await subs.markGoLive(sub.id, { date: GO_LIVE });

  const second = await subs.recordMonthlyPayment(sub.id, PAYMENT);
  assert.equal(second.started_at, GO_LIVE);
  assert.equal(second.renewal_date, "2026-11-16");
  assert.equal(second.subscription_status, "active");

  const monthly = monthlyPayments(second);
  const setup = second.payments.filter((p) => p.kind === "setup");
  assert.equal(monthly.length, 2);
  assert.equal(setup.length, 1, "no extra setup payments from renewals");
  for (const p of monthly) assert.equal(p.amount, sub.monthly_price);
  assert.deepEqual(monthly.map((p) => [p.period_start, p.period_end]), [
    [GO_LIVE, "2026-10-15"],
    ["2026-10-16", "2026-11-15"]
  ]);
  assert.equal(second.charges.recurringPayment, sub.monthly_price);
  assert.equal(second.charges.setupPayable, 0);
});

test("go-live with nothing prepaid makes the first month due that day", async () => {
  const sub = await newSub({ waive: { reason: "partner_referral", waivedBy: "admin" } });
  const live = await subs.markGoLive(sub.id, { date: GO_LIVE });
  assert.equal(live.started_at, GO_LIVE);
  assert.equal(live.renewal_date, GO_LIVE);
  assert.equal(monthlyPayments(live).length, 0);

  const paid = await subs.recordMonthlyPayment(sub.id, PAYMENT);
  assert.equal(paid.renewal_date, "2026-10-16");
  assert.equal(monthlyPayments(paid)[0].period_start, GO_LIVE);
});

test("two months prepaid before go-live are both counted from the go-live date", async () => {
  const sub = await newSub({ waive: { reason: "partner_referral", waivedBy: "admin" } });
  await subs.recordMonthlyPayment(sub.id, PAYMENT);
  await subs.recordMonthlyPayment(sub.id, PAYMENT);

  const live = await subs.markGoLive(sub.id, { date: GO_LIVE });
  assert.equal(live.renewal_date, "2026-11-16");
  assert.deepEqual(monthlyPayments(live).map((p) => p.period_start), [GO_LIVE, "2026-10-16"]);
});

test("go-live defaults to today, happens once, and needs the setup fee settled", async () => {
  const pending = await newSub();
  await assert.rejects(() => subs.markGoLive(pending.id, { date: GO_LIVE }), { code: "conflict" });

  const sub = await newSub({ waive: { reason: "partner_referral", waivedBy: "admin" } });
  await assert.rejects(() => subs.markGoLive(sub.id, { date: "2999-01-01" }), { code: "invalid" });
  await assert.rejects(() => subs.markGoLive(sub.id, { date: "2026-02-30" }), { code: "invalid" });
  await assert.rejects(() => subs.markGoLive(sub.id, { date: "16/09/2026" }), { code: "invalid" });

  const live = await subs.markGoLive(sub.id);
  const todayInIndia = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  assert.equal(live.started_at, todayInIndia);
  await assert.rejects(() => subs.markGoLive(sub.id, { date: GO_LIVE }), { code: "conflict" });
  assert.equal((await subs.getSubscription(sub.id)).started_at, todayInIndia, "go-live date cannot be moved");

  const cancelled = await newSub({ waive: { reason: "partner_referral", waivedBy: "admin" } });
  await subs.setSubscriptionStatus(cancelled.id, "cancelled");
  await assert.rejects(() => subs.markGoLive(cancelled.id, { date: GO_LIVE }), { code: "conflict" });
});

test("migration 0003 allows a monthly payment without dates, and fresh-install matches it", () => {
  const strip = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8").replace(/--.*$/gm, "").replace(/\s+/g, " ");
  const rule = /constraint subscription_payments_period_rule check \( \(period_start is null and period_end is null\) or \(kind = 'subscription' and period_start is not null and period_end is not null and period_end >= period_start\) \)/;
  assert.match(strip("../supabase/migrations/0003_prepaid_months.sql"), rule);
  assert.match(strip("../supabase/fresh-install.sql"), rule);
  assert.ok(!strip("../supabase/fresh-install.sql").includes("subscription_payments_period_shape"));
  assert.ok(fs.readFileSync(new URL("../supabase/verify.sql", import.meta.url), "utf8").includes("subscription_payments.subscription_payments_period_rule"));
});

test("recordMonthlyPayment is refused while the setup fee is pending", async () => {
  const sub = await newSub();
  await assert.rejects(() => subs.recordMonthlyPayment(sub.id, PAYMENT), { code: "conflict" });
});

test("invalid product, plan and inputs are rejected", async () => {
  await assert.rejects(() => newSub({ product_slug: "not-a-product" }), { code: "invalid" });
  await assert.rejects(() => newSub({ plan_key: "platinum" }), { code: "invalid" });
  await assert.rejects(() => newSub({ business_name: " " }), { code: "invalid" });
  await assert.rejects(() => newSub({ lead_id: "not-a-uuid" }), { code: "invalid" });
  await assert.rejects(() => subs.recordSetupPayment("not-a-uuid", PAYMENT), { code: "not_found" });
  const sub = await newSub();
  await assert.rejects(() => subs.recordSetupPayment(sub.id, { method: "bitcoin" }), { code: "invalid" });
  await assert.rejects(() => subs.setSubscriptionStatus(sub.id, "trial"), { code: "invalid" });
});

test("one subscription per lead per product", async () => {
  const leadId = "d3b07384-d113-4a16-a192-349089ef01a1";
  await newSub({ lead_id: leadId });
  await assert.rejects(() => newSub({ lead_id: leadId }), { code: "conflict" });
  await newSub({ lead_id: leadId, product_slug: "tours-travels" });
});

test("create with waiver snapshots the full discount", async () => {
  const plan = getPlan("starter", PRODUCT);
  const sub = await newSub({ waive: { reason: "partner_referral", waivedBy: "admin" } });
  assert.equal(sub.setup_fee_status, "waived");
  assert.equal(sub.setup_discount, plan.setupFee);
  assert.equal(sub.charges.firstPayment, plan.monthlyPrice);
});

test("status changes never touch prices or the setup fee", async () => {
  const sub = await newSub();
  const cancelled = await subs.setSubscriptionStatus(sub.id, "cancelled");
  assert.equal(cancelled.subscription_status, "cancelled");
  assert.equal(cancelled.setup_fee_status, "pending");
  assert.equal(cancelled.monthly_price, sub.monthly_price);
  await subs.waiveSetupFee(sub.id, { reason: "manual_admin_waiver" });
  await assert.rejects(() => subs.recordMonthlyPayment(sub.id, PAYMENT), { code: "conflict" });
});

test("a customer account ID sent by an older client is not stored", async () => {
  const sub = await newSub({ customer_id: "d3b07384-d113-4a16-a192-349089ef01a1" });
  assert.ok(!("customer_id" in sub));
});

// Statements only: comments may mention what the migration deliberately leaves out.
const MIGRATION = fs
  .readFileSync(new URL("../supabase/migrations/0001_subscriptions_setup_fee.sql", import.meta.url), "utf8")
  .replace(/--.*$/gm, "");

function checkList(column) {
  const match = MIGRATION.match(new RegExp(`${column} in \\(([^)]*)\\)`));
  return match[1].split(",").map((v) => v.trim().replace(/'/g, ""));
}

test("the subscriptions migration needs nothing from the removed customer app", () => {
  assert.ok(!MIGRATION.includes("customer_profiles"));
  assert.ok(!/customer_id\s+uuid/.test(MIGRATION), "no customer_id column");
  assert.ok(!MIGRATION.includes("auth.uid()"));
  assert.match(MIGRATION, /create or replace function public\.update_updated_at_column\(\)/);
  assert.match(MIGRATION, /create table if not exists public\.subscriptions/);
  assert.match(MIGRATION, /create table if not exists public\.subscription_payments/);
  // The only table it references that it does not create is public.leads.
  const referenced = [...MIGRATION.matchAll(/references public\.(\w+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(referenced)].sort(), ["leads", "subscriptions"]);
});

test("the subscriptions migration allows exactly the values the code uses", () => {
  assert.deepEqual(checkList("setup_waiver_reason"), Object.keys(SETUP_WAIVER_REASONS));
  assert.deepEqual(checkList("setup_fee_status"), SETUP_FEE_STATUSES);
  assert.deepEqual(checkList("subscription_status"), subs.SUBSCRIPTION_STATUSES);
  assert.deepEqual(checkList("kind"), ["setup", "subscription"]);
});

test("addMonths clamps to month end without drifting", () => {
  assert.equal(subs.addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(subs.addMonths("2026-01-31", 2), "2026-03-31");
  assert.equal(subs.addMonths("2026-12-15", 1), "2027-01-15");
});
