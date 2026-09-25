// app/api/app/ads/campaigns/route.js
// API route to fetch ad campaigns from connected accounts

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/app-auth';
import { createBrowserClient } from '@/lib/app-auth';

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { userId } = auth;
    const supabase = createBrowserClient();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    // First, get the connected ad accounts
    let accountsQuery = supabase
      .from('ad_accounts')
      .select('id, platform, account_name')
      .eq('customer_id', userId)
      .eq('is_active', true);

    if (platform && platform !== 'all') {
      accountsQuery = accountsQuery.eq('platform', platform);
    }

    const { data: accounts, error: accountsError } = await accountsQuery;

    if (accountsError) {
      console.error('Fetch ad accounts error:', accountsError);
      return NextResponse.json(
        { error: 'Failed to fetch ad accounts' },
        { status: 500 }
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        success: true,
        campaigns: [],
        accounts: [],
        message: 'No ad accounts connected. Connect an ad account in the CRM section.'
      });
    }

    // Get account IDs
    const accountIds = accounts.map(a => a.id);

    // Fetch campaigns for these accounts
    let campaignsQuery = supabase
      .from('ad_campaigns')
      .select('*')
      .eq('customer_id', userId)
      .in('ad_account_id', accountIds)
      .order('last_synced_at', { ascending: false });

    if (status && status !== 'all') {
      campaignsQuery = campaignsQuery.eq('status', status);
    }

    const { data: campaigns, error: campaignsError } = await campaignsQuery;

    if (campaignsError) {
      console.error('Fetch campaigns error:', campaignsError);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    // Calculate summary metrics
    const activeCampaigns = campaigns?.filter(c => c.status === 'active') || [];
    const totalSpend = activeCampaigns.reduce((sum, c) => sum + parseFloat(c.ad_spend || 0), 0);
    const totalLeads = activeCampaigns.reduce((sum, c) => sum + parseInt(c.leads_count || 0, 10), 0);
    const totalConversions = activeCampaigns.reduce((sum, c) => sum + parseInt(c.conversions || 0, 10), 0);
    const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;
    
    // Calculate weighted average ROAS
    let totalRevenue = 0;
    activeCampaigns.forEach(c => {
      if (c.roas && c.ad_spend) {
        totalRevenue += parseFloat(c.roas) * parseFloat(c.ad_spend);
      }
    });
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    const summary = {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: activeCampaigns.length,
      totalSpend: totalSpend,
      totalLeads: totalLeads,
      totalConversions: totalConversions,
      avgCPL: avgCPL,
      avgROAS: avgROAS
    };

    // Enrich campaigns with account info
    const enrichedCampaigns = campaigns?.map(campaign => {
      const account = accounts.find(a => a.id === campaign.ad_account_id);
      return {
        ...campaign,
        account_name: account?.account_name,
        platform: account?.platform
      };
    }) || [];

    return NextResponse.json({
      success: true,
      campaigns: enrichedCampaigns,
      accounts: accounts,
      summary: summary
    });

  } catch (error) {
    console.error('Ads campaigns API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
