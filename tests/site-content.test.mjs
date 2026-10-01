// tests/site-content.test.mjs
// The FAQ is rendered on the homepage AND emitted as FAQPage structured data, so these rules
// cover both.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FAQ_ITEMS, HOW_WE_WORK } from "../lib/site-content.js";
import { PLANS, formatINR, newSubscriptionCharges } from "../lib/pricing.js";

const allCopy = [
  ...FAQ_ITEMS.flatMap((f) => [f.question, f.answer]),
  ...HOW_WE_WORK.flatMap((s) => [s.title, s.body])
].join("\n");

// Every source file that can put text on the public site, its metadata or its structured data.
function siteSourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return siteSourceFiles(full);
    return /\.(js|jsx|mjs)$/.test(entry.name) ? [full] : [];
  });
}

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

// Where ZUGEE's data is hosted has not been verified, so the site must not say it is in India.
// "Built for Indian businesses" and similar are fine: they are not hosting claims.
const INDIA_HOSTING_CLAIMS = [
  /Data Stored in India/i,
  /Indian soil/i,
  /Data stays in India/i,
  /Indian Data Sovereignty/i,
  /sovereign data hosting/i,
  /(servers?|hosted|hosting|stored|storage)[^.\n]{0,40}\b(in|within) India\b/i
];

test("no India data-hosting claim appears anywhere in the site source", () => {
  const files = ["app", "components", "lib"].flatMap((dir) => siteSourceFiles(path.join(REPO_ROOT, dir)));
  assert.ok(files.length > 20, "expected to scan the site source");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const claim of INDIA_HOSTING_CLAIMS) {
      assert.ok(!claim.test(source), `${path.relative(REPO_ROOT, file)} contains a hosting claim matching ${claim}`);
    }
  }
});

test("the data-storage FAQ makes no location claim and offers hosting details on request", () => {
  const storage = FAQ_ITEMS.find((f) => f.question === "Where is my business data stored?");
  assert.ok(storage);
  assert.ok(!/India|country/i.test(storage.answer));
  assert.match(storage.answer, /stored securely/i);
  assert.match(storage.answer, /authorised users/i);
  assert.match(storage.answer, /hosting details on request/i);
});

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
