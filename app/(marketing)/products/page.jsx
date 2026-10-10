// app/(marketing)/products/page.jsx
// The products hub: every product that has a landing page, grouped by the catalog's categories
// (lib/products.js PRODUCT_CATEGORIES), each card linking to its page. A static route, so it takes
// precedence over the dynamic product route next to it.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCT_CATEGORIES, availableProducts } from "@/lib/products";
import { productsHubSchema, serializeJsonLd } from "@/lib/structured-data";

const TITLE = "Industry-Specific Business Software for Indian SMEs";
const DESCRIPTION =
  "ZUGEE makes separate software for each industry: fleet, travel, water, real estate, garments, schools, colleges, PGs, resorts and hospitals. Book a demo.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products" },
  // openGraph and twitter replace the root layout's objects, so every field is repeated.
  openGraph: {
    title: `${TITLE} | ZUGEE`,
    description: DESCRIPTION,
    url: "/products",
    siteName: "ZUGEE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | ZUGEE`, description: DESCRIPTION, images: ["/og.jpg"] }
};

// One line under each group heading.
const GROUP_INTROS = {
  business: "For any business that sells, bills and collects payments, whatever the trade.",
  industry: "Built around the daily work of one kind of business, in that industry's own language."
};

// Products with a page, in catalog order, grouped by category. The ItemList schema uses the same order.
const groups = PRODUCT_CATEGORIES.map((category) => ({
  ...category,
  products: availableProducts().filter((p) => p.category === category.id && p.pageSlug)
})).filter((group) => group.products.length > 0);
const listed = groups.flatMap((group) => group.products);

export default function ProductsHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productsHubSchema(listed)) }} />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full ambient-glow lg:blur-[180px]" />
        </div>
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li aria-current="page" className="text-slate-200 font-medium">Products</li>
            </ol>
          </nav>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">Our products</p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-fg leading-[1.08] mb-6">{TITLE}</h1>
          <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            <p>
              Most small and mid-size businesses in India run on a mix of Excel sheets, WhatsApp groups, paper registers
              and a Tally computer in the corner. ZUGEE takes a different approach from one-size-fits-all software: we
              make a separate product for each kind of business. A transport owner gets software built around vehicles,
              trips and drivers; a school gets attendance, fees and exams; a hospital gets patient registration, OP and IP
              billing, pharmacy and lab.
            </p>
            <p>
              Each ZUGEE product is separate software with its own login and its own data, so you learn only what your
              business needs. Whichever you choose, our team sets it up for you in 14 days, brings your records across from
              Excel or Tally and trains your staff before you go live. Pick your industry below to see what the product
              does, who it is for and how setup works.
            </p>
          </div>
        </div>
      </section>

      {groups.map((group, i) => (
        <section
          key={group.id}
          aria-labelledby={`group-${group.id}`}
          className={`py-16 sm:py-20 border-b border-ink/[0.06] ${i % 2 === 0 ? "bg-canvas-alt" : "bg-canvas"}`}
        >
          <div className="container max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-10">
              <h2 id={`group-${group.id}`} className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight leading-tight mb-3">
                {group.label}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{GROUP_INTROS[group.id]}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
              {group.products.map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight leading-tight mb-4">Not sure which product fits?</h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Tell us about your business on a short call. We will show you the product that fits, or tell you honestly if
            none does yet.
          </p>
          <Link href="/#contact" className="btn-primary text-base !py-3.5 !px-8">
            <span>Book a free demo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
