// app/admin/subscriptions/page.jsx
// Admin: subscriptions and the one-time Setup & Onboarding fee.
// Server-side gate: never rendered without a valid admin session cookie.
// Query string (from the lead detail panel) prefills the "New subscription" form:
//   ?lead_id=<uuid>&business_name=…&phone=…&email=…&product=<product slug>

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";
import { PRODUCTS } from "@/lib/products";
import SubscriptionsManager from "@/components/admin/SubscriptionsManager";

export const metadata = {
  title: "Subscriptions | Admin Portal"
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function param(value, max) {
  const text = Array.isArray(value) ? value[0] : value;
  return typeof text === "string" ? text.trim().slice(0, max) : "";
}

export default async function AdminSubscriptionsPage({ searchParams }) {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }

  const query = await searchParams;
  const leadId = param(query.lead_id, 36);
  const product = param(query.product, 60);
  const prefill = {
    lead_id: UUID_PATTERN.test(leadId) ? leadId : "",
    business_name: param(query.business_name, 200),
    contact_phone: param(query.phone, 25),
    contact_email: param(query.email, 254),
    product_slug: PRODUCTS.some((p) => p.slug === product) ? product : ""
  };
  const hasPrefill = Boolean(prefill.lead_id || prefill.business_name);

  return <SubscriptionsManager prefill={hasPrefill ? prefill : null} />;
}
