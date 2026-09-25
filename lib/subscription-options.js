// lib/subscription-options.js
// Client-safe constants for subscriptions (no server imports). lib/subscriptions.js re-exports them;
// the admin UI imports them from here so the service-role data layer never reaches the browser.

export const SUBSCRIPTION_STATUSES = ["pending", "active", "past_due", "cancelled"];

export const SUBSCRIPTION_STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
  past_due: "Past due",
  cancelled: "Cancelled"
};

export const SETUP_STATUS_LABELS = {
  pending: "Pending",
  paid: "Completed",
  waived: "Waived",
  refunded: "Refunded"
};

// How the team received a manually recorded payment. There is no payment gateway yet (Phase 6).
export const PAYMENT_METHODS = {
  upi: "UPI",
  bank_transfer: "Bank transfer",
  cash: "Cash",
  cheque: "Cheque",
  card: "Card (offline)",
  other: "Other"
};
