// app/app/back-office/erp/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import { Package, Plus, AlertTriangle } from 'lucide-react';

export default function ERPPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="ERP Operations"
        description="Inventory, operations, and supply chain management"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'ERP Operations' }
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Total Products', value: '—', icon: Package, color: 'blue' },
              { label: 'In Stock', value: '—', icon: Package, color: 'emerald' },
              { label: 'Low Stock', value: '—', icon: AlertTriangle, color: 'amber' },
              { label: 'Out of Stock', value: '—', icon: AlertTriangle, color: 'red' }
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

          {/* Products/Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Products & Inventory</h3>
              </div>
            </div>

            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">No products yet</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Add products to start tracking inventory and stock levels
              </p>
              <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                <Plus className="w-4 h-4" />
                Add First Product
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900 mb-1">
                  Stock Alerts
                </h4>
                <p className="text-sm text-amber-700">
                  Set up low stock thresholds to receive alerts when inventory runs low
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
