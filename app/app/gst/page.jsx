// app/app/gst/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import GSTEngineHeader from '@/components/app/gst/GSTEngineHeader';
import TaxMetricsCards from '@/components/app/gst/TaxMetricsCards';
import GSTSlabTable from '@/components/app/gst/GSTSlabTable';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { RefreshCw, Settings, AlertTriangle } from 'lucide-react';

export default function GSTPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchGSTData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/app/gst');
      const result = await response.json();

      if (result.success) {
        setData(result);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch GST data');
      }
    } catch (err) {
      console.error('Failed to fetch GST data:', err);
      setError('Failed to fetch GST data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGSTData();
  }, []);

  const handleRefresh = () => {
    fetchGSTData(true);
  };

  if (loading && !data) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <AppPageHeader
          title="GST & Compliance"
          description="Tax engine, compliance calendar, and GST reports"
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <LoadingSpinner size="lg" text="Loading GST data..." fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <AppPageHeader
          title="GST & Compliance"
          description="Tax engine, compliance calendar, and GST reports"
        />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load GST data</h3>
              <p className="text-sm text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="GST & Compliance"
        description="Tax engine configuration and GST reporting for your business"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-700 disabled:opacity-50 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Tax Engine Header */}
          <GSTEngineHeader
            gstConfig={data?.gstConfig}
            onRefresh={fetchGSTData}
          />

          {/* Tax Metrics Cards */}
          <TaxMetricsCards
            taxMetrics={data?.taxMetrics}
          />

          {/* GST Slab Breakdown Table */}
          <GSTSlabTable
            gstSlabs={data?.gstSlabs}
            totalRevenue={data?.taxMetrics?.totalRevenue}
            totalTaxCollected={data?.taxMetrics?.totalTaxCollected}
          />
        </div>
      </div>
    </div>
  );
}
