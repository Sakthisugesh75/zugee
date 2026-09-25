// app/api/leads/route.js
// Public lead submission endpoint.
// Server-side only: writes to Supabase using the service_role key.

import { NextResponse } from "next/server";
import { insertLead } from "@/lib/supabase";
import { VERTICALS } from "@/lib/verticals";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";

const ALLOWED_INDUSTRIES = new Set([...VERTICALS.map((v) => v.id), "other"]);
const ALLOWED_SOURCES = new Set(["homepage-contact", "fit-quiz", "pricing-estimator"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,24}$/;

const LIMITS = { name: 120, email: 254, phone: 25, goal: 300, message: 2000 };

// 5 submissions per IP per 10 minutes.
const submissionLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

/**
 * Returns a trimmed string, null when empty/absent, or undefined when the value is invalid.
 */
function optionalString(value, maxLength) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length <= maxLength ? trimmed : undefined;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return badRequest("Invalid request body.");
    }

    // Honeypot: real users never see or fill the `company_website` field.
    if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
      return NextResponse.json({ success: true, reference_id: null }, { status: 202 });
    }

    const ip = getClientIp(request);
    const rate = submissionLimiter.hit(ip);
    if (rate.limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please try again in ${retryAfterMinutes(rate.retryAfterMs)} minute(s).`
        },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) } }
      );
    }

    const name = optionalString(body.name, LIMITS.name);
    if (!name || name.length < 2) {
      return badRequest("Please provide a valid full name.");
    }

    const email = optionalString(body.email, LIMITS.email);
    if (!email || !EMAIL_PATTERN.test(email)) {
      return badRequest("Please provide a valid corporate or official email address.");
    }

    const industry = typeof body.industry === "string" ? body.industry.trim() : "";
    if (!ALLOWED_INDUSTRIES.has(industry)) {
      return badRequest("Please select your primary operating industry.");
    }

    const phone = optionalString(body.phone, LIMITS.phone);
    if (phone === undefined || (phone && !PHONE_PATTERN.test(phone))) {
      return badRequest("Please provide a valid phone number or leave it blank.");
    }

    const goal = optionalString(body.goal, LIMITS.goal);
    if (goal === undefined) {
      return badRequest(`Operational goals must be under ${LIMITS.goal} characters.`);
    }

    const message = optionalString(body.message, LIMITS.message);
    if (message === undefined) {
      return badRequest(`Message must be under ${LIMITS.message} characters.`);
    }

    const sourcePage = ALLOWED_SOURCES.has(body.source_page) ? body.source_page : "homepage-contact";

    const savedLead = await insertLead({
      name,
      email: email.toLowerCase(),
      phone,
      industry,
      goal,
      message,
      source_page: sourcePage
    });

    return NextResponse.json(
      {
        success: true,
        reference_id: savedLead.reference_id,
        message: "Your inquiry has been recorded. Our solutions engineer will contact you within one business day."
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API Leads Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to record inquiry. Please try again or reach out to support@zugee.com directly."
      },
      { status: 500 }
    );
  }
}
