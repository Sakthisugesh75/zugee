// app/api/admin/subscriptions/[id]/route.js
// Protected admin actions on one subscription (PATCH), and its payment history (GET).
// Payments recorded here are ones the team already collected (UPI / bank transfer). There is no
// payment gateway yet (Razorpay is Phase 6), so nothing here moves money.
//
// PATCH body: { action, ... }
//   record_setup_payment   { method, reference? }  one-time setup fee, only while pending
//   waive_setup_fee        { reason }              only while pending
//   record_monthly_payment { method, reference? }  monthly price only, never the setup fee
//   set_status             { status }

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { SETUP_WAIVER_REASONS } from "@/lib/pricing";
import {
  PAYMENT_METHODS,
  SUBSCRIPTION_STATUSES,
  SubscriptionError,
  getSubscription,
  isUuid,
  recordMonthlyPayment,
  recordSetupPayment,
  setSubscriptionStatus,
  waiveSetupFee
} from "@/lib/subscriptions";

const writeLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 60 });
const ACTIONS = ["record_setup_payment", "waive_setup_fee", "record_monthly_payment", "set_status"];
// The admin portal has a single shared password, so there is no individual identity to record yet.
const RECORDED_BY = "admin";

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

function readPayment(body) {
  const { method, reference } = body;
  if (typeof method !== "string" || !Object.prototype.hasOwnProperty.call(PAYMENT_METHODS, method)) {
    return { error: "Choose how the payment was received." };
  }
  if (reference !== undefined && reference !== null && (typeof reference !== "string" || reference.length > 120)) {
    return { error: "Payment reference must be at most 120 characters." };
  }
  return { payment: { method, reference: reference || null, recordedBy: RECORDED_BY } };
}

export async function GET(request, ctx) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    const { id } = await ctx.params;
    if (!isUuid(id)) return NextResponse.json({ success: false, error: "Subscription not found." }, { status: 404 });

    const subscription = await getSubscription(id);
    return NextResponse.json({ success: true, subscription }, { status: 200 });
  } catch (err) {
    if (err instanceof SubscriptionError) return subscriptionErrorResponse(err);
    console.error("[Admin Subscription GET Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to retrieve subscription." }, { status: 500 });
  }
}

export async function PATCH(request, ctx) {
  try {
    if (!isAdminRequest(request)) return unauthorized();
    if (writeLimiter.hit(getClientIp(request)).limited) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const { id } = await ctx.params;
    if (!isUuid(id)) return NextResponse.json({ success: false, error: "Subscription not found." }, { status: 404 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) return badRequest("Invalid request body.");
    if (!ACTIONS.includes(body.action)) return badRequest("Unknown action.");

    let subscription;
    switch (body.action) {
      case "record_setup_payment":
      case "record_monthly_payment": {
        const { payment, error } = readPayment(body);
        if (error) return badRequest(error);
        subscription =
          body.action === "record_setup_payment"
            ? await recordSetupPayment(id, payment)
            : await recordMonthlyPayment(id, payment);
        break;
      }
      case "waive_setup_fee": {
        const reason = body.reason;
        if (typeof reason !== "string" || !Object.prototype.hasOwnProperty.call(SETUP_WAIVER_REASONS, reason)) {
          return badRequest("Choose a valid reason for waiving the setup fee.");
        }
        subscription = await waiveSetupFee(id, { reason, waivedBy: RECORDED_BY });
        break;
      }
      case "set_status": {
        if (typeof body.status !== "string" || !SUBSCRIPTION_STATUSES.includes(body.status)) {
          return badRequest("Invalid subscription status.");
        }
        subscription = await setSubscriptionStatus(id, body.status);
        break;
      }
    }

    return NextResponse.json({ success: true, subscription }, { status: 200 });
  } catch (err) {
    if (err instanceof SubscriptionError) return subscriptionErrorResponse(err);
    console.error("[Admin Subscription PATCH Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to update subscription." }, { status: 500 });
  }
}
