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
