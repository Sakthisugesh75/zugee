// app/api/app/auth/signup/route.js
import { NextResponse } from 'next/server';
import { signUpCustomer } from '@/lib/app-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, businessName, businessType, state, phone } = body;

    // Validation
    if (!email || !password || !businessName || !businessType || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create customer account
    const { user, error } = await signUpCustomer({
      email,
      password,
      businessName,
      businessType,
      state,
      phone
    });

    if (error) {
      console.error('Sign up error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Sign up route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
