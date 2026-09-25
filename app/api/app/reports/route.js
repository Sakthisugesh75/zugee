// app/api/app/reports/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - List generated reports
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    // Fetch generated reports
    const { data: reports, error } = await supabase
      .from('generated_reports')
      .select('*')
      .eq('customer_id', customerId)
      .order('generated_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ reports: reports || [] });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST - Generate new report
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_id, report_type, period_start, period_end, format } = body;

    if (!customer_id || !report_type) {
      return NextResponse.json(
        { error: 'Customer ID and report type required' },
        { status: 400 }
      );
    }

    let reportData = {};

    // Generate report based on type
    if (report_type === 'daily_business') {
      reportData = await generateDailyBusinessReport(
        customer_id,
        period_start,
        period_end
      );
    } else if (report_type === 'monthly_gst_audit') {
      reportData = await generateMonthlyGSTAudit(
        customer_id,
        period_start,
        period_end
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Save report record
    const { data: report, error } = await supabase
      .from('generated_reports')
      .insert({
        customer_id,
        report_type,
        period_start,
        period_end,
        format,
        file_path: null, // Would store S3/Supabase Storage path in production
        report_data: reportData,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ report, reportData });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// Generate Daily Business Report
async function generateDailyBusinessReport(customerId, periodStart, periodEnd) {
  try {
    // Get leads data
    const { data: leads } = await supabase
      .from('crm_leads')
      .select('*')
      .eq('customer_id', customerId)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd);

    // Get invoices data
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', customerId)
      .gte('invoice_date', periodStart)
      .lte('invoice_date', periodEnd);

    // Get ad campaigns data
    const { data: campaigns } = await supabase
      .from('ad_campaigns')
      .select('*, ad_accounts!inner(customer_id)')
      .eq('ad_accounts.customer_id', customerId)
      .gte('updated_at', periodStart)
      .lte('updated_at', periodEnd);

    // Calculate metrics
    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter(l => l.status === 'qualified').length || 0;
    const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0;

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const paidInvoices = invoices?.filter(inv => inv.payment_status === 'paid').length || 0;
    const pendingInvoices = invoices?.filter(inv => inv.payment_status === 'pending').length || 0;

    const totalAdSpend = campaigns?.reduce((sum, c) => sum + (c.total_spend || 0), 0) || 0;
    const totalImpressions = campaigns?.reduce((sum, c) => sum + (c.impressions || 0), 0) || 0;
    const totalClicks = campaigns?.reduce((sum, c) => sum + (c.clicks || 0), 0) || 0;

    return {
      period: { start: periodStart, end: periodEnd },
      summary: {
        totalLeads,
        qualifiedLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0,
        totalRevenue,
        paidInvoices,
        pendingInvoices,
        totalAdSpend,
        roas: totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : 0
      },
      leads: leads || [],
      invoices: invoices || [],
      campaigns: campaigns || [],
      adPerformance: {
        totalImpressions,
        totalClicks,
        ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0,
        avgCpl: totalLeads > 0 ? (totalAdSpend / totalLeads).toFixed(2) : 0
      }
    };
  } catch (error) {
    console.error('Error generating daily business report:', error);
    throw error;
  }
}

// Generate Monthly GST Audit Report
async function generateMonthlyGSTAudit(customerId, periodStart, periodEnd) {
  try {
    // Get GST configuration
    const { data: gstConfig } = await supabase
      .from('gst_configurations')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    // Get all invoices for the period
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', customerId)
      .gte('invoice_date', periodStart)
      .lte('invoice_date', periodEnd);

    // Calculate GST metrics
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.taxable_amount || 0), 0) || 0;
    const totalCGST = invoices?.reduce((sum, inv) => sum + (inv.cgst_amount || 0), 0) || 0;
    const totalSGST = invoices?.reduce((sum, inv) => sum + (inv.sgst_amount || 0), 0) || 0;
    const totalIGST = invoices?.reduce((sum, inv) => sum + (inv.igst_amount || 0), 0) || 0;
    const totalOutputTax = totalCGST + totalSGST + totalIGST;

    // Group by GST rate
    const slabBreakdown = {};
    const gstRates = [0, 5, 12, 18, 28];
    
    gstRates.forEach(rate => {
      const slabInvoices = invoices?.filter(inv => inv.gst_rate === rate) || [];
      slabBreakdown[`${rate}%`] = {
        invoiceCount: slabInvoices.length,
        totalRevenue: slabInvoices.reduce((sum, inv) => sum + (inv.taxable_amount || 0), 0),
        taxCollected: slabInvoices.reduce((sum, inv) => 
          sum + (inv.cgst_amount || 0) + (inv.sgst_amount || 0) + (inv.igst_amount || 0), 0
        )
      };
    });

    // Estimate ITC (in production, would calculate from purchase invoices)
    const estimatedITC = totalOutputTax * 0.6;
    const netTaxPayable = totalOutputTax - estimatedITC;

    return {
      period: { start: periodStart, end: periodEnd },
      gstConfig: {
        gstNumber: gstConfig?.gst_number || 'Not configured',
        state: gstConfig?.state || 'Unknown',
        compositionScheme: gstConfig?.composition_scheme || false
      },
      summary: {
        totalRevenue,
        totalInvoices: invoices?.length || 0,
        totalOutputTax,
        cgst: totalCGST,
        sgst: totalSGST,
        igst: totalIGST,
        estimatedITC,
        netTaxPayable
      },
      slabBreakdown,
      invoices: invoices || []
    };
  } catch (error) {
    console.error('Error generating monthly GST audit:', error);
    throw error;
  }
}
