// app/app/back-office/erp/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import { Package, Plus, AlertTriangle } from 'lucide-react';

export default function ERPPage() {
  return (
    <div>
      <AppPageHeader
        title="ERP Operations"
        description="Inventory, operations, and supply chain management"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'ERP Operations' }
        ]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: '—', icon: Package, color: 'blue' },
            { label: 'In Stock', value: '—', icon: Package, color: 'emerald' },
            { label: 'Low Stock', value: '—', icon: AlertTriangle, color: 'amber' },
            { label: 'Out of Stock', value: '—', icon: AlertTriangle, color: 'red' }
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              </div>
            );
          })}
        </div>

        {/* Products/Inventory Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Products & Inventory</h3>
          </div>

          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No products yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Add products to start tracking inventory and stock levels
            </p>
            <button className="mt-4 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
              Add First Product
            </button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                Stock Alerts
              </h4>
              <p className="text-xs text-amber-700">
                Set up low stock thresholds to receive alerts when inventory runs low
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
