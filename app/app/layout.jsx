// app/app/layout.jsx
// Root layout for the Zugee PRODUCT APPLICATION (customer-facing dashboard)
// This is SEPARATE from the marketing site layout

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AppSidebar from '@/components/app/AppSidebar';
import AppTopBar from '@/components/app/AppTopBar';
import { getServerSession, getCustomerProfile } from '@/lib/app-auth';
import '../globals.css';

export const metadata = {
  title: {
    default: 'Zugee Dashboard',
    template: '%s | Zugee Dashboard'
  },
  description: 'Zugee business management dashboard',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AppLayout({ children }) {
  // Get the current session
  const cookieStore = await cookies();
  const { user, error } = await getServerSession(cookieStore);

  // If not authenticated, redirect to auth page
  if (error || !user) {
    redirect('/app/auth');
  }

  // Get customer profile
  const { profile, error: profileError } = await getCustomerProfile(user.id);

  if (profileError || !profile) {
    // If profile doesn't exist, redirect to onboarding (to be implemented)
    redirect('/app/auth');
  }

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <AppSidebar profile={profile} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <AppTopBar profile={profile} />

            {/* Page Content - Scrollable */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
