// lib/site-content.js
// Marketing copy that isn't product-specific. Rendered on the page AND emitted as JSON-LD, so the
// two can never drift apart.
//
// Claim rule: every sentence must pass "can the product (or our team) actually do this today?".
// If not, remove it or say "coming soon". No statistics, customer names or timelines we can't prove.
//
// Standing rules for this file (enforced by tests/site-content.test.mjs):
// - No shared login. Each ZUGEE product has its own login, database and codebase.
// - No prices. Pricing is quoted on a call, so no amount may appear here or in the JSON-LD.
// - No claim about which country data is kept in until that has been verified.
// - No claim that data is copied for safekeeping until that has been verified.

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
export const HOW_WE_WORK = [
  {
    title: "Tell us about your business",
    body: "Share your trade, how many people and branches you have, and what you track today."
  },
  {
    title: "See a live demo",
    body: "We arrange a meeting and show you the ZUGEE product built for your industry, using your own examples."
  },
  {
    title: "Get set up",
    body: "We help you configure your account, set up workflows, and bring in your existing customer and item lists."
  },
  {
    title: "Start running your business",
    body: "Launch your operations with full confidence, role-based workflows, and dedicated founder onboarding support."
  }
];

export const FAQ_ITEMS = [
  {
    question: "Which ZUGEE products can I use today?",
    answer:
      "Every product marked Available is ready to use today. Book a demo and we will arrange a meeting to show you the product working before you decide. Products marked Coming Soon are still being built."
  },
  {
    question: "Can I use more than one ZUGEE product?",
    answer:
      "Yes. Each ZUGEE product is separate software with its own login and its own data, built for one kind of business. You can use two or more side by side, and we set up each one for you."
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
