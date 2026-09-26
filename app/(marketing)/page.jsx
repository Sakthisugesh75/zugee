// app/(marketing)/page.jsx
// Homepage — ZUGEE's complete narrative experience:
//
// Hero → "This is a business ecosystem"
// Products → "These are the products inside it"
// Comparison → "This is the problem ZUGEE solves"
// Industries → "This is how it fits my business"
// How It Works → "This is how I use it"
// Pricing → "This is what it costs"
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
import ContactSection from "@/components/home/ContactSection";
import { BUSINESS_TYPES } from "@/lib/products";
import { FAQ_ITEMS } from "@/lib/site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

export const metadata = {
  title: { absolute: "ZUGEE — Business Software for Indian Businesses" },
  description:
    "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more.",
  alternates: {
    canonical: "/"
  }
};

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

      {/* 1. ECOSYSTEM — "This is a business ecosystem" */}
      <Hero />

      {/* 2. PRODUCTS — "These are the products inside it" */}
      <ProductShowcase />

      {/* 3. COMPARISON — "This is the problem ZUGEE solves" */}
      <ComparisonSection />

      {/* 4. INDUSTRIES — "This is how it fits my business" */}
      <IndustryShowcase />

      {/* 5. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 6. PRICING — "This is what it costs" */}
      <PricingSection />

      {/* 7. FAQ + CTA — "I understand what I can do next" */}
      <FinalCTA />

      {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={BUSINESS_TYPES} />
    </>
  );
}
