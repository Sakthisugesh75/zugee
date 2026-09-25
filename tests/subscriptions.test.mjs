// tests/subscriptions.test.mjs
// lib/subscriptions.js in dev-fallback mode (in-memory store, no Supabase). Run with `npm test`.

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

const { getPlan } = await import("../lib/pricing.js");
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

test("recordMonthlyPayment x2: monthly price only, never setup, renewal advances each time", async () => {
  const sub = await newSub();
  await subs.recordSetupPayment(sub.id, PAYMENT);

  const first = await subs.recordMonthlyPayment(sub.id, PAYMENT);
  assert.equal(first.subscription_status, "active");
  assert.ok(first.started_at);
  assert.equal(first.renewal_date, subs.addMonths(first.started_at, 1));

  const second = await subs.recordMonthlyPayment(sub.id, PAYMENT);
  assert.equal(second.started_at, first.started_at);
  assert.equal(second.renewal_date, subs.addMonths(first.started_at, 2));

  const monthly = second.payments.filter((p) => p.kind === "subscription");
  const setup = second.payments.filter((p) => p.kind === "setup");
  assert.equal(monthly.length, 2);
  assert.equal(setup.length, 1, "no extra setup payments from renewals");
  for (const p of monthly) assert.equal(p.amount, sub.monthly_price);
  assert.deepEqual(monthly.map((p) => p.period_start).sort(), [first.started_at, subs.addMonths(first.started_at, 1)]);
  assert.equal(second.charges.recurringPayment, sub.monthly_price);
  assert.equal(second.charges.setupPayable, 0);
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

test("customer view only returns that customer's rows", async () => {
  const customerId = "0f8b2c1e-6a1d-4c7b-9e2f-1a2b3c4d5e6f";
  await newSub({ customer_id: customerId });
  await newSub({ business_name: "Someone Else" });
  const mine = await subs.getCustomerSubscriptions(customerId);
  assert.equal(mine.length, 1);
  assert.equal(mine[0].customer_id, customerId);
  assert.deepEqual(await subs.getCustomerSubscriptions("not-a-uuid"), []);
});

test("addMonths clamps to month end without drifting", () => {
  assert.equal(subs.addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(subs.addMonths("2026-01-31", 2), "2026-03-31");
  assert.equal(subs.addMonths("2026-12-15", 1), "2027-01-15");
});
