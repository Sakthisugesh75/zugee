// components/app/reports/ReportHistory.jsx
"use client";

import { FileText, Download, Calendar, Clock } from 'lucide-react';

export default function ReportHistory({ reports = [], onDownload }) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 py-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-900">No reports generated yet</p>
        <p className="text-sm text-slate-600 mt-1">
          Generate your first report to see it here
        </p>
      </div>
    );
  }

  const formatReportType = (type) => {
    const types = {
      daily_business: 'Daily Business Report',
      monthly_gst_audit: 'Monthly GST Audit'
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Report History</h3>
        <p className="text-sm text-slate-600 mt-1">Recently generated reports</p>
      </div>

      <div className="divide-y divide-slate-100">
        {reports.map((report) => (
          <div
            key={report.id}
            className="px-8 py-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {formatReportType(report.report_type)}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(report.period_start)} - {formatDate(report.period_end)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(report.generated_at)} at {formatTime(report.generated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium uppercase tracking-wider">
                      {report.format}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDownload(report)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 self-start shrink-0 text-sm font-medium text-[#1B6FF8] border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
