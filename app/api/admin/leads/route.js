// app/api/admin/leads/route.js
// Protected admin leads endpoint: GET (list & stats) and PATCH (status update).
// Requires a valid httpOnly admin session cookie.

import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { LEAD_STATUSES, getLeadsList, getLeadsStats, updateLeadStatus } from "@/lib/supabase";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized. Valid administrator session required." },
    { status: 401 }
  );
}

export async function GET(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "25", 10);
    const status = searchParams.get("status") || "all";
    const industry = searchParams.get("industry") || "all";
    const search = searchParams.get("search") || "";
    const includeStats = searchParams.get("stats") !== "0";

    if (status !== "all" && !LEAD_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status filter." }, { status: 400 });
    }

    const [listResult, statsResult] = await Promise.all([
      getLeadsList({ page, limit, status, industry, search }),
      includeStats ? getLeadsStats() : null
    ]);

    return NextResponse.json(
      {
        success: true,
        ...listResult,
        ...(statsResult ? { stats: statsResult } : {})
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Admin Leads GET Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve leads list." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    if (!isAdminRequest(request)) return unauthorized();

    const body = await request.json().catch(() => null);
    const id = body?.id;
    const status = body?.status;

    if (typeof id !== "string" || !UUID_PATTERN.test(id) || typeof status !== "string") {
      return NextResponse.json(
        { success: false, error: "Lead ID and target status are required." },
        { status: 400 }
      );
    }
    if (!LEAD_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid lead status." }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Lead status successfully updated to ${status}.`,
        lead: updated
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Admin Leads PATCH Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update lead status." },
      { status: 500 }
    );
  }
}
