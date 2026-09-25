// app/app/back-office/erp/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { Package } from 'lucide-react';

export const metadata = {
  title: 'Inventory'
};

export default function InventoryPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Inventory"
        description="Products and stock levels"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Inventory' }
        ]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={Package}
            title="Inventory"
            description="Keep a list of your products and track stock as you buy and sell."
          />
        </div>
      </div>
    </div>
  );
}
