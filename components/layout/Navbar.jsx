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
    { label: "Products", targetId: "products" },
    { label: "How it works", targetId: "how-it-works" },
    { label: "Pricing", targetId: "pricing" },
    { label: "FAQ", targetId: "faq" }
  ];

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

    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#05070B]/90 backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.9),0_0_80px_rgba(6,182,212,0.08)] py-3.5"
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
        <nav className={`hidden lg:flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-1.5 rounded-full border backdrop-blur-md shrink-0 transition-all duration-500 ${
          scrolled 
            ? "bg-white/[0.05] border-white/[0.12]" 
            : "bg-white/[0.03] border-white/[0.06]"
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollToSection(link.targetId)}
              className="text-[13px] font-medium text-slate-300 hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-cyan-500/10 hover:text-cyan-300 whitespace-nowrap bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action CTAs & Live Badge */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="btn-primary text-sm !py-2.5 !px-5 whitespace-nowrap cursor-pointer"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="btn-primary text-xs !py-2 !px-3.5"
          >
            Book a Demo
          </button>
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
            className="animate-fade-in lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-80px)] overflow-y-auto bg-[#05070B]/95 backdrop-blur-2xl border-b border-white/[0.15] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_100px_rgba(6,182,212,0.1)] text-white z-50"
          >
            <div className="flex flex-col gap-4">

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToSection(link.targetId)}
                  className="text-base font-medium text-slate-300 hover:text-[#00F0FF] py-2.5 border-b border-white/[0.05] flex items-center justify-between w-full text-left bg-transparent border-none cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="btn-primary w-full text-center justify-center text-sm !py-3.5"
                >
                  Book a Demo
                </button>
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
