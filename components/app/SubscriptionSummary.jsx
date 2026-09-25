// components/app/SubscriptionSummary.jsx
// Read-only summary of one ZUGEE subscription for the customer's billing page.
// Amounts come from the subscription's price snapshot via calculateCharges (lib/pricing.js).
// The one-time setup fee is shown as due only while it is pending — never again once paid or waived.

import { CheckCircle2, Clock, Gift } from 'lucide-react';
import { calculateCharges, formatINR } from '@/lib/pricing';
import { SUBSCRIPTION_STATUS_LABELS } from '@/lib/subscription-options';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  past_due: 'bg-rose-50 text-rose-700 border-rose-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200'
};

function formatDate(isoDate) {
  if (!isoDate) return null;
  return new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function SetupStatus({ status }) {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="w-4 h-4" /> Completed
      </span>
    );
  }
  if (status === 'waived') {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-sky-700">
        <Gift className="w-4 h-4" /> Waived
      </span>
    );
  }
  if (status === 'refunded') {
    return <span className="text-sm font-medium text-slate-600">Refunded</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
      <Clock className="w-4 h-4" /> Pending
    </span>
  );
}

function Row({ label, children, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className={`text-sm ${strong ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{label}</dt>
      <dd className={`text-sm text-right ${strong ? 'font-semibold text-slate-900' : 'text-slate-900'}`}>{children}</dd>
    </div>
  );
}

export default function SubscriptionSummary({ subscription }) {
  const sub = subscription;
  const charges = calculateCharges({
    monthlyPrice: sub.monthly_price,
    setupFee: sub.setup_fee,
    setupFeeStatus: sub.setup_fee_status,
    setupDiscount: sub.setup_discount
  });
  const setupPending = sub.setup_fee_status === 'pending';
  const renewal = formatDate(sub.renewal_date);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-5 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{sub.product_name}</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {sub.plan_name} plan · {formatINR(charges.monthlyPrice)}/month
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${
            STATUS_STYLES[sub.subscription_status] || STATUS_STYLES.cancelled
          }`}
        >
          {SUBSCRIPTION_STATUS_LABELS[sub.subscription_status] || sub.subscription_status}
        </span>
      </div>

      <dl className="px-6 divide-y divide-slate-100">
        <Row label="Monthly subscription">{formatINR(charges.monthlyPrice)}/month</Row>
        <Row label="One-time Setup & Onboarding">
          <span className="flex flex-col items-end gap-0.5">
            <span className={sub.setup_fee_status === 'waived' ? 'line-through text-slate-400' : ''}>
              {formatINR(sub.setup_fee_status === 'waived' ? charges.setupFee : charges.setupFee - charges.setupDiscount)}
            </span>
            <SetupStatus status={sub.setup_fee_status} />
          </span>
        </Row>
        {setupPending && (
          <Row label="Initial payment (setup + first month)" strong>
            {formatINR(charges.firstPayment)}
          </Row>
        )}
        <Row label="Next renewal">
          {formatINR(charges.recurringPayment)}
          {renewal ? ` on ${renewal}` : ' — starts after your first payment'}
        </Row>
      </dl>

      <p className="px-6 py-4 text-xs text-slate-500 border-t border-slate-100">
        Amounts exclude GST. The setup fee is charged once; renewals are the monthly price only.
      </p>
    </section>
  );
}
