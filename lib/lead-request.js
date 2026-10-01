// lib/lead-request.js
// What a visitor is asking for on the demo form: a product demo or a pricing call.
// Stored in leads.request_type (supabase/migrations/0002_leads_request_type.sql).
// Safe to import from client components (no secrets, no prices).

export const REQUEST_TYPES = [
  { id: "demo", label: "Product demo" },
  { id: "pricing_call", label: "Pricing call" }
];

export const DEFAULT_REQUEST_TYPE = "demo";

export function isRequestType(value) {
  return REQUEST_TYPES.some((t) => t.id === value);
}

export function requestTypeLabel(id) {
  return REQUEST_TYPES.find((t) => t.id === id)?.label || id;
}

/** A lead's request type. Rows without a valid value count as a demo. */
export function leadRequestType(lead) {
  return isRequestType(lead?.request_type) ? lead.request_type : DEFAULT_REQUEST_TYPE;
}
