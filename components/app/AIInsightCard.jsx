// components/app/AIInsightCard.jsx
// AI Insight alert card component

import { AlertTriangle, TrendingDown, Clock, AlertCircle, X } from 'lucide-react';

export default function AIInsightCard({ 
  insight,
  onDismiss 
}) {
  const { insight_type, severity, title, description, action_label, action_url } = insight;

  const getIcon = () => {
    switch (insight_type) {
      case 'wasted_ad_spend':
        return <TrendingDown className="w-5 h-5" />;
      case 'lead_decay':
        return <Clock className="w-5 h-5" />;
      case 'overdue_payment':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'bg-red-100 text-red-600',
          text: 'text-red-900',
          subtext: 'text-red-700',
          button: 'text-red-600 hover:bg-red-100'
        };
      case 'high':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'bg-amber-100 text-amber-600',
          text: 'text-amber-900',
          subtext: 'text-amber-700',
          button: 'text-amber-600 hover:bg-amber-100'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'bg-blue-100 text-blue-600',
          text: 'text-blue-900',
          subtext: 'text-blue-700',
          button: 'text-blue-600 hover:bg-blue-100'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          icon: 'bg-slate-100 text-slate-600',
          text: 'text-slate-900',
          subtext: 'text-slate-700',
          button: 'text-slate-600 hover:bg-slate-100'
        };
    }
  };

  const colors = getSeverityColor();

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.icon}`}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-semibold ${colors.text}`}>
              {title}
            </h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`p-1 rounded hover:bg-white/50 transition-colors ${colors.button}`}
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className={`text-xs mb-3 ${colors.subtext}`}>
            {description}
          </p>

          {action_label && action_url && (
            <a
              href={action_url}
              className={`inline-flex items-center text-xs font-medium ${colors.button} px-3 py-1.5 rounded-lg transition-colors`}
            >
              {action_label} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
