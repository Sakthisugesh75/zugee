// app/(marketing)/privacy/page.jsx
// Privacy Policy. Every statement about what the website collects is taken from the code:
// components/home/ContactSection.jsx, app/api/leads/route.js, lib/supabase.js, lib/email.js,
// lib/subscriptions.js and lib/auth.js. If one of those changes, change this page too.

import Link from "next/link";
import LegalPage, { ContactLines, KeyPoint, LegalTable } from "@/components/legal/LegalPage";
import { COMPANY, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "What ZUGEE collects through its website and products, why, which companies handle it for us, how long we keep it, and how to see, correct or delete your data."
});

const sections = [
  {
    id: "roles",
    title: "Who this covers, and our two roles",
    body: (
      <>
        <p>We handle personal data in two different situations. The rules are different for each.</p>
        <h3>You contact us or buy from us</h3>
        <p>
          This is anyone who fills in the form on our website, talks to our team, or becomes a customer. Here we decide
          why and how your data is used. Indian law calls this role the <strong>Data Fiduciary</strong>.
        </p>
        <h3>Our customer stores data about you in a {COMPANY.brand} product</h3>
        <p>
          Our customers are businesses. They enter their own records into the product they use: their customers, staff,
          students, tenants, drivers, suppliers and so on. That data belongs to the business, and the business decides
          what is collected and why. We only store and process it for them, on their instructions. Indian law calls our
          role here the <strong>Data Processor</strong>.
        </p>
        <p>
          If a business that uses {COMPANY.brand} holds data about you, please contact that business first. If they ask
          us to correct or delete something, we will help them do it.
        </p>
      </>
    )
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <h3>When you send the form on our website</h3>
        <ul>
          <li>
            <strong>Required:</strong> your name, your mobile or WhatsApp number, your type of business, and whether you
            want a product demo or a pricing call.
          </li>
          <li>
            <strong>Optional:</strong> your email address, your company name, and a message about what you need.
          </li>
          <li>
            <strong>Added by us:</strong> a reference number, the date and time, and a follow-up status (new, contacted,
            qualified or archived).
          </li>
        </ul>
        <h3>When we talk to you</h3>
        <p>
          What you tell us on a call, in a demo, on WhatsApp or by email, so that we can show you the right product and
          prepare a quote.
        </p>
        <h3>When you become a customer</h3>
        <ul>
          <li>Your business name, and a contact phone number and email address.</li>
          <li>The product and plan you chose, and the prices we agreed.</li>
          <li>
            Each payment you make: the date, the amount, how you paid (for example UPI or bank transfer), and the
            payment reference such as a UTR number.
          </li>
          <li>The details needed for a GST invoice, such as your legal name, billing address and GSTIN.</li>
        </ul>
        <h3>Inside a {COMPANY.brand} product</h3>
        <p>
          The names and login details of the people in your business who use the product, and the business records
          they enter. What those records contain depends on the product and on you.
        </p>
        <h3>Automatically</h3>
        <ul>
          <li>
            The company that hosts our website keeps standard technical logs of each request: IP address, browser type,
            the page requested and the time.
          </li>
          <li>
            We use your IP address for a few minutes to limit repeated form submissions and failed sign-in attempts.
            This counter is held in memory only. We do not save it with your enquiry.
          </li>
        </ul>
        <h3>What we do not collect</h3>
        <ul>
          <li>We run no analytics, advertising or tracking scripts on this website.</li>
          <li>
            We never see or store card numbers, UPI PINs, net-banking passwords or OTPs. Payments reach our bank
            account directly, and we only record that they arrived.
          </li>
          <li>We do not buy contact lists or collect data about you from other companies.</li>
        </ul>
      </>
    )
  },
  {
    id: "why",
    title: "Why we use it, and on what basis",
    body: (
      <>
        <LegalTable
          head={["What we do", "Data used", "Basis"]}
          rows={[
            [
              "Reply to your demo or pricing request, by phone call, WhatsApp or email",
              "Form details",
              "Your consent: you gave us these details for this purpose"
            ],
            [
              "Send you one confirmation email with your reference number, if you gave an email address",
              "Name, email, phone, business type",
              "Your consent"
            ],
            [
              "Set up your product, train your staff and support you",
              "Customer and product data",
              "Our contract with your business"
            ],
            ["Issue invoices and keep accounts", "Billing and payment records", "Indian tax and company law"],
            ["Stop spam and protect the service", "IP address, technical logs", "Keeping the service secure"]
          ]}
        />
        <p>
          By sending the form you agree to us using your details to contact you about your request. You can withdraw
          that agreement at any time: tell us, and we will stop contacting you and delete the enquiry, unless the law
          requires us to keep a record.
        </p>
        <KeyPoint>
          <strong>No marketing emails.</strong> If you only asked for a demo or a pricing call, we contact you about
          that request and nothing else. We do not add you to a mailing list, and we do not sell, rent or trade your
          data. We do not show advertising and do not share data with advertisers.
        </KeyPoint>
      </>
    )
  },
  {
    id: "providers",
    title: "The companies that handle data for us",
    body: (
      <>
        <p>
          We are a small company and we do not run our own servers. These providers process data on our behalf. Each
          one is bound by its own published terms and data-processing agreement.
        </p>
        <LegalTable
          head={["Provider", "What it does for us", "Data it handles"]}
          rows={[
            [
              "Supabase",
              "Database",
              "Website enquiries, customer subscription and payment records, and the business data inside each product"
            ],
            [
              "Vercel",
              "Hosts this website and runs its server code",
              "Every form submission passes through it on the way to the database. It also keeps request logs (IP address, browser type, time)."
            ],
            [
              "Zoho Mail",
              "Sends and stores our email",
              "The notice our team receives for each enquiry, which contains the form details, and the confirmation email sent to you. Also any email you exchange with us."
            ],
            [
              "WhatsApp (Meta)",
              "Messaging, when we contact you on WhatsApp",
              "Your phone number and the messages we exchange. We use the standard WhatsApp app. Messages are sent by a person on our team, not by an automated system. WhatsApp is operated by Meta under its own privacy policy."
            ]
          ]}
        />
        <p>We also share data when we have to:</p>
        <ul>
          <li>with our accountant and auditors, for invoices and tax records;</li>
          <li>with a court, regulator or government authority, when Indian law requires it;</li>
          <li>with a buyer or successor, if the company is ever sold or merged, under the same commitments as here.</li>
        </ul>
        <p>We will update this list before we start using a new provider for personal data.</p>
      </>
    )
  },
  {
    id: "location",
    title: "Where your data is kept",
    body: (
      <>
        <p>
          Your data is kept on the systems of the providers listed above. Some of them are based outside India, and
          some may process data on computers outside India.{" "}
          <strong>We do not promise that your data never leaves India.</strong>
        </p>
        <p>
          Indian law allows personal data to be sent abroad, except to countries the Government of India restricts. We
          will not send data to a restricted country.
        </p>
        <p>
          If the location of your business data matters to you, for example because of your own contracts, ask us
          before you buy. We share hosting details on request.
        </p>
      </>
    )
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <LegalTable
          head={["Data", "How long"]}
          rows={[
            [
              "Website enquiries that do not become customers",
              "24 months after our last contact with you, then deleted. Sooner if you ask."
            ],
            [
              "Customer account, invoice and payment records",
              "For as long as you are a customer, and afterwards for as long as Indian tax and company law require us to keep books of account. That is currently up to 8 years."
            ],
            [
              "Business data inside a product",
              <>
                For as long as your subscription runs. After it ends: kept for export for 30 days, then deleted within
                90 days of the end of your subscription. See the{" "}
                <Link href="/refund#data">Refund &amp; Cancellation Policy</Link>.
              </>
            ],
            [
              "Emails and WhatsApp messages with us",
              "24 months after our last contact with you, then deleted. Sooner if you ask."
            ],
            [
              "Website request logs",
              "For as long as our hosting provider keeps them under its own retention settings. We do not copy them anywhere else."
            ]
          ]}
        />
        <p>
          Enquiries are not deleted automatically today. We review them and delete the old ones by hand. If you want
          yours deleted now, tell us and we will do it.
        </p>
        {/* The one approved mention of backups on the site (tests/site-content.test.mjs). It is a
            retention disclosure, not a promise that customer data can be restored. */}
        <p>
          Our database provider keeps automated backups. Deleted data may persist in those backups for a short period
          before being overwritten.
        </p>
      </>
    )
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <ul>
          <li>This website is served over an encrypted connection (HTTPS).</li>
          <li>
            The database cannot be read or written with any public key. Only our own server code can reach it.
          </li>
          <li>Enquiries are visible only to our team, behind a password-protected admin portal.</li>
          <li>Everything typed into the form is checked and length-limited before it is saved.</li>
          <li>Inside each product, only the users your business authorises can see your data.</li>
        </ul>
        <p>
          We want to be honest about the limits. We hold no security certification such as ISO 27001 or SOC 2. No
          system is perfectly secure, and we cannot guarantee that a breach will never happen.
        </p>
        <p>
          If a breach affects your personal data, we will tell you and the Data Protection Board of India, as the law
          requires, and we will tell you what we are doing about it.
        </p>
      </>
    )
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the Digital Personal Data Protection Act, 2023 you can ask us to:</p>
        <ul>
          <li>
            <strong>Show you</strong> what personal data we hold about you, what we have done with it, and who we have
            shared it with.
          </li>
          <li>
            <strong>Correct</strong> anything that is wrong, incomplete or out of date.
          </li>
          <li>
            <strong>Delete</strong> your data, unless the law requires us to keep it.
          </li>
          <li>
            <strong>Stop</strong>, by withdrawing your consent. This is as easy as telling us.
          </li>
          <li>
            <strong>Name another person</strong> who can use these rights for you if you die or become unable to.
          </li>
        </ul>
        <h3>How to use them</h3>
        <p>
          Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Tell us your name and the phone number or email address you
          gave us, and what you want done. We may ask one question to confirm it is really you. There is no fee.
        </p>
        <p>
          We will reply within 7 days and finish within 30 days. If we cannot do what you ask, we will tell you why.
        </p>
      </>
    )
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <KeyPoint>
          <strong>This website sets no cookies for visitors.</strong> It also stores nothing else in your browser, and
          it loads no scripts, fonts or images from other companies. That is why there is no cookie banner.
        </KeyPoint>
        <p>The only cookie this website can set is for our own staff:</p>
        <LegalTable
          head={["Cookie", "Who gets it", "Purpose", "Lasts"]}
          rows={[
            [
              "zugee_admin_session",
              "Only a member of our team who signs in to the admin portal",
              "Keeps them signed in. It cannot be read by scripts and is not sent to other sites.",
              "24 hours"
            ]
          ]}
        />
        <p>
          Each {COMPANY.brand} product is separate software with its own login. A product sets one login session
          cookie, to keep you signed in. The products use no analytics or tracking.
        </p>
      </>
    )
  },
  {
    id: "children",
    title: "Children",
    body: (
      <>
        <p>
          We sell to businesses. This website is not meant for anyone under 18, and we do not knowingly collect
          enquiries from children.
        </p>
        <p>
          Some products hold data about children because of what they are for, such as Scholora, our school software. That data is entered
          by the school, which is responsible for telling parents and getting any consent the law requires. We process
          it only for the school.
        </p>
      </>
    )
  },
  {
    id: "law",
    title: "Which laws apply",
    body: (
      <>
        <p>
          We follow the Digital Personal Data Protection Act, 2023, and the Information Technology Act, 2000 with the
          rules made under it.
        </p>
        <p>
          We sell only to businesses in India and do not market to people in the European Union or the United Kingdom.
          We do not believe the GDPR applies to our normal business. If you write to us from there, we handle your data
          as this policy describes, and we will act on a request to see or delete it in the same way.
        </p>
      </>
    )
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    body: (
      <>
        <p>If you have a complaint about how we handle personal data, contact our Grievance Officer:</p>
        <ul>
          <li>
            Name: Sakthisugesh R, Director
          </li>
          <li>
            Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </li>
          <li>
            {COMPANY.name}, {COMPANY.city}
          </li>
        </ul>
        <p>We will acknowledge your complaint within 48 hours and resolve it within 30 days.</p>
        <p>
          If you are not satisfied with our answer, you can complain to the Data Protection Board of India.
        </p>
      </>
    )
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          When we change this policy we change the date at the top. If a change affects how we use data we already
          hold about customers, we will email the contact address on your account before it takes effect.
        </p>
        <p>Questions about this policy:</p>
        <ContactLines />
      </>
    )
  }
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy Policy"
      intro={
        <>
          <p>
            This policy explains what {COMPANY.name} (&quot;{COMPANY.brand}&quot;, &quot;we&quot;) collects, why, who
            handles it for us, how long we keep it, and what you can ask us to do with it.
          </p>
          <p>
            It covers this website and the {COMPANY.brand} products. We make business software for Indian businesses,
            so most of what follows is about business contact details and business records.
          </p>
        </>
      }
      sections={sections}
    />
  );
}
