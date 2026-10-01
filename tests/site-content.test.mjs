// tests/site-content.test.mjs
// The FAQ is rendered on the homepage AND emitted as FAQPage structured data, so these rules
// cover both.
import test from "node:test";
import assert from "node:assert/strict";
import { FAQ_ITEMS, HOW_WE_WORK } from "../lib/site-content.js";
import { PLANS, formatINR, newSubscriptionCharges } from "../lib/pricing.js";

const allCopy = [
  ...FAQ_ITEMS.flatMap((f) => [f.question, f.answer]),
  ...HOW_WE_WORK.flatMap((s) => [s.title, s.body])
].join("\n");

test("no price appears in the FAQ or how-it-works copy", () => {
  assert.ok(!/₹|\bRs\.?\s?\d|\bINR\b/i.test(allCopy), "currency amount found");
  assert.ok(!/\/\s?(month|mo|year|yr)\b/i.test(allCopy), "per-period price found");

  // Every amount lib/pricing.js knows about, formatted (₹1,999) and bare (1,999 / 1999).
  const amounts = PLANS.flatMap((p) => [
    p.monthlyPrice,
    p.setupFee,
    p.annualPrice,
    p.annualMonthlyEquivalent,
    newSubscriptionCharges(p.key).firstPayment
  ]);
  for (const amount of amounts) {
    assert.ok(!allCopy.includes(formatINR(amount)), `${formatINR(amount)} found`);
    assert.ok(!allCopy.includes(Number(amount).toLocaleString("en-IN")), `${amount} found`);
    assert.ok(!allCopy.includes(String(amount)), `${amount} found`);
  }
});

test("the setup fee and subscription are explained, with pricing shared on the call", () => {
  const setup = FAQ_ITEMS.find((f) => f.question === "What is the one-time setup fee?");
  const monthly = FAQ_ITEMS.find((f) => f.question === "Do I pay the setup fee again every month?");
  assert.ok(setup && monthly);
  assert.match(setup.answer, /once/i);
  assert.match(setup.answer, /pricing call/i);
  assert.match(monthly.answer, /^No\./);
  assert.match(monthly.answer, /once per product/i);
  assert.match(monthly.answer, /on the call/i);
});

test("the FAQ never claims a shared login or shared database across products", () => {
  assert.ok(!/unified zugee account|unified account|single login|one login|one account|one operating system/i.test(allCopy));
  assert.ok(!/shared (login|users|database)/i.test(allCopy));

  const multi = FAQ_ITEMS.find((f) => f.question === "Can I use more than one ZUGEE product?");
  assert.ok(multi);
  assert.match(multi.answer, /^Yes\./);
  assert.match(multi.answer, /own login/i);
  assert.match(multi.answer, /side by side/i);
  assert.ok(!/coming soon/i.test(multi.answer));
});
