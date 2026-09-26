// components/animations/StaggeredGroup.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Staggered reveal animation for groups of items
 */
export default function StaggeredGroup({
  children,
  className = "",
  staggerDelay = 100,
  threshold = 0.15
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 450ms cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms, transform 450ms cubic-bezier(0.16, 1, 0.3, 1) ${index * staggerDelay}ms`
            }}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
}
