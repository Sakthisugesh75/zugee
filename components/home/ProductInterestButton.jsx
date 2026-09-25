// components/home/ProductInterestButton.jsx
// Small client island: pre-selects the product in the contact form, then scrolls to it.
"use client";

import { ArrowRight } from "lucide-react";

export default function ProductInterestButton({ slug, label, emphasis = false }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("zugee:select-product", { detail: { slug } }));
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
        emphasis ? "text-[#00F0FF] hover:text-white" : "text-slate-300 hover:text-white"
      }`}
    >
      {label}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </a>
  );
}
