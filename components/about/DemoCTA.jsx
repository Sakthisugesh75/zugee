// components/about/DemoCTA.jsx
// Closing "book a demo" band for the company pages. A real link to the homepage contact form.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DemoCTA({ title, children, alt = true }) {
  return (
    <section className={`py-16 sm:py-20 border-b border-ink/[0.06] ${alt ? "bg-canvas-alt" : "bg-canvas"}`}>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight leading-tight mb-4">{title}</h2>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">{children}</p>
        <Link href="/#contact" className="btn-primary text-base !py-3.5 !px-8">
          <span>Book a free demo</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
