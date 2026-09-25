// app/app/ads/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import CampaignCard from '@/components/app/ads/CampaignCard';
import AdsOverview from '@/components/app/ads/AdsOverview';
import EmptyState from '@/components/app/EmptyState';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { TrendingUp, RefreshCw, Filter, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  const fetchCampaigns = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams();
      if (platformFilter !== 'all') params.append('platform', platformFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/app/ads/campaigns?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns);
        setAccounts(data.accounts);
        setSummary(data.summary);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch campaigns');
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [platformFilter, statusFilter]);

  const handleRefresh = () => {
    fetchCampaigns(true);
  };

  if (loading && !campaigns.length) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <AppPageHeader
          title="Ads & Intelligence"
          description="Monitor your Meta and Google ad campaigns"
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <LoadingSpinner size="lg" text="Loading campaigns..." fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error && (!accounts || accounts.length === 0)) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <AppPageHeader
          title="Ads & Intelligence"
          description="Monitor your Meta and Google ad campaigns"
        />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load campaigns</h3>
              <p className="text-sm text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No accounts connected - show empty state
  if (!accounts || accounts.length === 0) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <AppPageHeader
          title="Ads & Intelligence"
          description="Monitor your Meta and Google ad campaigns"
        />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <EmptyState
                icon={TrendingUp}
                title="No ad accounts connected"
                description="Connect your Meta Ads or Google Ads account in the CRM section to see your campaign performance here."
                action={
                  <Link
                    href="/app/crm"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Go to CRM
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Ads & Intelligence"
        description={`Monitoring ${campaigns.length} ${campaigns.length === 1 ? 'campaign' : 'campaigns'} across ${accounts.length} ad ${accounts.length === 1 ? 'account' : 'accounts'}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-700 disabled:opacity-50 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Overview Summary */}
          {summary && <AdsOverview summary={summary} />}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 items-center justify-center shrink-0">
              <Filter className="w-4 h-4 text-slate-500" />
            </div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              aria-label="Filter by platform"
              className="px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="google_ads">Google Ads</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Campaign Cards Grid */}
          {campaigns.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <EmptyState
                icon={TrendingUp}
                title="No campaigns found"
                description="Try adjusting your filters or sync your ad accounts to see campaigns."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
