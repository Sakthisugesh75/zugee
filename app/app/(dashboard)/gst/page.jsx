// app/app/gst/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'GST'
};

export default function GSTPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="GST"
        description="GST reporting for your business"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={FileText}
            title="GST reporting"
            description="GST summaries and return-ready reports built from the invoices you create in Zugee."
          />
        </div>
      </div>
    </div>
  );
}
