// components/layout/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MascotLogo from "@/components/ui/MascotLogo";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06090F]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center no-underline">
            <MascotLogo
              size={36}
              showWordmark={true}
              showSubline={true}
              preload
              sublineClassName="hidden sm:block lg:hidden xl:block"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-slate-300 hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full transition-all hover:bg-white/[0.06] no-underline whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs & Live Badge */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          <a
            href="#contact"
            className="btn-primary text-sm !py-2.5 !px-5 whitespace-nowrap"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <a
            href="#contact"
            className="btn-primary text-xs !py-2 !px-3.5"
          >
            Book a Demo
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white hover:border-[#00F0FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
          <div
            className="animate-fade-in lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-80px)] overflow-y-auto bg-[#0A0F1D]/95 backdrop-blur-2xl border-b border-white/[0.1] p-6 shadow-2xl text-white z-50"
          >
            <div className="flex flex-col gap-4">

              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-[#00F0FF] py-2.5 border-b border-white/[0.05] no-underline flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center justify-center text-sm !py-3.5"
                >
                  Book a Demo
                </a>
                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Zugee Systems Technologies Pvt. Ltd.</span>
                </div>
              </div>
            </div>
          </div>
        )}
    </header>
  );
}
