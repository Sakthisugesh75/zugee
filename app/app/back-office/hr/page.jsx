// app/app/back-office/hr/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import { Users, Plus, UserCheck, UserX, Clock } from 'lucide-react';

export default function HRPage() {
  return (
    <div>
      <AppPageHeader
        title="HR & Employees"
        description="Employee records, attendance, and payroll"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'HR & Employees' }
        ]}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Employees', value: '—', icon: Users, color: 'blue' },
            { label: 'Active', value: '—', icon: UserCheck, color: 'emerald' },
            { label: 'On Leave', value: '—', icon: Clock, color: 'amber' },
            { label: 'Resigned', value: '—', icon: UserX, color: 'red' }
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

        {/* Employee List/Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Employee Directory</h3>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6FF8]">
                <option value="all">All Employees</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
          </div>

          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No employees yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Add employees to start managing your team records and attendance
            </p>
            <button className="mt-4 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium">
              Add First Employee
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow">
            <Clock className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              Attendance Tracking
            </h4>
            <p className="text-xs text-slate-600">
              Mark attendance and view reports
            </p>
          </button>

          <button className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow">
            <Users className="w-8 h-8 text-emerald-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              Payroll Management
            </h4>
            <p className="text-xs text-slate-600">
              Process salaries and deductions
            </p>
          </button>

          <button className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow">
            <UserCheck className="w-8 h-8 text-cyan-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              Leave Management
            </h4>
            <p className="text-xs text-slate-600">
              Approve and track leave requests
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
