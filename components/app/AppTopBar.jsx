// components/app/AppTopBar.jsx
"use client";

import { usePathname } from 'next/navigation';

// Page titles by route prefix. Longest match wins.
const SECTION_TITLES = [
  { href: '/app/dashboard', title: 'Dashboard' },
  { href: '/app/crm', title: 'CRM' },
  { href: '/app/ads', title: 'Ads' },
  { href: '/app/gst', title: 'GST' },
  { href: '/app/back-office/billing', title: 'Billing' },
  { href: '/app/back-office/erp', title: 'Inventory' },
  { href: '/app/back-office/hr', title: 'Employees' },
  { href: '/app/reports', title: 'Reports' }
];

function getSectionTitle(pathname) {
  const match = SECTION_TITLES
    .filter((s) => pathname === s.href || pathname.startsWith(`${s.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match ? match.title : 'Dashboard';
}

export default function AppTopBar({ profile }) {
  const pathname = usePathname() || '';
  const currentSection = getSectionTitle(pathname);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between gap-4 px-8">
      {/* Left Side - Section Name */}
      <div className="flex items-center gap-4 min-w-0">
        <p className="text-xl font-bold text-slate-900 tracking-tight truncate">{currentSection}</p>
      </div>

      {/* Right Side - Business */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-8 h-8 rounded-full bg-linear-to-br from-[#1B6FF8] to-[#00F0FF] flex items-center justify-center text-white text-sm font-bold"
          aria-hidden="true"
        >
          {profile?.business_name?.[0]?.toUpperCase() || 'U'}
        </div>
        <p className="hidden lg:block text-sm font-medium text-slate-900 truncate max-w-48">
          {profile?.business_name || 'Your business'}
        </p>
      </div>
    </header>
  );
}
