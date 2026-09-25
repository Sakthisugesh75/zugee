// app/api/app/oauth/google/route.js
// Google Ads OAuth callback handler

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
      console.error('Google OAuth error:', error);
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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/app/oauth/google`
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token exchange error:', errorData);
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=Token exchange failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get Google Ads accounts using Google Ads API
    const accountsResponse = await fetch(
      'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN
        }
      }
    );

    if (!accountsResponse.ok) {
      console.error('Failed to fetch Google Ads accounts');
      // Continue even if we can't fetch accounts - store token for later use
    }

    const accountsData = await accountsResponse.json();
    const customerIds = accountsData.resourceNames || [];

    // Extract customer_id from state
    const customerId = state;

    if (!customerId) {
      return NextResponse.redirect(
        new URL('/app/crm?error=oauth_failed&message=Invalid state', request.url)
      );
    }

    // Encrypt tokens before storage
    const encryptedAccessToken = encryptToken(access_token);
    const encryptedRefreshToken = refresh_token ? encryptToken(refresh_token) : null;

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + (expires_in || 3600) * 1000);

    if (customerIds.length > 0) {
      // Store each Google Ads account
      for (const resourceName of customerIds) {
        // Extract customer ID from resource name (format: customers/1234567890)
        const accountId = resourceName.split('/')[1];

        // Fetch account details
        let accountName = `Google Ads Account ${accountId}`;
        try {
          const detailsResponse = await fetch(
            `https://googleads.googleapis.com/v15/${resourceName}`,
            {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN
              }
            }
          );
          if (detailsResponse.ok) {
            const details = await detailsResponse.json();
            accountName = details.descriptiveName || accountName;
          }
        } catch (err) {
          console.error('Failed to fetch account details:', err);
        }

        await supabase.from('ad_accounts').upsert({
          customer_id: customerId,
          platform: 'google_ads',
          platform_account_id: accountId,
          account_name: accountName,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          token_expires_at: expiresAt.toISOString(),
          is_active: true,
          sync_status: 'success',
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'customer_id,platform,platform_account_id'
        });
      }
    } else {
      // No accounts found, but store the token for manual account addition later
      await supabase.from('ad_accounts').insert({
        customer_id: customerId,
        platform: 'google_ads',
        platform_account_id: 'pending',
        account_name: 'Google Ads (Setup Required)',
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        token_expires_at: expiresAt.toISOString(),
        is_active: false,
        sync_status: 'pending',
        last_sync_at: new Date().toISOString()
      });
    }

    // Redirect to CRM with success
    return NextResponse.redirect(
      new URL('/app/crm?success=google_connected', request.url)
    );

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/app/crm?error=oauth_failed&message=Server error', request.url)
    );
  }
}
