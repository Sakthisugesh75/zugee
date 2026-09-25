// components/app/AppSidebar.jsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  ShoppingCart,
  Package,
  UsersRound,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import MascotLogo from '@/components/ui/MascotLogo';

export default function AppSidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [backOfficeExpanded, setBackOfficeExpanded] = useState(true);

  const handleSignOut = async () => {
    try {
      await fetch('/api/app/auth/signout', { method: 'POST' });
      router.push('/app/auth');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const primaryNavItems = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'CRM',
      href: '/app/crm',
      icon: Users,
      badge: 'Leads & Sales'
    },
    {
      name: 'Ads & Intelligence',
      href: '/app/ads',
      icon: TrendingUp
    },
    {
      name: 'GST & Compliance',
      href: '/app/gst',
      icon: FileText
    }
  ];

  const backOfficeItems = [
    {
      name: 'Sales & Billing',
      href: '/app/back-office/billing',
      icon: ShoppingCart
    },
    {
      name: 'ERP Operations',
      href: '/app/back-office/erp',
      icon: Package
    },
    {
      name: 'HR & Employees',
      href: '/app/back-office/hr',
      icon: UsersRound
    },
    {
      name: 'Reports',
      href: '/app/reports',
      icon: BarChart3
    }
  ];

  const isActive = (href) => {
    if (href === '/app/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-screen bg-[#0B1220] border-r border-white/[0.08] flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.08]">
        <Link href="/app/dashboard">
          <MascotLogo size={32} showWordmark={true} showSubline={false} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Primary Navigation */}
        <div className="space-y-1 mb-6">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                    : 'text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono text-slate-500">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Back Office Section */}
        <div>
          <button
            onClick={() => setBackOfficeExpanded(!backOfficeExpanded)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors w-full"
          >
            {backOfficeExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            Back Office
          </button>

          {backOfficeExpanded && (
            <div className="space-y-1 mt-2">
              {backOfficeItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${active
                        ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer - User & Sign Out */}
      <div className="border-t border-white/[0.08] p-3">
        {/* User Info */}
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">
            {profile?.business_name || 'Business Name'}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {profile?.plan_tier === 'starter' && 'Starter Plan'}
            {profile?.plan_tier === 'growth' && 'Growth Plan'}
            {profile?.plan_tier === 'enterprise' && 'Enterprise Plan'}
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
