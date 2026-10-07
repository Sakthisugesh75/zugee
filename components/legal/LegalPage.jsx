// components/legal/LegalPage.jsx
// Shared layout for /privacy, /terms and /refund. Server component: plain text, no JavaScript.
//
// Writing rules for these pages:
// - Plain English and short sentences. A business owner without a lawyer should understand it.
// - Only state what is true today. Where a fact has not been confirmed, use <Confirm> instead of
//   inventing it, and keep LEGAL_DRAFT true in lib/legal.js until none are left.
// - The site-wide claim rules in tests/site-content.test.mjs apply here too.

import Link from "next/link";
import { COMPANY, LEGAL_DRAFT, LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_ISO, LEGAL_PAGES } from "@/lib/legal";

const PROSE =
  "space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed " +
  "[&_strong]:text-fg [&_strong]:font-semibold " +
  "[&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cyan-300 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 " +
  "[&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-fg [&_h3]:pt-3";

/** A fact the founder still has to confirm. Visible on purpose, so it cannot go live unnoticed. */
export function Confirm({ children }) {
  return (
    <mark className="rounded px-1 py-0.5 bg-amber-400/15 text-amber-300 font-medium">[CONFIRM: {children}]</mark>
  );
}

/** A short highlighted note, used for the one or two points a reader must not miss. */
export function KeyPoint({ children }) {
  return (
    <div className="glass-card border-cyan-500/30 p-5 text-sm sm:text-base text-slate-200 leading-relaxed [&_strong]:text-fg">
      {children}
    </div>
  );
}

export function LegalTable({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/[0.08]">
      {/* Wide tables scroll sideways on a phone; two-column tables fit without it. */}
      <table className={`w-full text-left text-sm ${head.length > 2 ? "min-w-[560px]" : ""}`}>
        <thead>
          <tr className="bg-ink/[0.04] text-fg">
            {head.map((cell) => (
              <th key={cell} scope="col" className="py-3 px-4 font-semibold align-top">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/[0.06]">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className={`py-3 px-4 align-top ${cellIdx === 0 ? "text-fg font-semibold" : "text-slate-300"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Email and address, the same on every page. */
export function ContactLines() {
  return (
    <ul>
      <li>
        Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
      </li>
      <li>
        {COMPANY.name}, {COMPANY.city}
      </li>
    </ul>
  );
}

/**
 * @param {{ path: string, title: string, intro: React.ReactNode,
 *           sections: { id: string, title: string, body: React.ReactNode }[] }} props
 */
export default function LegalPage({ path, title, intro, sections }) {
  const otherPages = LEGAL_PAGES.filter((page) => page.href !== path);

  return (
    <div className="relative bg-canvas border-b border-ink/[0.08] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* The navbar is fixed, so the page starts below it. */}
      <div className="container relative z-10 pt-32 pb-20 sm:pt-36">
        <article className="max-w-3xl mx-auto">
          <header className="pb-8 mb-10 border-b border-ink/[0.08]">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 mb-3">Legal</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fg tracking-tight mb-4">{title}</h1>
            <p className="text-sm text-slate-400 font-mono">
              Last updated: <time dateTime={LEGAL_LAST_UPDATED_ISO}>{LEGAL_LAST_UPDATED}</time>
            </p>
            <div className={`${PROSE} mt-6`}>{intro}</div>
          </header>

          {LEGAL_DRAFT && (
            <p role="note" className="mb-10 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-sm text-amber-200 leading-relaxed">
              This page is a draft. Items marked <span className="font-semibold">[CONFIRM: …]</span> are still being
              finalised and are not yet binding. Ask us if any of them matters to your decision.
            </p>
          )}

          <nav aria-label="On this page" className="glass-card p-6 mb-12">
            <p className="text-xs font-bold text-fg uppercase tracking-wider mb-4">On this page</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 list-none p-0 m-0 text-sm">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-slate-300 hover:text-cyan-300 transition-colors">
                    <span className="font-mono text-cyan-400 mr-2">{idx + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
                <h2 id={`${section.id}-title`} className="text-xl sm:text-2xl font-extrabold text-fg tracking-tight mb-4">
                  <span className="font-mono text-cyan-400 mr-2">{idx + 1}.</span>
                  {section.title}
                </h2>
                <div className={PROSE}>{section.body}</div>
              </section>
            ))}
          </div>

          <footer className="mt-14 pt-8 border-t border-ink/[0.08] text-sm text-slate-400">
            <p className="mb-3">Related pages:</p>
            <ul className="flex flex-col sm:flex-row gap-x-6 gap-y-2 list-none p-0 m-0">
              {otherPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    {page.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        </article>
      </div>
    </div>
  );
}
