// app/(marketing)/page.jsx
// Homepage — ZUGEE's complete narrative experience:
//
// Hero → "Specialised software for each industry"
// Industry grid → "Find your industry"
// Product carousel → "What each product covers"
// Why ZUGEE → "Why choose this company"
// How It Works → "This is how I use it"
// Pricing → "How to get a quote" (no prices are published; see below)
// FAQ → "Common questions answered"
// Final CTA → "See the software live — book a free demo."
// Contact → the demo form (#contact)
//
// Every claim must pass the rule in docs/ZUGEE-PLATFORM-PLAN.md:
// "can the product actually do this today?"

import Hero from "@/components/home/Hero";
import IndustryGrid from "@/components/home/IndustryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import WhyZugee from "@/components/home/WhyZugee";
import HowWeWork from "@/components/home/HowWeWork";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import ContactSection from "@/components/home/ContactSection";
import { DEMO_FORM_BUSINESS_TYPES } from "@/lib/products";
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

      {/* 3. PRODUCT CAROUSEL — one slide per product (#product-<slug>) */}
      <ProductCarousel />

      {/* 4. WHY ZUGEE */}
      <WhyZugee />

      {/* 5. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 6. PRICING — "How to get a quote" */}
      <PricingSection />

      {/* 7. FAQ (#faq) */}
      <FAQSection />

      {/* 8. FINAL CTA — "See the software live — book a free demo." */}
      <FinalCTA />

      {/* 9. CONTACT — the demo form (#contact). Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={DEMO_FORM_BUSINESS_TYPES} />
    </>
  );
}
