// components/admin/SubscriptionsManager.jsx
// Admin portal: subscriptions and the one-time Setup & Onboarding fee.
// Every price shown here is computed from lib/pricing.js; the server snapshots prices on creation
// and never accepts them from the browser.
//
// There is no payment gateway yet (Razorpay is Phase 6). "Record … payment" logs money the team has
// already collected by UPI / bank transfer — it never charges anyone.
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MascotLogo from "@/components/ui/MascotLogo";
import AdminNav from "@/components/admin/AdminNav";
import { PLANS, SETUP_WAIVER_REASONS, calculateCharges, formatINR, newSubscriptionCharges } from "@/lib/pricing";
import { PRODUCTS } from "@/lib/products";
import {
  PAYMENT_METHODS,
  SETUP_STATUS_LABELS,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_STATUS_LABELS
} from "@/lib/subscription-options";
import { AlertCircle, CheckCircle2, LogOut, Plus, RefreshCw, Search, Settings2, X } from "lucide-react";

const INPUT =
  "w-full bg-[#06090F] border border-white/[0.1] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none";
const LABEL = "text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold";
const BTN_PRIMARY =
  "py-2 px-3.5 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-mono cursor-pointer hover:bg-[#00F0FF]/25 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_NEUTRAL =
  "py-2 px-3.5 rounded-xl bg-white/[0.05] text-slate-300 border border-white/[0.1] text-xs font-mono cursor-pointer hover:bg-white/[0.1] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const SETUP_TONES = { pending: "amber", paid: "emerald", waived: "cyan", refunded: "slate" };
const STATUS_TONES = { pending: "amber", active: "emerald", past_due: "rose", cancelled: "slate" };
const TONE_CLASSES = {
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/35",
  cyan: "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  slate: "bg-white/[0.05] text-slate-400 border-white/[0.1]"
};

// Products the team can sell today (the catalog marks the rest Coming Soon).
const SELLABLE_PRODUCTS = PRODUCTS.filter((p) => p.status === "available");

function Badge({ tone, children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold whitespace-nowrap ${TONE_CLASSES[tone] || TONE_CLASSES.slate}`}>
      {children}
    </span>
  );
}

function formatDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

function SetupFeeCell({ sub }) {
  if (sub.setup_fee_status === "waived") {
    return (
      <span>
        <span className="line-through text-slate-500">{formatINR(sub.setup_fee)}</span>{" "}
        <span className="text-[#00F0FF]">waived</span>
      </span>
    );
  }
  if (sub.setup_discount > 0) {
    return (
      <span>
        {formatINR(sub.setup_fee - sub.setup_discount)}{" "}
        <span className="text-slate-500">(−{formatINR(sub.setup_discount)})</span>
      </span>
    );
  }
  return formatINR(sub.setup_fee);
}

/** Setup + first month = total, then ₹X/month. */
function ChargesBreakdown({ charges, waived }) {
  return (
    <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] text-xs font-mono space-y-1.5">
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">One-time Setup &amp; Onboarding</span>
        <span className="text-white">
          {waived ? (
            <>
              <span className="line-through text-slate-500">{formatINR(charges.setupFee)}</span> waived
            </>
          ) : (
            formatINR(charges.setupPayable)
          )}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-slate-400">First month</span>
        <span className="text-white">{formatINR(charges.monthlyPrice)}</span>
      </div>
      <div className="flex justify-between gap-4 pt-1.5 border-t border-white/[0.08]">
        <span className="text-slate-300 font-semibold">First payment</span>
        <span className="text-[#00F0FF] font-bold">{formatINR(charges.firstPayment)}</span>
      </div>
      <div className="text-slate-400">Then {formatINR(charges.recurringPayment)}/month. Amounts exclude GST.</div>
    </div>
  );
}

/** Inline confirmation used instead of window.confirm(). */
function ConfirmBox({ text, busy, onConfirm, onCancel }) {
  return (
    <div role="alertdialog" aria-label="Confirm action" className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
      <p className="text-xs text-amber-100 font-sans leading-relaxed">{text}</p>
      <div className="flex gap-2">
        <button type="button" onClick={onConfirm} disabled={busy} className={BTN_PRIMARY}>
          {busy ? "Saving..." : "Confirm"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={BTN_NEUTRAL}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function ErrorLine({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400 font-mono">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

async function sendJson(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

// ---------------------------------------------------------------------------
// New subscription form
// ---------------------------------------------------------------------------

function NewSubscriptionForm({ prefill, onCreated, onCancel, onUnauthorized }) {
  const [form, setForm] = useState({
    business_name: prefill?.business_name || "",
    contact_phone: prefill?.contact_phone || "",
    contact_email: prefill?.contact_email || "",
    product_slug: prefill?.product_slug || "",
    plan_key: "starter",
    notes: "",
    customer_id: "",
    waive: false,
    waive_reason: ""
  });
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setConfirming(false);
  };

  const product = PRODUCTS.find((p) => p.slug === form.product_slug);
  const plan = PLANS.find((p) => p.key === form.plan_key);
  const charges = product && plan ? newSubscriptionCharges(plan.key, product.slug, { waived: form.waive }) : null;

  const review = (e) => {
    e.preventDefault();
    setError("");
    if (form.business_name.trim().length < 2) return setError("Business name is required.");
    if (!product || !plan) return setError("Choose a product and a plan.");
    if (form.waive && !form.waive_reason) return setError("Choose a reason for waiving the setup fee.");
    setConfirming(true);
  };

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const { res, data } = await sendJson("/api/admin/subscriptions", "POST", {
        business_name: form.business_name,
        contact_phone: form.contact_phone,
        contact_email: form.contact_email,
        product_slug: form.product_slug,
        plan_key: form.plan_key,
        notes: form.notes,
        customer_id: form.customer_id.trim(),
        lead_id: prefill?.lead_id || "",
        waive_reason: form.waive ? form.waive_reason : ""
      });
      if (res.status === 401) return onUnauthorized();
      if (res.ok && data.success) {
        onCreated(data.subscription);
      } else {
        setError(data.error || "Could not create the subscription.");
        setConfirming(false);
      }
    } catch {
      setError("Network communication error.");
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={review} className="p-5 sm:p-6 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">New subscription</h2>
          <p className="text-xs text-slate-400 mt-1">
            Record a deal agreed after the demo. Prices come from the current price list and are locked in for this
            customer.
            {prefill?.lead_id && <span className="text-[#00F0FF]"> Linked to the selected lead.</span>}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.1] cursor-pointer" aria-label="Close form">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className={LABEL}>Business name *</span>
          <input className={INPUT} value={form.business_name} onChange={set("business_name")} maxLength={200} required />
        </label>
        <label className="block">
          <span className={LABEL}>Phone</span>
          <input className={INPUT} value={form.contact_phone} onChange={set("contact_phone")} maxLength={25} />
        </label>
        <label className="block">
          <span className={LABEL}>Email</span>
          <input type="email" className={INPUT} value={form.contact_email} onChange={set("contact_email")} maxLength={254} />
        </label>
        <label className="block">
          <span className={LABEL}>Product *</span>
          <select className={`${INPUT} cursor-pointer`} value={form.product_slug} onChange={set("product_slug")} required>
            <option value="">Choose a product</option>
            {SELLABLE_PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={LABEL}>Plan *</span>
          <select className={`${INPUT} cursor-pointer`} value={form.plan_key} onChange={set("plan_key")}>
            {PLANS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={LABEL}>Customer account ID (optional)</span>
          <input
            className={INPUT}
            value={form.customer_id}
            onChange={set("customer_id")}
            maxLength={36}
            placeholder="Only if they already have a ZUGEE login"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form.waive} onChange={set("waive")} className="accent-[#00F0FF]" />
            Waive the one-time setup fee
          </label>
          {form.waive && (
            <select className={`${INPUT} cursor-pointer`} value={form.waive_reason} onChange={set("waive_reason")} aria-label="Waiver reason">
              <option value="">Choose a reason</option>
              {Object.entries(SETUP_WAIVER_REASONS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          )}
          <label className="block">
            <span className={LABEL}>Notes</span>
            <textarea className={`${INPUT} min-h-[72px]`} value={form.notes} onChange={set("notes")} maxLength={1000} />
          </label>
        </div>
        {charges ? (
          <ChargesBreakdown charges={charges} waived={form.waive} />
        ) : (
          <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] text-xs font-mono text-slate-400">
            Choose a product and plan to see the first payment.
          </div>
        )}
      </div>

      <ErrorLine message={error} />

      {confirming && charges ? (
        <ConfirmBox
          busy={busy}
          text={`Create a ${plan.name} subscription to ${product.name} for ${form.business_name.trim()}? First payment ${formatINR(
            charges.firstPayment
          )}, then ${formatINR(charges.recurringPayment)}/month.`}
          onConfirm={create}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        <div className="flex gap-2">
          <button type="submit" className={BTN_PRIMARY}>
            Review &amp; create
          </button>
          <button type="button" onClick={onCancel} className={BTN_NEUTRAL}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// Subscription detail drawer with admin actions
// ---------------------------------------------------------------------------

function PaymentFields({ method, reference, onMethod, onReference }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <select className={`${INPUT} cursor-pointer`} value={method} onChange={(e) => onMethod(e.target.value)} aria-label="Payment method">
        {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input
        className={INPUT}
        value={reference}
        onChange={(e) => onReference(e.target.value)}
        maxLength={120}
        placeholder="UTR / reference"
        aria-label="Payment reference"
      />
    </div>
  );
}

function SubscriptionDrawer({ subscriptionId, onClose, onChanged, onUnauthorized }) {
  const [detail, setDetail] = useState({ sub: null, error: "", loaded: false });
  const [setupPayment, setSetupPayment] = useState({ method: "upi", reference: "" });
  const [monthlyPayment, setMonthlyPayment] = useState({ method: "upi", reference: "" });
  const [waiveReason, setWaiveReason] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [pending, setPending] = useState(null); // { body, text }
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/admin/subscriptions/${subscriptionId}`, { signal: controller.signal, cache: "no-store" });
        if (res.status === 401) return onUnauthorized();
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) setDetail({ sub: data.subscription, error: "", loaded: true });
        else setDetail({ sub: null, error: data.error || "Failed to load subscription.", loaded: true });
      } catch (err) {
        if (err.name === "AbortError") return;
        setDetail({ sub: null, error: "Network communication error.", loaded: true });
      }
    })();
    return () => controller.abort();
  }, [subscriptionId, onUnauthorized]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const ask = (body, text) => {
    setActionError("");
    setPending({ body, text });
  };

  const run = async () => {
    setBusy(true);
    setActionError("");
    try {
      const { res, data } = await sendJson(`/api/admin/subscriptions/${subscriptionId}`, "PATCH", pending.body);
      if (res.status === 401) return onUnauthorized();
      if (res.ok && data.success) {
        setDetail({ sub: data.subscription, error: "", loaded: true });
        setSetupPayment({ method: "upi", reference: "" });
        setMonthlyPayment({ method: "upi", reference: "" });
        setWaiveReason("");
        setNextStatus("");
        onChanged();
      } else {
        setActionError(data.error || "Update failed.");
      }
    } catch {
      setActionError("Network communication error.");
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  const sub = detail.sub;
  const setupPending = sub?.setup_fee_status === "pending";
  const canRecordMonthly = sub && !setupPending && sub.subscription_status !== "cancelled";
  const methodLabel = (m) => PAYMENT_METHODS[m] || m;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={sub ? `Subscription for ${sub.business_name}` : "Subscription"}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-[#0A0F1D] border-l border-white/[0.1] p-6 sm:p-8 overflow-y-auto shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] block font-semibold">Subscription</span>
            <h3 className="text-xl font-bold font-sans text-white mt-0.5">{sub?.business_name || "Loading..."}</h3>
            {sub && (
              <p className="text-xs font-mono text-slate-400 mt-1">
                {sub.product_name} · {sub.plan_name}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.1] cursor-pointer" aria-label="Close details">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!detail.loaded && <p className="text-xs font-mono text-slate-400">Loading subscription...</p>}
        <ErrorLine message={detail.error} />

        {sub && (
          <>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className={LABEL}>Setup fee</span>
                <Badge tone={SETUP_TONES[sub.setup_fee_status]}>{SETUP_STATUS_LABELS[sub.setup_fee_status]}</Badge>
                {sub.setup_fee_status === "waived" && (
                  <span className="block text-slate-400 mt-1">
                    {SETUP_WAIVER_REASONS[sub.setup_waiver_reason] || sub.setup_waiver_reason} · by {sub.setup_waived_by} ·{" "}
                    {formatDate(sub.setup_waived_at)}
                  </span>
                )}
                {sub.setup_fee_status === "paid" && <span className="block text-slate-400 mt-1">Paid {formatDate(sub.setup_paid_at)}</span>}
              </div>
              <div>
                <span className={LABEL}>Subscription</span>
                <Badge tone={STATUS_TONES[sub.subscription_status]}>{SUBSCRIPTION_STATUS_LABELS[sub.subscription_status]}</Badge>
                <span className="block text-slate-400 mt-1">
                  Started {formatDate(sub.started_at)} · Renews {formatDate(sub.renewal_date)}
                </span>
              </div>
            </div>

            {setupPending ? (
              <ChargesBreakdown charges={sub.charges} waived={false} />
            ) : (
              <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] text-xs font-mono text-slate-300">
                Setup &amp; onboarding settled. Each renewal is {formatINR(sub.charges.recurringPayment)}/month.
              </div>
            )}

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              These actions record payments your team has already collected (UPI, bank transfer…). Nothing is charged
              from here — online payments arrive with Razorpay in a later phase.
            </p>

            <ErrorLine message={actionError} />

            {pending ? (
              <ConfirmBox text={pending.text} busy={busy} onConfirm={run} onCancel={() => setPending(null)} />
            ) : (
              <div className="space-y-5">
                {setupPending && (
                  <section className="space-y-2">
                    <span className={LABEL}>Record setup payment received ({formatINR(sub.charges.setupPayable)})</span>
                    <PaymentFields
                      method={setupPayment.method}
                      reference={setupPayment.reference}
                      onMethod={(method) => setSetupPayment((p) => ({ ...p, method }))}
                      onReference={(reference) => setSetupPayment((p) => ({ ...p, reference }))}
                    />
                    <button
                      type="button"
                      className={BTN_PRIMARY}
                      onClick={() =>
                        ask(
                          { action: "record_setup_payment", ...setupPayment },
                          `Record ${formatINR(sub.charges.setupPayable)} one-time Setup & Onboarding payment received by ${methodLabel(
                            setupPayment.method
                          )}? The setup fee can be recorded only once.`
                        )
                      }
                    >
                      Record setup payment
                    </button>
                  </section>
                )}

                {setupPending && (
                  <section className="space-y-2">
                    <span className={LABEL}>Waive setup fee</span>
                    <select className={`${INPUT} cursor-pointer`} value={waiveReason} onChange={(e) => setWaiveReason(e.target.value)} aria-label="Waiver reason">
                      <option value="">Choose a reason</option>
                      {Object.entries(SETUP_WAIVER_REASONS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={BTN_NEUTRAL}
                      disabled={!waiveReason}
                      onClick={() =>
                        ask(
                          { action: "waive_setup_fee", reason: waiveReason },
                          `Waive the ${formatINR(sub.setup_fee)} setup fee (${SETUP_WAIVER_REASONS[waiveReason]})? This cannot be undone.`
                        )
                      }
                    >
                      Waive setup fee
                    </button>
                  </section>
                )}

                <section className="space-y-2">
                  <span className={LABEL}>Record monthly payment received ({formatINR(sub.monthly_price)})</span>
                  {canRecordMonthly ? (
                    <>
                      <PaymentFields
                        method={monthlyPayment.method}
                        reference={monthlyPayment.reference}
                        onMethod={(method) => setMonthlyPayment((p) => ({ ...p, method }))}
                        onReference={(reference) => setMonthlyPayment((p) => ({ ...p, reference }))}
                      />
                      <button
                        type="button"
                        className={BTN_PRIMARY}
                        onClick={() =>
                          ask(
                            { action: "record_monthly_payment", ...monthlyPayment },
                            `Record ${formatINR(sub.monthly_price)} for the ${
                              sub.renewal_date ? `month starting ${formatDate(sub.renewal_date)}` : "first month (starting today)"
                            }, received by ${methodLabel(monthlyPayment.method)}?`
                          )
                        }
                      >
                        Record monthly payment
                      </button>
                    </>
                  ) : (
                    <p className="text-xs font-mono text-slate-500">
                      {setupPending
                        ? "Record or waive the setup fee first — the first payment includes it."
                        : "Reactivate the subscription to record payments."}
                    </p>
                  )}
                </section>

                <section className="space-y-2">
                  <span className={LABEL}>Change subscription status</span>
                  <div className="flex gap-2">
                    <select className={`${INPUT} cursor-pointer`} value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} aria-label="New status">
                      <option value="">Choose a status</option>
                      {SUBSCRIPTION_STATUSES.filter((s) => s !== sub.subscription_status).map((s) => (
                        <option key={s} value={s}>
                          {SUBSCRIPTION_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={`${BTN_NEUTRAL} whitespace-nowrap`}
                      disabled={!nextStatus}
                      onClick={() =>
                        ask(
                          { action: "set_status", status: nextStatus },
                          `Change the subscription status from ${SUBSCRIPTION_STATUS_LABELS[sub.subscription_status]} to ${SUBSCRIPTION_STATUS_LABELS[nextStatus]}?`
                        )
                      }
                    >
                      Update
                    </button>
                  </div>
                </section>
              </div>
            )}

            <section>
              <span className={LABEL}>Payments recorded</span>
              {sub.payments?.length ? (
                <ul className="divide-y divide-white/[0.06] text-xs font-mono">
                  {sub.payments.map((p) => (
                    <li key={p.id} className="py-2 flex justify-between gap-3">
                      <span className="text-slate-300">
                        {p.kind === "setup" ? "Setup & Onboarding" : `Month ${formatDate(p.period_start)} – ${formatDate(p.period_end)}`}
                        <span className="block text-slate-500">
                          {methodLabel(p.method)}
                          {p.reference ? ` · ${p.reference}` : ""} · {formatDate(p.paid_at)}
                        </span>
                      </span>
                      <span className="text-white">{formatINR(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-mono text-slate-500">No payments recorded yet.</p>
              )}
            </section>

            {sub.notes && (
              <section>
                <span className={LABEL}>Notes</span>
                <p className="p-3 rounded-xl bg-[#06090F] text-slate-300 border border-white/[0.08] text-xs whitespace-pre-wrap break-words">{sub.notes}</p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SubscriptionsManager({ prefill }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState({ key: null, rows: [], error: "" });
  const [showForm, setShowForm] = useState(Boolean(prefill));
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");

  const queryKey = JSON.stringify([statusFilter, debouncedSearch, refreshKey]);
  const loading = result.key !== queryKey;
  const { rows, error } = result;

  const handleUnauthorized = useCallback(() => {
    router.replace("/admin");
    router.refresh();
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const params = new URLSearchParams({ status: statusFilter, search: debouncedSearch });
        const res = await fetch(`/api/admin/subscriptions?${params}`, { signal: controller.signal, cache: "no-store" });
        if (res.status === 401) return handleUnauthorized();
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) setResult({ key: queryKey, rows: data.subscriptions || [], error: "" });
        else setResult({ key: queryKey, rows: [], error: data.error || "Failed to load subscriptions." });
      } catch (err) {
        if (err.name === "AbortError") return;
        setResult({ key: queryKey, rows: [], error: "Network communication error." });
      }
    })();
    return () => controller.abort();
  }, [queryKey, statusFilter, debouncedSearch, handleUnauthorized]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      handleUnauthorized();
    }
  };

  const handleCreated = (sub) => {
    setShowForm(false);
    setNotice(`Subscription created for ${sub.business_name}.`);
    if (prefill) router.replace("/admin/subscriptions");
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div className="flex items-center gap-3">
          <MascotLogo size={40} showWordmark={true} showSubline={true} />
          <span className="hidden md:inline-block h-6 w-px bg-white/[0.1] mx-2" />
          <AdminNav active="/admin/subscriptions" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-400 hover:text-white cursor-pointer transition-colors"
            title="Refresh"
            aria-label="Refresh subscriptions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#00F0FF]" : ""}`} />
          </button>
          <button type="button" onClick={() => setShowForm(true)} className="btn-secondary text-xs font-mono !py-2 !px-3.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            New subscription
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {notice && (
          <div role="status" className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-400 font-mono">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {notice}
            </span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss" className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {showForm && (
          <NewSubscriptionForm
            prefill={prefill}
            onCreated={handleCreated}
            onCancel={() => setShowForm(false)}
            onUnauthorized={handleUnauthorized}
          />
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
            {["all", ...SUBSCRIPTION_STATUSES].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border cursor-pointer whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                    : "bg-white/[0.02] text-slate-400 border-transparent hover:text-white"
                }`}
              >
                {st === "all" ? "All" : SUBSCRIPTION_STATUS_LABELS[st]}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Business name, phone or email..."
              aria-label="Search subscriptions"
              value={searchQuery}
              maxLength={100}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#06090F] border border-white/[0.1] focus:border-[#00F0FF] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono outline-none"
            />
          </div>
        </div>

        <ErrorLine message={error} />

        <div className="rounded-3xl bg-[#0A0F1D] border border-white/[0.08] shadow-lg overflow-hidden">
          <div className={`overflow-x-auto transition-opacity ${loading && rows.length ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[1040px] text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 bg-[#0D1527]">
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Plan</th>
                  <th className="py-3 px-4 font-semibold">Monthly fee</th>
                  <th className="py-3 px-4 font-semibold">Setup fee</th>
                  <th className="py-3 px-4 font-semibold">Setup status</th>
                  <th className="py-3 px-4 font-semibold">Subscription</th>
                  <th className="py-3 px-4 font-semibold">Start date</th>
                  <th className="py-3 px-4 font-semibold">Renewal date</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <span className="inline-block w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mr-2" />
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      No subscriptions yet. Create one from a qualified lead after the demo.
                    </td>
                  </tr>
                ) : (
                  rows.map((sub) => {
                    const charges = calculateCharges({
                      monthlyPrice: sub.monthly_price,
                      setupFee: sub.setup_fee,
                      setupFeeStatus: sub.setup_fee_status,
                      setupDiscount: sub.setup_discount
                    });
                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white font-sans text-sm">{sub.business_name}</div>
                          {sub.contact_phone && <div className="text-slate-400 text-[11px]">{sub.contact_phone}</div>}
                          {sub.setup_fee_status === "pending" && (
                            <div className="text-amber-300/80 text-[10px]">First payment {formatINR(charges.firstPayment)}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">{sub.product_name}</td>
                        <td className="py-3.5 px-4">{sub.plan_name}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-white">{formatINR(sub.monthly_price)}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <SetupFeeCell sub={sub} />
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge tone={SETUP_TONES[sub.setup_fee_status]}>{SETUP_STATUS_LABELS[sub.setup_fee_status]}</Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge tone={STATUS_TONES[sub.subscription_status]}>{SUBSCRIPTION_STATUS_LABELS[sub.subscription_status]}</Badge>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">{formatDate(sub.started_at)}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">{formatDate(sub.renewal_date)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedId(sub.id)}
                            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] cursor-pointer transition-colors"
                            aria-label={`Manage subscription for ${sub.business_name}`}
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedId && (
        <SubscriptionDrawer
          key={selectedId}
          subscriptionId={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={refresh}
          onUnauthorized={handleUnauthorized}
        />
      )}
    </div>
  );
}
