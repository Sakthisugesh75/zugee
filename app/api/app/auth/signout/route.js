// app/api/app/auth/signout/route.js
import { NextResponse } from 'next/server';
import { signOut } from '@/lib/app-auth';

export async function POST(request) {
  try {
    const { success, error } = await signOut();

    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to sign out' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('Sign out route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
