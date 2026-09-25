// components/app/reports/ReportCard.jsx
"use client";

import { FileText, Download, Calendar } from 'lucide-react';

export default function ReportCard({
  title,
  description,
  icon: Icon = FileText,
  iconColor = 'blue',
  periodType = 'date-range',
  format = 'pdf',
  onGenerate,
  generating = false
}) {
  const iconColorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconColorClasses[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">{title}</h3>
          <p className="text-sm text-slate-600 mb-6">{description}</p>

          {/* Period Selector */}
          {periodType === 'date-range' && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                aria-label="Start date"
                className="px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <span className="text-sm text-slate-500">to</span>
              <input
                type="date"
                aria-label="End date"
                className="px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {periodType === 'month' && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="month"
                aria-label="Report month"
                className="px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                defaultValue={new Date().toISOString().substring(0, 7)}
              />
            </div>
          )}

          {/* Format and Generate Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate {format.toUpperCase()}
                </>
              )}
            </button>

            <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium uppercase tracking-wider">
              {format}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
