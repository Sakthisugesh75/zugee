// lib/case-studies.js
// Customer case studies for /case-studies. No JSX, so tests can load it.
//
// NEVER invent customers, numbers or quotes. Publish only real case studies the customer has
// approved in writing. While no entry has `published: true`, /case-studies shows a "coming soon"
// state and both case-study routes are noindex.
//
// Shape of each entry:
// {
//   slug: "salem-transport-fleet",          // URL: /case-studies/<slug>
//   industry: "Fleet & transport",
//   businessName: "…",                      // optional: leave out if the customer prefers anonymity
//   problem: "One or two paragraphs.",      // string, or array of paragraphs
//   whatWeSetUp: ["…", "…"],                // what ZUGEE configured, migrated and trained
//   results: ["…", "…"],                    // only results the customer confirmed
//   quote: { text: "…", name: "…", role: "…" }, // optional
//   productPageSlug: "fleet-management-software", // pageSlug from lib/products.js
//   published: false
// }
export const CASE_STUDIES = [];

export function publishedCaseStudies() {
  return CASE_STUDIES.filter((study) => study.published === true);
}

export function getCaseStudy(slug) {
  return publishedCaseStudies().find((study) => study.slug === slug) ?? null;
}

/** Robots for both case-study routes: noindex until at least one real case study is published. */
export function caseStudiesRobots() {
  return publishedCaseStudies().length > 0 ? { index: true, follow: true } : { index: false, follow: true };
}

/** The heading for a case study: the business name, or a generic description if it is anonymous. */
export function caseStudyTitle(study) {
  return study.businessName ?? `A ${study.industry.toLowerCase()} business`;
}
