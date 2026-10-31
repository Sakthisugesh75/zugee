// app/(marketing)/pricing/page.jsx
// /pricing: the homepage's Pricing section on its own page (SEO brief), with the setup-fee FAQs and
// the demo form. The homepage keeps its #pricing section too.
//
// No prices are published (see app/(marketing)/page.jsx): only plan names and what each plan
// includes reach this page. "Schedule a pricing call" scrolls to the demo form below.

import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import { FaqJsonLd, JsonLdScript } from "@/components/JsonLdSchema";
import { DEMO_FORM_BUSINESS_TYPES } from "@/lib/products";
import { PLANS } from "@/lib/pricing";
import { FAQ_ITEMS } from "@/lib/site-content";
import { getSiteUrl } from "@/lib/site";

const TITLE = "Pricing | ZUGEE Business Software for Indian SMEs";
const DESCRIPTION =
  "How ZUGEE pricing works: a one-time setup fee plus a subscription based on your product, users and branches. Compare Starter, Growth and Enterprise.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  // openGraph and twitter replace the root layout's objects, so every field is repeated.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/pricing",
    siteName: "ZUGEE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] }
};

// Price fields stripped, as on the homepage, so the amounts never reach the HTML or client bundle.
const PLAN_SUMMARIES = PLANS.map(({ key, name, features, setupIncludes }) => ({ key, name, features, setupIncludes }));

// The homepage FAQs about the setup fee and what the price covers, word for word.
const PRICING_FAQ_QUESTIONS = [
  "What is the one-time setup fee?",
  "Do I pay the setup fee again every month?",
  "Can I use more than one ZUGEE product?"
];
const PRICING_FAQS = FAQ_ITEMS.filter((faq) => PRICING_FAQ_QUESTIONS.includes(faq.question)).map((faq) => ({
  q: faq.question,
  a: faq.answer
}));

function breadcrumbSchema(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteUrl}/pricing` }
    ]
  };
}

export default function PricingPage() {
  return (
    <>
      <JsonLdScript schema={breadcrumbSchema()} />
      <FaqJsonLd faqs={PRICING_FAQS} />

      {/* Clears the fixed navbar; the section itself starts with its own padding. */}
      <div className="pt-12 md:pt-16 bg-canvas-alt" aria-hidden="true" />
      <PricingSection plans={PLAN_SUMMARIES} headingLevel="h1" />

      <section className="section-wrapper bg-canvas border-b border-ink/[0.08]">
        <div className="container">
          <FAQSection
            items={PRICING_FAQS}
            title="Questions about pricing"
            subtitle="The setup fee, the subscription and using more than one product"
            showRoadmapNote={false}
          />
        </div>
      </section>

      <ContactSection businessTypes={DEMO_FORM_BUSINESS_TYPES} />
    </>
  );
}
