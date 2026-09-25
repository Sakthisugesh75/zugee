// components/app/AppTopBar.jsx
"use client";

import { useState } from 'react';
import { Search, Bell, Filter, User } from 'lucide-react';

export default function AppTopBar({ profile, currentSection = 'Dashboard' }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left Side - Section Name & System Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900">{currentSection}</h1>
        
        {/* System Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">System Live</span>
        </div>
      </div>

      {/* Right Side - Search, Notifications, Filter, User */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* Filter */}
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Filter className="w-5 h-5 text-slate-600" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B6FF8] to-[#00F0FF] flex items-center justify-center text-white text-sm font-bold">
            {profile?.business_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-medium text-slate-900 truncate max-w-32">
              {profile?.business_name || 'User'}
            </p>
            <p className="text-xs text-slate-500">
              {profile?.plan_tier || 'starter'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
