// components/home/ContactSection.jsx
// Final CTA: a short demo-request form. The team calls back to arrange a demo meeting.
// Required: name, mobile/WhatsApp, business type. Everything else is
// optional — most Indian SMB owners would rather be called or WhatsApped than emailed.
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

// Keep in sync with the limits enforced in app/api/leads/route.js
const MAX_LENGTHS = { name: 120, phone: 25, email: 254, company: 160, message: 2000 };

const EMPTY_FORM = { name: "", phone: "", industry: "", email: "", company: "", message: "" };

const inputClass =
  "w-full bg-[#06090F] border border-white/[0.12] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors";
const labelClass = "block text-sm font-medium text-slate-200 mb-2";

export default function ContactSection({ businessTypes }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  // Product cards pre-select the business type before scrolling here.
  useEffect(() => {
    const handleSelect = (e) => {
      const slug = e.detail?.slug;
      if (slug && businessTypes.some((b) => b.id === slug)) {
        setFormData((prev) => ({ ...prev, industry: slug }));
      }
    };
    window.addEventListener("zugee:select-product", handleSelect);
    return () => window.removeEventListener("zugee:select-product", handleSelect);
  }, [businessTypes]);

  // Pricing cards' "Get Started" notes the chosen plan in the message (only if it's still empty,
  // so we never overwrite what the visitor typed).
  useEffect(() => {
    const handlePlan = (e) => {
      const planName = e.detail?.planName;
      if (!planName) return;
      setFormData((prev) =>
        prev.message.trim() ? prev : { ...prev, message: `I'm interested in the ${planName} plan.` }
      );
    };
    window.addEventListener("zugee:select-plan", handlePlan);
    return () => window.removeEventListener("zugee:select-plan", handlePlan);
  }, []);

  const updateField = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source_page: "homepage-contact", company_website: honeypot })
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setConfirmed({ name: formData.name, phone: formData.phone, referenceId: result.reference_id });
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "We couldn't send your details. Please check the form and try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("We couldn't reach our server. Please check your connection and try again.");
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSubmitStatus("idle");
    setConfirmed(null);
  };

  const busy = submitStatus === "loading";

  return (
    <section id="contact" className="section-wrapper bg-[#06090F] border-b border-white/[0.08] relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Book a demo
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Tell us about your business. We&apos;ll call or WhatsApp you to fix a time and show you the product live.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-10 items-center">
          {/* Mascot — desktop only, so the form stays first on phones. The webp has its black
              background converted to transparency, so it sits directly on the section glow. */}
          <div aria-hidden="true" className="hidden lg:flex justify-center relative">
            <div className="absolute bottom-6 w-48 h-10 rounded-full bg-[#00F0FF]/20 blur-2xl" />
            <Image
              src="/zugee-mascot-cutout.webp"
              alt=""
              width={1024}
              height={1536}
              sizes="300px"
              className="w-full max-w-[300px] h-auto animate-mascot-float"
            />
          </div>

          {/* Not wrapped in a reveal animation: CTAs jump straight here, so the form must be visible at once. */}
          <div className="w-full max-w-2xl mx-auto">
            {submitStatus === "success" && confirmed ? (
              <div
                role="status"
                className="rounded-3xl border border-[#00F0FF]/40 bg-[#0A0F1D]/90 p-8 sm:p-10 text-center space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#00F0FF]/15 text-[#00F0FF] flex items-center justify-center mx-auto border border-[#00F0FF]/40">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thanks, {confirmed.name}.</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  We&apos;ll contact you on{" "}
                  <strong className="text-white">{confirmed.phone}</strong> to arrange your demo.
                </p>
                {confirmed.referenceId && (
                  <p className="text-xs text-slate-400">
                    Your reference: <span className="text-slate-200 font-semibold">{confirmed.referenceId}</span>
                  </p>
                )}
                <button type="button" onClick={resetForm} className="btn-secondary text-sm !py-2.5 !px-6 cursor-pointer">
                  Send another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-white/[0.12] bg-[#0A0F1D]/85 p-5 sm:p-10 space-y-5"
              >
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
                    <label htmlFor="contact-name" className={labelClass}>
                      Your name <span className="text-[#00F0FF]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={MAX_LENGTHS.name}
                      autoComplete="name"
                      value={formData.name}
                      onChange={updateField("name")}
                      className={inputClass}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Mobile / WhatsApp <span className="text-[#00F0FF]">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      maxLength={MAX_LENGTHS.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={updateField("phone")}
                      className={inputClass}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-industry" className={labelClass}>
                    Business type <span className="text-[#00F0FF]">*</span>
                  </label>
                  <select
                    id="contact-industry"
                    required
                    value={formData.industry}
                    onChange={updateField("industry")}
                    className={`${inputClass} cursor-pointer`}
                    disabled={busy}
                  >
                    <option value="" disabled className="bg-[#0A0F1D] text-slate-400">
                      Choose your business type…
                    </option>
                    {businessTypes.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#0A0F1D] text-white">
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      maxLength={MAX_LENGTHS.email}
                      autoComplete="email"
                      value={formData.email}
                      onChange={updateField("email")}
                      className={inputClass}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>
                      Company name <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      maxLength={MAX_LENGTHS.company}
                      autoComplete="organization"
                      value={formData.company}
                      onChange={updateField("company")}
                      className={inputClass}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    What do you need? <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    maxLength={MAX_LENGTHS.message}
                    placeholder="For example: we run 3 branches and track stock in Excel"
                    value={formData.message}
                    onChange={updateField("message")}
                    className={`${inputClass} resize-none`}
                    disabled={busy}
                  />
                </div>

                {submitStatus === "error" && (
                  <div role="alert" className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-sm text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary w-full text-sm !py-4 cursor-pointer justify-center"
                >
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Book a Demo</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                </button>

                {/* TODO(founder): link a real /privacy page here once it exists (Phase 3). */}
                <p className="text-xs text-slate-400 text-center">
                  We only use these details to contact you about ZUGEE.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
