// app/app/ads/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Ads'
};

export default function AdsPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Ads"
        description="Meta and Google ad performance"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={TrendingUp}
            title="Ads"
            description="Connect your Meta and Google ad accounts to see spend and the leads each campaign brings in."
          />
        </div>
      </div>
    </div>
  );
}
