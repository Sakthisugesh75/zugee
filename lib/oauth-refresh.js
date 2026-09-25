// lib/oauth-refresh.js
// Automatic OAuth token refresh utilities

import { createClient } from '@supabase/supabase-js';
import { encryptToken, decryptToken } from './oauth-encryption';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Check if a token is expired or about to expire (within 5 minutes)
 * @param {string} expiresAt - ISO timestamp
 * @returns {boolean}
 */
export function isTokenExpired(expiresAt) {
  if (!expiresAt) return true;
  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return expiryTime - now < fiveMinutes;
}

/**
 * Refresh Meta Ads access token
 * @param {string} accountId - Ad account ID in database
 * @returns {Promise<string>} New access token
 */
export async function refreshMetaToken(accountId) {
  try {
    // Fetch the account with encrypted token
    const { data: account, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('platform', 'meta_ads')
      .single();

    if (error || !account) {
      throw new Error('Ad account not found');
    }

    // Decrypt the current token
    const currentToken = decryptToken(account.access_token);

    // Exchange for new long-lived token
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${currentToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Meta token refresh error:', errorData);
      
      // Mark account as needing reauthorization
      await supabase
        .from('ad_accounts')
        .update({ 
          sync_status: 'error',
          is_active: false 
        })
        .eq('id', accountId);

      throw new Error('Token refresh failed - reauthorization required');
    }

    const tokenData = await response.json();
    const newToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 5184000; // Default 60 days

    // Encrypt and save new token
    const encryptedToken = encryptToken(newToken);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await supabase
      .from('ad_accounts')
      .update({
        access_token: encryptedToken,
        token_expires_at: expiresAt.toISOString(),
        sync_status: 'success',
        last_sync_at: new Date().toISOString()
      })
      .eq('id', accountId);

    return newToken;

  } catch (error) {
    console.error('Error refreshing Meta token:', error);
    throw error;
  }
}

/**
 * Refresh Google Ads access token using refresh token
 * @param {string} accountId - Ad account ID in database
 * @returns {Promise<string>} New access token
 */
export async function refreshGoogleToken(accountId) {
  try {
    // Fetch the account with encrypted tokens
    const { data: account, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('platform', 'google_ads')
      .single();

    if (error || !account) {
      throw new Error('Ad account not found');
    }

    if (!account.refresh_token) {
      throw new Error('No refresh token available - reauthorization required');
    }

    // Decrypt the refresh token
    const refreshToken = decryptToken(account.refresh_token);

    // Request new access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google token refresh error:', errorData);
      
      // Mark account as needing reauthorization
      await supabase
        .from('ad_accounts')
        .update({ 
          sync_status: 'error',
          is_active: false 
        })
        .eq('id', accountId);

      throw new Error('Token refresh failed - reauthorization required');
    }

    const tokenData = await response.json();
    const newAccessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600; // Default 1 hour

    // Encrypt and save new access token
    const encryptedAccessToken = encryptToken(newAccessToken);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Update refresh token if a new one was provided
    let updateData = {
      access_token: encryptedAccessToken,
      token_expires_at: expiresAt.toISOString(),
      sync_status: 'success',
      last_sync_at: new Date().toISOString()
    };

    if (tokenData.refresh_token) {
      updateData.refresh_token = encryptToken(tokenData.refresh_token);
    }

    await supabase
      .from('ad_accounts')
      .update(updateData)
      .eq('id', accountId);

    return newAccessToken;

  } catch (error) {
    console.error('Error refreshing Google token:', error);
    throw error;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * @param {string} accountId - Ad account ID
 * @param {string} platform - 'meta_ads' or 'google_ads'
 * @returns {Promise<string>} Valid access token
 */
export async function getValidAccessToken(accountId, platform) {
  try {
    // Fetch account
    const { data: account, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error || !account) {
      throw new Error('Ad account not found');
    }

    // Check if token needs refresh
    if (isTokenExpired(account.token_expires_at)) {
      console.log(`Token expired for account ${accountId}, refreshing...`);
      
      if (platform === 'meta_ads') {
        return await refreshMetaToken(accountId);
      } else if (platform === 'google_ads') {
        return await refreshGoogleToken(accountId);
      }
    }

    // Token is still valid, decrypt and return
    return decryptToken(account.access_token);

  } catch (error) {
    console.error('Error getting valid access token:', error);
    throw error;
  }
}
