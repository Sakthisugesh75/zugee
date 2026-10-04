// tests/public-contact.test.mjs
// The public site publishes no phone number: contact is by email and the demo form. The company
// number, tel: links and wa.me links must not appear on any public page or in the structured data.
//
// Not covered, on purpose: the admin portal (app/admin, components/admin), the API routes
// (app/api), the email templates (lib/email.js) and the server-only database code (lib/supabase.js,
// whose development seed rows hold dummy lead numbers). They handle the phone number a visitor typed
// into the form, shown as tel: and wa.me links for our team, and are never public pages.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { homePageSchema, organizationSchema } from "../lib/structured-data.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

// The company number in any format (9629144648, 96291 44648, +91-96291-44648, …), any Indian
// +91 mobile number, and phone or WhatsApp links.
const PHONE_PATTERNS = [
  /9\D?6\D?2\D?9\D?1\D?4\D?4\D?6\D?4\D?8/,
  /\+\s?91[\s-]?\d{5}[\s-]?\d{5}/,
  /\btel:/i,
  /wa\.me/i,
  /api\.whatsapp\.com/i,
  /whatsapp:\/\//i
];

const NOT_PUBLIC = [
  path.join("app", "admin"),
  path.join("app", "api"),
  path.join("components", "admin"),
  path.join("lib", "email.js"),
  path.join("lib", "supabase.js")
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function publicSourceFiles() {
  return ["app", "components", "lib"]
    .flatMap((dir) => walk(path.join(REPO_ROOT, dir)))
    .filter((file) => /\.(js|jsx|mjs)$/.test(file))
    .filter((file) => !NOT_PUBLIC.some((p) => path.relative(REPO_ROOT, file).startsWith(p)));
}

test("no public page, component or shared library contains a phone number or phone link", () => {
  const files = publicSourceFiles();
  assert.ok(files.length > 20, "expected to scan the site source");
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const pattern of PHONE_PATTERNS) {
      assert.ok(!pattern.test(source), `${path.relative(REPO_ROOT, file)} matches ${pattern}`);
    }
  }
});

test("no file in public/ contains the company number or a phone link", () => {
  // latin1 so binary files (images) can be searched too.
  for (const file of walk(path.join(REPO_ROOT, "public"))) {
    const content = fs.readFileSync(file, "latin1");
    for (const pattern of PHONE_PATTERNS) {
      assert.ok(!pattern.test(content), `${path.relative(REPO_ROOT, file)} matches ${pattern}`);
    }
  }
});

test("the structured data carries no telephone and no phone number", () => {
  for (const schema of [organizationSchema("https://www.example.com"), homePageSchema("https://www.example.com")]) {
    const json = JSON.stringify(schema);
    assert.ok(!/"telephone"/.test(json), "structured data has a telephone field");
    for (const pattern of PHONE_PATTERNS) {
      assert.ok(!pattern.test(json), `structured data matches ${pattern}`);
    }
  }
});
