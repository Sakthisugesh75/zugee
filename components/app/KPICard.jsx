// components/app/KPICard.jsx
// Reusable KPI card component for dashboard metrics

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  trend,
  trendValue,
  trendLabel,
  color = 'blue',
  loading = false 
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-3.5 h-3.5" />;
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-slate-500';
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-4 bg-slate-200 rounded"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="w-32 h-8 bg-slate-200 rounded mb-2"></div>
        <div className="w-20 h-3 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
        {value}
      </p>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-600 min-w-0">
          {subtitle}
        </p>

        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium shrink-0 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
            {trendLabel && <span className="text-slate-500 ml-1">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
