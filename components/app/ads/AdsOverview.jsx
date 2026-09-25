// components/app/ads/AdsOverview.jsx
"use client";

import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function AdsOverview({ summary }) {
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

  const metrics = [
    {
      label: 'Total Ad Spend',
      value: formatCurrency(summary.totalSpend),
      subtitle: `${summary.activeCampaigns} active campaigns`,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Total Leads',
      value: formatNumber(summary.totalLeads),
      subtitle: `${summary.totalConversions} conversions`,
      icon: Users,
      color: 'emerald'
    },
    {
      label: 'Avg CPL',
      value: summary.avgCPL > 0 ? `₹${summary.avgCPL.toFixed(0)}` : '—',
      subtitle: 'Cost per lead',
      icon: Target,
      color: 'cyan'
    },
    {
      label: 'Avg ROAS',
      value: summary.avgROAS > 0 ? `${summary.avgROAS.toFixed(2)}x` : '—',
      subtitle: 'Return on ad spend',
      icon: TrendingUp,
      color: summary.avgROAS > 1 ? 'emerald' : 'amber'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const colorClass = colorClasses[metric.color];

        return (
          <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {metric.label}
              </p>
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900 mb-1">
              {metric.value}
            </p>

            <p className="text-xs text-slate-600">
              {metric.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
