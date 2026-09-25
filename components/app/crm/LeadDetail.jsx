// components/app/crm/LeadDetail.jsx
"use client";

import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, DollarSign, MessageSquare, Save, X } from 'lucide-react';
import EmptyState from '../EmptyState';

export default function LeadDetail({ lead, onUpdate, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(lead || {});

  if (!lead) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
        <EmptyState
          icon={MessageSquare}
          title="Select a lead to view details"
          description="Choose a lead from the list on the left to see their information and update their status."
        />
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(lead);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(lead);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch('/api/app/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, ...formData })
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.lead);
        setEditing(false);
      } else {
        alert('Failed to update lead');
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight truncate">{lead.name}</h3>
          {lead.company && (
            <p className="text-sm text-slate-600 truncate">{lead.company}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                aria-label="Cancel editing"
                className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 h-10 text-sm font-medium text-white bg-[#1B6FF8] rounded-lg hover:bg-[#1557C7] transition-colors disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 h-10 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Contact Information
          </h4>
          <div className="space-y-3">
            {editing ? (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-900 truncate">{lead.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-900">{lead.phone || 'No phone'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lead Details */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Lead Details
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Status</label>
              {editing ? (
                <select
                  value={formData.status || 'new'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="hot">Hot</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              ) : (
                <p className="text-sm text-slate-900 capitalize">{lead.status.replace('_', ' ')}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Priority</label>
              {editing ? (
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className="text-sm text-slate-900 capitalize">{lead.priority}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Source</label>
              <p className="text-sm text-slate-900 capitalize">{lead.source.replace('_', ' ')}</p>
            </div>

            {editing ? (
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Estimated Value</label>
                <input
                  type="number"
                  value={formData.estimated_value || ''}
                  onChange={(e) => handleChange('estimated_value', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ) : lead.estimated_value && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900">₹{parseFloat(lead.estimated_value).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Timeline
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Created</span>
              <span className="text-slate-900 text-right">{formatDate(lead.created_at)}</span>
            </div>
            {lead.first_contact_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">First Contact</span>
                <span className="text-slate-900 text-right">{formatDate(lead.first_contact_at)}</span>
              </div>
            )}
            {lead.last_contact_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Last Contact</span>
                <span className="text-slate-900 text-right">{formatDate(lead.last_contact_at)}</span>
              </div>
            )}
            {lead.next_follow_up_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Next Follow-up</span>
                <span className="text-slate-900 text-right">{formatDate(lead.next_follow_up_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Notes
          </h4>
          {editing ? (
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
              placeholder="Add notes about this lead..."
            />
          ) : (
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {lead.notes || 'No notes yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
