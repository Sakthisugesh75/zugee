// app/api/app/auth/signin/route.js
import { NextResponse } from 'next/server';
import { signInWithPassword } from '@/lib/app-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in
    const { user, session, error } = await signInWithPassword({ email, password });

    if (error) {
      console.error('Sign in error:', error);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at
      }
    });

  } catch (error) {
    console.error('Sign in route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
