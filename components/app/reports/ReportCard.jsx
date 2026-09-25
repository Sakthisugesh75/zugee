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
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl ${iconColorClasses[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-600 mb-4">{description}</p>

          {/* Period Selector */}
          {periodType === 'date-range' && (
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {periodType === 'month' && (
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="month"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
                defaultValue={new Date().toISOString().substring(0, 7)}
              />
            </div>
          )}

          {/* Format and Generate Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium uppercase">
              {format}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
