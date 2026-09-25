// components/app/ComingSoon.jsx
// Honest placeholder for modules that are not built yet.
// No dates, no preview data, no buttons that do nothing.

import { Clock } from 'lucide-react';

export default function ComingSoon({
  icon: Icon = Clock,
  title,
  description
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 mb-4">
            <Icon className="w-8 h-8 text-slate-400" />
          </div>

          <p className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wider">
              Coming Soon
            </span>
          </p>

          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
