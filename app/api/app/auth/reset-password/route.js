// app/api/app/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/app-auth';

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

    // Send reset password email
    const { sent, error } = await resetPassword({ email });

    if (error) {
      console.error('Reset password error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send reset email' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Reset password route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
