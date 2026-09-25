// app/api/app/oauth/meta/route.js
// Meta Ads OAuth callback handler

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { encryptToken } from '@/lib/oauth-encryption';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Meta OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/app/crm?error=oauth_failed&message=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=No authorization code', request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/app/oauth/meta`,
        code
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Meta token exchange error:', errorData);
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=Token exchange failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Get long-lived token
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${access_token}`
    );

    const longLivedData = await longLivedResponse.json();
    const longLivedToken = longLivedData.access_token || access_token;

    // Get user's ad accounts
    const adAccountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${longLivedToken}`
    );

    const adAccountsData = await adAccountsResponse.json();

    if (!adAccountsData.data || adAccountsData.data.length === 0) {
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=No ad accounts found', request.url)
      );
    }

    // Extract customer_id from state (format: "customer_id")
    const customerId = state;

    if (!customerId) {
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=Invalid state', request.url)
      );
    }

    // Encrypt tokens before storage
    const encryptedAccessToken = encryptToken(longLivedToken);
    const encryptedRefreshToken = tokenData.refresh_token 
      ? encryptToken(tokenData.refresh_token) 
      : null;

    // Store each ad account
    const expiresAt = new Date(Date.now() + (expires_in || 5184000) * 1000); // Default 60 days

    for (const account of adAccountsData.data) {
      await supabase.from('ad_accounts').upsert({
        customer_id: customerId,
        platform: 'meta_ads',
        platform_account_id: account.id,
        account_name: account.name,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: expiresAt.toISOString(),
        is_active: account.account_status === 1,
        sync_status: 'success',
        last_sync_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id,platform,platform_account_id'
      });
    }

    // Redirect to CRM with success
    return NextResponse.redirect(
      new URL('/app/crm?success=meta_connected', request.url)
    );

  } catch (error) {
    console.error('Meta OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/app/crm?error=oauth_failed&message=Server error', request.url)
    );
  }
}
