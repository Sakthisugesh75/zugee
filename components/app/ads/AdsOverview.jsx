// components/app/ads/AdsOverview.jsx
"use client";

import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import KPICard from '../KPICard';

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

  // Rendered with the shared KPICard so metrics match the dashboard
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <KPICard
          key={metric.label}
          icon={metric.icon}
          label={metric.label}
          value={metric.value}
          subtitle={metric.subtitle}
          color={metric.color}
        />
      ))}
    </div>
  );
}
