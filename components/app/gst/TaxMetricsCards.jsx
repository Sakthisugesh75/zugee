// components/app/gst/TaxMetricsCards.jsx
"use client";

import { Receipt, TrendingDown, Calculator, FileText } from 'lucide-react';

export default function TaxMetricsCards({ taxMetrics }) {
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const metrics = [
    {
      label: 'Tax Payable (Output Tax)',
      value: formatCurrency(taxMetrics?.taxPayable || 0),
      subtitle: `From ${taxMetrics?.invoiceCount || 0} invoices`,
      icon: Receipt,
      color: 'red',
      detail: 'CGST + SGST + IGST collected'
    },
    {
      label: 'ITC Claimable (Input Tax Credit)',
      value: formatCurrency(taxMetrics?.itcClaimable || 0),
      subtitle: 'Eligible for credit',
      icon: TrendingDown,
      color: 'emerald',
      detail: 'From purchase invoices'
    },
    {
      label: 'Net Tax Payable',
      value: formatCurrency(taxMetrics?.netTaxPayable || 0),
      subtitle: 'Output Tax - ITC',
      icon: Calculator,
      color: 'amber',
      detail: 'Actual tax liability'
    },
    {
      label: 'Total Revenue (MTD)',
      value: formatCurrency(taxMetrics?.totalRevenue || 0),
      subtitle: `${taxMetrics?.invoiceCount || 0} invoices`,
      icon: FileText,
      color: 'blue',
      detail: 'Before tax'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const colorClass = colorClasses[metric.color];

        return (
          <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
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

            <p className="text-xs text-slate-600 mb-1">
              {metric.subtitle}
            </p>

            <p className="text-xs text-slate-500">
              {metric.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
