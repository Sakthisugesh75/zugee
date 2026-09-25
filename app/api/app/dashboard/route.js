// app/api/app/dashboard/route.js
// API route for dashboard metrics.
// Every number here is a count of the customer's own crm_leads rows.
// No trends, no estimates: we only show what the database actually contains.

import { NextResponse } from 'next/server';
import { requireAuth, createBrowserClient } from '@/lib/app-auth';

// India does not observe DST, so a fixed +05:30 offset is exact for IST.
const IST_OFFSET_MINUTES = 330;

// Returns the UTC instants for the start and end of "today" in IST
function getTodayBoundsIST(now = new Date()) {
  const offsetMs = IST_OFFSET_MINUTES * 60 * 1000;
  const istNow = new Date(now.getTime() + offsetMs);
  const startUtcMs = Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()) - offsetMs;
  return {
    start: new Date(startUtcMs).toISOString(),
    end: new Date(startUtcMs + 24 * 60 * 60 * 1000 - 1).toISOString()
  };
}

export async function GET(request) {
  try {
    // Authenticate the request
    const auth = await requireAuth(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { userId, profile } = auth;
    const supabase = createBrowserClient();
    const today = getTodayBoundsIST();

    const countLeads = () => supabase
      .from('crm_leads')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', userId);

    const [totalRes, todayRes, followUpsRes, convertedRes] = await Promise.all([
      // All leads
      countLeads(),

      // Leads created today (IST)
      countLeads().gte('created_at', today.start),

      // Follow-ups due today or overdue, on leads that are still open
      countLeads()
        .not('status', 'in', '(converted,lost)')
        .not('next_follow_up_at', 'is', null)
        .lte('next_follow_up_at', today.end),

      // Leads marked converted
      countLeads().eq('status', 'converted')
    ]);

    const failed = [totalRes, todayRes, followUpsRes, convertedRes].find((r) => r.error);
    if (failed) {
      console.error('Dashboard query error:', failed.error);
      return NextResponse.json(
        { error: 'Failed to load dashboard metrics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      kpis: {
        totalLeads: totalRes.count || 0,
        leadsToday: todayRes.count || 0,
        followUpsDue: followUpsRes.count || 0,
        converted: convertedRes.count || 0
      },
      profile: {
        business_name: profile.business_name
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
