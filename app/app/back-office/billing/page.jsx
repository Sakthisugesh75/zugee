// app/app/back-office/billing/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import { FileText, Plus, Search } from 'lucide-react';

export default function BillingPage() {
  return (
    <div>
      <AppPageHeader
        title="Sales & Billing"
        description="Manage invoices, payments, and billing records"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Sales & Billing' }
        ]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Invoices', value: '—', color: 'blue' },
            { label: 'Paid', value: '—', color: 'emerald' },
            { label: 'Pending', value: '—', color: 'amber' },
            { label: 'Overdue', value: '—', color: 'red' }
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]"
              />
            </div>
          </div>

          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No invoices yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first invoice to start tracking sales and payments
            </p>
            <button className="mt-4 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
              Create First Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
