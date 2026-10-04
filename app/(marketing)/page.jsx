// app/(marketing)/page.jsx
// Homepage — ZUGEE's complete narrative experience:
//
// Hero → "Specialised software for each industry"
// Products → "These are the products"
// How It Works → "This is how I use it"
// Pricing → "How to get a quote" (no prices are published; see below)
// FAQ → "Common questions answered"
// CTA → "I understand what I can do next"
//
// Every claim must pass the rule in docs/ZUGEE-PLATFORM-PLAN.md:
// "can the product actually do this today?"

import Hero from "@/components/home/Hero";
import ProductShowcase from "@/components/home/ProductShowcase";
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

      {/* 2. PRODUCTS — "These are the products" */}
      <ProductShowcase />

      {/* 3. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 4. PRICING — "How to get a quote" */}
      <PricingSection />

      {/* 5. FAQ — "Common questions answered" */}
      <section className="section-wrapper bg-[#06090F] border-b border-white/[0.08]">
        <div className="container">
          <FAQSection />
        </div>
      </section>

      {/* 6. CTA — "I understand what I can do next" */}
      <FinalCTA />

      {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={BUSINESS_TYPES} />
    </>
  );
}
