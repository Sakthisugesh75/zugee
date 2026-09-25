// components/app/gst/GSTEngineHeader.jsx
"use client";

import { useState } from 'react';
import { Settings, CheckCircle, Edit2, X, Save } from 'lucide-react';

export default function GSTEngineHeader({ gstConfig, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(gstConfig || {});

  const handleEdit = () => {
    setFormData(gstConfig);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(gstConfig);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch('/api/app/gst', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setEditing(false);
        onRefresh();
      } else {
        alert('Failed to update GST configuration');
      }
    } catch (error) {
      console.error('Failed to update GST config:', error);
      alert('Failed to update GST configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!gstConfig) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 tracking-tight mb-1">
              GST Configuration Required
            </h3>
            <p className="text-sm text-amber-700">
              Complete your GST configuration to start tracking tax compliance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
              {gstConfig.registered_state} GST Engine {gstConfig.engine_version}
            </h3>
            <p className="text-sm text-slate-600">
              State-specific tax calculation engine configured for your business
            </p>
          </div>
        </div>

        {!editing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 self-start shrink-0 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Configuration Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">GST Number</p>
          {editing ? (
            <input
              type="text"
              value={formData.gst_number || ''}
              onChange={(e) => handleChange('gst_number', e.target.value)}
              aria-label="GST Number"
              className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
              placeholder="Enter GST number"
            />
          ) : (
            <p className="text-sm font-bold text-slate-900 font-mono">
              {gstConfig.gst_number || 'Not configured'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Default GST Rate</p>
          {editing ? (
            <select
              value={formData.default_gst_rate || 18}
              onChange={(e) => handleChange('default_gst_rate', parseFloat(e.target.value))}
              aria-label="Default GST Rate"
              className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          ) : (
            <p className="text-sm font-bold text-slate-900">
              {gstConfig.default_gst_rate}%
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Composition Scheme</p>
          {editing ? (
            <label className="flex items-center gap-2 min-h-10 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.composition_scheme || false}
                onChange={(e) => handleChange('composition_scheme', e.target.checked)}
                className="w-4 h-4 text-[#1B6FF8] border-slate-300 rounded focus:ring-[#1B6FF8]"
              />
              <span className="text-sm text-slate-700">Enabled</span>
            </label>
          ) : (
            <p className="text-sm font-bold text-slate-900">
              {gstConfig.composition_scheme ? 'Yes' : 'No'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Reverse Charge</p>
          {editing ? (
            <label className="flex items-center gap-2 min-h-10 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.reverse_charge || false}
                onChange={(e) => handleChange('reverse_charge', e.target.checked)}
                className="w-4 h-4 text-[#1B6FF8] border-slate-300 rounded focus:ring-[#1B6FF8]"
              />
              <span className="text-sm text-slate-700">Enabled</span>
            </label>
          ) : (
            <p className="text-sm font-bold text-slate-900">
              {gstConfig.reverse_charge ? 'Yes' : 'No'}
            </p>
          )}
        </div>
      </div>

      {/* Edit Actions */}
      {editing && (
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-6 pt-6 border-t border-blue-200">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1B6FF8] rounded-lg hover:bg-[#1557C7] transition-colors disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
