// lib/app-auth.js
// Authentication utilities for the Zugee PRODUCT APPLICATION (customer-facing dashboard)
// This is SEPARATE from the marketing site's admin auth (lib/auth.js)
// Uses Supabase Auth for proper multi-tenant customer authentication

import { createClient } from '@supabase/supabase-js';

// Env vars are read when a client is created, never at import time, so that
// `next build` works without secrets. A clear error is thrown only when called.
function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) {
    throw new Error('Missing env.SUPABASE_URL');
  }
  return url;
}

// ---------------------------------------------------------------------------
// Client-side Supabase client (uses anon key, respects RLS)
// ---------------------------------------------------------------------------
export function createBrowserClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
}

// ---------------------------------------------------------------------------
// Server-side Supabase client (uses service role key, bypasses RLS)
// Only use this for admin operations that need to bypass RLS
// ---------------------------------------------------------------------------
export function createServerClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

// ---------------------------------------------------------------------------
// Server-side auth helpers for API routes and server components
// ---------------------------------------------------------------------------

/**
 * Get the current authenticated user from cookies (server-side)
 * Returns { user, error } where user is the Supabase auth user object
 */
export async function getServerSession(cookieStore) {
  const supabase = createBrowserClient();
  
  // Get the session from cookies
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { user: null, error: error || new Error('No session') };
  }
  
  return { user: session.user, error: null };
}

/**
 * Get the customer profile for the authenticated user
 * Returns the full customer_profiles record
 */
export async function getCustomerProfile(userId) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    return { profile: null, error };
  }
  
  return { profile: data, error: null };
}

/**
 * Middleware helper to protect API routes
 * Returns { userId, profile } or throws an error response
 */
export async function requireAuth(request) {
  const supabase = createBrowserClient();
  
  // Get session from the request
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    return {
      authenticated: false,
      error: 'Authentication required',
      status: 401
    };
  }
  
  // Get customer profile
  const { profile, error: profileError } = await getCustomerProfile(session.user.id);
  
  if (profileError || !profile) {
    return {
      authenticated: false,
      error: 'Customer profile not found',
      status: 403
    };
  }
  
  return {
    authenticated: true,
    userId: session.user.id,
    profile,
    user: session.user
  };
}

// ---------------------------------------------------------------------------
// Sign up / Sign in / Sign out functions
// ---------------------------------------------------------------------------

/**
 * Sign up a new customer with email and password
 * Also creates the customer_profiles record
 */
export async function signUpCustomer({ 
  email, 
  password, 
  businessName, 
  businessType, 
  state,
  phone 
}) {
  const supabase = createBrowserClient();
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
        business_type: businessType,
        state: state
      }
    }
  });
  
  if (authError) {
    return { user: null, error: authError };
  }
  
  if (!authData.user) {
    return { user: null, error: new Error('Failed to create user') };
  }
  
  // Create customer profile
  // Note: In production, this should be done via a database trigger or function
  // to ensure atomicity and handle the case where the auth user is created but profile fails
  const { error: profileError } = await supabase
    .from('customer_profiles')
    .insert({
      id: authData.user.id,
      business_name: businessName,
      business_type: businessType,
      state: state,
      phone: phone,
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
    });
  
  if (profileError) {
    console.error('Failed to create customer profile:', profileError);
    // Note: The auth user is already created at this point
    // In production, consider using a database trigger or transaction
  }
  
  return { user: authData.user, error: null };
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword({ email, password }) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    return { user: null, session: null, error };
  }
  
  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign in with magic link (passwordless)
 */
export async function signInWithMagicLink({ email }) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/auth/callback`
    }
  });
  
  if (error) {
    return { sent: false, error };
  }
  
  return { sent: true, error: null };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createBrowserClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { success: false, error };
  }
  
  return { success: true, error: null };
}

/**
 * Reset password (send reset email)
 */
export async function resetPassword({ email }) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/app/auth/reset-password`
  });
  
  if (error) {
    return { sent: false, error };
  }
  
  return { sent: true, error: null };
}

/**
 * Update password (when user is already authenticated)
 */
export async function updatePassword({ newPassword }) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    return { success: false, error };
  }
  
  return { success: true, error: null };
}

// ---------------------------------------------------------------------------
// Profile management
// ---------------------------------------------------------------------------

/**
 * Update customer profile
 */
export async function updateCustomerProfile(userId, updates) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase
    .from('customer_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    return { profile: null, error };
  }
  
  return { profile: data, error: null };
}

/**
 * Complete onboarding for a customer
 */
export async function completeOnboarding(userId, onboardingData) {
  const supabase = createBrowserClient();
  
  // Update customer profile with onboarding data
  const { data, error } = await supabase
    .from('customer_profiles')
    .update({
      ...onboardingData,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    return { success: false, error };
  }
  
  // Initialize GST configuration if GST number provided
  if (onboardingData.gst_number) {
    const { error: gstError } = await supabase
      .from('gst_configurations')
      .insert({
        customer_id: userId,
        gst_number: onboardingData.gst_number,
        registered_state: onboardingData.state || data.state
      });
    
    if (gstError) {
      console.error('Failed to create GST configuration:', gstError);
      // Don't fail the whole onboarding, just log the error
    }
  }
  
  return { success: true, profile: data, error: null };
}

// ---------------------------------------------------------------------------
// Session management helpers
// ---------------------------------------------------------------------------

/**
 * Check if user session is valid and not expired
 */
export async function validateSession() {
  const supabase = createBrowserClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { valid: false, session: null };
  }
  
  // Check if session is expired
  const expiresAt = new Date(session.expires_at * 1000);
  if (expiresAt < new Date()) {
    return { valid: false, session: null };
  }
  
  return { valid: true, session };
}

/**
 * Refresh the current session
 */
export async function refreshSession() {
  const supabase = createBrowserClient();
  
  const { data: { session }, error } = await supabase.auth.refreshSession();
  
  if (error || !session) {
    return { session: null, error: error || new Error('Failed to refresh session') };
  }
  
  return { session, error: null };
}

// ---------------------------------------------------------------------------
// Development helpers (DEV ONLY - remove in production)
// ---------------------------------------------------------------------------

/**
 * Create a test customer account (DEV ONLY)
 */
export async function createTestAccount() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('createTestAccount is not available in production');
  }
  
  const testEmail = `test-${Date.now()}@zugee.local`;
  const testPassword = 'TestPassword123!';
  
  const result = await signUpCustomer({
    email: testEmail,
    password: testPassword,
    businessName: 'Test Business Pvt Ltd',
    businessType: 'Retail',
    state: 'Tamil Nadu',
    phone: '+919876543210'
  });
  
  return {
    ...result,
    credentials: { email: testEmail, password: testPassword }
  };
}
