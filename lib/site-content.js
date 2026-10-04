// lib/site-content.js
// Marketing copy that isn't product-specific. Rendered on the page AND emitted as JSON-LD, so the
// two can never drift apart.
//
// Claim rule: every sentence must pass "can the product (or our team) actually do this today?".
// If not, remove it or say "coming soon". No statistics, customer names or timelines we can't prove.
//
// Standing rules for this file (enforced by tests/site-content.test.mjs):
// - No shared login ACROSS products. Each product is one system with one login for its own
//   industry; two products run separately with their own data. The only approved wording is the
//   "Can I use more than one ZUGEE product?" answer below.
// - No prices. Pricing is quoted on a call, so no amount may appear here or in the JSON-LD.
// - No claim about which country data is kept in until that has been verified.
// - No claim that data is copied for safekeeping until that has been verified.

import { availableProducts } from "./products.js";

/** "A, B and C". */
function listNames(names) {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

// "Why ZUGEE" points (founder, 2026-10-04). Rules, enforced by tests/site-content.test.mjs:
// - Tally: ZUGEE works ALONGSIDE it. Never "sync", "integration" or "replace".
// - Price: the exact Terms wording, "fixed for the life of your subscription".
// - Custom work: "we build" — never imply GST invoicing or custom modules are already included.
export const WHY_ZUGEE = [
  {
    key: "tally",
    title: "Works alongside Tally",
    body: "Your chartered accountant can keep using Tally for statutory filings and audits. ZUGEE runs your daily operations alongside it."
  },
  {
    key: "price",
    title: "Your monthly price is fixed for the life of your subscription",
    body: "We record your monthly price when you buy, and we will never raise it."
  },
  {
    key: "setup",
    title: "Set up for you by our team",
    body: "We configure your business profile, users, branches and workflows, bring in your existing customer and item lists, and walk your staff through the software."
  },
  {
    key: "custom",
    title: "Built around your business",
    body: "Need GST invoicing, a custom report or your own workflow? We build modules to fit how you work."
  }
];

// Sales run through a demo meeting (founder, 2026-09-25).
// Steps follow the setup work listed in the Terms of Service.
export const HOW_WE_WORK = [
  {
    title: "Demo",
    body: "Tell us about your business. We arrange a meeting and show you the ZUGEE product for your industry, using your own examples."
  },
  {
    title: "Setup",
    body: "We configure your business profile, users, branches and workflows, and bring in your existing customer and item lists from Excel or Tally."
  },
  {
    title: "Go-live",
    body: "We walk your staff through the software and support you through your first days of live use."
  },
  {
    title: "Support",
    body: "Email our team Monday to Saturday, 10am to 6pm IST. We aim to reply within one business day."
  }
];

// The only setup timeline the site may state (Terms wording). Never a stronger version.
export const SETUP_TIMELINE = "Setup typically takes about 14 days. This is a target, not a guarantee.";

export const FAQ_ITEMS = [
  {
    question: "Which ZUGEE products can I use today?",
    // Built from the catalog, so it always names exactly the products in the industry grid.
    answer: `Available today: ${listNames(availableProducts().map((p) => p.name))}. More industries are on the way — tell us yours and we'll let you know.`
  },
  {
    question: "Can I use more than one ZUGEE product?",
    answer:
      "Each ZUGEE product is a complete system for its industry, in one login. If you run two different businesses, each product runs separately with its own data."
  },
  {
    question: "What is the one-time setup fee?",
    answer:
      "It covers setting up ZUGEE around your business: your business profile, users, branches, workflows and first data, plus a walkthrough and onboarding support. You pay it once, when you start. The amount depends on the product and how much setup your business needs, and we share the exact figure on a short pricing call."
  },
  {
    question: "Do I pay the setup fee again every month?",
    answer:
      "No. The setup fee is charged once per product. After that you only pay the subscription for that product, which depends on the product, the number of users and the number of branches. We confirm your exact pricing on the call, before you decide."
  },
  {
    question: "My industry isn't listed. Can ZUGEE still help?",
    answer:
      "Choose \"Something else\" in the form and tell us what you need. We will tell you honestly whether one of our products fits."
  },
  {
    question: "Can I still use Tally alongside ZUGEE?",
    answer:
      "Yes. ZUGEE handles your daily operations, billing and customer management. Your chartered accountant can continue using Tally for statutory filings and audits. We can export the data your accountant needs in a format they can work with."
  },
  {
    question: "Where is my business data stored?",
    answer:
      "Your business data is stored securely and can be accessed only by the authorised users in your organisation. We share hosting details on request; just ask us on your demo call."
  },
  {
    question: "Does ZUGEE support WhatsApp notifications?",
    answer:
      "WhatsApp Cloud API integration is currently rolling out. Once live, ZUGEE will send invoices, payment reminders, booking confirmations and dispatch alerts directly to your customers on WhatsApp. This feature is actively being built but not yet available. Book a demo and we will share the latest timeline."
  }
];
