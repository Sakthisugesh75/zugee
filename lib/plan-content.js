// lib/plan-content.js
// What each plan includes, as shown in the Pricing section (components/home/PricingSection.jsx) and
// given to the chat assistant. NO PRICES here: amounts live in lib/pricing.js for the admin tools
// only and are never published.
// No JSX and relative imports only, so `node --test` can load this file.

// The headline limits of each plan, shown as a short structured list at the top of each card.
export const PLAN_LIMITS = {
  starter: ["1 Branch", "Up to 5 Staff Logins", "14-Day White-Glove Setup"],
  growth: ["Multiple Branches", "Up to 20 Staff Logins", "Role-Based Mobile Access & Approvals"],
  enterprise: ["Unlimited Branches & Users", "Dedicated Cloud Database", "Custom ERP Integrations"]
};

export const ENTERPRISE_FEATURES = [
  "Unlimited branches & staff accounts",
  "Dedicated cloud database",
  "Custom module development & API webhooks",
  "On-site staff & management training",
  "Priority support — direct founder line, business hours"
];

// The one bullet list on each plan card (homepage #pricing and /pricing): the plan's limits first,
// then what else it includes. Merged from PLAN_LIMITS and the plan's features (lib/pricing.js) /
// ENTERPRISE_FEATURES, which repeated each other ("1 Branch" and "1 branch"). `limits` counts the
// leading items that are the plan's limits; the card shows those in bold.
export const PLAN_INCLUDES = {
  starter: {
    limits: 3,
    items: [
      "1 branch",
      "Up to 5 staff logins",
      "14-day white-glove setup",
      "Core business management",
      "Customer management",
      "Basic reports",
      "Basic support"
    ]
  },
  growth: {
    limits: 3,
    items: [
      "Multiple branches",
      "Up to 20 staff logins",
      "Role-based mobile access & approvals",
      "Automated follow-ups",
      "Advanced reports",
      "Business configuration"
    ]
  },
  enterprise: {
    limits: 2,
    items: [
      "Unlimited branches & staff accounts",
      "Dedicated cloud database",
      "Custom ERP integrations, module development & API webhooks",
      "On-site staff & management training",
      "Priority support — direct founder line, business hours"
    ]
  }
};

export const PRICING_SCOPE_CALL =
  "10-minute scope call to check your branches & staff count — receive a clear written quote on WhatsApp/Email the same day.";

export const PRICING_MODEL =
  "You pay a one-time setup fee (covering data migration from Excel/Tally, workflow mapping, and staff training) plus a simple subscription based on your product, branches, and user count. No hidden AMC charges and 1-click data export anytime.";
