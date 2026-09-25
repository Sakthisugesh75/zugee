// app/api/app/crm/leads/route.js
// API routes for CRM leads management

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/app-auth';
import { createBrowserClient } from '@/lib/app-auth';

// GET - Fetch all leads for the customer
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

    // Get query parameters for filtering and search
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    let query = supabase
      .from('crm_leads')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (source) {
      query = query.eq('source', source);
    }

    // Apply search
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error('Fetch leads error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leads: leads || []
    });

  } catch (error) {
    console.error('CRM leads API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new lead
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
    const supabase = createBrowserClient();
    const body = await request.json();

    const { name, email, phone, company, source, notes, estimated_value, priority } = body;

    // Validation
    if (!name || !source) {
      return NextResponse.json(
        { error: 'Name and source are required' },
        { status: 400 }
      );
    }

    // Create lead
    const { data: lead, error } = await supabase
      .from('crm_leads')
      .insert({
        customer_id: userId,
        name,
        email,
        phone,
        company,
        source,
        notes,
        estimated_value,
        priority: priority || 'medium',
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Create lead error:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead
    });

  } catch (error) {
    console.error('CRM leads POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a lead
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

    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Update lead (RLS policy ensures customer can only update their own leads)
    const { data: lead, error } = await supabase
      .from('crm_leads')
      .update(updates)
      .eq('id', id)
      .eq('customer_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update lead error:', error);
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead
    });

  } catch (error) {
    console.error('CRM leads PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
