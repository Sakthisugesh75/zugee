// app/app/ads/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import CampaignCard from '@/components/app/ads/CampaignCard';
import AdsOverview from '@/components/app/ads/AdsOverview';
import EmptyState from '@/components/app/EmptyState';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { TrendingUp, RefreshCw, Filter } from 'lucide-react';
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
      <div>
        <AppPageHeader
          title="Ads & Intelligence"
          description="Monitor your Meta and Google ad campaigns"
        />
        <div className="p-6">
          <LoadingSpinner size="lg" text="Loading campaigns..." fullScreen={false} />
        </div>
      </div>
    );
  }

  // No accounts connected - show empty state
  if (!accounts || accounts.length === 0) {
    return (
      <div>
        <AppPageHeader
          title="Ads & Intelligence"
          description="Monitor your Meta and Google ad campaigns"
        />
        <div className="p-6">
          <EmptyState
            icon={TrendingUp}
            title="No ad accounts connected"
            description="Connect your Meta Ads or Google Ads account in the CRM section to see your campaign performance here."
            action={
              <Link
                href="/app/crm"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium"
              >
                Go to CRM
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppPageHeader
        title="Ads & Intelligence"
        description={`Monitoring ${campaigns.length} ${campaigns.length === 1 ? 'campaign' : 'campaigns'} across ${accounts.length} ad ${accounts.length === 1 ? 'account' : 'accounts'}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Overview Summary */}
        {summary && <AdsOverview summary={summary} />}

        {/* Filters */}
        <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] bg-white"
          >
            <option value="all">All Platforms</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Campaign Cards Grid */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <EmptyState
              icon={TrendingUp}
              title="No campaigns found"
              description="Try adjusting your filters or sync your ad accounts to see campaigns."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
