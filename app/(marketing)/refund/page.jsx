// app/(marketing)/refund/page.jsx
// Refund & Cancellation Policy. Matches how billing works in lib/subscriptions.js: the setup fee
// is one-time (pending -> paid | waived, paid -> refunded), the subscription is paid month by
// month in advance, and payments are recorded by hand. There is no payment gateway.

import Link from "next/link";
import LegalPage, { ContactLines, KeyPoint, LegalTable } from "@/components/legal/LegalPage";
import { COMPANY, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata({
  path: "/refund",
  title: "Refund & Cancellation Policy",
  description:
    "When the ZUGEE setup fee and monthly subscription are refundable, how to cancel, what happens to your data afterwards, and how to ask for a refund."
});

const sections = [
  {
    id: "summary",
    title: "The short version",
    body: (
      <>
        <KeyPoint>
          <strong>No auto-renewal. No card on file.</strong> We cannot take money from you. You pay each month
          yourself, by UPI or bank transfer. If you stop paying, nothing more is charged.
        </KeyPoint>
        <ul>
          <li>
            <strong>Setup fee:</strong> refundable until we start configuring your account or moving your data. Not
            refundable after that.
          </li>
          <li>
            <strong>Monthly subscription:</strong> starts on your go-live day, not when you pay. Cancel any time. A
            month that has already started is not refunded, and you keep access until it ends.
          </li>
          <li>
            <strong>Your data:</strong> yours to export before and after you cancel, for a limited time.
          </li>
        </ul>
        <p>
          This policy is part of our <Link href="/terms">Terms of Service</Link>. If your written quote says something
          different, the quote wins.
        </p>
      </>
    )
  },
  {
    id: "setup-fee",
    title: "The one-time setup fee",
    body: (
      <>
        <p>
          The setup fee pays for our team&apos;s time: learning how your business works, configuring the product,
          moving your data and training your staff. Once that work is done it cannot be undone, so the refund depends
          on how far we have got.
        </p>
        <LegalTable
          head={["Stage", "Refund of the setup fee"]}
          rows={[
            [
              "You cancel before any setup work has started",
              <>
                <strong>Full refund</strong>, if you tell us within 7 days of paying.
              </>
            ],
            [
              "We have held the discovery session with you, but have not started configuring your account or moving your data",
              <strong key="half">50% refund.</strong>
            ],
            [
              "We have started configuring your account or moving your data",
              <>
                <strong>No refund.</strong> This is the point of no return.
              </>
            ],
            ["Setup is finished and you are using the product", <strong key="none">No refund.</strong>]
          ]}
        />
        <h3>How you will know the point of no return</h3>
        <p>
          Before we start configuring your account or moving your data, we will tell you in writing, by email or
          WhatsApp, that setup is about to begin. If you want to stop, say so before that message.
        </p>
        <h3>If we cannot deliver</h3>
        <p>
          If we fail to get your product working as described in your quote, for reasons on our side, you get a{" "}
          <strong>full refund</strong> of the setup fee, whatever stage we reached. We treat it as a failure on our side if
          you are not live within 45 days of the day we received the data and decisions we asked you for.
        </p>
        <p>
          A delay because we are waiting for your data, your decisions or your staff&apos;s time is not a failure on
          our side.
        </p>
        <h3>Other points</h3>
        <ul>
          <li>The setup fee is charged once per product. A second product has its own setup fee and its own refund.</li>
          <li>If we waived your setup fee, there is nothing to refund.</li>
          <li>
            <strong>The first month you prepaid is always refunded in full if you cancel before go-live.</strong> Your
            subscription only starts on the day you start using the product, so a month paid before that has not
            begun. This applies whatever happens to the setup fee.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "subscription",
    title: "The monthly subscription",
    body: (
      <>
        <h3>Cancelling</h3>
        <ul>
          <li>There is no minimum term. You can cancel in any month.</li>
          <li>
            To cancel, tell us in writing at least 7 days before your next month begins. Email{" "}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> from the contact address on your account.
          </li>
          <li>
            Because nothing renews automatically, simply not paying also ends your subscription. Telling us is better:
            it lets us prepare your data export and stop the reminders.
          </li>
        </ul>
        <h3>What is refunded</h3>
        <ul>
          <li>
            <strong>A month that has started is not refunded.</strong> You paid for it in advance, and you keep full
            access until it ends.
          </li>
          <li>We do not refund part of a month.</li>
          <li>You owe nothing for any later month.</li>
        </ul>
        <h3>When we do refund a subscription payment</h3>
        <ul>
          <li>
            <strong>You paid twice or paid too much by mistake.</strong> We refund the extra amount in full.
          </li>
          <li>
            <strong>We end your subscription</strong> for a reason that is not your breach or non-payment. We refund
            the unused days you have paid for.
          </li>
        </ul>
        <h3>Downtime</h3>
        <ul>
          <li>
            We do not give a refund or credit for downtime. We do not measure or promise any level of availability,
            as the <Link href="/terms#our-part">Terms of Service</Link> explain.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "data",
    title: "Your data after you cancel",
    body: (
      <>
        <p>Your business data is yours. Cancelling does not change that.</p>
        <LegalTable
          head={["When", "What happens"]}
          rows={[
            [
              "Until the end of the month you paid for",
              "You have full access. Export anything you want from the product yourself."
            ],
            [
              "The next 30 days",
              "Your login is closed. If you ask, we send you an export of your data in a common format such as Excel or CSV, free of charge."
            ],
            [
              "After that, within 90 days of the end of your subscription",
              "We delete your business data. Once deleted, it cannot be recovered."
            ]
          ]}
        />
        <ul>
          <li>
            If you come back before your data is deleted, we reopen your account as it was, and you do not pay the
            setup fee again.
          </li>
          <li>
            We keep our own records of your invoices and payments for as long as tax and company law require. See the{" "}
            <Link href="/privacy#retention">Privacy Policy</Link>.
          </li>
          <li>If you want your data deleted sooner, ask us in writing and we will do it.</li>
        </ul>
      </>
    )
  },
  {
    id: "request",
    title: "How to ask for a refund",
    body: (
      <>
        <p>
          Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> from the contact address on your account.
          Include:
        </p>
        <ul>
          <li>your business name and the product;</li>
          <li>the invoice number, or the payment reference such as the UTR number;</li>
          <li>what you want refunded, and why.</li>
        </ul>
        <h3>How long it takes</h3>
        <ul>
          <li>We confirm we have your request within 2 business days.</li>
          <li>We give you our decision, with the reason, within 7 business days.</li>
          <li>An approved refund is paid within 7 business days of the decision.</li>
        </ul>
        <h3>How it is paid</h3>
        <ul>
          <li>By bank transfer or UPI, to the account the payment came from.</li>
          <li>The GST on a refunded amount is refunded with it, and we issue a credit note.</li>
          <li>
            If you deducted TDS from a payment, we refund only the amount we actually received. You recover the TDS
            through your own tax return.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "disagree",
    title: "If you disagree with our decision",
    body: (
      <>
        <p>
          Reply to the decision email and ask for it to be looked at again. A founder will review it and answer within 7
          business days.
        </p>
        <p>
          If we still cannot agree, the dispute section of the <Link href="/terms#law">Terms of Service</Link> applies.
        </p>
        <p>Questions about this policy:</p>
        <ContactLines />
      </>
    )
  }
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      path="/refund"
      title="Refund & Cancellation Policy"
      intro={
        <p>
          This policy explains when {COMPANY.name} refunds the one-time setup fee and the monthly subscription, how to
          cancel, and what happens to your data afterwards.
        </p>
      }
      sections={sections}
    />
  );
}
