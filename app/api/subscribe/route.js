// app/api/subscribe/route.js
// Public newsletter subscription endpoint.
// Kept separate from /api/leads so subscribers never enter the sales lead queue.

import { NextResponse } from "next/server";
import { insertSubscriber } from "@/lib/supabase";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 5 subscription attempts per IP per 10 minutes.
const subscribeLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    // Honeypot field, hidden from real users.
    if (typeof body?.company_website === "string" && body.company_website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const rate = subscribeLimiter.hit(getClientIp(request));
    if (rate.limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Please try again in ${retryAfterMinutes(rate.retryAfterMs)} minute(s).`
        },
        { status: 429 }
      );
    }

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await insertSubscriber(email);

    return NextResponse.json(
      { success: true, message: "Subscribed to the monthly operations briefing." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API Subscribe Error]:", err);
    return NextResponse.json(
      { success: false, error: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
