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
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Settings className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-1">
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
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {gstConfig.registered_state} GST Engine {gstConfig.engine_version}
            </h3>
            <p className="text-sm text-slate-700">
              State-specific tax calculation engine configured for your business
            </p>
          </div>
        </div>

        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Configuration Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">GST Number</p>
          {editing ? (
            <input
              type="text"
              value={formData.gst_number || ''}
              onChange={(e) => handleChange('gst_number', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
              placeholder="Enter GST number"
            />
          ) : (
            <p className="text-sm font-bold text-slate-900 font-mono">
              {gstConfig.gst_number || 'Not configured'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Default GST Rate</p>
          {editing ? (
            <select
              value={formData.default_gst_rate || 18}
              onChange={(e) => handleChange('default_gst_rate', parseFloat(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
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

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Composition Scheme</p>
          {editing ? (
            <label className="flex items-center gap-2">
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

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-600 mb-1">Reverse Charge</p>
          {editing ? (
            <label className="flex items-center gap-2">
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
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-blue-200">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1B6FF8] rounded-lg hover:bg-[#1557C7] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
