// app/app/reports/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Reports'
};

export default function ReportsPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Reports"
        description="Business reports and data exports"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Reports' }
        ]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={BarChart3}
            title="Reports"
            description="Download sales, outstanding and stock reports for any period, built from your own records."
          />
        </div>
      </div>
    </div>
  );
}
