// app/api/app/auth/magic-link/route.js
import { NextResponse } from 'next/server';
import { signInWithMagicLink } from '@/lib/app-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send magic link
    const { sent, error } = await signInWithMagicLink({ email });

    if (error) {
      console.error('Magic link error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send magic link' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    });

  } catch (error) {
    console.error('Magic link route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
