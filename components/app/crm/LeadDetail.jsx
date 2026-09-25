// components/app/crm/LeadDetail.jsx
"use client";

import { useState } from 'react';
import { Mail, Phone, IndianRupee, MessageSquare, Save, X, AlertCircle } from 'lucide-react';
import EmptyState from '../EmptyState';

// Fields the user can edit here. Only fields that actually changed are sent.
const EDITABLE_FIELDS = ['email', 'phone', 'status', 'priority', 'estimated_value', 'next_follow_up_at', 'notes'];

// ISO timestamp -> value for <input type="datetime-local"> in the browser's timezone
function toLocalInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toFormData(lead) {
  if (!lead) return {};
  return {
    email: lead.email || '',
    phone: lead.phone || '',
    status: lead.status || 'new',
    priority: lead.priority || 'medium',
    estimated_value: lead.estimated_value ?? '',
    next_follow_up_at: toLocalInputValue(lead.next_follow_up_at),
    notes: lead.notes || ''
  };
}

// Convert a form value to what the API/database expects
function normalize(field, value) {
  if (field === 'estimated_value') {
    return value === '' || value === null ? null : Number(value);
  }
  if (field === 'next_follow_up_at') {
    return value ? new Date(value).toISOString() : null;
  }
  if (field === 'email' || field === 'phone' || field === 'notes') {
    const trimmed = (value || '').trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
}

// The CRM page keys this component by lead.id, so all state resets when a different lead is selected.
export default function LeadDetail({ lead, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState(() => toFormData(lead));

  if (!lead) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
        <EmptyState
          icon={MessageSquare}
          title="Select a lead to view details"
          description="Choose a lead from the list to see their information and update their status."
        />
      </div>
    );
  }

  const handleEdit = () => {
    setFormData(toFormData(lead));
    setSaveError('');
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(toFormData(lead));
    setSaveError('');
    setEditing(false);
  };

  const handleSave = async () => {
    // Send only the fields that changed
    const original = toFormData(lead);
    const changes = {};
    for (const field of EDITABLE_FIELDS) {
      if (String(formData[field] ?? '') !== String(original[field] ?? '')) {
        changes[field] = normalize(field, formData[field]);
      }
    }

    if (Object.keys(changes).length === 0) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError('');

      const response = await fetch('/api/app/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, ...changes })
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.lead);
        setEditing(false);
      } else {
        setSaveError(data.error || 'Failed to update lead');
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      setSaveError('Failed to update lead');
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

  const hasEstimatedValue = lead.estimated_value !== null && lead.estimated_value !== undefined && lead.estimated_value !== '';

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
        {saveError && (
          <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{saveError}</p>
          </div>
        )}

        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Contact Information
          </h4>
          <div className="space-y-3">
            {editing ? (
              <>
                <div>
                  <label htmlFor="lead-email" className="text-xs font-medium text-slate-700 mb-1 block">Email</label>
                  <input
                    id="lead-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="text-xs font-medium text-slate-700 mb-1 block">Phone</label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={formData.phone}
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
              <label htmlFor="lead-status" className="text-xs font-medium text-slate-700 mb-1 block">Status</label>
              {editing ? (
                <select
                  id="lead-status"
                  value={formData.status}
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
                <p className="text-sm text-slate-900 capitalize">{(lead.status || '').replace('_', ' ')}</p>
              )}
            </div>

            <div>
              <label htmlFor="lead-priority" className="text-xs font-medium text-slate-700 mb-1 block">Priority</label>
              {editing ? (
                <select
                  id="lead-priority"
                  value={formData.priority}
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
              <p className="text-xs font-medium text-slate-700 mb-1">Source</p>
              <p className="text-sm text-slate-900 capitalize">{(lead.source || '').replace('_', ' ')}</p>
            </div>

            {editing ? (
              <>
                <div>
                  <label htmlFor="lead-value" className="text-xs font-medium text-slate-700 mb-1 block">Estimated Value (₹)</label>
                  <input
                    id="lead-value"
                    type="number"
                    min="0"
                    value={formData.estimated_value}
                    onChange={(e) => handleChange('estimated_value', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="lead-follow-up" className="text-xs font-medium text-slate-700 mb-1 block">Next Follow-up</label>
                  <input
                    id="lead-follow-up"
                    type="datetime-local"
                    value={formData.next_follow_up_at}
                    onChange={(e) => handleChange('next_follow_up_at', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                  />
                </div>
              </>
            ) : hasEstimatedValue && (
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900">₹{parseFloat(lead.estimated_value).toLocaleString('en-IN')}</span>
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
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              maxLength={5000}
              aria-label="Notes"
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
