// app/api/app/dashboard/route.js
// API route to fetch dashboard metrics and insights

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/app-auth';
import { createBrowserClient } from '@/lib/app-auth';

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

    // Fetch today's leads count
    const { count: leadsToday, error: leadsError } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', userId)
      .gte('created_at', new Date().toISOString().split('T')[0]);

    // Fetch month-to-date revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('total_amount, cgst_amount, sgst_amount, igst_amount, payment_status')
      .eq('customer_id', userId)
      .gte('invoice_date', startOfMonth.toISOString().split('T')[0])
      .in('payment_status', ['paid', 'partial']);

    const revenue = invoices?.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0) || 0;
    const gstCollected = invoices?.reduce((sum, inv) => {
      return sum + parseFloat(inv.cgst_amount || 0) + parseFloat(inv.sgst_amount || 0) + parseFloat(inv.igst_amount || 0);
    }, 0) || 0;

    // Fetch month-to-date ad spend
    const { data: campaigns, error: campaignsError } = await supabase
      .from('ad_campaigns')
      .select('ad_spend, leads_count')
      .eq('customer_id', userId)
      .eq('status', 'active')
      .gte('last_synced_at', startOfMonth.toISOString());

    const adSpend = campaigns?.reduce((sum, camp) => sum + parseFloat(camp.ad_spend || 0), 0) || 0;
    const adLeads = campaigns?.reduce((sum, camp) => sum + parseInt(camp.leads_count || 0, 10), 0) || 0;

    // Calculate ROI
    const roi = adSpend > 0 ? (revenue / adSpend) : 0;

    // Fetch pending follow-ups (leads with next_follow_up_at in next 24 hours or overdue)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const { count: pendingFollowUps, error: followUpsError } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', userId)
      .in('status', ['hot', 'follow_up'])
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', tomorrow.toISOString());

    // Count high priority pending follow-ups
    const { count: highPriorityFollowUps } = await supabase
      .from('crm_leads')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', userId)
      .eq('priority', 'high')
      .in('status', ['hot', 'follow_up'])
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', tomorrow.toISOString());

    // Fetch AI insights (non-dismissed, ordered by severity and created_at)
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('customer_id', userId)
      .eq('is_dismissed', false)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate trends (compare with previous period - simplified for now)
    // In production, this would compare current period vs previous period
    const trends = {
      leads: { value: '+12%', direction: 'up' },
      revenue: { value: '+8%', direction: 'up' },
      adSpend: { value: '+5%', direction: 'up' },
      followUps: { value: '-3%', direction: 'down' }
    };

    // Prepare KPI data
    const kpis = {
      leadsToday: {
        value: leadsToday || 0,
        subtitle: adLeads > 0 ? `${adLeads} from ads` : 'Direct & organic',
        trend: trends.leads.direction,
        trendValue: trends.leads.value
      },
      revenue: {
        value: revenue,
        formatted: `₹${(revenue / 100000).toFixed(2)}L`,
        subtitle: `GST Collected: ₹${(gstCollected / 1000).toFixed(1)}K`,
        trend: trends.revenue.direction,
        trendValue: trends.revenue.value
      },
      adSpend: {
        value: adSpend,
        formatted: `₹${(adSpend / 1000).toFixed(1)}K`,
        subtitle: `ROI: ${roi.toFixed(1)}x`,
        trend: trends.adSpend.direction,
        trendValue: trends.adSpend.value
      },
      pendingFollowUps: {
        value: pendingFollowUps || 0,
        subtitle: `${highPriorityFollowUps || 0} High Priority`,
        trend: trends.followUps.direction,
        trendValue: trends.followUps.value
      }
    };

    return NextResponse.json({
      success: true,
      kpis,
      insights: insights || [],
      profile: {
        business_name: profile.business_name,
        plan_tier: profile.plan_tier,
        subscription_status: profile.subscription_status
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
