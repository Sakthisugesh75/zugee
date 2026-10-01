// app/(marketing)/page.jsx
// Homepage — ZUGEE's complete narrative experience:
//
// Hero → "Specialised software for each industry"
// Products → "These are the products"
// Comparison → "This is the problem ZUGEE solves"
// Industries → "This is how it fits my business"
// How It Works → "This is how I use it"
// Pricing → "How to get a quote" (no prices are published; see below)
// FAQ → "Common questions answered"
// CTA → "I understand what I can do next"
//
// Every claim must pass the rule in docs/ZUGEE-PLATFORM-PLAN.md:
// "can the product actually do this today?"

import Hero from "@/components/home/Hero";
import ProductShowcase from "@/components/home/ProductShowcase";
import ComparisonSection from "@/components/home/ComparisonSection";
import IndustryShowcase from "@/components/home/IndustryShowcase";
import HowWeWork from "@/components/home/HowWeWork";
import PricingSection from "@/components/home/PricingSection";
import FinalCTA from "@/components/home/FinalCTA";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import { BUSINESS_TYPES, getProduct } from "@/lib/products";
import { PLANS, PRODUCT_SETUP_FOCUS } from "@/lib/pricing";
import { FAQ_ITEMS } from "@/lib/site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zugee.in";

export const metadata = {
  title: { absolute: "ZUGEE — Business Software for Indian Businesses" },
  description:
    "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more.",
  alternates: {
    canonical: "/"
  }
};

// No prices are published on the site: pricing is quoted on a call. Only the plan names and what
// each plan includes are passed to the page, so the amounts in lib/pricing.js (still used by the
// admin subscriptions tool) never reach the HTML or the client bundle.
const PLAN_SUMMARIES = PLANS.map(({ key, name, features, setupIncludes }) => ({ key, name, features, setupIncludes }));

const PRODUCT_SETUPS = Object.entries(PRODUCT_SETUP_FOCUS)
  .map(([slug, items]) => ({ slug, name: getProduct(slug)?.name, items }))
  .filter((entry) => Boolean(entry.name));

// Structured data is generated from the same arrays that render the page, so what search engines
// are told can never drift from what visitors see.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "ZUGEE",
      legalName: "Zugee Systems Technologies Pvt. Ltd.",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/zugee-mascot-icon.png`
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output; "<" is escaped so the payload can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      {/* 1. HERO — "Specialised software for each industry" */}
      <Hero />

      {/* 2. PRODUCTS — "These are the products" */}
      <ProductShowcase />

      {/* 3. COMPARISON — "This is the problem ZUGEE solves" */}
      <ComparisonSection />

      {/* 4. INDUSTRIES — "This is how it fits my business" */}
      <IndustryShowcase />

      {/* 5. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 6. PRICING — "How to get a quote" */}
      <PricingSection plans={PLAN_SUMMARIES} productSetups={PRODUCT_SETUPS} />

      {/* 7. FAQ — "Common questions answered" */}
      <section className="section-wrapper bg-[#06090F] border-b border-white/[0.08]">
        <div className="container">
          <FAQSection />
        </div>
      </section>

      {/* 8. CTA — "I understand what I can do next" */}
      <FinalCTA />

      {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={BUSINESS_TYPES} />
    </>
  );
}
