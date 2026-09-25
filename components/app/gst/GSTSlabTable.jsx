// components/app/gst/GSTSlabTable.jsx
"use client";

import { TrendingUp, Receipt } from 'lucide-react';

export default function GSTSlabTable({ gstSlabs, totalRevenue, totalTaxCollected }) {
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const getSlabColor = (rate) => {
    const colors = {
      0: 'bg-slate-100 text-slate-700',
      5: 'bg-blue-100 text-blue-700',
      12: 'bg-cyan-100 text-cyan-700',
      18: 'bg-emerald-100 text-emerald-700',
      28: 'bg-red-100 text-red-700'
    };
    return colors[rate] || 'bg-slate-100 text-slate-700';
  };

  if (!gstSlabs || gstSlabs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 py-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-900">No GST data available for this month</p>
        <p className="text-sm text-slate-600 mt-1">
          Create invoices to see GST slab breakdown
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              GST Slab-wise Revenue Breakdown
            </h3>
            <p className="text-sm text-slate-600">
              Revenue and tax collection across different GST rates
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                GST Slab
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tax Collected
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Invoices
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                % of Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {gstSlabs.map((slab) => {
              const revenuePercentage = totalRevenue > 0 
                ? (slab.revenue / totalRevenue) * 100 
                : 0;

              return (
                <tr key={slab.rate} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSlabColor(slab.rate)}`}>
                      {slab.rate}% GST
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                    {formatCurrency(slab.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                    {formatCurrency(slab.taxCollected)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                    {slab.invoiceCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {revenuePercentage.toFixed(1)}%
                      </span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr className="font-semibold">
              <td className="px-6 py-4 text-sm text-slate-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                {formatCurrency(totalRevenue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                {formatCurrency(totalTaxCollected)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                {gstSlabs.reduce((sum, slab) => sum + slab.invoiceCount, 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Note */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          💡 <strong>Note:</strong> Tax breakdown is based on invoices generated this month. 
          Revenue excludes tax amount. ITC (Input Tax Credit) is estimated based on purchase patterns.
        </p>
      </div>
    </div>
  );
}
