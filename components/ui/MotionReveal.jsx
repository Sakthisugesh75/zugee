// components/ui/MotionReveal.jsx
"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Progressive scroll-reveal.
 *
 * The server renders content fully visible (no inline `opacity:0`), so the page is readable before
 * JavaScript loads and never shows blank sections on slow connections or anchor jumps. After mount,
 * only blocks that are *below the fold* are hidden (synchronously, before paint) and then fade in as
 * they scroll into view. Blocks already on screen at mount stay visible with no flicker.
 *
 * Reduced motion is handled globally by <MotionProvider> (MotionConfig reducedMotion="user").
 */

const EASE = [0.16, 1, 0.3, 1];

function useRevealState(ref, viewportMargin) {
  // "visible" on the server and on first client render (matches SSR markup).
  const [state, setState] = useState("visible");
  const inView = useInView(ref, { once: true, margin: viewportMargin });

  // Before first paint: hide only what is below the fold, so it can reveal later.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      setState("hidden");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const isVisible = state === "visible" || inView;
  return isVisible;
}

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  yOffset = 24,
  viewportMargin = "-40px"
}) {
  const ref = useRef(null);
  const isVisible = useRevealState(ref, viewportMargin);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={isVisible ? { duration, delay, ease: EASE } : { duration: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
