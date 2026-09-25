# OAuth Integration Setup Guide

> **Removed in Phase 0 — to be rebuilt (see ZUGEE-PLATFORM-PLAN.md Phase 3).**
> `/api/app/oauth/meta`, `/api/app/oauth/google`, `/api/app/crm/ad-accounts`,
> `/api/app/ads/campaigns`, `lib/oauth-refresh.js` and the CRM "Ad Integrations" panel were
> deleted: the OAuth `state` was the raw customer UUID (account-linking CSRF) and the callbacks
> wrote a column that does not exist. The Ads page now shows "Coming Soon".
> `lib/oauth-encryption.js` (AES-GCM token encryption) is kept for the rebuild.
> Do not register the redirect URIs below; kept only as historical reference.

This guide explains how to set up Meta Ads and Google Ads OAuth integrations for Zugee.

## Overview

Zugee uses OAuth 2.0 to securely connect customer ad accounts from Meta (Facebook) and Google. All OAuth tokens are encrypted before storage in the database using AES-256-GCM encryption.

## Security Features

- **Token Encryption**: All access tokens and refresh tokens are encrypted using AES-256-GCM before storage
- **Automatic Refresh**: Tokens are automatically refreshed when expired
- **Secure Storage**: Tokens stored in Supabase with Row Level Security (RLS) policies
- **Server-Side Only**: Token decryption happens only on the server, never exposed to client

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Generate encryption secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```
OAUTH_ENCRYPTION_SECRET=your_generated_secret_here
```

⚠️ **IMPORTANT**: Never change `OAUTH_ENCRYPTION_SECRET` in production - it will invalidate all stored tokens!

## Meta Ads Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" type
4. Fill in app details:
   - App Name: "Zugee Ad Integration"
   - Contact Email: your email
   - Business Account: Select your business

### 2. Configure OAuth Settings

1. In your app dashboard, go to "Settings" → "Basic"
2. Note your **App ID** and **App Secret**
3. Add to `.env.local`:
   ```
   META_APP_ID=your_app_id_here
   META_APP_SECRET=your_app_secret_here
   ```

4. Go to "Products" → Add "Facebook Login"
5. In Facebook Login settings → OAuth Redirect URIs, add:
   ```
   https://yourdomain.com/api/app/oauth/meta
   http://localhost:3000/api/app/oauth/meta  (for development)
   ```

### 3. Request Permissions

In your app dashboard:
1. Go to "App Review" → "Permissions and Features"
2. Request the following permissions:
   - `ads_read` - Read ad account data
   - `ads_management` - Manage ad accounts
   - `leads_retrieval` - Retrieve leads from ads

3. Submit for review (business verification required)

### 4. Add Test Users (Development)

1. Go to "Roles" → "Test Users"
2. Add test users who can connect ad accounts during development

## Google Ads Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Zugee Ad Integration"
3. Enable APIs:
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google Ads API"

### 2. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Zugee OAuth Client"
5. Authorized redirect URIs:
   ```
   https://yourdomain.com/api/app/oauth/google
   http://localhost:3000/api/app/oauth/google  (for development)
   ```
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

### 3. Configure Environment

Add to `.env.local`:
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 4. Get Developer Token

1. Sign in to your [Google Ads account](https://ads.google.com/)
2. Go to "Tools & Settings" → "API Center"
3. Request developer token (approval may take 24-48 hours)
4. Add to `.env.local`:
   ```
   GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
   ```

### 5. OAuth Consent Screen

1. In Google Cloud Console → "OAuth consent screen"
2. User Type: External (or Internal for Google Workspace)
3. Fill in app information:
   - App name: "Zugee"
   - User support email: your email
   - Developer contact: your email
4. Scopes: Add `https://www.googleapis.com/auth/adwords`
5. Add test users (for development)

## Testing OAuth Flow

### Local Development

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/app/auth`
3. Sign in with test account
4. Go to CRM → Click "Connect Meta Ads" or "Connect Google Ads"
5. Complete OAuth flow
6. Verify account appears in "Connected Accounts"

### Production

1. Update `NEXT_PUBLIC_SITE_URL` in `.env.local`:
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. Update OAuth redirect URIs in Meta and Google dashboards

3. Deploy and test

## Database Schema

Connected ad accounts are stored in `ad_accounts` table:

```sql
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'meta_ads' or 'google_ads'
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT, -- Encrypted (Google only)
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'success', 'error'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(customer_id, platform, platform_account_id)
);
```

## Token Refresh

Tokens are automatically refreshed when:
- They expire (checked on every API call)
- They're within 5 minutes of expiry

### Meta Ads Token Refresh

Meta provides long-lived tokens (60 days). When expired, we exchange the current token for a new long-lived token.

### Google Ads Token Refresh

Google provides short-lived access tokens (1 hour) with refresh tokens. We automatically use the refresh token to get new access tokens.

## Security Best Practices

1. **Never commit secrets**: Always use `.env.local` (gitignored)
2. **Rotate secrets carefully**: Changing `OAUTH_ENCRYPTION_SECRET` invalidates all tokens
3. **Use HTTPS**: Always use HTTPS in production for OAuth callbacks
4. **Monitor token refresh failures**: Set up alerts for accounts with `sync_status: 'error'`
5. **Regular audits**: Review connected accounts and remove unused ones

## Troubleshooting

### "OAuth not configured" error

- Check environment variables are set correctly
- Restart Next.js server after changing `.env.local`

### "Token refresh failed" error

- Account needs reauthorization
- User will see "Reconnect" button in CRM
- Check Meta/Google app credentials are valid

### "No ad accounts found" error (Meta)

- User must have ad accounts in their Business Manager
- Check ad account permissions in Meta Business Manager

### "Invalid grant" error (Google)

- Refresh token may be revoked
- User needs to reconnect account
- Ensure `access_type=offline` and `prompt=consent` in OAuth URL

## API Reference

### Initiate OAuth Flow

```javascript
POST /api/app/crm/ad-accounts
{
  "platform": "meta_ads" // or "google_ads"
}

Response:
{
  "success": true,
  "oauthUrl": "https://..."
}
```

### List Connected Accounts

```javascript
GET /api/app/crm/ad-accounts

Response:
{
  "success": true,
  "accounts": [
    {
      "id": "uuid",
      "platform": "meta_ads",
      "account_name": "My Ad Account",
      "is_active": true,
      "sync_status": "success",
      "last_sync_at": "2026-09-22T12:00:00Z"
    }
  ]
}
```

### Disconnect Account

```javascript
DELETE /api/app/crm/ad-accounts?id=uuid

Response:
{
  "success": true,
  "message": "Ad account disconnected"
}
```

## Support

For issues or questions:
- Check logs in Supabase Dashboard → Database → Logs
- Review Next.js server logs for OAuth errors
- Contact: support@zugee.com
