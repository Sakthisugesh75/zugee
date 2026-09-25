// app/app/back-office/billing/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import { FileText, Plus, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Sales & Billing"
        description="Manage invoices, payments, and billing records"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Sales & Billing' }
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Total Invoices', value: '—', icon: FileText, color: 'blue' },
              { label: 'Paid', value: '—', icon: CheckCircle, color: 'emerald' },
              { label: 'Pending', value: '—', icon: Clock, color: 'amber' },
              { label: 'Overdue', value: '—', icon: AlertCircle, color: 'red' }
            ].map((metric) => (
              <KPICard
                key={metric.label}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                color={metric.color}
              />
            ))}
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  aria-label="Search invoices"
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">No invoices yet</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Create your first invoice to start tracking sales and payments
              </p>
              <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                <Plus className="w-4 h-4" />
                Create First Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
