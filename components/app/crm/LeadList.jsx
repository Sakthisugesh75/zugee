// components/app/crm/LeadList.jsx
"use client";

import { Search, Filter } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

export default function LeadList({
  leads,
  loading,
  selectedLead,
  onSelectLead,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange
}) {
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      hot: 'bg-red-100 text-red-700 border-red-200',
      follow_up: 'bg-amber-100 text-amber-700 border-amber-200',
      contacted: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      qualified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      converted: 'bg-green-100 text-green-700 border-green-200',
      lost: 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'New',
      hot: 'Hot',
      follow_up: 'Follow-up',
      contacted: 'Contacted',
      qualified: 'Qualified',
      converted: 'Converted',
      lost: 'Lost'
    };
    return labels[status] || status;
  };

  const getSourceIcon = (source) => {
    const sources = {
      meta_ads: '📘',
      google_ads: '🔍',
      direct: '🌐',
      whatsapp: '💬',
      website: '🖥️',
      referral: '👥',
      other: '📌'
    };
    return sources[source] || sources.other;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = now - created;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-full flex flex-col">
      {/* Header with Search */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent bg-white"
        >
          <option value="all">All Leads</option>
          <option value="new">New</option>
          <option value="hot">Hot</option>
          <option value="follow_up">Follow-up</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Lead List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="md" text="Loading leads..." />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-900 mb-1">No leads found</p>
              <p className="text-xs text-slate-600">Try adjusting your filters or add a new lead</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-[#1B6FF8]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {lead.name}
                    </h4>
                    {lead.company && (
                      <p className="text-xs text-slate-600 truncate">{lead.company}</p>
                    )}
                  </div>
                  <span className="text-lg shrink-0">
                    {getSourceIcon(lead.source)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(lead.status)}`}>
                    {getStatusLabel(lead.status)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {getTimeAgo(lead.created_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Count */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-600 text-center">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </p>
      </div>
    </div>
  );
}
