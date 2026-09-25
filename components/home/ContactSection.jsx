// components/home/ContactSection.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { VERTICALS } from "@/lib/verticals";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionReveal";

// Keep in sync with the limits enforced in app/api/leads/route.js
const MAX_LENGTHS = { name: 120, email: 254, phone: 25, goal: 300, message: 2000 };

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  industry: "",
  goal: "",
  message: ""
};

export default function ContactSection() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sourcePage, setSourcePage] = useState("homepage-contact");
  const [honeypot, setHoneypot] = useState("");

  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedData, setConfirmedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [prefillNotice, setPrefillNotice] = useState(null);
  const noticeTimerRef = useRef(null);

  // Listen for prefill events from Quiz and Pricing Estimator
  useEffect(() => {
    const handlePrefill = (e) => {
      const { industry, goal, message, source } = e.detail || {};
      setFormData((prev) => ({
        ...prev,
        industry: industry || prev.industry,
        goal: (goal || prev.goal).slice(0, MAX_LENGTHS.goal),
        message: (message || prev.message).slice(0, MAX_LENGTHS.message)
      }));
      if (source) setSourcePage(source);

      const verticalMatch = VERTICALS.find((v) => v.id === industry);
      const label = verticalMatch ? verticalMatch.name : industry || "your assessment";
      setPrefillNotice(`Pre-filled profile: ${label}`);
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = setTimeout(() => setPrefillNotice(null), 8000);
    };

    window.addEventListener("zugee:prefill-contact", handlePrefill);
    return () => {
      window.removeEventListener("zugee:prefill-contact", handlePrefill);
      clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source_page: sourcePage,
          company_website: honeypot
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        // Confirmation is shown ONLY after database write succeeds
        const industryMatch = VERTICALS.find((v) => v.id === formData.industry);
        setConfirmedData({
          referenceId: result.reference_id,
          name: formData.name,
          email: formData.email,
          industry: industryMatch ? industryMatch.name : "Other / Bespoke"
        });
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.error || "Failed to record inquiry. Please check your inputs and try again."
        );
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error: Unable to reach lead server. Please try again.");
    }
  };

  const copyRefId = async () => {
    if (!confirmedData?.referenceId) return;
    try {
      await navigator.clipboard.writeText(confirmedData.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context or denied) — the ID is still visible to copy manually
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSourcePage("homepage-contact");
    setSubmitStatus("idle");
    setConfirmedData(null);
  };

  const updateField = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const selectIndustry = (industryId) => {
    setFormData((prev) => ({ ...prev, industry: industryId }));
    document.getElementById("contact-name")?.focus({ preventScroll: true });
  };

  return (
    <section id="contact" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header — final CTA */}
        <MotionReveal className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Stop juggling <span className="blue-cyan-gradient-text">Tally, Excel and WhatsApp.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Book a 20-minute call and see Zugee set up for your trade.
          </p>
        </MotionReveal>

        {/* Compact industries strip — the eleven verticals now live here as a one-line selector,
            not as the pitch. Choosing one pre-fills the industry field below.
            TODO(seo): once /industries/* landing pages exist with real content, turn these into links. */}
        <MotionReveal delay={0.05} className="max-w-4xl mx-auto mb-8">
          <div id="industries" className="scroll-mt-28 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1">Built for your trade:</span>
            {[...VERTICALS.map((v) => ({ id: v.id, label: v.shortName })), { id: "other", label: "Other" }].map((v) => {
              const active = formData.industry === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectIndustry(v.id)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/50"
                      : "bg-white/[0.03] text-slate-300 border-white/[0.1] hover:border-[#00F0FF]/40 hover:text-white"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </MotionReveal>

        {/* Main Form Container */}
        <MotionReveal delay={0.15} className="max-w-2xl mx-auto">
          {submitStatus === "success" && confirmedData ? (
            /* Success confirmation card — ONLY appears after verified database write */
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border-[#00F0FF]/40 bg-[#0A0F1D]/90 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-center space-y-6 animate-fade-in backdrop-blur-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.25)] border border-[#00F0FF]/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] block mb-2 font-bold">
                  Confirmed & Queued
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans mb-2">
                  Inquiry Verified & Saved
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{confirmedData.name}</strong>. Your inquiry has been securely recorded into our lead queue.
                </p>
              </div>

              {/* Reference ID Pill with Copy */}
              {confirmedData.referenceId && (
                <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] max-w-sm mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                      Lead Reference ID
                    </span>
                    <span className="text-base font-mono font-bold text-[#00F0FF]">
                      {confirmedData.referenceId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyRefId}
                    className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:border-[#00F0FF] cursor-pointer transition-colors"
                    title="Copy Reference ID"
                    aria-label="Copy reference ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#00F0FF]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#06090F] border border-white/[0.08] text-xs text-slate-400 font-mono text-left space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span>Selected Industry:</span>
                  <span className="text-white font-medium text-right">{confirmedData.industry}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>We&apos;ll reply to:</span>
                  <span className="text-white font-medium text-right break-all">{confirmedData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SLA Response Window:</span>
                  <span className="text-[#00F0FF] font-semibold">Within 1 business day</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary text-xs font-mono !py-2.5 !px-6 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Lead Capture Form */
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] border-white/[0.12] bg-[#0A0F1D]/85 backdrop-blur-2xl"
            >
              {prefillNotice && (
                <div className="p-3.5 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-between text-xs font-mono text-[#00F0FF] animate-fade-in shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{prefillNotice} — review details and submit below.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrefillNotice(null)}
                    className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="contact-company-website">Company website</label>
                <input
                  id="contact-company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Name <span className="text-[#00F0FF]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={MAX_LENGTHS.name}
                    autoComplete="name"
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.name}
                    onChange={updateField("name")}
                    className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors"
                    disabled={submitStatus === "loading"}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Email <span className="text-[#00F0FF]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={MAX_LENGTHS.email}
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={updateField("email")}
                    className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors"
                    disabled={submitStatus === "loading"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    WhatsApp number (optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    maxLength={MAX_LENGTHS.phone}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={updateField("phone")}
                    className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors"
                    disabled={submitStatus === "loading"}
                  />
                </div>

                <div>
                  <label htmlFor="contact-industry" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Your trade <span className="text-[#00F0FF]">*</span>
                  </label>
                  <select
                    id="contact-industry"
                    required
                    value={formData.industry}
                    onChange={updateField("industry")}
                    className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors cursor-pointer"
                    disabled={submitStatus === "loading"}
                  >
                    <option value="" disabled className="bg-[#0A0F1D] text-slate-400">
                      Choose your trade...
                    </option>
                    {VERTICALS.map((v) => (
                      <option key={v.id} value={v.id} className="bg-[#0A0F1D] text-white">
                        {v.shortName}
                      </option>
                    ))}
                    <option value="other" className="bg-[#0A0F1D] text-white">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-goal" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  Main goal (optional)
                </label>
                <input
                  id="contact-goal"
                  type="text"
                  maxLength={MAX_LENGTHS.goal}
                  placeholder="e.g. Automating fee collection & instant WhatsApp receipts"
                  value={formData.goal}
                  onChange={updateField("goal")}
                  className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors"
                  disabled={submitStatus === "loading"}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                  What you use today (optional)
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  maxLength={MAX_LENGTHS.message}
                  placeholder="Briefly describe your current spreadsheets, billing software, or bottlenecks..."
                  value={formData.message}
                  onChange={updateField("message")}
                  className="w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white font-sans text-sm outline-none transition-colors resize-none"
                  disabled={submitStatus === "loading"}
                />
              </div>

              {submitStatus === "error" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="btn-primary w-full text-xs font-mono uppercase tracking-wider !py-4 shadow-xl cursor-pointer justify-center"
              >
                {submitStatus === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Recording into secure lead queue...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Book a Discovery Call</span>
                    <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400 text-center">
                <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>No spam. We reply within one business day.</span>
              </div>
            </form>
          )}
        </MotionReveal>
      </div>
    </section>
  );
}
