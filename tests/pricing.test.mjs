// tests/pricing.test.mjs — run with `npm test` (Node's built-in test runner, no dependencies).
import { test } from "node:test";
import assert from "node:assert/strict";
import { PLANS, getPlan, calculateCharges, newSubscriptionCharges, formatINR } from "../lib/pricing.js";

test("monthly prices and setup fees match the published pricing", () => {
  assert.equal(getPlan("starter").monthlyPrice, 1999);
  assert.equal(getPlan("starter").setupFee, 4999);
  assert.equal(getPlan("growth").monthlyPrice, 4099);
  assert.equal(getPlan("growth").setupFee, 9999);
});

test("first payment = setup + first month; renewals = monthly only", () => {
  const starter = newSubscriptionCharges("starter");
  assert.equal(starter.firstPayment, 6998);
  assert.equal(starter.recurringPayment, 1999);

  const growth = newSubscriptionCharges("growth");
  assert.equal(growth.firstPayment, 14098);
  assert.equal(growth.recurringPayment, 4099);
});

test("once setup is paid, waived or refunded it is never due again", () => {
  for (const status of ["paid", "waived", "refunded"]) {
    const c = calculateCharges({ monthlyPrice: 4099, setupFee: 9999, setupFeeStatus: status });
    assert.equal(c.setupPayable, 0, status);
    assert.equal(c.firstPayment, 4099, status);
  }
});

test("a waiver discounts the whole setup fee", () => {
  const c = newSubscriptionCharges("starter", null, { waived: true });
  assert.equal(c.setupFee, 4999);
  assert.equal(c.setupDiscount, 4999);
  assert.equal(c.setupPayable, 0);
  assert.equal(c.firstPayment, 1999);
});

test("a discount can never exceed the setup fee or make it negative", () => {
  const c = calculateCharges({ monthlyPrice: 1999, setupFee: 4999, setupDiscount: 99999 });
  assert.equal(c.setupPayable, 0);
});

test("rejects bad input instead of producing a wrong bill", () => {
  assert.throws(() => calculateCharges({ monthlyPrice: -1, setupFee: 0 }));
  assert.throws(() => calculateCharges({ monthlyPrice: 19.99, setupFee: 0 }));
  assert.throws(() => calculateCharges({ monthlyPrice: 1999, setupFee: 4999, setupFeeStatus: "free" }));
  assert.throws(() => newSubscriptionCharges("enterprise"));
});

test("unknown products fall back to the default plans", () => {
  assert.deepEqual(getPlan("growth", "aqua-erp"), getPlan("growth"));
});

test("every plan has the fields the UI and billing rely on", () => {
  for (const p of PLANS) {
    assert.ok(p.key && p.name && p.audience);
    assert.ok(Number.isInteger(p.monthlyPrice) && Number.isInteger(p.setupFee));
    assert.ok(p.features.length > 0 && p.setupIncludes.length > 0);
    assert.doesNotMatch(p.setupIncludes.join(" "), /whatsapp/i, "WhatsApp setup must not be advertised until an integration exists");
  }
});

test("formats rupees the Indian way", () => {
  assert.equal(formatINR(14098), "₹14,098");
  assert.equal(formatINR(100000), "₹1,00,000");
});
