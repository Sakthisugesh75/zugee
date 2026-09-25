// app/app/back-office/billing/page.jsx
// Billing: the customer's ZUGEE subscription (read-only) + invoicing for their own business (not built yet).
import { cookies } from 'next/headers';
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import SubscriptionSummary from '@/components/app/SubscriptionSummary';
import { getServerSession } from '@/lib/app-auth';
import { getCustomerSubscriptions } from '@/lib/subscriptions';
import { ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'Billing'
};

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
        title="Billing"
        description="Your ZUGEE subscription, invoices and payments"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Billing' }
        ]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
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
        </div>
      </div>
    </div>
  );
}
