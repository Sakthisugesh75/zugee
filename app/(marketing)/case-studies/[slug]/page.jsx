// app/(marketing)/case-studies/[slug]/page.jsx
// One case study: industry, the problem, what we set up, results and the customer's quote. Fully
// static: one page per published entry in lib/case-studies.js, any other slug is a 404. With no
// published entries, generateStaticParams returns [] and dynamicParams = false makes every slug a 404.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, Quote } from "lucide-react";
import PageIntro from "@/components/about/PageIntro";
import DemoCTA from "@/components/about/DemoCTA";
import { caseStudiesRobots, caseStudyTitle, getCaseStudy, publishedCaseStudies } from "@/lib/case-studies";
import { PRODUCTS, productPagePath } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCaseStudies().map((study) => ({ slug: study.slug }));
}

function paragraphs(value) {
  return Array.isArray(value) ? value : [value];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { robots: caseStudiesRobots() };
  const title = `${caseStudyTitle(study)} | ZUGEE Case Study`;
  const description = paragraphs(study.problem)[0].slice(0, 160);
  const path = `/case-studies/${study.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    // noindex, follow until a real case study is published (computed from lib/case-studies.js).
    robots: caseStudiesRobots(),
    // openGraph and twitter replace the root layout's objects, so every field is repeated.
    openGraph: {
      title,
      description,
      url: path,
      siteName: "ZUGEE",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
      locale: "en_IN",
      type: "article"
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] }
  };
}

function ListSection({ id, title, items, alt }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby={id} className={`py-14 sm:py-16 border-b border-ink/[0.06] ${alt ? "bg-canvas-alt" : "bg-canvas"}`}>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <h2 id={id} className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight mb-6">
          {title}
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-base sm:text-lg text-slate-300 leading-relaxed">
              <CircleCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-1" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const productPath = productPagePath(PRODUCTS.find((p) => p.pageSlug && p.pageSlug === study.productPageSlug));

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Case studies", href: "/case-studies" }, { label: caseStudyTitle(study) }]}
        eyebrow={study.industry}
        title={caseStudyTitle(study)}
      />

      <section aria-labelledby="case-problem" className="py-14 sm:py-16 bg-canvas-alt border-b border-ink/[0.06]">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
          <h2 id="case-problem" className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight mb-6">
            The problem
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {paragraphs(study.problem).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <ListSection id="case-setup" title="What we set up" items={study.whatWeSetUp} alt={false} />
      <ListSection id="case-results" title="Results" items={study.results} alt />

      {study.quote?.text && (
        <section className="py-14 sm:py-16 bg-canvas border-b border-ink/[0.06]">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
            <figure className="m-0 p-6 sm:p-8 rounded-2xl bg-card border border-cyan-500/30 shadow-card">
              <Quote className="w-8 h-8 text-cyan-400 mb-4" aria-hidden="true" />
              <blockquote className="text-lg sm:text-xl text-fg leading-relaxed m-0">{study.quote.text}</blockquote>
              <figcaption className="mt-5 text-sm text-slate-400">
                <span className="font-bold text-slate-200">{study.quote.name}</span>
                {study.quote.role && <>, {study.quote.role}</>}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {productPath && (
        <section className="py-10 bg-canvas-alt border-b border-ink/[0.06]">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Link
              href={productPath}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              See the product they use
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <DemoCTA title="Want the same for your business?" alt={false}>
        Book a free demo and we&apos;ll show you the software working with your own examples.
      </DemoCTA>
    </>
  );
}
