// app/app/back-office/hr/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import { Users, Plus, UserCheck, UserX, Clock } from 'lucide-react';

export default function HRPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="HR & Employees"
        description="Employee records, attendance, and payroll"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'HR & Employees' }
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Total Employees', value: '—', icon: Users, color: 'blue' },
              { label: 'Active', value: '—', icon: UserCheck, color: 'emerald' },
              { label: 'On Leave', value: '—', icon: Clock, color: 'amber' },
              { label: 'Resigned', value: '—', icon: UserX, color: 'red' }
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

          {/* Employee List/Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Employee Directory</h3>
              </div>
              <select
                aria-label="Filter employees by status"
                className="w-full sm:w-auto px-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B6FF8] focus:border-transparent"
              >
                <option value="all">All Employees</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>

            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">No employees yet</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Add employees to start managing your team records and attendance
              </p>
              <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                <Plus className="w-4 h-4" />
                Add First Employee
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-base font-medium text-slate-900 mb-1">
                Attendance Tracking
              </h4>
              <p className="text-sm text-slate-600">
                Mark attendance and view reports
              </p>
            </button>

            <button className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-base font-medium text-slate-900 mb-1">
                Payroll Management
              </h4>
              <p className="text-sm text-slate-600">
                Process salaries and deductions
              </p>
            </button>

            <button className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="text-base font-medium text-slate-900 mb-1">
                Leave Management
              </h4>
              <p className="text-sm text-slate-600">
                Approve and track leave requests
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
