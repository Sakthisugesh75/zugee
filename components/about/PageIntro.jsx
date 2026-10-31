// components/about/PageIntro.jsx
// Top section for the company pages (/about, /case-studies): visible breadcrumb, eyebrow, the page's
// single H1 and optional intro. Same look as the products hub hero; the top padding clears the fixed header.

import Link from "next/link";

/**
 * @param {{ crumbs: { label: string, href?: string }[], eyebrow?: string, title: string, children?: React.ReactNode }} props
 * The last crumb is the current page (no href).
 */
export default function PageIntro({ crumbs, eyebrow, title, children }) {
  return (
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-16 overflow-hidden bg-canvas light-mesh border-b border-ink/[0.06]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-cyan-500/[0.07] rounded-full ambient-glow lg:blur-[180px]" />
      </div>
      <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400 list-none p-0 m-0">
            {crumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-x-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-slate-600">/</span>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-brand transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-slate-200 font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">{eyebrow}</p>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-fg leading-[1.08]">{title}</h1>
        {children && <div className="mt-6 space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed">{children}</div>}
      </div>
    </section>
  );
}
