// app/app/dashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import { Users, UserPlus, Clock, CheckCircle, RefreshCw } from 'lucide-react';

async function fetchDashboard(signal) {
  const response = await fetch('/api/app/dashboard', { signal });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Bumped by Refresh / Try Again to re-run the fetch effect
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboard(controller.signal)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
        setRefreshing(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setReloadKey((k) => k + 1);
  };

  if (loading && !data) {
    return (
      <div className="h-full flex flex-col">
        <AppPageHeader
          title="Dashboard"
          description="Your leads at a glance"
        />
        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <KPICard key={i} loading={true} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <AppPageHeader
          title="Dashboard"
          description="Your leads at a glance"
        />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load dashboard</h3>
              <p className="text-sm text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <AppPageHeader
        title="Dashboard"
        description={data?.profile?.business_name ? `Welcome back, ${data.profile.business_name}` : 'Your leads at a glance'}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-700 disabled:opacity-50 shadow-sm hover:shadow"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          {/* KPI Cards Grid - counts of your CRM leads, nothing estimated */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <KPICard
              icon={Users}
              label="Total Leads"
              value={kpis.totalLeads ?? 0}
              subtitle="All leads in your CRM"
              color="blue"
            />

            <KPICard
              icon={UserPlus}
              label="New Today"
              value={kpis.leadsToday ?? 0}
              subtitle="Added since midnight (IST)"
              color="cyan"
            />

            <KPICard
              icon={Clock}
              label="Follow-ups Due"
              value={kpis.followUpsDue ?? 0}
              subtitle="Due today or overdue"
              color="amber"
            />

            <KPICard
              icon={CheckCircle}
              label="Converted"
              value={kpis.converted ?? 0}
              subtitle="Leads marked converted"
              color="emerald"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Work your leads</h3>
              <p className="text-sm text-slate-600">Update status, priority, follow-up dates and notes in the CRM.</p>
            </div>
            <Link
              href="/app/crm"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shrink-0"
            >
              Open CRM
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
