// components/ui/MotionProvider.jsx
"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honour the visitor's "reduce motion" OS setting for every framer-motion animation.
 * With reducedMotion="user", transform/layout animations are skipped and only opacity animates,
 * so components never need to branch on useReducedMotion() — which would render different markup
 * on server vs client and trigger hydration errors.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
