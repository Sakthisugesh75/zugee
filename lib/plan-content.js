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

export const PRICING_SCOPE_CALL =
  "10-minute scope call to check your branches & staff count — receive a clear written quote on WhatsApp/Email the same day.";

export const PRICING_MODEL =
  "You pay a one-time setup fee (covering data migration from Excel/Tally, workflow mapping, and staff training) plus a simple subscription based on your product, branches, and user count. No hidden AMC charges and 1-click data export anytime.";
