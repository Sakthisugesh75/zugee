// app/api/leads/route.js
// Public lead submission endpoint.
// Server-side only: writes to Supabase using the service_role key.

import { NextResponse } from "next/server";
import { insertLead } from "@/lib/supabase";
import { BUSINESS_TYPES } from "@/lib/products";
import { createRateLimiter, getClientIp, retryAfterMinutes } from "@/lib/rate-limit";
import { sendLeadNotificationEmail, sendLeadConfirmationEmail } from "@/lib/email";

const ALLOWED_INDUSTRIES = new Set(BUSINESS_TYPES.map((b) => b.id));
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,24}$/;

const LIMITS = { name: 120, email: 254, phone: 25, company: 160, message: 2000 };

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

    // Mobile / WhatsApp is the main way the team follows up, so it is required; email is optional.
    const phone = optionalString(body.phone, LIMITS.phone);
    if (!phone || !PHONE_PATTERN.test(phone)) {
      return badRequest("Please enter a valid mobile or WhatsApp number.");
    }

    const industry = typeof body.industry === "string" ? body.industry.trim() : "";
    if (!ALLOWED_INDUSTRIES.has(industry)) {
      return badRequest("Please choose your business type.");
    }

    const email = optionalString(body.email, LIMITS.email);
    if (email === undefined || (email && !EMAIL_PATTERN.test(email))) {
      return badRequest("Please check your email address, or leave it blank.");
    }

    const company = optionalString(body.company, LIMITS.company);
    if (company === undefined) {
      return badRequest(`Company name must be under ${LIMITS.company} characters.`);
    }

    const message = optionalString(body.message, LIMITS.message);
    if (message === undefined) {
      return badRequest(`Message must be under ${LIMITS.message} characters.`);
    }

    const savedLead = await insertLead({
      name,
      phone,
      email: email ? email.toLowerCase() : null,
      company_name: company,
      industry,
      message,
      source_page: "homepage-contact"
    });

    // Send demo alert email to sugeshwebdevops@gmail.com and confirmation email to the lead
    try {
      await sendLeadNotificationEmail(savedLead);
      if (savedLead.email) {
        await sendLeadConfirmationEmail(savedLead);
      }
    } catch (emailErr) {
      // Log without breaking lead submission
      console.error("[Email Notification Error]:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        reference_id: savedLead.reference_id,
        message: "Thanks. Our team will contact you on the number you gave to arrange a demo."
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API Leads Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't save your details. Please try again in a few minutes."
      },
      { status: 500 }
    );
  }
}
