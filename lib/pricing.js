// lib/pricing.js
// Single source of truth for ZUGEE plans: monthly price + one-time Setup & Onboarding fee.
// The pricing page, the first-payment summaries, the admin subscription tools and the customer
// billing page all read from here. Never hardcode a price anywhere else.
//
// Business rule: the setup fee is ONE-TIME (once per business per product); the subscription is
// RECURRING at the monthly price. Amounts are whole rupees and exclude GST.
//
// When a subscription is created, its prices are copied onto the subscription row
// (supabase/migrations/0001_subscriptions_setup_fee.sql). Changing a number here therefore only
// affects NEW subscriptions — existing customers keep what they signed up for.

export const PLANS = [
  {
    key: "starter",
    name: "Starter",
    monthlyPrice: 1999,
    setupFee: 4999,
    billingCycle: "monthly",
    maxUsers: 5,
    maxBranches: 1,
    audience: "For small businesses getting started with ZUGEE.",
    features: ["1 branch", "Up to 5 users", "Core business management", "Customer management", "Basic reports", "Basic support"],
    setupIncludes: [
      "Business profile configuration",
      "Basic GST and business settings",
      "Initial user setup",
      "Branch configuration",
      "Help setting up your first customers and products",
      "Basic data import",
      "Initial system configuration",
      "Product walkthrough",
      "Basic onboarding support"
    ]
  },
  {
    key: "growth",
    name: "Growth",
    monthlyPrice: 4099,
    setupFee: 9999,
    billingCycle: "monthly",
    maxUsers: 20,
    maxBranches: null, // multiple branches
    featured: true,
    audience: "For growing businesses with multiple teams or branches.",
    features: [
      "Multiple branches",
      "Up to 20 users",
      "Role-based permissions",
      "Automated follow-ups",
      "Advanced reports",
      "Business configuration"
    ],
    // WhatsApp configuration assistance is deliberately NOT listed: no ZUGEE product has a working
    // WhatsApp integration yet. Add it here only once one does.
    setupIncludes: [
      "Everything in Starter setup",
      "Multi-branch configuration",
      "Multiple user setup",
      "Role and permission configuration",
      "Help migrating your existing data",
      "Workflow configuration",
      "Admin training",
      "Business-specific onboarding",
      "Advanced configuration support"
    ]
  }
];

// Product-specific overrides. Any field of a plan (setupFee, monthlyPrice, setupIncludes…) can be
// overridden per product, e.g.
//   transposs: { growth: { setupFee: 14999 } }
// Empty today: every product uses the default plans above.
const PRODUCT_PLAN_OVERRIDES = {};

// What the setup work covers for a specific product, shown alongside the plan's setupIncludes.
// TODO(founder): confirm each list matches what your team actually does during onboarding.
export const PRODUCT_SETUP_FOCUS = {
  "tours-travels": ["Travel business configuration", "Package configuration", "Vendor setup", "Currency setup", "Booking workflow"],
  transposs: ["Fleet configuration", "Vehicle setup", "Driver setup", "Trip settings"],
  resort: ["Property configuration", "Room setup", "Booking settings", "Payment configuration"]
};

// Reasons an authorised admin may waive the setup fee. `existing_customer` is used by the migration
// so customers who signed up before the setup fee existed are never charged it.
export const SETUP_WAIVER_REASONS = {
  early_customer: "Early customer",
  promotional_offer: "Promotional offer",
  partner_referral: "Partner referral",
  enterprise_deal: "Enterprise deal",
  manual_admin_waiver: "Manual admin waiver",
  existing_customer: "Existing customer (before setup fee)"
};

export const SETUP_FEE_STATUSES = ["pending", "paid", "waived", "refunded"];

export function getPlan(planKey, productSlug = null) {
  const base = PLANS.find((p) => p.key === planKey);
  if (!base) return null;
  const override = productSlug ? PRODUCT_PLAN_OVERRIDES[productSlug]?.[planKey] : null;
  return override ? { ...base, ...override } : base;
}

/**
 * What the customer pays. `setupFeeStatus` decides whether the setup fee is still due:
 * - pending  → due with the first payment
 * - paid / waived / refunded → never due again (renewals are the monthly price only)
 * `setupDiscount` is the waived amount (0..setupFee).
 */
export function calculateCharges({ monthlyPrice, setupFee, setupFeeStatus = "pending", setupDiscount = 0 }) {
  assertAmount(monthlyPrice, "monthlyPrice");
  assertAmount(setupFee, "setupFee");
  assertAmount(setupDiscount, "setupDiscount");
  if (!SETUP_FEE_STATUSES.includes(setupFeeStatus)) {
    throw new Error(`Unknown setup fee status: ${setupFeeStatus}`);
  }

  const discount = Math.min(setupDiscount, setupFee);
  const setupPayable = setupFeeStatus === "pending" ? setupFee - discount : 0;

  return {
    monthlyPrice,
    setupFee,
    setupDiscount: discount,
    setupPayable,
    firstPayment: monthlyPrice + setupPayable,
    recurringPayment: monthlyPrice
  };
}

/** Charges for a brand-new subscription to `planKey` (setup fee due unless waived). */
export function newSubscriptionCharges(planKey, productSlug = null, { waived = false } = {}) {
  const plan = getPlan(planKey, productSlug);
  if (!plan) throw new Error(`Unknown plan: ${planKey}`);
  return calculateCharges({
    monthlyPrice: plan.monthlyPrice,
    setupFee: plan.setupFee,
    setupFeeStatus: waived ? "waived" : "pending",
    setupDiscount: waived ? plan.setupFee : 0
  });
}

export function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function assertAmount(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative whole number of rupees`);
  }
}
