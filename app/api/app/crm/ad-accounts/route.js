// app/api/app/crm/ad-accounts/route.js
// API routes for ad account connections

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/app-auth';
import { createBrowserClient } from '@/lib/app-auth';

// GET - Fetch connected ad accounts
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

    const { data: accounts, error } = await supabase
      .from('ad_accounts')
      .select('id, platform, account_name, is_active, last_sync_at, sync_status, created_at')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch ad accounts error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ad accounts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accounts: accounts || []
    });

  } catch (error) {
    console.error('Ad accounts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Initiate OAuth connection (returns OAuth URL)
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { userId } = auth;
    const body = await request.json();
    const { platform } = body;

    if (!platform || !['meta_ads', 'google_ads'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Generate OAuth URL with proper configuration
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    let oauthUrl = '';

    if (platform === 'meta_ads') {
      // Meta Ads OAuth URL
      const clientId = process.env.META_APP_ID;
      if (!clientId) {
        return NextResponse.json(
          { error: 'Meta Ads OAuth is not configured. Please contact administrator.' },
          { status: 503 }
        );
      }

      const redirectUri = `${baseUrl}/api/app/oauth/meta`;
      const scopes = 'ads_read,ads_management,leads_retrieval';
      const state = userId; // Pass customer ID in state for callback

      oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}&response_type=code`;

    } else if (platform === 'google_ads') {
      // Google Ads OAuth URL
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return NextResponse.json(
          { error: 'Google Ads OAuth is not configured. Please contact administrator.' },
          { status: 503 }
        );
      }

      const redirectUri = `${baseUrl}/api/app/oauth/google`;
      const scopes = 'https://www.googleapis.com/auth/adwords';
      const state = userId; // Pass customer ID in state for callback

      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${state}`;
    }

    return NextResponse.json({
      success: true,
      oauthUrl
    });

  } catch (error) {
    console.error('Ad accounts POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Disconnect an ad account
export async function DELETE(request) {
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
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('ad_accounts')
      .delete()
      .eq('id', accountId)
      .eq('customer_id', userId);

    if (error) {
      console.error('Delete ad account error:', error);
      return NextResponse.json(
        { error: 'Failed to delete ad account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ad account disconnected'
    });

  } catch (error) {
    console.error('Ad accounts DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
