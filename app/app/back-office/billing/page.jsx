// app/app/back-office/billing/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'Billing'
};

export default function BillingPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Billing"
        description="Invoices and payments"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Billing' }
        ]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={ShoppingCart}
            title="Billing"
            description="Create GST invoices, record payments and see who still owes you money."
          />
        </div>
      </div>
    </div>
  );
}
