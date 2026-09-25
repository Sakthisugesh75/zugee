// app/app/gst/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import GSTEngineHeader from '@/components/app/gst/GSTEngineHeader';
import TaxMetricsCards from '@/components/app/gst/TaxMetricsCards';
import GSTSlabTable from '@/components/app/gst/GSTSlabTable';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { RefreshCw, Settings } from 'lucide-react';

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
      <div>
        <AppPageHeader
          title="GST & Compliance"
          description="Tax engine, compliance calendar, and GST reports"
        />
        <div className="p-6">
          <LoadingSpinner size="lg" text="Loading GST data..." fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AppPageHeader
          title="GST & Compliance"
          description="Tax engine, compliance calendar, and GST reports"
        />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-900 font-medium mb-2">Failed to load GST data</p>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppPageHeader
        title="GST & Compliance"
        description="Tax engine configuration and GST reporting for your business"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
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
  );
}
