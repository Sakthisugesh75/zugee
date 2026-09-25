# AI Insights Computation Setup

This guide explains how to set up and schedule AI insights computation for Zugee.

## Overview

The AI Insights Engine automatically analyzes customer data to detect:
- **Wasted Ad Spend**: Campaigns with poor performance (high CPL, low ROAS, low CTR, zero conversions)
- **Lead Decay**: Stale leads that need attention (uncontacted leads, hot leads going cold, missed follow-ups)

Insights are stored in the `ai_insights` table and displayed on the Dashboard.

## How It Works

### 1. Wasted Ad Spend Detection

The engine analyzes active campaigns from the last 30 days and flags:

- **High CPL**: Cost per lead is 2x above customer's average
- **Negative ROI**: ROAS below 1x (losing money)
- **Low CTR**: Click-through rate below 0.5% with significant impressions
- **Zero Conversions**: High spend campaigns with no conversions

Each insight includes:
- Severity level (critical/high/medium)
- Estimated financial impact
- Actionable recommendations
- Campaign metadata

### 2. Lead Decay Detection

The engine analyzes active leads and flags:

- **Uncontacted Leads**: New leads not contacted within 24 hours
- **Decaying Hot Leads**: High-priority leads with no contact in >3 days
- **Stagnant Qualified Leads**: Qualified leads with no progress in >7 days
- **Overdue Follow-ups**: Leads past their scheduled follow-up date

Each insight includes:
- Severity based on time elapsed
- Estimated revenue at risk
- Specific action recommendations
- Lead details

## Configuration

### 1. Environment Variables

Generate a secret for the insights computation endpoint:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```
INSIGHTS_COMPUTE_SECRET=your_generated_secret_here
```

### 2. Manual Trigger (Testing)

You can manually trigger insights computation for testing:

```bash
# Compute for specific customer
curl -X POST http://localhost:3000/api/app/insights/compute \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-uuid-here",
    "secret": "your_secret_here"
  }'

# Compute for all customers
curl -X POST http://localhost:3000/api/app/insights/compute \
  -H "Content-Type: application/json" \
  -d '{
    "all": true,
    "secret": "your_secret_here"
  }'
```

Expected response:
```json
{
  "success": true,
  "count": 5,
  "breakdown": {
    "wasted_ad_spend": 3,
    "lead_decay": 2
  },
  "timestamp": "2026-09-22T12:00:00Z"
}
```

## Scheduling (Production)

### Option 1: Vercel Cron Jobs

If deploying to Vercel, create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/app/insights/compute",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This runs every 6 hours. Update the API route to accept cron requests:

```javascript
// Check for Vercel cron authorization header
const authHeader = request.headers.get('authorization');
if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
  // Cron job authenticated
  return await computeAllCustomerInsights();
}
```

Add to `.env.local`:
```
CRON_SECRET=your_vercel_cron_secret
```

### Option 2: External Cron Service

Use services like [cron-job.org](https://cron-job.org/) or [EasyCron](https://www.easycron.com/):

1. Create new cron job
2. URL: `https://yourdomain.com/api/app/insights/compute`
3. Method: POST
4. Headers:
   - `Content-Type: application/json`
5. Body:
   ```json
   {
     "all": true,
     "secret": "your_secret_here"
   }
   ```
6. Schedule: Every 6 hours (0 */6 * * *)

### Option 3: GitHub Actions

Create `.github/workflows/insights-computation.yml`:

```yaml
name: AI Insights Computation

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Allow manual trigger

jobs:
  compute-insights:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Insights Computation
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/app/insights/compute \
            -H "Content-Type: application/json" \
            -d '{"all": true, "secret": "${{ secrets.INSIGHTS_COMPUTE_SECRET }}"}'
```

Add secrets in GitHub repository settings:
- `APP_URL`: Your production URL
- `INSIGHTS_COMPUTE_SECRET`: Your secret from `.env`

### Option 4: Supabase Edge Functions (Advanced)

Create a Supabase Edge Function that runs on schedule:

```typescript
// supabase/functions/compute-insights/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const response = await fetch('https://yourdomain.com/api/app/insights/compute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      all: true,
      secret: Deno.env.get('INSIGHTS_COMPUTE_SECRET')
    })
  });
  
  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

Deploy and schedule with `pg_cron`:

```sql
SELECT cron.schedule(
  'compute-insights',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/compute-insights',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

## Insight Lifecycle

1. **Generation**: Insights computed every 6 hours (recommended)
2. **Display**: Shown in Dashboard AI Insights panel
3. **Dismissal**: User can dismiss insights (sets `dismissed_at`)
4. **Cleanup**: Dismissed insights and insights older than 7 days are auto-deleted on next computation

## Database Schema

```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'wasted_ad_spend' or 'lead_decay'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  estimated_impact TEXT,
  related_entity_type TEXT, -- 'campaign' or 'lead'
  related_entity_id UUID,
  metadata JSONB,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Customization

### Adjust Detection Thresholds

Edit `lib/ai-insights-engine.js`:

```javascript
// Example: Change high CPL threshold from 2x to 1.5x
if (cpl !== Infinity && cpl > avgCPL * 1.5) {
  // Generate insight
}

// Example: Change uncontacted lead threshold from 24h to 12h
if (lead.status === 'new' && daysSinceCreated >= 0.5 && !lastContact) {
  // Generate insight
}
```

### Add New Insight Types

1. Create new analysis function in `ai-insights-engine.js`:
```javascript
export async function analyzeNewInsightType(customerId) {
  const insights = [];
  // Your analysis logic
  return insights;
}
```

2. Add to `computeAIInsights`:
```javascript
const [wastedSpend, leadDecay, newInsights] = await Promise.all([
  analyzeWastedAdSpend(customerId),
  analyzeLeadDecay(customerId),
  analyzeNewInsightType(customerId)
]);
```

### Industry Benchmarks

Currently uses customer's own averages. To use industry benchmarks:

```javascript
// Define industry benchmarks by vertical
const INDUSTRY_BENCHMARKS = {
  'restaurant': { avgCPL: 150, avgROAS: 3.5, avgCTR: 1.2 },
  'retail': { avgCPL: 80, avgROAS: 4.0, avgCTR: 1.5 },
  // ... more verticals
};

// Fetch customer vertical from profile
const { data: profile } = await supabase
  .from('customer_profiles')
  .select('vertical')
  .eq('id', customerId)
  .single();

const benchmarks = INDUSTRY_BENCHMARKS[profile.vertical] || defaultBenchmarks;
```

## Monitoring

### Check Computation Success

```bash
curl http://localhost:3000/api/app/insights/compute?secret=your_secret
```

### View Generated Insights

Query the database:
```sql
SELECT 
  insight_type,
  severity,
  COUNT(*) as count,
  MAX(created_at) as last_generated
FROM ai_insights
WHERE customer_id = 'customer-uuid'
  AND dismissed_at IS NULL
GROUP BY insight_type, severity;
```

### Log Analysis

Check Next.js logs for computation status:
```
Computing AI insights for customer abc-123
Generated 5 insights
```

## Best Practices

1. **Frequency**: Run every 6 hours (good balance of freshness vs. cost)
2. **Rate Limiting**: If you have many customers, consider batching or adding delays
3. **Error Handling**: Monitor failed computations and set up alerts
4. **Data Quality**: Ensure campaign and lead data is synced regularly
5. **Testing**: Always test with a single customer before enabling for all
6. **Monitoring**: Track insight generation rates and user engagement

## Troubleshooting

### "Insights computation is not configured"
- Check `INSIGHTS_COMPUTE_SECRET` is set in `.env.local`
- Restart Next.js server after adding environment variables

### "Unauthorized" error
- Verify the secret matches exactly (no extra spaces)
- Check the secret is being sent in the request body

### No insights generated
- Verify customer has active campaigns or leads
- Check date ranges (campaigns must be from last 30 days)
- Lower thresholds in `ai-insights-engine.js` for testing

### Insights not showing in Dashboard
- Check `dismissed_at` is null in database
- Verify RLS policies allow customer to read their insights
- Check Dashboard API is fetching insights correctly

## API Reference

### Compute Insights

```
POST /api/app/insights/compute

Body:
{
  "customer_id": "uuid",  // Optional: specific customer
  "all": true,            // Optional: all customers
  "secret": "string"      // Required: API secret
}

Response:
{
  "success": true,
  "count": 5,
  "breakdown": {
    "wasted_ad_spend": 3,
    "lead_decay": 2
  },
  "timestamp": "2026-09-22T12:00:00Z"
}
```

### Check Status

```
GET /api/app/insights/compute?secret=string

Response:
{
  "status": "ready",
  "endpoint": "/api/app/insights/compute",
  "methods": ["POST"],
  "timestamp": "2026-09-22T12:00:00Z"
}
```

## Support

For issues or questions:
- Review logs in Supabase Dashboard
- Check Next.js server logs for computation errors
- Contact: support@zugee.com
