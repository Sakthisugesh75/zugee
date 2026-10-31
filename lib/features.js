// lib/features.js
// Feature flags for the public site. No JSX, so tests can load it.

export const FEATURES = {
  // Homepage testimonials (components/home/TestimonialsSection.jsx). Turn on only when real,
  // approved testimonials exist in lib/testimonials.js.
  testimonials: false
};
