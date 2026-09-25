// app/api/app/gst/route.js
// API route for GST & Compliance data

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

    const { userId, profile } = auth;
    const supabase = createBrowserClient();

    // Get GST configuration
    const { data: gstConfig, error: configError } = await supabase
      .from('gst_configurations')
      .select('*')
      .eq('customer_id', userId)
      .single();

    // If no GST config exists, create a default one
    let config = gstConfig;
    if (configError || !gstConfig) {
      const { data: newConfig, error: createError } = await supabase
        .from('gst_configurations')
        .insert({
          customer_id: userId,
          gst_number: profile.gst_number || '',
          registered_state: profile.state,
          engine_version: 'v2.0',
          default_gst_rate: 18.00
        })
        .select()
        .single();

      if (!createError) {
        config = newConfig;
      }
    }

    // Get current month invoices for tax calculations
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('customer_id', userId)
      .gte('invoice_date', startOfMonth.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('Fetch invoices error:', invoicesError);
    }

    // Calculate tax metrics
    let taxPayable = 0;
    let itcClaimable = 0;
    const gstSlabs = {
      '0': { rate: 0, revenue: 0, taxCollected: 0, invoiceCount: 0 },
      '5': { rate: 5, revenue: 0, taxCollected: 0, invoiceCount: 0 },
      '12': { rate: 12, revenue: 0, taxCollected: 0, invoiceCount: 0 },
      '18': { rate: 18, revenue: 0, taxCollected: 0, invoiceCount: 0 },
      '28': { rate: 28, revenue: 0, taxCollected: 0, invoiceCount: 0 }
    };

    if (invoices && invoices.length > 0) {
      invoices.forEach(invoice => {
        const cgst = parseFloat(invoice.cgst_amount || 0);
        const sgst = parseFloat(invoice.sgst_amount || 0);
        const igst = parseFloat(invoice.igst_amount || 0);
        const totalTax = cgst + sgst + igst;
        const subtotal = parseFloat(invoice.subtotal || 0);

        taxPayable += totalTax;

        // Determine GST slab based on tax rate
        const gstRate = subtotal > 0 ? Math.round((totalTax / subtotal) * 100) : 0;
        const slabKey = String(gstRate);

        if (gstSlabs[slabKey]) {
          gstSlabs[slabKey].revenue += subtotal;
          gstSlabs[slabKey].taxCollected += totalTax;
          gstSlabs[slabKey].invoiceCount += 1;
        } else if (gstRate > 0) {
          // If exact match not found, assign to closest slab
          const closestSlab = Object.keys(gstSlabs).reduce((prev, curr) => {
            return Math.abs(parseInt(curr) - gstRate) < Math.abs(parseInt(prev) - gstRate) ? curr : prev;
          });
          gstSlabs[closestSlab].revenue += subtotal;
          gstSlabs[closestSlab].taxCollected += totalTax;
          gstSlabs[closestSlab].invoiceCount += 1;
        }
      });

      // ITC (Input Tax Credit) - simplified calculation
      // In real scenario, this would come from purchase invoices
      // For now, estimate at 60% of output tax
      itcClaimable = taxPayable * 0.6;
    }

    // Convert slabs to array
    const slabsArray = Object.values(gstSlabs).filter(slab => slab.revenue > 0 || slab.rate === 0);

    // Calculate totals
    const totalRevenue = slabsArray.reduce((sum, slab) => sum + slab.revenue, 0);
    const totalTaxCollected = slabsArray.reduce((sum, slab) => sum + slab.taxCollected, 0);
    const netTaxPayable = taxPayable - itcClaimable;

    return NextResponse.json({
      success: true,
      gstConfig: config ? {
        gst_number: config.gst_number,
        registered_state: config.registered_state,
        engine_version: config.engine_version,
        default_gst_rate: config.default_gst_rate,
        composition_scheme: config.composition_scheme,
        reverse_charge: config.reverse_charge
      } : null,
      taxMetrics: {
        taxPayable,
        itcClaimable,
        netTaxPayable,
        totalRevenue,
        totalTaxCollected,
        invoiceCount: invoices?.length || 0
      },
      gstSlabs: slabsArray
    });

  } catch (error) {
    console.error('GST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update GST configuration
export async function PATCH(request) {
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
    const body = await request.json();

    const { gst_number, default_gst_rate, composition_scheme, reverse_charge } = body;

    // Update GST configuration
    const { data: config, error } = await supabase
      .from('gst_configurations')
      .update({
        gst_number,
        default_gst_rate,
        composition_scheme,
        reverse_charge
      })
      .eq('customer_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update GST config error:', error);
      return NextResponse.json(
        { error: 'Failed to update GST configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      gstConfig: config
    });

  } catch (error) {
    console.error('GST PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
