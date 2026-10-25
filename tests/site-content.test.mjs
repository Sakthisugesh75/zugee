// tests/site-content.test.mjs
// The FAQ is rendered on the homepage AND emitted as FAQPage structured data, so these rules
// cover both.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FAQ_ITEMS, HOW_WE_WORK } from "../lib/site-content.js";
import { PLANS, formatINR, newSubscriptionCharges } from "../lib/pricing.js";
import { LEGAL_DRAFT, LEGAL_PAGES, legalMetadata } from "../lib/legal.js";

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

// Backups have not been verified either, so the site must not claim them in any form
// ("backup", "backups", "backed up", "back-up").
const BACKUP_CLAIM = /\bback(ed)?[\s-]?ups?\b/i;

// The single exception (founder, 2026-10-02): the Privacy Policy discloses that deleted data can
// linger in the database provider's backups. It is a retention disclosure, not a promise that a
// customer's data can be restored, and it must appear with exactly this wording and nowhere else.
const PRIVACY_PAGE = path.join("app", "(marketing)", "privacy", "page.jsx");
const APPROVED_BACKUP_DISCLOSURE =
  "Our database provider keeps automated backups. Deleted data may persist in those backups for a short period before being overwritten.";

test("no backup claim appears anywhere in the site source", () => {
  const files = ["app", "components", "lib"].flatMap((dir) => siteSourceFiles(path.join(REPO_ROOT, dir)));
  assert.ok(files.length > 20, "expected to scan the site source");

  for (const file of files) {
    const relative = path.relative(REPO_ROOT, file);
    let source = fs.readFileSync(file, "utf8");
    if (relative === PRIVACY_PAGE) {
      source = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\s+/g, " ");
      assert.ok(source.includes(APPROVED_BACKUP_DISCLOSURE), "the Privacy Policy must keep the approved backup disclosure");
      source = source.replace(APPROVED_BACKUP_DISCLOSURE, "");
    }
    assert.ok(!BACKUP_CLAIM.test(source), `${relative} contains a backup claim`);
  }
});

// Claims removed from the marketing copy on 2026-10-02 because nothing backs them: the company
// holds no security certification, and no ZUGEE product is known to work offline.
const UNBACKED_CLAIMS = [
  /enterprise[\s-]grade security/i,
  /(bank|military)[\s-]grade/i,
  /encrypted storage/i,
  /offline[\s-]resilient/i,
  /offline (sync|mode|access)/i,
  /works? offline/i
];

test("no unbacked security or offline claim appears anywhere in the site source", () => {
  const files = ["app", "components", "lib"].flatMap((dir) => siteSourceFiles(path.join(REPO_ROOT, dir)));
  assert.ok(files.length > 20, "expected to scan the site source");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const claim of UNBACKED_CLAIMS) {
      assert.ok(!claim.test(source), `${path.relative(REPO_ROOT, file)} contains an unbacked claim matching ${claim}`);
    }
  }
});

test("the data-storage FAQ makes no location claim and offers hosting details on request", () => {
  const storage = FAQ_ITEMS.find((f) => f.question === "Where is my business data stored?");
  assert.ok(storage);
  assert.ok(!/India|country/i.test(storage.answer));
  assert.ok(!BACKUP_CLAIM.test(storage.answer));
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

// ---------------------------------------------------------------------------
// Legal pages (/privacy, /terms, /refund)
// ---------------------------------------------------------------------------
const legalSources = LEGAL_PAGES.map((page) => {
  const file = path.join(REPO_ROOT, "app", "(marketing)", page.href.slice(1), "page.jsx");
  return { ...page, file, source: fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null };
});

test("every legal page linked from the footer exists", () => {
  assert.deepEqual(LEGAL_PAGES.map((p) => p.href), ["/privacy", "/terms", "/refund"]);
  for (const page of legalSources) {
    assert.ok(page.source, `${page.href} has no page file`);
    assert.match(page.source, /legalMetadata\(/, `${page.href} must use legalMetadata`);
  }
});

test("legal pages are always noindex so RAG crawlers skip legal disclaimers", () => {
  const placeholders = legalSources.reduce((n, page) => n + (page.source.match(/<Confirm[\s>]/g) || []).length, 0);
  if (placeholders > 0) {
    assert.equal(LEGAL_DRAFT, true, `${placeholders} unconfirmed placeholders remain: LEGAL_DRAFT must stay true`);
  }

  const metadata = legalMetadata({ path: "/privacy", title: "Privacy Policy", description: "x" });
  assert.equal(metadata.robots.index, false, "legal pages must be noindex");
  assert.equal(metadata.robots.follow, true, "legal pages must be follow so link equity flows");
  assert.equal(metadata.robots.nocache, true, "legal pages must be nocache");
  // Shared legal links show their own title and URL, not the homepage's.
  assert.equal(metadata.openGraph.url, "/privacy");
  assert.equal(metadata.openGraph.title, "Privacy Policy | ZUGEE");
});

test("the sitemap never lists a noindex page", () => {
  const sitemap = fs.readFileSync(path.join(import.meta.dirname, "..", "app", "sitemap.js"), "utf8");
  assert.ok(!/LEGAL_PAGES|\/privacy|\/terms|\/refund/.test(sitemap), "legal pages are noindex: keep them out of the sitemap");
  // lastmod dates are fixed strings, so they only change when the content does.
  for (const [, date] of sitemap.matchAll(/_UPDATED = "([^"]+)"/g)) assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
});

test("IndexNow key file and search verification tags", async () => {
  const { INDEXNOW_KEY, searchVerification } = await import("../lib/site.js");
  assert.match(INDEXNOW_KEY, /^[a-f0-9]{32}$/);
  const keyFile = path.join(import.meta.dirname, "..", "public", `${INDEXNOW_KEY}.txt`);
  assert.equal(fs.readFileSync(keyFile, "utf8").trim(), INDEXNOW_KEY, "public/<key>.txt must hold exactly the key");

  assert.deepEqual(searchVerification({}), {}, "no tags when nothing is configured");
  assert.deepEqual(searchVerification({ GOOGLE_SITE_VERIFICATION: "g", BING_SITE_VERIFICATION: "b", YANDEX_SITE_VERIFICATION: "y" }), {
    google: "g",
    yandex: "y",
    other: { "msvalidate.01": "b" }
  });
});

test("legal pages publish no price and no promise the company cannot keep", () => {
  for (const page of legalSources) {
    assert.ok(!/₹|\bRs\.?\s?\d|\bINR\b/.test(page.source), `${page.href} contains a price`);
    assert.ok(!/99(\.\d+)?\s?%/.test(page.source), `${page.href} contains an uptime percentage`);
    assert.ok(!/money[\s-]back/i.test(page.source), `${page.href} promises money back`);
  }
  // The honest limits must stay stated.
  const terms = legalSources.find((p) => p.href === "/terms").source;
  assert.match(terms, /No uptime guarantee/);
  assert.match(terms, /No 24\/7 support on standard plans/);
  assert.match(terms, /Salem, Tamil Nadu/);
  const privacy = legalSources.find((p) => p.href === "/privacy").source;
  assert.match(privacy, /We do not promise that your data never leaves India/);
  // Since the chat assistant (2026-10-25) the site sets a guest cookie, so the policy must say exactly
  // what it keeps instead of "no cookies".
  assert.match(privacy, /sets no advertising, analytics or tracking cookies/);
  assert.match(privacy, /zugee_chat_guest \(cookie\)/);
  assert.match(privacy, /scrambled, one-way code made from your IP address/);
  assert.ok(!/sets no cookies for visitors/.test(privacy), "the site does set a cookie for chat guests");
});

test("no source file holds mojibake (UTF-8 text saved as Windows-1252)", () => {
  // "â€”" is an em dash, "Ã—" a multiplication sign, "Â·" a middle dot after a wrong-encoding save.
  // These reach page titles and share previews, so fail fast.
  const MOJIBAKE = /\u00e2\u20ac|\u00c3[\u0080-\u00bf\u2014\u2013\u201c\u201d\u2018\u2019\u2022\u2026\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192\u02c6\u02dc\u2020\u2021\u2030\u2039\u203a\u2122]|\u00c2[\u00a0-\u00bf]/;
  const root = path.join(import.meta.dirname, "..");
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : /\.(js|jsx|mjs|css|txt|json)$/.test(e.name) ? [full] : [];
    });
  for (const file of ["app", "components", "lib", "public", "scripts"].flatMap((d) => walk(path.join(root, d)))) {
    assert.ok(!MOJIBAKE.test(fs.readFileSync(file, "utf8")), `${path.relative(root, file)} has mojibake (re-save as UTF-8)`);
  }
});
