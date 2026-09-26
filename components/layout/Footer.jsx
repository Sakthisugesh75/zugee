// components/layout/Footer.jsx
// Footer with smooth scroll navigation (no URL hash changes)
//
// TODO(founder): add real trust details here once confirmed — registered address, phone,
// WhatsApp, support email, founder/team names, and links to /privacy, /terms and /refund
// (Phase 3). Never add a CIN, GSTIN, address or number that isn't real.

"use client";

import MascotLogo from "@/components/ui/MascotLogo";
import { PRODUCTS, PRODUCT_STATUS } from "@/lib/products";
import { ArrowUp } from "lucide-react";

const SITE_LINKS = [
  { label: "Products", targetId: "products" },
  { label: "How it works", targetId: "how-it-works" },
  { label: "Pricing", targetId: "pricing" },
  { label: "FAQ", targetId: "faq" },
  { label: "Book a demo", targetId: "contact" }
];

const linkClass = "text-slate-400 hover:text-[#00F0FF] transition-colors cursor-pointer bg-transparent border-none text-left p-0";

export default function Footer() {
  const listedProducts = PRODUCTS.filter((p) => p.status !== "coming_soon");

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (!section) return;

    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetPosition = sectionTop - navbarHeight - 16;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth"
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#05070B] via-[#04070D] to-[#03060C] border-t border-white/[0.12] pt-16 pb-12 text-slate-400 overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.02] via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.15]">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MascotLogo size={44} showWordmark={true} showSubline={true} />
            <p className="text-sm text-slate-300 max-w-sm mt-2 leading-relaxed">
              Industry-focused CRM, ERP, billing and operations software for Indian businesses.
            </p>
            
            {/* Trust Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 w-fit">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-cyan-400">Trusted by Indian SMEs</span>
            </div>
          </div>

          <nav aria-label="Site">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-5">Quick Links</p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm">
              {SITE_LINKS.map((l) => (
                <li key={l.targetId}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(l.targetId)}
                    className={linkClass}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products">
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-5">Products</p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm">
              {listedProducts.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => scrollToSection("products")}
                    className={linkClass}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("products")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-none text-left p-0 font-medium"
                >
                  View all products →
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-400">
            <p>© {new Date().getFullYear()} Zugee Systems Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.15] text-slate-300 hover:text-white hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-sm font-medium">Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
