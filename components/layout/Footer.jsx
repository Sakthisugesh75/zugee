// components/layout/Footer.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import MascotLogo from "@/components/ui/MascotLogo";
import { VERTICALS } from "@/lib/verticals";
import { ArrowUp, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // idle | loading | success | error
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;

    setNewsletterStatus("loading");
    try {
      // Subscribers are stored separately so they never enter the sales lead queue
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail, company_website: honeypot })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setNewsletterStatus("success");
        setNewsletterMsg("Subscribed! Watch your inbox for the next briefing.");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Network error. Please try again.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#04070D] border-t border-white/[0.08] pt-16 pb-12 text-slate-400">
      <div className="container">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Col 1 & 2: Brand Lockup & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MascotLogo
              size={44}
              showWordmark={true}
              showSubline={true}
              showTagline={true}
            />

            <p className="text-sm text-slate-400 max-w-sm mt-3 leading-relaxed">
              GST billing, stock tracking and WhatsApp payment reminders for small businesses in India — in one login.
            </p>

            {/* Newsletter Subscription with Verified Lead Storage */}
            <div className="mt-4 max-w-sm">
              <span className="block text-xs font-mono uppercase tracking-wider text-[#00F0FF] mb-2 font-semibold">
                Operations Briefing (Monthly)
              </span>
              <form onSubmit={handleNewsletterSubmit} className="relative flex gap-2">
                {/* Honeypot: hidden from people and assistive tech */}
                <input
                  type="text"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute left-[-9999px] w-px h-px opacity-0"
                />
                <input
                  type="email"
                  aria-label="Email address for the monthly operations briefing"
                  maxLength={254}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                  className="w-full bg-[#0A0F1D] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none flex-1 transition-colors"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                  className="btn-primary text-xs !py-2.5 !px-4 font-mono"
                >
                  {newsletterStatus === "loading" ? "..." : "Join"}
                </button>
              </form>

              {newsletterStatus === "success" && (
                <div className="flex items-center gap-1.5 text-xs text-[#00F0FF] font-mono mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{newsletterMsg}</span>
                </div>
              )}
              {newsletterStatus === "error" && (
                <p className="text-xs text-rose-400 font-mono mt-1">{newsletterMsg}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-3">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              <span>Durable lead queue storage · Zero marketing spam</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4">
              Zugee
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-sm">
              <li><a href="#product" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">Product</a></li>
              <li><a href="#why-zugee" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">Why Zugee</a></li>
              <li><a href="#pricing" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">Pricing</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">FAQ</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">Book a Discovery Call</a></li>
            </ul>
          </div>

          {/* Col 4 & 5: All 11 Verticals */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4">
              Built for your trade
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {VERTICALS.map((v) => (
                <a
                  key={v.id}
                  href={`#industries`}
                  className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline py-0.5"
                >
                  {v.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Zugee Systems Technologies Pvt. Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-slate-400 hover:text-[#00F0FF] transition-colors no-underline">
              Internal Admin Portal
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:border-[#00F0FF] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
