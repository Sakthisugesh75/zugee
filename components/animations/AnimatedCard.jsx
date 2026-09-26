// components/animations/AnimatedCard.jsx
"use client";

import { useState } from "react";

/**
 * Premium animated card with hover effects
 */
export default function AnimatedCard({ children, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered 
          ? "0 20px 40px -10px rgba(0, 240, 255, 0.15), 0 0 25px rgba(0, 240, 255, 0.1)"
          : "none"
      }}
    >
      {children}
    </div>
  );
}
