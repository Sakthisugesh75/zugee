// app/app/(dashboard)/layout.jsx
// Authenticated dashboard layout with sidebar and topbar

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AppSidebar from '@/components/app/AppSidebar';
import AppTopBar from '@/components/app/AppTopBar';
import { getServerSession, getCustomerProfile } from '@/lib/app-auth';

export default async function DashboardLayout({ children }) {
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
    // If profile doesn't exist, redirect to auth
    redirect('/app/auth');
  }

  return (
    <div className="flex h-screen bg-slate-50">
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
  );
}
