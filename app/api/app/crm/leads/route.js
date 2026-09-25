// app/api/app/crm/leads/route.js
// API routes for CRM leads management

import { NextResponse } from 'next/server';
import { requireAuth, createBrowserClient } from '@/lib/app-auth';

// Allowed values - must match the CHECK constraints on crm_leads in supabase/app-schema.sql
const LEAD_STATUSES = ['new', 'hot', 'follow_up', 'contacted', 'qualified', 'converted', 'lost'];
const LEAD_PRIORITIES = ['low', 'medium', 'high'];
const LEAD_SOURCES = ['meta_ads', 'google_ads', 'direct', 'whatsapp', 'website', 'referral', 'other'];

// Columns a customer may change through PATCH. Anything else in the body is ignored.
const EDITABLE_FIELDS = [
  'name',
  'email',
  'phone',
  'company',
  'status',
  'priority',
  'notes',
  'estimated_value',
  'next_follow_up_at',
  'first_contact_at',
  'last_contact_at'
];

// Characters that have meaning inside a PostgREST .or() filter are replaced,
// so user input cannot add extra filter clauses. Same approach as sanitizeSearch in lib/supabase.js.
function sanitizeSearch(search) {
  if (typeof search !== 'string') return '';
  return search.replace(/[,()"\\%*]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
}

function isValidTimestamp(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

// Returns { updates } or { error } for a PATCH body
function buildLeadUpdates(body) {
  const updates = {};

  for (const field of EDITABLE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
    const value = body[field];

    switch (field) {
      case 'name':
        if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 120) {
          return { error: 'Name must be 2 to 120 characters' };
        }
        updates.name = value.trim();
        break;

      case 'status':
        if (!LEAD_STATUSES.includes(value)) {
          return { error: 'Invalid status' };
        }
        updates.status = value;
        break;

      case 'priority':
        if (!LEAD_PRIORITIES.includes(value)) {
          return { error: 'Invalid priority' };
        }
        updates.priority = value;
        break;

      case 'estimated_value':
        if (value === null || value === '') {
          updates.estimated_value = null;
        } else {
          const num = Number(value);
          if (!Number.isFinite(num) || num < 0) {
            return { error: 'Estimated value must be a positive number' };
          }
          updates.estimated_value = num;
        }
        break;

      case 'next_follow_up_at':
      case 'first_contact_at':
      case 'last_contact_at':
        if (value === null || value === '') {
          updates[field] = null;
        } else if (!isValidTimestamp(value)) {
          return { error: `Invalid date for ${field}` };
        } else {
          updates[field] = new Date(value).toISOString();
        }
        break;

      default: {
        // email, phone, company, notes: optional text
        const limits = { email: 254, phone: 25, company: 200, notes: 5000 };
        if (value === null || value === '') {
          updates[field] = null;
        } else if (typeof value !== 'string' || value.length > limits[field]) {
          return { error: `Invalid ${field}` };
        } else {
          updates[field] = value.trim() || null;
        }
      }
    }
  }

  return { updates };
}

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
    const search = sanitizeSearch(searchParams.get('search'));
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    let query = supabase
      .from('crm_leads')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && LEAD_STATUSES.includes(status)) {
      query = query.eq('status', status);
    }

    if (source && LEAD_SOURCES.includes(source)) {
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

    if (!LEAD_SOURCES.includes(source) || (priority && !LEAD_PRIORITIES.includes(priority))) {
      return NextResponse.json(
        { error: 'Invalid source or priority' },
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

    const id = body?.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Only whitelisted, validated columns are written
    const { updates, error: validationError } = buildLeadUpdates(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No editable fields provided' },
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
