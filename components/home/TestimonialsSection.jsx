// components/home/TestimonialsSection.jsx
// Homepage testimonials. Renders nothing unless FEATURES.testimonials is on (lib/features.js) AND
// lib/testimonials.js has at least one real, customer-approved testimonial. Never fill it with
// invented quotes.

import { Quote } from "lucide-react";
import { FEATURES } from "@/lib/features";
import { TESTIMONIALS } from "@/lib/testimonials";

export default function TestimonialsSection() {
  if (!FEATURES.testimonials || TESTIMONIALS.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden py-20 sm:py-28 bg-canvas border-b border-ink/[0.06] scroll-mt-[80px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/[0.04] rounded-full ambient-glow lg:blur-[160px]" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-cyan-400 mb-3">From our customers</p>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-fg leading-tight">
            What business owners say about ZUGEE
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
          {TESTIMONIALS.map((t) => (
            <li key={`${t.name}-${t.business}`}>
              <figure className="h-full m-0 p-6 rounded-2xl bg-card border border-line shadow-card flex flex-col">
                <Quote className="w-7 h-7 text-cyan-400 mb-4" aria-hidden="true" />
                <blockquote className="text-base text-slate-200 leading-relaxed m-0 mb-6">{t.quote}</blockquote>
                <figcaption className="mt-auto pt-4 border-t border-ink/[0.06]">
                  <span className="block text-sm font-bold text-fg">{t.name}</span>
                  <span className="block text-sm text-slate-400">
                    {[t.role, t.business].filter(Boolean).join(", ")}
                  </span>
                  {t.industry && (
                    <span className="mt-2 inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {t.industry}
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
