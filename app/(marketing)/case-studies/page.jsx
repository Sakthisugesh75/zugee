// app/(marketing)/case-studies/page.jsx
// Case studies list. Only real, customer-approved case studies from lib/case-studies.js are shown.
// While none is published the page shows an honest "coming soon" state and is noindex.
// Deliberately not linked from the nav, footer or sitemap until a real case study exists.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageIntro from "@/components/about/PageIntro";
import DemoCTA from "@/components/about/DemoCTA";
import { caseStudiesRobots, caseStudyTitle, publishedCaseStudies } from "@/lib/case-studies";

const TITLE = "ZUGEE Case Studies | How Indian SMEs Use ZUGEE";
const DESCRIPTION =
  "How Indian businesses set up and use ZUGEE's industry-specific CRM, ERP and GST billing software, in their own words.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/case-studies" },
  // noindex, follow until a real case study is published (computed from lib/case-studies.js).
  robots: caseStudiesRobots(),
  // openGraph and twitter replace the root layout's objects, so every field is repeated.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/case-studies",
    siteName: "ZUGEE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
    locale: "en_IN",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] }
};

export default function CaseStudiesPage() {
  const studies = publishedCaseStudies();

  return (
    <>
      <PageIntro crumbs={[{ label: "Home", href: "/" }, { label: "Case studies" }]} eyebrow="Customer stories" title="Case studies">
        {studies.length > 0 && <p>How businesses like yours set up ZUGEE, what we set up for them and what changed.</p>}
      </PageIntro>

      {studies.length === 0 ? (
        <DemoCTA title="Case studies coming soon">
          We publish a case study only when a customer has approved every word of it. Until then, the best way to see
          ZUGEE is a free demo with your own examples.
        </DemoCTA>
      ) : (
        <>
          <section aria-labelledby="case-studies-list" className="py-16 sm:py-20 bg-canvas-alt border-b border-ink/[0.06]">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
              <h2 id="case-studies-list" className="sr-only">
                All case studies
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
                {studies.map((study) => (
                  <li key={study.slug}>
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="group h-full p-6 rounded-2xl bg-card border border-line shadow-card hover:border-cyan-500/40 transition-colors flex flex-col"
                    >
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                        {study.industry}
                      </span>
                      <h3 className="text-lg font-bold text-fg leading-snug mb-2">{caseStudyTitle(study)}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                        {Array.isArray(study.problem) ? study.problem[0] : study.problem}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
                        Read the case study
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <DemoCTA title="See it with your own examples" alt={false}>
            Book a free demo and we&apos;ll show you the software working with your own examples.
          </DemoCTA>
        </>
      )}
    </>
  );
}
