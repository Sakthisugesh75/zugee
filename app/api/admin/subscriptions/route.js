// app/api/admin/subscriptions/route.js
// Protected admin subscriptions endpoint: GET (list) and POST (create).
// Requires a valid httpOnly admin session cookie. Prices always come from lib/pricing.js on the
// server — a request that tries to send a price is rejected.

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { SETUP_WAIVER_REASONS } from "@/lib/pricing";
import { SUBSCRIPTION_STATUSES, SubscriptionError, createSubscription, listSubscriptions } from "@/lib/subscriptions";

const writeLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 60 });

// Fields the client may send. Everything else is ignored; price fields are refused outright.
const TEXT_FIELDS = { business_name: 200, contact_phone: 25, contact_email: 254, product_slug: 60, plan_key: 40, notes: 1000 };
const FORBIDDEN_FIELDS = ["monthly_price", "setup_fee", "setup_discount", "setup_fee_status", "subscription_status", "amount"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized. Valid administrator session required." },
    { status: 401 }
  );
}

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

function subscriptionErrorResponse(err) {
  const status = { invalid: 400, not_found: 404, conflict: 409 }[err.code] || 400;
  return NextResponse.json({ success: false, error: err.message }, { status });
}

export async function GET(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const search = (searchParams.get("search") || "").slice(0, 100);

    if (status !== "all" && !SUBSCRIPTION_STATUSES.includes(status)) {
      return badRequest("Invalid status filter.");
    }

    const subscriptions = await listSubscriptions({ status, search });
    return NextResponse.json({ success: true, subscriptions }, { status: 200 });
  } catch (err) {
    if (err instanceof SubscriptionError) return subscriptionErrorResponse(err);
    console.error("[Admin Subscriptions GET Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to retrieve subscriptions." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    if (writeLimiter.hit(getClientIp(request)).limited) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) return badRequest("Invalid request body.");
    if (FORBIDDEN_FIELDS.some((f) => f in body)) {
      return badRequest("Prices and statuses are set by the server and cannot be sent.");
    }

    const input = {};
    for (const [field, max] of Object.entries(TEXT_FIELDS)) {
      const value = body[field];
      if (value === undefined || value === null || value === "") continue;
      if (typeof value !== "string" || value.length > max) return badRequest(`Invalid ${field.replace(/_/g, " ")}.`);
      input[field] = value;
    }
    if (!input.business_name || !input.product_slug || !input.plan_key) {
      return badRequest("Business name, product and plan are required.");
    }

    for (const field of ["lead_id", "customer_id"]) {
      const value = body[field];
      if (value === undefined || value === null || value === "") continue;
      if (typeof value !== "string" || !UUID_PATTERN.test(value)) return badRequest(`Invalid ${field.replace(/_/g, " ")}.`);
      input[field] = value;
    }

    const waiveReason = body.waive_reason;
    if (waiveReason !== undefined && waiveReason !== null && waiveReason !== "") {
      if (typeof waiveReason !== "string" || !Object.prototype.hasOwnProperty.call(SETUP_WAIVER_REASONS, waiveReason)) {
        return badRequest("Invalid waiver reason.");
      }
      input.waive = { reason: waiveReason, waivedBy: "admin" };
    }

    const subscription = await createSubscription(input);
    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (err) {
    if (err instanceof SubscriptionError) return subscriptionErrorResponse(err);
    console.error("[Admin Subscriptions POST Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to create subscription." }, { status: 500 });
  }
}
