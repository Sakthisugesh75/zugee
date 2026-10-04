// tests/lead-request.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  REQUEST_TYPES,
  DEFAULT_REQUEST_TYPE,
  isRequestType,
  requestTypeLabel,
  leadRequestType
} from "../lib/lead-request.js";

// No Supabase env vars in tests, so lib/supabase.js uses its in-memory development store.
const { insertLead, getLeadsList } = await import("../lib/supabase.js");

test("the form offers a product demo and a pricing call", () => {
  assert.deepEqual(REQUEST_TYPES.map((t) => t.label), ["Product demo", "Pricing call"]);
  assert.equal(DEFAULT_REQUEST_TYPE, "demo");
  assert.equal(isRequestType("demo"), true);
  assert.equal(isRequestType("pricing_call"), true);
  assert.equal(isRequestType("free_trial"), false);
  assert.equal(isRequestType(undefined), false);
  assert.equal(requestTypeLabel("pricing_call"), "Pricing call");
});

test("a lead's request type comes from its request_type column", () => {
  assert.equal(leadRequestType({ request_type: "pricing_call" }), "pricing_call");
  assert.equal(leadRequestType({ request_type: "demo" }), "demo");
  // Rows from before the column existed, or with an unknown value, count as a demo.
  assert.equal(leadRequestType({}), "demo");
  assert.equal(leadRequestType({ request_type: null }), "demo");
  assert.equal(leadRequestType({ request_type: "something_else" }), "demo");
  // The message never decides the type.
  assert.equal(leadRequestType({ request_type: "demo", message: "I'd like a pricing call" }), "demo");
});

test("the migration allows exactly the request types the code uses", () => {
  const sql = fs.readFileSync(new URL("../supabase/migrations/0002_leads_request_type.sql", import.meta.url), "utf8");
  assert.match(sql, /add column if not exists request_type text not null default 'demo'/);
  const allowed = sql.match(/check \(request_type in \(([^)]*)\)\)/)[1].split(",").map((v) => v.trim().replace(/'/g, ""));
  assert.deepEqual(allowed, REQUEST_TYPES.map((t) => t.id));
});

test("a saved lead keeps its request type and its message unchanged", async () => {
  const lead = await insertLead({
    name: "Stored Asker",
    phone: "+91 98765 43200",
    email: null,
    company_name: null,
    industry: "transposs",
    request_type: "pricing_call",
    message: "Quote for 12 users",
    source_page: "homepage-contact"
  });
  assert.equal(lead.request_type, "pricing_call");
  assert.equal(lead.message, "Quote for 12 users");
});

test("the admin lead list can be filtered by request type", async () => {
  const base = { phone: "+91 98765 43210", email: null, company_name: null, industry: "transposs", source_page: "homepage-contact" };
  const pricingLead = await insertLead({ ...base, name: "Pricing Asker", request_type: "pricing_call", message: "Quote for 12 users" });
  const demoLead = await insertLead({ ...base, name: "Demo Asker", request_type: "demo", message: "Show me trips" });

  const pricingOnly = await getLeadsList({ request: "pricing_call", limit: 100 });
  assert.ok(pricingOnly.leads.some((l) => l.id === pricingLead.id));
  assert.ok(pricingOnly.leads.every((l) => l.request_type === "pricing_call"));

  const demoOnly = await getLeadsList({ request: "demo", limit: 100 });
  assert.ok(demoOnly.leads.some((l) => l.id === demoLead.id));
  assert.ok(demoOnly.leads.every((l) => leadRequestType(l) === "demo"));

  const all = await getLeadsList({ limit: 100 });
  assert.ok(all.leads.some((l) => l.id === pricingLead.id));
  assert.ok(all.leads.some((l) => l.id === demoLead.id));
});

// ---------------------------------------------------------------------------
// What the homepage form sends must pass the public.leads CHECK constraints.
// ---------------------------------------------------------------------------
const repoFile = (...parts) => fs.readFileSync(new URL(`../${parts.join("/")}`, import.meta.url), "utf8");

function checkList(sql, column) {
  const match = sql.match(new RegExp(`check \\(${column} in \\(([^)]*)\\)\\)`));
  assert.ok(match, `no CHECK constraint for ${column}`);
  return match[1].split(",").map((v) => v.trim().replace(/'/g, ""));
}

test("every request_type and source_page the homepage form can send passes the leads CHECK constraints", () => {
  const form = repoFile("components", "home", "ContactSection.jsx");
  const route = repoFile("app", "api", "leads", "route.js");

  // source_page: every literal the form or the API route writes.
  const sourcePages = new Set(
    [...form.matchAll(/source_page:\s*"([^"]+)"/g), ...route.matchAll(/source_page:\s*"([^"]+)"/g)].map((m) => m[1])
  );
  assert.deepEqual([...sourcePages], ["homepage-contact"]);

  // request_type: the form only offers REQUEST_TYPES, and the route rejects anything else.
  assert.match(form, /REQUEST_TYPES\.map\(/);
  assert.match(form, /request_type: requestType/);
  assert.match(route, /if \(!isRequestType\(requestType\)\)/);
  const requestTypes = REQUEST_TYPES.map((t) => t.id);

  for (const file of ["schema.sql", "fresh-install.sql"]) {
    const sql = repoFile("supabase", file);
    const allowedTypes = checkList(sql, "request_type");
    const allowedPages = checkList(sql, "source_page");
    for (const value of requestTypes) assert.ok(allowedTypes.includes(value), `${file}: request_type '${value}' not allowed`);
    for (const value of sourcePages) assert.ok(allowedPages.includes(value), `${file}: source_page '${value}' not allowed`);
  }
});

test("the homepage form keeps its spam honeypot and the API drops filled ones", () => {
  const form = repoFile("components", "home", "ContactSection.jsx");
  const route = repoFile("app", "api", "leads", "route.js");
  assert.match(form, /id="contact-company-website"/);
  assert.match(form, /tabIndex=\{-1\}/);
  assert.match(form, /company_website: honeypot/);
  assert.match(route, /body\.company_website/);
  assert.match(route, /submissionLimiter\.hit\(ip\)/, "the API keeps its rate limit");
});

test("the homepage demo form offers only Available products plus 'Something else'", async () => {
  const { DEMO_FORM_BUSINESS_TYPES, BUSINESS_TYPES, PRODUCTS } = await import("../lib/products.js");
  const offered = DEMO_FORM_BUSINESS_TYPES.map((b) => b.id);
  const available = PRODUCTS.filter((p) => p.status === "available").map((p) => p.slug);
  assert.deepEqual(offered, [...available, "other"]);
  // Every option is still accepted by the API, which validates against the full list.
  const allowed = new Set(BUSINESS_TYPES.map((b) => b.id));
  for (const id of offered) assert.ok(allowed.has(id), `${id} not accepted by /api/leads`);
  assert.match(repoFile("app", "(marketing)", "page.jsx"), /businessTypes=\{DEMO_FORM_BUSINESS_TYPES\}/);
});
