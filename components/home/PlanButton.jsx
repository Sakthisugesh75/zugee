// components/home/PlanButton.jsx
// Small client island: tells the demo form which plan the visitor picked, then scrolls to it.
"use client";

import { ArrowRight } from "lucide-react";

export default function PlanButton({ planKey, planName, featured = false }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("zugee:select-plan", { detail: { planKey, planName } }));
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className={`${featured ? "btn-primary" : "btn-secondary"} w-full text-sm !py-3.5 justify-center`}
    >
      <span>Get Started</span>
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </a>
  );
}
