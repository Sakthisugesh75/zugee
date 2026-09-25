// components/app/reports/ReportHistory.jsx
"use client";

import { FileText, Download, Calendar, Clock } from 'lucide-react';

export default function ReportHistory({ reports = [], onDownload }) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No reports generated yet</p>
        <p className="text-sm text-slate-500 mt-1">
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
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Report History</h3>
        <p className="text-sm text-slate-600 mt-1">Recently generated reports</p>
      </div>

      <div className="divide-y divide-slate-200">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {formatReportType(report.report_type)}
                  </h4>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
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
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium uppercase">
                      {report.format}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDownload(report)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1B6FF8] hover:bg-blue-50 rounded-lg transition-colors"
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
