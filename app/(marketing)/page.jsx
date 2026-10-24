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
import { DEMO_FORM_BUSINESS_TYPES } from "@/lib/products";
import { PLANS } from "@/lib/pricing";
import { homePageSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata = {
  // The search terms people use (CRM, ERP, GST billing software) in the title, within 60 characters.
  title: { absolute: "ZUGEE — CRM, ERP & GST Billing Software for Indian SMEs" },
  description:
    "ZUGEE makes industry-specific CRM, ERP and billing software for Indian SMEs: fleet, travel, water, real estate, schools, hospitals and more. Book a demo.",
  alternates: {
    canonical: "/"
  }
};

// No prices are published on the site: pricing is quoted on a call. Only the plan names and what
// each plan includes are passed to the page, so the amounts in lib/pricing.js (still used by the
// admin subscriptions tool) never reach the HTML or the client bundle.
const PLAN_SUMMARIES = PLANS.map(({ key, name, features, setupIncludes }) => ({ key, name, features, setupIncludes }));

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

      {/* 3. COMPARISON — "This is the problem ZUGEE solves" */}
      <ComparisonSection />

      {/* 4. INDUSTRIES — "This is how it fits my business" */}
      <IndustryShowcase />

      {/* 5. HOW IT WORKS — "This is how I use it" */}
      <HowWeWork />

      {/* 6. PRICING — "How to get a quote" */}
      <PricingSection plans={PLAN_SUMMARIES} />

      {/* 7. FAQ — "Common questions answered" */}
      <section className="section-wrapper bg-canvas border-b border-ink/[0.08]">
        <div className="container">
          <FAQSection />
        </div>
      </section>

      {/* 8. CTA — "I understand what I can do next" */}
      <FinalCTA />

      {/* Only the option list is passed down, so the full catalog stays out of the client bundle. */}
      <ContactSection businessTypes={DEMO_FORM_BUSINESS_TYPES} />
    </>
  );
}
