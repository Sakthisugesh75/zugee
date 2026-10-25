// lib/chatbot/capabilities.js
// What ZUGEE can and cannot do today, topic by topic, with a status and the evidence behind it.
// The chat assistant reads this (lib/chatbot/knowledge.js) to keep "available", "partly / by our
// team", "coming soon", "not offered" and "can't confirm" apart.
// No JSX and relative imports only, so `node --test` can load this file.
//
// STATUS RULES (do not relax without evidence):
//   confirmed    stated in founder-approved site copy or a legal commitment
//   limited      available, but only in the products listed, partly, or done by our team
//   coming_soon  named as planned in the site copy or docs/ZUGEE-PLATFORM-PLAN.md; never give a date
//   unsupported  the site copy says ZUGEE does not do it (for example: filings stay with your accountant)
//   unverified   no reliable source either way: say so and offer to check with the team
// The products' own code lives outside this repo, so "confirmed" rests on founder sign-off recorded in
// lib/products.js, approved product-page copy and the Terms, not on reading product code.
//
// evidence: exact text from the cited file (repo-relative path). tests/chatbot.test.mjs checks every
// quote still exists, so a copy change that removes the backing for a status fails the build.
// Every status except "unverified" needs evidence; "unverified" may have none.
// To update: change the entry, quote the evidence, run `npm test`.

export const CAPABILITY_STATUSES = ["confirmed", "limited", "coming_soon", "unsupported", "unverified"];

const PLAN = "docs/ZUGEE-PLATFORM-PLAN.md";
const TERMS = "app/(marketing)/terms/page.jsx";
const page = (name) => `lib/product-pages/${name}.js`;

/**
 * @typedef {{ id: string, topic: string, status: "confirmed"|"limited"|"coming_soon"|"unsupported"|"unverified",
 *             answer: string, products?: string[], evidence: { file: string, quote: string }[] }} Capability
 * @type {Capability[]}
 */
export const CAPABILITIES = [
  // ---- GST and accounting --------------------------------------------------------------------
  {
    id: "gst_billing",
    topic: "GST tax invoices (bills that charge GST)",
    status: "limited",
    products: ["core-erp", "transposs"],
    answer:
      "ZUGEE Omni and ZUGEE Fleet raise GST bills with your business and customer details. The other products raise their own bills or receipts (fees, rent, bookings, OP/IP bills); for GST on those, your accountant handles the GST side using data we export.",
    evidence: [
      { file: page("zugee-omni"), quote: "leads, customers, GST billing, payments and stock" },
      { file: page("fleetova"), quote: "GST billing for transport customers" }
    ]
  },
  {
    id: "gst_calculation_help",
    topic: "Working out GST on an amount or invoice",
    status: "confirmed",
    answer:
      "The assistant can work out an educational GST breakdown (taxable value, CGST/SGST or IGST, total) with the calculate_gst_invoice tool. It is an estimate, not tax advice or a tax invoice.",
    evidence: [{ file: "lib/gst.js", quote: "Deterministic GST invoice maths" }]
  },
  {
    id: "gst_return_filing",
    topic: "Filing GST returns (GSTR-1, GSTR-3B) from ZUGEE",
    status: "unsupported",
    answer: "ZUGEE does not file GST returns. Your accountant keeps filing (for example from Tally), and we export the billing data they need.",
    evidence: [
      { file: page("clinivance"), quote: "statutory filings stay with your accountant" },
      { file: page("aqurix"), quote: "Your accountant can continue filing GST from Tally" }
    ]
  },
  {
    id: "gstr1_report",
    topic: "A ready GSTR-1 report inside ZUGEE",
    status: "coming_soon",
    answer: "A GSTR-1 report inside ZUGEE is planned but not available yet. Today your accountant prepares it from the billing data we export.",
    evidence: [{ file: PLAN, quote: 'GSTR-1, e-invoice and Tally export stay "Coming Soon"' }]
  },
  {
    id: "gst_portal_connectivity",
    topic: "Direct connection to the GST portal (GSTN / GSP API)",
    status: "unsupported",
    answer: "ZUGEE does not connect to the GST portal. Filing and portal work stay with your accountant.",
    evidence: [{ file: page("clinivance"), quote: "statutory filings stay with your accountant" }]
  },
  {
    id: "gstr2b_reconciliation",
    topic: "GSTR-2B / input tax credit (ITC) reconciliation",
    status: "unsupported",
    answer: "ZUGEE does not reconcile GSTR-2B or input tax credit. Your accountant does this with their own tools.",
    evidence: [{ file: page("aqurix"), quote: "Your accountant can continue filing GST from Tally" }]
  },
  {
    id: "e_invoice",
    topic: "E-invoicing (IRN / QR code from the IRP)",
    status: "coming_soon",
    // Explicit "until then" so the model does not invent who does it today (live eval runs 2 and 3
    // said "your accountant handles e-invoicing").
    answer:
      "E-invoicing (IRN generation) is planned but not available in ZUGEE yet. Until then, keep generating e-invoices the way you do now; do not say who does it for the visitor.",
    evidence: [{ file: PLAN, quote: 'GSTR-1, e-invoice and Tally export stay "Coming Soon"' }]
  },
  {
    id: "e_way_bill",
    topic: "E-way bills",
    status: "unverified",
    answer: "I can't confirm e-way bill generation from ZUGEE. Our team can tell you on WhatsApp whether your product supports it.",
    evidence: []
  },
  {
    id: "tally_export",
    topic: "Giving your accountant data for Tally",
    status: "limited",
    // Not "a format Tally can work with": a Tally import file is the coming_soon tally_direct entry
    // (live eval run 3 stretched it that way).
    answer:
      "Your accountant can keep using Tally. We export the billing data your accountant needs as Excel or CSV. It is an export for your accountant, not a file that imports straight into Tally and not a live Tally connection.",
    evidence: [
      { file: page("fleetova"), quote: "we can export the billing data they need in a format they can work with" },
      { file: TERMS, quote: "an export in a common format such as Excel or CSV" }
    ]
  },
  {
    id: "tally_direct",
    topic: "Direct Tally integration / Tally XML sync",
    status: "coming_soon",
    answer: "A direct Tally export (Tally XML) is planned but not available yet. Today the data goes to your accountant as an export.",
    evidence: [{ file: PLAN, quote: 'GSTR-1, e-invoice and Tally export stay "Coming Soon"' }]
  },
  {
    id: "supplier_payments",
    topic: "Automated supplier / vendor payments (bank payouts)",
    status: "unverified",
    answer: "I can't confirm automated supplier payments. ZUGEE products record payments; making bank payouts from ZUGEE is not something I can confirm.",
    evidence: []
  },

  // ---- Sales, payments, stock -----------------------------------------------------------------
  {
    id: "customer_credit_outstanding",
    topic: "Customer dues, credit sales and outstanding balances",
    status: "limited",
    products: ["core-erp", "aqua-erp", "pg-management", "real-estate"],
    answer:
      "Dues are tracked in ZUGEE Omni (payments set against bills, outstanding by customer), ZUGEE Water (outstanding by customer and route), ZUGEE Hostels (unpaid rent by tenant) and ZUGEE Estates (dues per booking). For other products, ask our team.",
    evidence: [
      { file: page("zugee-omni"), quote: "Each payment is set against its bill, so outstanding by customer is always up to date." },
      { file: page("aqurix"), quote: "See outstanding amounts per customer and per route" },
      { file: page("roomora"), quote: "unpaid rent" },
      { file: page("estatova"), quote: "Payments are recorded against each booking, so collections and dues for every unit are visible." }
    ]
  },
  {
    id: "partial_payments",
    topic: "Part payments / instalments",
    status: "limited",
    products: ["pg-management", "resort", "real-estate"],
    answer:
      "Part payments are recorded in ZUGEE Hostels (rent in instalments), ZUGEE Resorts (advances and part payments) and ZUGEE Estates (token, booking amount and each instalment). For any other product, I can't confirm part payments.",
    evidence: [
      { file: page("roomora"), quote: "Part payments are recorded as they come" },
      { file: page("resortique"), quote: "Record advances, part payments and the final settlement" },
      { file: page("estatova"), quote: "Record the token, the booking amount and each instalment against the booking." }
    ]
  },
  {
    // Spelled out because the model kept extending part payments to ZUGEE Water (live eval runs 1 and 2).
    id: "partial_payments_other_products",
    topic: "Part payments / instalments in the other products (ZUGEE Water, ZUGEE Omni, ZUGEE Fleet and the rest)",
    status: "unverified",
    answer:
      "For ZUGEE Water, ZUGEE Omni, ZUGEE Fleet, ZUGEE Tours, ZUGEE Schools, ZUGEE Campus, ZUGEE Care and ZUGEE Factory, I can't confirm part-payment or instalment tracking. They record payments and (where listed) outstanding dues; ask our team whether instalments fit your case.",
    evidence: []
  },
  {
    id: "inventory",
    topic: "Inventory and stock",
    status: "limited",
    products: ["core-erp", "manuflow"],
    answer:
      "ZUGEE Omni tracks stock, and each sale reduces stock as it is billed. ZUGEE Factory keeps raw-material and finished-goods inventory with purchase orders and GRNs. The other products are not built around stock.",
    evidence: [
      { file: page("zugee-omni"), quote: "Each sale reduces stock as it is billed" },
      { file: page("fabrova"), quote: "keep inventory of raw materials and finished goods in one place" }
    ]
  },
  {
    id: "low_stock_alerts",
    topic: "Low-stock alerts",
    status: "unverified",
    answer: "I can't confirm automatic low-stock alerts. Our team can check this for your product.",
    // The platform plan found earlier marketing promised stock alerts that did not exist.
    evidence: [{ file: PLAN, quote: "Marketing sells GST invoicing, e-invoice, stock alerts" }]
  },
  {
    id: "online_payment_links",
    topic: "Online payment links / collecting payments online",
    status: "coming_soon",
    answer: "Sending payment links and reminders to customers is coming soon. Today payments by cash, UPI or bank are recorded in the product.",
    evidence: [{ file: "components/home/ComparisonSection.jsx", quote: "WhatsApp payment reminders with UPI & payment links (coming soon)" }]
  },
  {
    id: "whatsapp_messaging",
    topic: "WhatsApp messages and payment reminders sent from ZUGEE",
    status: "coming_soon",
    answer:
      "Sending invoices, reminders and alerts on WhatsApp from inside ZUGEE is coming soon, not live. Today the outstanding list tells your staff whom to remind.",
    evidence: [
      { file: "lib/site-content.js", quote: "WhatsApp Cloud API integration is currently rolling out" },
      { file: page("aqurix"), quote: "WhatsApp sending is not live in any ZUGEE product yet" }
    ]
  },

  // ---- Teams, branches, access ----------------------------------------------------------------
  {
    id: "multi_branch",
    topic: "Multiple branches",
    status: "confirmed",
    answer: "Starter covers 1 branch; Growth covers multiple branches; Enterprise covers unlimited branches. The branch count is part of your quote.",
    evidence: [
      { file: "lib/pricing.js", quote: '"1 branch"' },
      { file: "lib/pricing.js", quote: '"Multiple branches"' },
      { file: "components/home/PricingSection.jsx", quote: "Unlimited branches & staff accounts" }
    ]
  },
  {
    id: "branch_restricted_access",
    topic: "Limiting staff to their own branch's data",
    status: "unverified",
    answer:
      "Role-based permissions control what each person can see, but I can't confirm that staff can be limited to only their own branch's data. Our team can check this for your product.",
    // Only a design in the platform plan, not a built feature.
    evidence: [{ file: PLAN, quote: "restricts staff to branches" }]
  },
  {
    id: "per_branch_gstin",
    topic: "A separate GSTIN per branch",
    status: "unverified",
    answer: "I can't confirm separate GSTINs per branch. Our team can check this for your product.",
    evidence: [{ file: PLAN, quote: "per-branch GSTIN support" }]
  },
  {
    id: "roles_permissions",
    topic: "Staff logins and role-based permissions",
    status: "confirmed",
    answer:
      "Each person signs in with their own login and sees only what their role allows (for example lab staff in ZUGEE Care do not see billing). Role-based permissions are part of the Growth plan.",
    evidence: [
      { file: "lib/pricing.js", quote: '"Role-based permissions"' },
      { file: page("clinivance"), quote: "A lab technician does not see billing" }
    ]
  },
  {
    id: "mobile_access",
    topic: "Using ZUGEE on a phone",
    status: "confirmed",
    answer: "ZUGEE products run in a web browser, so staff can use them on an Android phone as well as on a computer.",
    evidence: [{ file: page("fleetova"), quote: "runs in a web browser, so staff can open it on an Android phone" }]
  },
  {
    id: "native_app",
    topic: "A native Android / iOS app from the Play Store or App Store",
    status: "unverified",
    answer: "I can't confirm a separate app-store app; the products run in the phone's browser.",
    evidence: []
  },
  {
    id: "driver_app_trip_logging",
    topic: "Drivers logging trips, expenses or proof of delivery on their phones",
    status: "unverified",
    answer:
      "ZUGEE Fleet runs in a phone browser for office staff and supervisors. Whether drivers log trips, expenses or proof of delivery themselves isn't something I can confirm; our team can check.",
    evidence: [{ file: page("fleetova"), quote: "Can my office staff and supervisors use ZUGEE Fleet on a mobile phone?" }]
  },
  {
    id: "gps_tracking",
    topic: "Live GPS vehicle tracking",
    status: "unverified",
    answer: "Live GPS tracking is not among ZUGEE Fleet's modules, so I can't confirm it. Ask our team if you need it.",
    evidence: [{ file: "lib/products.js", quote: 'modules: ["Vehicles", "Drivers", "Bookings", "Trips", "Maintenance", "Billing"]' }]
  },
  {
    id: "separate_products",
    topic: "Using two ZUGEE products together",
    status: "confirmed",
    answer: "Each ZUGEE product is separate software with its own login and data. You can use two side by side; they do not share a login or database.",
    evidence: [{ file: "lib/site-content.js", quote: "separate software with its own login and its own data" }]
  },
  {
    id: "custom_integrations",
    topic: "Custom integrations with other software (APIs, ERPs)",
    status: "limited",
    answer: "Custom integrations are scoped for Enterprise customers on a call. There is no ready list of integrations.",
    evidence: [
      { file: "components/home/PricingSection.jsx", quote: "Custom module development & API webhooks" },
      { file: "components/home/PricingSection.jsx", quote: "Custom ERP Integrations" }
    ]
  },

  // ---- Setup, data, contract ------------------------------------------------------------------
  {
    id: "setup_migration",
    topic: "Setup, data migration and training",
    status: "confirmed",
    answer:
      "Our team sets each customer up in about 14 days: we bring your data across from Excel or Tally exports, configure the product and train your staff. The setup fee is one-time.",
    evidence: [
      { file: page("fleetova"), quote: "Our team sets it up for your business in 14 days" },
      { file: page("fleetova"), quote: "from Excel or your Tally exports" }
    ]
  },
  {
    id: "data_export",
    topic: "Exporting your own data",
    status: "confirmed",
    answer: "You can export your data from the product in one click, and we will also send an export (such as Excel or CSV) if you ask.",
    evidence: [
      { file: TERMS, quote: "You can export your data from the product in one click." },
      { file: TERMS, quote: "an export in a common format such as Excel or CSV" }
    ]
  },
  {
    id: "contract_payment",
    topic: "Contract, payment method and cancellation",
    status: "confirmed",
    answer:
      "No minimum term or lock-in: cancel any time in writing. Payment is by UPI or bank transfer against our invoice; nothing is charged automatically (no auto-renewal). The monthly price is fixed for the life of the subscription. Refund rules are on /refund.",
    evidence: [
      { file: TERMS, quote: "There is no minimum term and no lock-in." },
      { file: TERMS, quote: "Nothing is charged automatically." },
      { file: TERMS, quote: "Your monthly price is fixed for the life of your subscription." }
    ]
  },
  {
    id: "pricing_amounts",
    topic: "Prices and fees",
    status: "limited",
    answer:
      "Prices are not published. You pay a one-time setup fee plus a subscription based on the product, number of branches and users; the team sends a written quote after a short call. No hidden AMC charges.",
    evidence: [
      { file: "app/(marketing)/page.jsx", quote: "No prices are published on the site" },
      { file: "components/home/PricingSection.jsx", quote: "No hidden AMC charges" }
    ]
  },
  {
    id: "data_location",
    topic: "Where data is hosted",
    status: "unverified",
    answer: "I can't say which country the data is kept in. Hosting details are shared on request.",
    evidence: [{ file: "lib/site-content.js", quote: "We share hosting details on request" }]
  },
  {
    id: "offline_use",
    topic: "Working offline",
    status: "unverified",
    answer: "I can't confirm offline use; the products run in a web browser with an internet connection.",
    evidence: []
  }
];

const STATUS_LABEL = {
  confirmed: "AVAILABLE",
  limited: "PARTLY / ONLY THE PRODUCTS NAMED / BY OUR TEAM",
  coming_soon: "COMING SOON (no date)",
  unsupported: "NOT OFFERED",
  unverified: "CAN'T CONFIRM"
};

/** The registry as prompt text, grouped by status so the model keeps them apart. */
export function capabilitiesForPrompt() {
  return CAPABILITY_STATUSES.map((status) => {
    const rows = CAPABILITIES.filter((c) => c.status === status).map((c) => `- [${c.id}] ${c.topic}: ${c.answer}`);
    return `### ${STATUS_LABEL[status]}\n${rows.join("\n")}`;
  }).join("\n\n");
}

/**
 * Simple keyword lookup over the registry: the entries whose id or topic share the most words with
 * the question. Used by tests and available to callers; the assistant itself sees the whole registry.
 */
export function findCapabilities(question, limit = 3) {
  const words = new Set(String(question).toLowerCase().match(/[a-z0-9-]{3,}/g) ?? []);
  return CAPABILITIES.map((c) => {
    const text = `${c.id.replace(/_/g, " ")} ${c.topic}`.toLowerCase();
    let score = 0;
    for (const w of words) if (text.includes(w)) score += 1;
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}
