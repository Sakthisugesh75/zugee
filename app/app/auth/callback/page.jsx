// app/app/auth/callback/page.jsx
// OAuth callback handler for Supabase Auth (magic links, social providers, etc.)

import { redirect } from 'next/navigation';
import { createBrowserClient } from '@/lib/app-auth';

export default async function AuthCallbackPage({ searchParams }) {
  const code = searchParams?.code;

  if (code) {
    const supabase = createBrowserClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after successful authentication
  redirect('/app/dashboard');
}
