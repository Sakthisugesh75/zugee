// app/app/dashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import AIInsightCard from '@/components/app/AIInsightCard';
import PerformanceFunnel from '@/components/app/PerformanceFunnel';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { Users, DollarSign, TrendingUp, Clock, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/app/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDismissInsight = async (insightId) => {
    try {
      // TODO: Implement dismiss insight API call
      setData(prevData => ({
        ...prevData,
        insights: prevData.insights.filter(i => i.id !== insightId)
      }));
    } catch (err) {
      console.error('Failed to dismiss insight:', err);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Sample funnel data (will be replaced with real data from campaigns)
  const funnelData = [
    { stage: 'Impressions', value: 125000, color: 'bg-blue-500' },
    { stage: 'Clicks', value: 3200, color: 'bg-cyan-500' },
    { stage: 'Leads', value: data?.kpis?.leadsToday?.value || 0, color: 'bg-emerald-500' },
    { stage: 'Qualified', value: Math.floor((data?.kpis?.leadsToday?.value || 0) * 0.6), color: 'bg-amber-500' },
    { stage: 'Converted', value: Math.floor((data?.kpis?.leadsToday?.value || 0) * 0.2), color: 'bg-green-600' }
  ];

  if (loading && !data) {
    return (
      <div className="h-full flex flex-col">
        <AppPageHeader
          title="Dashboard"
          description="Welcome to your Zugee dashboard"
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
          description="Welcome to your Zugee dashboard"
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

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <AppPageHeader
        title="Dashboard"
        description={`Welcome back, ${data?.profile?.business_name || 'User'}`}
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
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <KPICard
              icon={Users}
              label="Today's Leads"
              value={data?.kpis?.leadsToday?.value || 0}
              subtitle={data?.kpis?.leadsToday?.subtitle || 'No leads yet'}
              trend={data?.kpis?.leadsToday?.trend}
              trendValue={data?.kpis?.leadsToday?.trendValue}
              color="blue"
            />

            <KPICard
              icon={DollarSign}
              label="Revenue (MTD)"
              value={data?.kpis?.revenue?.formatted || '₹0'}
              subtitle={data?.kpis?.revenue?.subtitle || 'No revenue yet'}
              trend={data?.kpis?.revenue?.trend}
              trendValue={data?.kpis?.revenue?.trendValue}
              color="emerald"
            />

            <KPICard
              icon={TrendingUp}
              label="Ad Spend (MTD)"
              value={data?.kpis?.adSpend?.formatted || '₹0'}
              subtitle={data?.kpis?.adSpend?.subtitle || 'No campaigns'}
              trend={data?.kpis?.adSpend?.trend}
              trendValue={data?.kpis?.adSpend?.trendValue}
              color="cyan"
            />

            <KPICard
              icon={Clock}
              label="Pending Follow-ups"
              value={data?.kpis?.pendingFollowUps?.value || 0}
              subtitle={data?.kpis?.pendingFollowUps?.subtitle || 'All caught up'}
              trend={data?.kpis?.pendingFollowUps?.trend}
              trendValue={data?.kpis?.pendingFollowUps?.trendValue}
              color="amber"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Performance Funnel - Takes 2 columns on xl */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Performance Funnel</h3>
                    <p className="text-sm text-slate-600">Conversion metrics at each stage</p>
                  </div>
                </div>
                <PerformanceFunnel data={funnelData} loading={loading} />
              </div>
            </div>

            {/* AI Insights - Takes 1 column on xl */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
                    <p className="text-sm text-slate-600">Actionable recommendations</p>
                  </div>
                </div>

                {data?.insights && data.insights.length > 0 ? (
                  <div className="space-y-4">
                    {data.insights.map((insight) => (
                      <AIInsightCard
                        key={insight.id}
                        insight={insight}
                        onDismiss={() => handleDismissInsight(insight.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      All systems optimal
                    </h4>
                    <p className="text-sm text-slate-600">
                      No issues detected. Keep up the great work!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
