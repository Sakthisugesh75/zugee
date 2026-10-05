// components/home/PricingCallButton.jsx
// Small client island: tells the demo form the visitor wants a pricing call (and for which plan,
// if any), then scrolls to it.
"use client";

import SmoothScrollLink from "@/components/layout/SmoothScrollLink";

export default function PricingCallButton({ planName = null, className, children }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("zugee:pricing-call", { detail: { planName } }));
  };

  return (
    <SmoothScrollLink targetId="contact" onClick={handleClick} className={className}>
      {children}
    </SmoothScrollLink>
  );
}
