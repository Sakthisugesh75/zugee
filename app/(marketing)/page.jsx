// app/(marketing)/page.jsx
// Homepage — ZUGEE's complete narrative experience:
//
// Hero → "Specialised software for each industry"
// Industry grid → "Find your industry"
// Product details → "What each product covers"
// Why ZUGEE → "Why choose this company"
// How It Works → "This is how I use it"
// Pricing → "How to get a quote" (no prices are published; see below)
// FAQ → "Common questions answered"
// CTA → "I understand what I can do next"
//
// Every claim must pass the rule in docs/ZUGEE-PLATFORM-PLAN.md:
// "can the product actually do this today?"

import Hero from "@/components/home/Hero";
import IndustryGrid from "@/components/home/IndustryGrid";
import ProductDetails from "@/components/home/ProductDetails";
import WhyZugee from "@/components/home/WhyZugee";
import HowWeWork from "@/components/home/HowWeWork";
import PricingSection from "@/components/home/PricingSection";
import FinalCTA from "@/components/home/FinalCTA";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import { BUSINESS_TYPES } from "@/lib/products";
import { homePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = {
  title: { absolute: "ZUGEE — Business Software for Indian Businesses" },
  description:
    "ZUGEE makes industry-focused CRM, ERP, billing and operations software for Indian businesses: fleet, travel, water supply, real estate, manufacturing and more.",
  alternates: {
    canonical: "/"
  }
};

// FAQPage + one SoftwareApplication per available product. The Organization is emitted by the root
// layout. Built from the same arrays that render the page, so it can never drift from what visitors see.
const structuredData = homePageSchema();

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* 1. HERO — "Specialised software for each industry" */}
      <Hero />

      {/* 2. INDUSTRY GRID — "Find your industry" (#products) */}
      <IndustryGrid />

      {/* 3. PRODUCT DETAILS — one block per product (#product-<slug>) */}
      <ProductDetails />

      {/* 4. WHY ZUGEE — light section */}
      <WhyZugee />

      {/* 5. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 6. PRICING — "How to get a quote" */}
      <PricingSection />

      {/* 7. FAQ — light section (#faq) */}
      <FAQSection />

      {/* 8. CTA — "I understand what I can do next" */}
      <FinalCTA />

      {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={BUSINESS_TYPES} />
    </>
  );
}
