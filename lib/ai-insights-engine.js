// lib/ai-insights-engine.js
// AI-powered insights computation engine

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Analyze ad campaigns to detect wasted spend
 * Returns insights for campaigns with poor performance
 */
export async function analyzeWastedAdSpend(customerId) {
  const insights = [];

  try {
    // Fetch active campaigns from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: campaigns, error } = await supabase
      .from('ad_campaigns')
      .select(`
        *,
        ad_accounts!inner(customer_id, platform, account_name)
      `)
      .eq('ad_accounts.customer_id', customerId)
      .gte('updated_at', thirtyDaysAgo.toISOString())
      .eq('status', 'active');

    if (error) throw error;

    if (!campaigns || campaigns.length === 0) {
      return insights;
    }

    // Calculate industry benchmarks (simplified - in production, use real data)
    const avgCPL = campaigns.reduce((sum, c) => {
      const cpl = c.conversions > 0 ? c.total_spend / c.conversions : 0;
      return sum + cpl;
    }, 0) / campaigns.length;

    const avgROAS = campaigns.reduce((sum, c) => {
      return sum + (c.roas || 0);
    }, 0) / campaigns.length;

    const avgCTR = campaigns.reduce((sum, c) => {
      const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
      return sum + ctr;
    }, 0) / campaigns.length;

    // Analyze each campaign
    for (const campaign of campaigns) {
      const cpl = campaign.conversions > 0 
        ? campaign.total_spend / campaign.conversions 
        : Infinity;
      
      const ctr = campaign.impressions > 0 
        ? (campaign.clicks / campaign.impressions) * 100 
        : 0;

      const roas = campaign.roas || 0;

      // Detect wasted spend scenarios
      
      // 1. High CPL (2x above average)
      if (cpl !== Infinity && cpl > avgCPL * 2) {
        const wastedAmount = campaign.total_spend * 0.5; // Estimate 50% waste
        insights.push({
          customer_id: customerId,
          insight_type: 'wasted_ad_spend',
          severity: wastedAmount > 5000 ? 'critical' : 'high',
          title: `High Cost Per Lead: ${campaign.campaign_name}`,
          description: `Campaign CPL (₹${cpl.toFixed(2)}) is ${((cpl / avgCPL - 1) * 100).toFixed(0)}% above your average. Consider pausing or optimizing targeting.`,
          recommendation: `Review audience targeting and ad creative. Current spend: ₹${campaign.total_spend.toLocaleString('en-IN')}`,
          estimated_impact: `Potential savings: ₹${wastedAmount.toFixed(0)}`,
          related_entity_type: 'campaign',
          related_entity_id: campaign.id,
          metadata: {
            platform: campaign.ad_accounts.platform,
            account_name: campaign.ad_accounts.account_name,
            campaign_name: campaign.campaign_name,
            current_cpl: cpl,
            average_cpl: avgCPL,
            total_spend: campaign.total_spend,
            estimated_waste: wastedAmount
          }
        });
      }

      // 2. Low ROAS (below 1x)
      if (roas > 0 && roas < 1) {
        insights.push({
          customer_id: customerId,
          insight_type: 'wasted_ad_spend',
          severity: roas < 0.5 ? 'critical' : 'high',
          title: `Negative ROI: ${campaign.campaign_name}`,
          description: `Campaign ROAS is ${roas.toFixed(2)}x - losing ₹${((1 - roas) * campaign.total_spend).toFixed(0)} for every ₹${campaign.total_spend.toFixed(0)} spent.`,
          recommendation: 'Immediate action required. Review conversion tracking and optimize or pause campaign.',
          estimated_impact: `Current loss: ₹${((1 - roas) * campaign.total_spend).toFixed(0)}`,
          related_entity_type: 'campaign',
          related_entity_id: campaign.id,
          metadata: {
            platform: campaign.ad_accounts.platform,
            account_name: campaign.ad_accounts.account_name,
            campaign_name: campaign.campaign_name,
            current_roas: roas,
            total_spend: campaign.total_spend
          }
        });
      }

      // 3. Very low CTR (below 0.5%)
      if (ctr > 0 && ctr < 0.5 && campaign.impressions > 1000) {
        insights.push({
          customer_id: customerId,
          insight_type: 'wasted_ad_spend',
          severity: 'medium',
          title: `Low Click-Through Rate: ${campaign.campaign_name}`,
          description: `CTR is ${ctr.toFixed(2)}% (${campaign.clicks.toLocaleString()} clicks from ${campaign.impressions.toLocaleString()} impressions). Ad creative may not be engaging.`,
          recommendation: 'Test new ad creatives, headlines, or offers to improve engagement.',
          estimated_impact: `Impressions wasted: ${(campaign.impressions * 0.7).toFixed(0)}`,
          related_entity_type: 'campaign',
          related_entity_id: campaign.id,
          metadata: {
            platform: campaign.ad_accounts.platform,
            account_name: campaign.ad_accounts.account_name,
            campaign_name: campaign.campaign_name,
            current_ctr: ctr,
            average_ctr: avgCTR,
            impressions: campaign.impressions,
            clicks: campaign.clicks
          }
        });
      }

      // 4. High spend with no conversions
      if (campaign.total_spend > 1000 && campaign.conversions === 0) {
        insights.push({
          customer_id: customerId,
          insight_type: 'wasted_ad_spend',
          severity: 'critical',
          title: `Zero Conversions: ${campaign.campaign_name}`,
          description: `Spent ₹${campaign.total_spend.toLocaleString('en-IN')} with 0 conversions. Campaign is not delivering results.`,
          recommendation: 'Pause immediately. Review landing page, conversion tracking, and targeting settings.',
          estimated_impact: `Total waste: ₹${campaign.total_spend.toFixed(0)}`,
          related_entity_type: 'campaign',
          related_entity_id: campaign.id,
          metadata: {
            platform: campaign.ad_accounts.platform,
            account_name: campaign.ad_accounts.account_name,
            campaign_name: campaign.campaign_name,
            total_spend: campaign.total_spend,
            clicks: campaign.clicks,
            impressions: campaign.impressions
          }
        });
      }
    }

  } catch (error) {
    console.error('Error analyzing wasted ad spend:', error);
  }

  return insights;
}

/**
 * Analyze leads to detect decay/stale opportunities
 * Returns insights for leads that need attention
 */
export async function analyzeLeadDecay(customerId) {
  const insights = [];

  try {
    // Fetch active leads
    const { data: leads, error } = await supabase
      .from('crm_leads')
      .select('*')
      .eq('customer_id', customerId)
      .in('status', ['new', 'contacted', 'qualified']);

    if (error) throw error;

    if (!leads || leads.length === 0) {
      return insights;
    }

    const now = new Date();

    for (const lead of leads) {
      const createdAt = new Date(lead.created_at);
      const lastContact = lead.last_contact_at ? new Date(lead.last_contact_at) : null;
      const nextFollowUp = lead.next_follow_up_at ? new Date(lead.next_follow_up_at) : null;

      const daysSinceCreated = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      const daysSinceLastContact = lastContact 
        ? Math.floor((now - lastContact) / (1000 * 60 * 60 * 24))
        : daysSinceCreated;

      // 1. New leads not contacted within 24 hours
      if (lead.status === 'new' && daysSinceCreated >= 1 && !lastContact) {
        insights.push({
          customer_id: customerId,
          insight_type: 'lead_decay',
          severity: daysSinceCreated >= 3 ? 'critical' : 'high',
          title: `Uncontacted Lead: ${lead.name}`,
          description: `Lead created ${daysSinceCreated} day(s) ago but never contacted. Response time critical for conversion.`,
          recommendation: `Contact immediately. Leads contacted within 24 hours are 7x more likely to convert.`,
          estimated_impact: `Potential revenue: ₹${(lead.estimated_value || 0).toLocaleString('en-IN')}`,
          related_entity_type: 'lead',
          related_entity_id: lead.id,
          metadata: {
            lead_name: lead.name,
            company: lead.company,
            source: lead.source,
            days_since_created: daysSinceCreated,
            estimated_value: lead.estimated_value
          }
        });
      }

      // 2. Hot leads with no recent contact (>3 days)
      if (lead.priority === 'hot' && daysSinceLastContact > 3) {
        insights.push({
          customer_id: customerId,
          insight_type: 'lead_decay',
          severity: 'high',
          title: `Decaying Hot Lead: ${lead.name}`,
          description: `High-priority lead with no contact in ${daysSinceLastContact} days. Risk of losing to competitor.`,
          recommendation: 'Reach out today with personalized follow-up. Offer demo or special terms.',
          estimated_impact: `At-risk revenue: ₹${(lead.estimated_value || 0).toLocaleString('en-IN')}`,
          related_entity_type: 'lead',
          related_entity_id: lead.id,
          metadata: {
            lead_name: lead.name,
            company: lead.company,
            source: lead.source,
            priority: lead.priority,
            days_since_last_contact: daysSinceLastContact,
            estimated_value: lead.estimated_value
          }
        });
      }

      // 3. Qualified leads stagnant (>7 days since last contact)
      if (lead.status === 'qualified' && daysSinceLastContact > 7) {
        insights.push({
          customer_id: customerId,
          insight_type: 'lead_decay',
          severity: 'medium',
          title: `Stagnant Qualified Lead: ${lead.name}`,
          description: `Qualified lead with no progress in ${daysSinceLastContact} days. Opportunity may be cooling.`,
          recommendation: 'Schedule call or meeting to advance deal. Send proposal or pricing information.',
          estimated_impact: `Pipeline value: ₹${(lead.estimated_value || 0).toLocaleString('en-IN')}`,
          related_entity_type: 'lead',
          related_entity_id: lead.id,
          metadata: {
            lead_name: lead.name,
            company: lead.company,
            status: lead.status,
            days_since_last_contact: daysSinceLastContact,
            estimated_value: lead.estimated_value
          }
        });
      }

      // 4. Missed follow-up dates
      if (nextFollowUp && nextFollowUp < now) {
        const daysOverdue = Math.floor((now - nextFollowUp) / (1000 * 60 * 60 * 24));
        insights.push({
          customer_id: customerId,
          insight_type: 'lead_decay',
          severity: daysOverdue > 7 ? 'high' : 'medium',
          title: `Overdue Follow-up: ${lead.name}`,
          description: `Follow-up was due ${daysOverdue} day(s) ago. Lead may feel neglected.`,
          recommendation: 'Contact immediately with apology and value proposition. Reschedule next steps.',
          estimated_impact: `Revenue at risk: ₹${(lead.estimated_value || 0).toLocaleString('en-IN')}`,
          related_entity_type: 'lead',
          related_entity_id: lead.id,
          metadata: {
            lead_name: lead.name,
            company: lead.company,
            status: lead.status,
            days_overdue: daysOverdue,
            next_follow_up_at: lead.next_follow_up_at,
            estimated_value: lead.estimated_value
          }
        });
      }
    }

  } catch (error) {
    console.error('Error analyzing lead decay:', error);
  }

  return insights;
}

/**
 * Run all AI insight computations for a customer
 */
export async function computeAIInsights(customerId) {
  try {
    console.log(`Computing AI insights for customer ${customerId}`);

    // Run all analysis functions in parallel
    const [wastedSpendInsights, leadDecayInsights] = await Promise.all([
      analyzeWastedAdSpend(customerId),
      analyzeLeadDecay(customerId)
    ]);

    const allInsights = [...wastedSpendInsights, ...leadDecayInsights];

    console.log(`Generated ${allInsights.length} insights`);

    if (allInsights.length === 0) {
      return { success: true, count: 0, message: 'No insights generated' };
    }

    // Delete old insights (older than 7 days or already dismissed)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await supabase
      .from('ai_insights')
      .delete()
      .eq('customer_id', customerId)
      .or(`created_at.lt.${sevenDaysAgo.toISOString()},dismissed_at.not.is.null`);

    // Insert new insights
    const { data, error } = await supabase
      .from('ai_insights')
      .insert(allInsights.map(insight => ({
        ...insight,
        created_at: new Date().toISOString()
      })));

    if (error) {
      console.error('Error inserting insights:', error);
      throw error;
    }

    return {
      success: true,
      count: allInsights.length,
      breakdown: {
        wasted_ad_spend: wastedSpendInsights.length,
        lead_decay: leadDecayInsights.length
      }
    };

  } catch (error) {
    console.error('Error computing AI insights:', error);
    throw error;
  }
}

/**
 * Run AI insights computation for all active customers
 * Use this for scheduled/cron jobs
 */
export async function computeAllCustomerInsights() {
  try {
    // Fetch all active customers
    const { data: customers, error } = await supabase
      .from('customer_profiles')
      .select('id, company_name')
      .eq('is_active', true);

    if (error) throw error;

    console.log(`Running AI insights for ${customers?.length || 0} customers`);

    const results = [];

    for (const customer of customers || []) {
      try {
        const result = await computeAIInsights(customer.id);
        results.push({
          customer_id: customer.id,
          company_name: customer.company_name,
          ...result
        });
      } catch (error) {
        console.error(`Failed for customer ${customer.id}:`, error);
        results.push({
          customer_id: customer.id,
          company_name: customer.company_name,
          success: false,
          error: error.message
        });
      }
    }

    return {
      success: true,
      total_customers: customers?.length || 0,
      results
    };

  } catch (error) {
    console.error('Error in computeAllCustomerInsights:', error);
    throw error;
  }
}
