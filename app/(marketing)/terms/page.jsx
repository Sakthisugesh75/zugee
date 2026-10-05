// app/(marketing)/terms/page.jsx
// Terms of Service. The commercial facts come from lib/pricing.js, lib/subscriptions.js and
// lib/products.js: a one-time setup fee per product, a monthly subscription, prices copied onto
// the subscription when it is created, payments recorded by hand. If those change, change this.

import Link from "next/link";
import LegalPage, { ContactLines, KeyPoint } from "@/components/legal/LegalPage";
import { COMPANY, legalMetadata } from "@/lib/legal";
import { PRODUCTS } from "@/lib/products";

export const metadata = legalMetadata({
  path: "/terms",
  title: "Terms of Service",
  description:
    "The terms on which ZUGEE supplies its business software: the one-time setup fee, the monthly subscription, payment, your data, support, liability and how either side can end the agreement."
});

const sections = [
  {
    id: "agreement",
    title: "The agreement",
    body: (
      <>
        <p>
          These terms are between {COMPANY.name} (&quot;{COMPANY.brand}&quot;, &quot;we&quot;) and the business that
          buys or uses a {COMPANY.brand} product (&quot;you&quot;).
        </p>
        <p>Your agreement with us is made up of:</p>
        <ul>
          <li>the written quote we send you, which states your product, plan, prices and what setup includes;</li>
          <li>these Terms of Service;</li>
          <li>
            the <Link href="/refund">Refund &amp; Cancellation Policy</Link>; and
          </li>
          <li>
            the <Link href="/privacy">Privacy Policy</Link>.
          </li>
        </ul>
        <p>
          If your quote says something different from these terms, the quote wins. The agreement starts when we receive
          your first payment.
        </p>
        <p>
          If you only visit this website, the sections on acceptable use, ownership, liability and governing law apply
          to you.
        </p>
      </>
    )
  },
  {
    id: "who",
    title: "Who can use ZUGEE",
    body: (
      <>
        <p>
          {COMPANY.brand} is sold to businesses in India, for business use. We do not sell to consumers for personal or
          household use.
        </p>
        <ul>
          <li>
            You must be a business registered or lawfully operating in India: a company, LLP, partnership, sole
            proprietorship, trust or society. You do not need a GST registration to buy.
          </li>
          <li>The person who accepts the quote must be at least 18 and have the authority to commit the business.</li>
          <li>You are responsible for everyone you give a login to.</li>
        </ul>
      </>
    )
  },
  {
    id: "products",
    title: "The products",
    body: (
      <>
        <p>
          {COMPANY.brand} makes {PRODUCTS.length} products, each for one kind of business. Every product is separate
          software with its own login and its own data. There is no shared login across products. If you use two
          products, you have two subscriptions.
        </p>
        <ul>
          <li>
            You can buy only products shown on our website. Other products are not for sale, and we make no
            promise about when they will be ready.
          </li>
          <li>
            What you get is what we showed you working in your demo, set up as described in your quote.
          </li>
          <li>
            A feature described as coming soon or in progress, such as WhatsApp notifications, is not part of the
            service until we tell you in writing that it is live.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "fees",
    title: "What you pay for",
    body: (
      <>
        <p>There are two charges. They buy different things.</p>
        <h3>The one-time setup fee</h3>
        <p>
          You pay this once for each product. It pays for the work of getting the product running for your business, as
          listed in your quote. This usually means:
        </p>
        <ul>
          <li>finding out how your business works;</li>
          <li>configuring your business profile, GST settings, users, branches and workflows;</li>
          <li>bringing in your existing records, such as customer and item lists from Excel or Tally;</li>
          <li>walking your staff through the product; and</li>
          <li>supporting you through your first days of live use.</li>
        </ul>
        <p>
          How much data we migrate and how much training is included depends on your plan and is stated in your quote.
        </p>
        <p>
          Setup typically takes 14 days. This is a target, not a guarantee. It depends on you giving us your data, your
          decisions and your staff&apos;s time when we ask for them.
        </p>
        <h3>The monthly subscription</h3>
        <p>
          This is the recurring charge for each product. It pays for the right to use the product for the number of
          users and branches in your plan, the hosting of your data, updates, and standard support.
        </p>
        <KeyPoint>
          The setup fee is charged <strong>once per product</strong>. Every payment after the first is the monthly
          subscription only.
        </KeyPoint>
      </>
    )
  },
  {
    id: "prices",
    title: "Prices, quotes and GST",
    body: (
      <>
        <ul>
          <li>
            We do not publish prices. We quote each business individually, on a call, based on the product, the number
            of users and branches, and how much setup you need.
          </li>
          <li>A quote is valid for 15 days from the date we send it.</li>
          <li>
            <strong>
              Your monthly price is fixed for the life of your subscription. We will never raise it.
            </strong>{" "}
            We record your setup fee and monthly price when you buy. A later change to our price list does not change
            what you pay for that subscription.
          </li>
          <li>
            All prices are in Indian rupees and <strong>exclude GST</strong>. GST is added at the rate that applies on
            the invoice date.
          </li>
          <li>
            If the law requires you to deduct tax at source, you may do so, and you must give us the TDS certificate.
          </li>
          <li>
            That price is for the plan, users and branches in your quote. If you ask for more users, more branches, a
            different plan or another product, we quote that separately. Nothing changes unless you accept the new
            quote.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "payment",
    title: "Payment",
    body: (
      <>
        <ul>
          <li>
            You pay by <strong>UPI or bank transfer</strong> to the account shown on our invoice.
          </li>
          <li>
            Your first payment is the setup fee plus the first month&apos;s subscription. Setup work starts once we
            receive it.
          </li>
          <li>
            <strong>Your first month starts on your go-live day</strong>, the day you start using the product. It does
            not start on the day you pay. You are not charged a subscription for the time we spend setting up.
          </li>
          <li>
            The subscription is paid <strong>monthly, in advance</strong>. Each payment covers one month, counted from
            your go-live day.
          </li>
          <li>We send an invoice 7 days before each month begins.</li>
          <li>We issue a GST invoice for every payment.</li>
        </ul>
        <KeyPoint>
          <strong>Nothing is charged automatically.</strong> There is no auto-renewal and no automatic debit. We do
          not hold card details, a UPI mandate or any other way to take money from you. Each month continues only
          because you choose to pay for it.
        </KeyPoint>
        <p>
          Pay only to the bank account or UPI ID on an invoice from us. We will never ask you for an OTP, a UPI PIN or
          a password. If a payment request looks unusual, check with us before you pay: email{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or call the number our team already uses with you.
        </p>
      </>
    )
  },
  {
    id: "late",
    title: "Late payment and non-payment",
    body: (
      <>
        <p>If we have not received a month&apos;s payment by the day that month begins:</p>
        <ul>
          <li>
            Your account is marked past due, and we will remind you. You keep full access for a grace period of 7 days.
          </li>
          <li>After the grace period we may suspend access to the product.</li>
          <li>
            While you are suspended you can ask for an export of your data by emailing{" "}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. We provide it within 5 business days, free of
            charge.
          </li>
          <li>
            Your data is kept while you are suspended. If you pay within 30 days of the due date, we restore full
            access and nothing is lost.
          </li>
          <li>
            If you have not paid by then, we treat the subscription as cancelled by you, and the rules in{" "}
            <a href="#ending">Ending the agreement</a> apply.
          </li>
        </ul>
        <p>If you are going to be late, tell us. We would rather agree a date than suspend an account.</p>
      </>
    )
  },
  {
    id: "data",
    title: "Your data",
    body: (
      <>
        <KeyPoint>
          <strong>You own your business data.</strong> Everything you and your staff enter into a {COMPANY.brand}{" "}
          product belongs to you. We claim no ownership of it.
        </KeyPoint>
        <ul>
          <li>We use your data only to provide the product, to support you, and as you instruct us.</li>
          <li>
            We look at your data only when you ask for help, when we need to fix a problem, or when the law requires
            it.
          </li>
          <li>
            <strong>You can take it with you.</strong> You can export your data from the product in one click. If you
            ask, we will also send you an export in a common format such as Excel or CSV.
          </li>
          <li>
            You are responsible for the data you put in, including the personal data of your own customers, staff,
            students or tenants. You must have the right to hold it and must tell those people as the law requires.
            For that data you are the Data Fiduciary and we are your Data Processor.
          </li>
          <li>
            <strong>Keep your own copies.</strong> Export your important records regularly and store them yourself. Do
            not rely on the product as the only place your records exist.
          </li>
        </ul>
        <p>
          How we handle personal data is explained in the <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    )
  },
  {
    id: "our-part",
    title: "What we will do, and what we cannot promise",
    body: (
      <>
        <h3>What we will do</h3>
        <ul>
          <li>Provide the product with reasonable skill and care.</li>
          <li>Carry out the setup described in your quote.</li>
          <li>
            Answer support requests during business hours, <strong>Monday to Saturday, 10 am to 6 pm IST</strong>, by
            phone, email and WhatsApp. We do not offer live chat. We aim to reply within one business day.
          </li>
          <li>Fix faults in the product within a reasonable time, the most serious first.</li>
          <li>Tell you in advance about planned maintenance when we can.</li>
          <li>Tell you promptly if a security incident affects your data.</li>
        </ul>
        <h3>What we cannot promise</h3>
        <p>We are a small company, and we would rather be honest than impressive.</p>
        <ul>
          <li>
            <strong>No uptime guarantee.</strong> We do not measure or promise any level of availability, and we give
            no credit or refund for downtime. The product may be unavailable at times because of maintenance, faults,
            or problems at our hosting providers.
          </li>
          <li>
            <strong>No 24/7 support on standard plans.</strong> Support is during business hours. A request sent at
            night or on a holiday is handled on the next business day.
          </li>
          <li>
            <strong>No security certification.</strong> We do not hold ISO 27001, SOC 2 or a similar certification.
          </li>
          <li>We do not promise that the product is free of errors or that it will meet every need you have.</li>
          <li>
            The product depends on hosting and messaging providers, your internet connection and your devices. We
            cannot control those.
          </li>
        </ul>
        <p>
          Different support or availability terms apply only if they are written into an agreement signed by both of
          us.
        </p>
        <h3>Not tax or legal advice</h3>
        <p>
          The product helps you manage invoices and records. You remain responsible for your tax filings and GST
          compliance. Check them with your chartered accountant.
        </p>
      </>
    )
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree to:</p>
        <ul>
          <li>give each person their own login, and keep passwords private;</li>
          <li>stay within the number of users and branches in your plan;</li>
          <li>give us accurate information and tell us when your contact details change; and</li>
          <li>use the product only for your own lawful business.</li>
        </ul>
        <p>You agree not to:</p>
        <ul>
          <li>resell, rent or share the product with another business;</li>
          <li>copy, reverse-engineer or try to extract the source code;</li>
          <li>test, probe or attack the security of the product or this website without our written permission;</li>
          <li>upload viruses or anything unlawful, or use the product to send spam; or</li>
          <li>use automated tools to scrape or overload the product or this website.</li>
        </ul>
        <p>
          If a serious breach puts other customers or the service at risk, we may suspend your access straight away. We
          will tell you why and give you the chance to put it right.
        </p>
      </>
    )
  },
  {
    id: "ownership",
    title: "Who owns what",
    body: (
      <>
        <ul>
          <li>
            We own the {COMPANY.brand} software, its design and this website. Your subscription gives you a right to
            use the product while you pay for it. It does not transfer ownership, and the right cannot be passed to
            anyone else.
          </li>
          <li>You own your data, as set out above.</li>
          <li>Configuration we do for you during setup is part of the product. The records in it are yours.</li>
          <li>If you suggest an improvement, we may use it without owing you anything.</li>
          <li>We will not use your business name or logo as a reference without your written permission.</li>
        </ul>
        <p>
          Each of us will keep the other&apos;s confidential information private, and use it only for this agreement.
          That includes your business data and our prices.
        </p>
      </>
    )
  },
  {
    id: "liability",
    title: "Limits on our liability",
    body: (
      <>
        <p>Please read this section carefully. It limits what you can claim from us.</p>
        <ul>
          <li>
            <strong>The cap.</strong> Our total liability to you, for everything connected with this agreement, is
            limited to the fees you paid us in the 12 months before the event that caused the claim.
          </li>
          <li>
            <strong>What we are not liable for.</strong> Loss of profit, revenue, business or goodwill; loss or
            corruption of data; and any indirect or consequential loss.
          </li>
          <li>
            We are not liable for a failure caused by something outside our reasonable control, such as a failure at a
            hosting provider, an internet or power outage, a natural disaster or a government order.
          </li>
          <li>
            You are responsible for claims that arise from the data you enter or from your breach of these terms.
          </li>
        </ul>
        <p>
          Nothing in these terms limits liability for fraud, or any liability that cannot be limited under Indian law.
        </p>
      </>
    )
  },
  {
    id: "ending",
    title: "Ending the agreement",
    body: (
      <>
        <h3>You can leave</h3>
        <p>
          There is no minimum term and no lock-in. You can cancel at any time by telling us in writing. The notice
          period and what is refunded are in the <Link href="/refund">Refund &amp; Cancellation Policy</Link>.
        </p>
        <h3>We can end it</h3>
        <ul>
          <li>
            For any reason, with 30 days written notice. We will refund any subscription you have paid for a period
            after the end date.
          </li>
          <li>
            If you have not paid, as set out in <a href="#late">Late payment and non-payment</a>.
          </li>
          <li>
            Immediately, if you seriously breach these terms and do not put it right within 7 days of our notice, or
            if you use the product unlawfully.
          </li>
          <li>If we stop offering a product, with at least 90 days written notice.</li>
        </ul>
        <h3>What happens to your data</h3>
        <ul>
          <li>You keep access until the end of the period you have paid for.</li>
          <li>For 30 days after that, we will give you an export of your data on request, free of charge.</li>
          <li>
            We then delete your business data, within 90 days of the end of your subscription. Once deleted, it cannot
            be recovered.
          </li>
          <li>We keep invoices and payment records for as long as tax and company law require.</li>
        </ul>
      </>
    )
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <>
        <p>
          We may update these terms. The date at the top shows the latest version. If a change reduces your rights or
          adds to your obligations, we will email the contact address on your account at least 30 days
          before it takes effect. If you do not accept the change, you can cancel before
          that date. Paying for a month after that date means you accept the new terms.
        </p>
      </>
    )
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <ul>
          <li>These terms are governed by the laws of India.</li>
          <li>
            If there is a dispute, tell us in writing first. Both of us will try in good faith to settle it within 30
            days.
          </li>
          <li>
            If it is not settled, the courts at <strong>Coimbatore, Tamil Nadu</strong> have exclusive jurisdiction.
          </li>
        </ul>
      </>
    )
  },
  {
    id: "general",
    title: "General",
    body: (
      <>
        <ul>
          <li>
            This agreement is the whole agreement between us. It replaces anything said or written before, including in
            a demo, unless it is in your quote.
          </li>
          <li>
            Notices to us go to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Notices to you go to the
            contact email on your account.
          </li>
          <li>
            You may not transfer this agreement without our written consent. We may transfer it if the company is sold
            or merged, and we will tell you.
          </li>
          <li>If one part of these terms cannot be enforced, the rest still applies.</li>
          <li>If we do not enforce a right straight away, we have not given it up.</li>
        </ul>
        <p>Questions about these terms:</p>
        <ContactLines />
      </>
    )
  }
];

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of Service"
      intro={
        <>
          <p>
            These are the terms on which {COMPANY.name} supplies its business software. We have written them in plain
            English. Please read them before you buy.
          </p>
          <p>
            In short: you pay a one-time setup fee and a monthly subscription for each product, you own your data and
            can take it with you, nothing renews automatically, and either of us can end the agreement.
          </p>
        </>
      }
      sections={sections}
    />
  );
}
