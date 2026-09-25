// app/app/back-office/billing/page.jsx
<<<<<<< Updated upstream
"use client";
=======
// Billing: the customer's ZUGEE subscription (read-only) + invoicing for their own business (not built yet).
import { cookies } from 'next/headers';
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import SubscriptionSummary from '@/components/app/SubscriptionSummary';
import { getServerSession } from '@/lib/app-auth';
import { getCustomerSubscriptions } from '@/lib/subscriptions';
import { ShoppingCart } from 'lucide-react';
>>>>>>> Stashed changes

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import KPICard from '@/components/app/KPICard';
import { FileText, Plus, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

async function loadSubscriptions() {
  // Same session lookup as app/app/layout.jsx (which already redirects signed-out visitors).
  const cookieStore = await cookies();
  const { user } = await getServerSession(cookieStore);
  if (!user) return { subscriptions: [], failed: false };
  try {
    return { subscriptions: await getCustomerSubscriptions(user.id), failed: false };
  } catch (err) {
    console.error('[Billing] Failed to load subscriptions:', err);
    return { subscriptions: [], failed: true };
  }
}

export default async function BillingPage() {
  const { subscriptions, failed } = await loadSubscriptions();

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
<<<<<<< Updated upstream
        title="Sales & Billing"
        description="Manage invoices, payments, and billing records"
=======
        title="Billing"
        description="Your ZUGEE subscription, invoices and payments"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Subscription</h2>
            {failed ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-sm text-slate-600">
                We couldn&apos;t load your subscription right now. Please try again in a moment.
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-sm text-slate-600">
                No active subscription yet — our team sets this up after your demo.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {subscriptions.map((sub) => (
                  <SubscriptionSummary key={sub.id} subscription={sub} />
                ))}
              </div>
            )}
          </div>

          <ComingSoon
            icon={ShoppingCart}
            title="Invoices for your customers"
            description="Create GST invoices, record payments and see who still owes you money."
          />
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
}
