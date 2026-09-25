// components/app/PerformanceFunnel.jsx
"use client";

export default function PerformanceFunnel({ data, loading = false }) {
  const defaultData = [
    { stage: 'Impressions', value: 0, color: 'bg-blue-500' },
    { stage: 'Clicks', value: 0, color: 'bg-cyan-500' },
    { stage: 'Leads', value: 0, color: 'bg-emerald-500' },
    { stage: 'Qualified', value: 0, color: 'bg-amber-500' },
    { stage: 'Converted', value: 0, color: 'bg-green-600' }
  ];

  const funnelData = data || defaultData;
  const maxValue = Math.max(...funnelData.map(d => d.value), 1);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="w-full h-12 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate conversion rates between stages
  const getConversionRate = (index) => {
    if (index === 0 || !funnelData[index - 1].value) return null;
    const rate = (funnelData[index].value / funnelData[index - 1].value) * 100;
    return rate.toFixed(1);
  };

  return (
    <div className="space-y-4">
      {funnelData.map((item, index) => {
        const widthPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        const conversionRate = getConversionRate(index);

        return (
          <div key={item.stage} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">
                  {item.stage}
                </span>
                {conversionRate && (
                  <span className="text-xs font-medium text-slate-500">
                    {conversionRate}% conversion
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-slate-900">
                {item.value.toLocaleString()}
              </span>
            </div>

            <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${item.color} transition-all duration-500 ease-out flex items-center justify-start px-4`}
                style={{ width: `${Math.max(widthPercentage, 5)}%` }}
              >
                {widthPercentage > 15 && (
                  <span className="text-xs font-medium text-white">
                    {((item.value / funnelData[0].value) * 100).toFixed(1)}% of total
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Overall Funnel Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Overall Conversion</p>
          <p className="text-lg font-bold text-slate-900">
            {funnelData[0].value > 0
              ? ((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(2)
              : '0.00'}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Total Leads</p>
          <p className="text-lg font-bold text-slate-900">
            {funnelData.find(d => d.stage === 'Leads')?.value.toLocaleString() || '0'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Conversions</p>
          <p className="text-lg font-bold text-slate-900">
            {funnelData[funnelData.length - 1].value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
