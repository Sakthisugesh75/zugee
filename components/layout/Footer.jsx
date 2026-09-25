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
    <footer className="bg-[#04070D] border-t border-white/[0.08] pt-16 pb-12 text-slate-400">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MascotLogo size={44} showWordmark={true} showSubline={true} />
            <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
              Industry-focused CRM, ERP, billing and operations software for Indian businesses.
            </p>
          </div>

          <nav aria-label="Site">
            <p className="text-sm font-semibold text-white mb-4">ZUGEE</p>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-sm">
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
            <p className="text-sm font-semibold text-white mb-4">Products</p>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-sm">
              {listedProducts.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => scrollToSection("products")}
                    className={linkClass}
                  >
                    {p.name}
                    {p.status !== "available" && (
                      <span className="ml-1.5 text-xs text-slate-400">({PRODUCT_STATUS[p.status].label})</span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("products")}
                  className={linkClass}
                >
                  More coming soon
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Zugee Systems Technologies Pvt. Ltd.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:border-[#00F0FF] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
