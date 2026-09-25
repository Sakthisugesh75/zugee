// app/api/app/insights/compute/route.js
// API endpoint to trigger AI insights computation

import { NextResponse } from 'next/server';
import { computeAIInsights, computeAllCustomerInsights } from '@/lib/ai-insights-engine';

/**
 * POST - Trigger AI insights computation
 * Can compute for specific customer or all customers
 * 
 * Body:
 *  - customer_id: (optional) specific customer ID
 *  - all: (optional) true to compute for all customers
 *  - secret: (required) API secret for authorization
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_id, all, secret } = body;

    // Verify API secret (for cron job authentication)
    const expectedSecret = process.env.INSIGHTS_COMPUTE_SECRET;
    
    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Insights computation is not configured' },
        { status: 503 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Compute insights
    let result;

    if (all) {
      // Compute for all active customers
      result = await computeAllCustomerInsights();
    } else if (customer_id) {
      // Compute for specific customer
      result = await computeAIInsights(customer_id);
    } else {
      return NextResponse.json(
        { error: 'Either customer_id or all=true must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Insights computation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to compute insights',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Check insights computation status
 * Returns summary of recent insights
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Verify API secret
    const expectedSecret = process.env.INSIGHTS_COMPUTE_SECRET;
    
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return a simple status
    // In production, you could track computation jobs in a separate table
    return NextResponse.json({
      status: 'ready',
      endpoint: '/api/app/insights/compute',
      methods: ['POST'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
