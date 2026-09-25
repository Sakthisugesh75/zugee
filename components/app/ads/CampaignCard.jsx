// components/app/ads/CampaignCard.jsx
"use client";

import { ExternalLink, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

export default function CampaignCard({ campaign }) {
  const getPlatformInfo = (platform) => {
    const info = {
      meta_ads: {
        name: 'Meta Ads',
        icon: '📘',
        color: 'bg-blue-50 border-blue-200'
      },
      google_ads: {
        name: 'Google Ads',
        icon: '🔍',
        color: 'bg-red-50 border-red-200'
      }
    };
    return info[platform] || info.meta_ads;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      paused: 'bg-amber-100 text-amber-700 border-amber-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      deleted: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || colors.active;
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const platformInfo = getPlatformInfo(campaign.platform);

  // Calculate metrics
  const adSpend = parseFloat(campaign.ad_spend || 0);
  const leads = parseInt(campaign.leads_count || 0, 10);
  const cpl = campaign.cpl ? parseFloat(campaign.cpl) : (leads > 0 ? adSpend / leads : 0);
  const roas = campaign.roas ? parseFloat(campaign.roas) : 0;

  return (
    <div className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${platformInfo.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{platformInfo.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
              {campaign.campaign_name}
            </h3>
            <p className="text-xs text-slate-600">{campaign.account_name}</p>
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Ad Spend */}
        <div className="p-3 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600">Ad Spend</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(adSpend)}
          </p>
        </div>

        {/* ROAS */}
        <div className="p-3 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            {roas > 1 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-slate-600">ROAS</span>
          </div>
          <p className={`text-lg font-bold ${roas > 1 ? 'text-emerald-600' : 'text-red-600'}`}>
            {roas.toFixed(2)}x
          </p>
        </div>

        {/* Leads */}
        <div className="p-3 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600">Leads</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatNumber(leads)}
          </p>
        </div>

        {/* CPL */}
        <div className="p-3 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600">CPL</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {cpl > 0 ? `₹${cpl.toFixed(0)}` : '—'}
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="flex items-center justify-between text-xs text-slate-600 mb-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-slate-500">Impressions:</span>{' '}
          <span className="font-medium text-slate-900">
            {formatNumber(campaign.impressions || 0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Clicks:</span>{' '}
          <span className="font-medium text-slate-900">
            {formatNumber(campaign.clicks || 0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Conv:</span>{' '}
          <span className="font-medium text-slate-900">
            {formatNumber(campaign.conversions || 0)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {campaign.last_synced_at 
            ? `Synced ${new Date(campaign.last_synced_at).toLocaleTimeString()}`
            : 'Never synced'
          }
        </span>
        <button className="flex items-center gap-1 text-xs font-medium text-[#1B6FF8] hover:text-[#1557C7] transition-colors">
          Details
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
