// app/(marketing)/page.jsx
// Homepage: six sections that sell the platform to one buyer — the owner of a 5–50 person Indian
// business running on Tally, Excel and WhatsApp. Industry detail lives in the compact strip inside
// the final CTA (and, later, on dedicated /industries/* pages).

import Hero from "@/components/home/Hero";
import ProofSection from "@/components/home/ProofSection";
import ProductSection from "@/components/home/ProductSection";
import WhyZugee from "@/components/home/WhyZugee";
import PricingSection from "@/components/home/PricingSection";
import ContactSection from "@/components/home/ContactSection";
import { FAQ_ITEMS, PRICING_TIERS } from "@/lib/verticals";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zugee.com";

export const metadata = {
  title: { absolute: "GST Billing & Inventory Software for Small Business | Zugee" },
  description:
    "Business management software for small businesses in India: GST billing, stock tracking and WhatsApp payment reminders in one login. From ₹1,999/month.",
  alternates: {
    canonical: "/"
  }
};

// Structured data is generated from the same arrays that render the page, so the visible
// FAQ answers and prices can never drift from what search engines are told.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Zugee",
      url: `${SITE_URL}/`,
      description:
        "GST billing and inventory software for small businesses in India. Billing, stock, payments and WhatsApp customer communication in one login.",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Billing and inventory management",
      operatingSystem: "Web browser",
      inLanguage: "en-IN",
      countriesSupported: "IN",
      publisher: {
        "@type": "Organization",
        name: "Zugee Systems Technologies Pvt. Ltd.",
        url: `${SITE_URL}/`
      },
      offers: PRICING_TIERS.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: String(tier.price),
        priceCurrency: "INR",
        description: `${tier.audience} Free 2-week setup with your real data after a discovery call.`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(tier.price),
          priceCurrency: "INR",
          unitText: "MONTH",
          valueAddedTaxIncluded: false
        },
        url: `${SITE_URL}/#pricing`,
        availability: "https://schema.org/InStock"
      }))
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

      {/* 1. Hero — one outcome, one keyword, primary CTA */}
      <Hero />

      {/* 2. Proof — testimonials + metric (TODO(founder): content) */}
      <ProofSection />

      {/* 3. Product — dashboard preview + four outcomes */}
      <ProductSection />

      {/* 4. Why Zugee — three differentiators */}
      <WhyZugee />

      {/* 5. Pricing — two tiers + the six buying-objection FAQs */}
      <PricingSection />

      {/* 6. Final CTA — industries strip + discovery-call form */}
      <ContactSection />
    </>
  );
}
