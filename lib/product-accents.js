// lib/product-accents.js
// Each product's accent colours and icon. Shared by the homepage product showcase and the product
// landing pages, so a product looks the same on both. Words (category label, "Replaces" line) live
// in lib/products.js.

import { Cpu, Truck, Plane, Activity, Building, Layers, School, Users, Shield, TrendingUp } from "lucide-react";

export const PRODUCT_ACCENTS = {
  "core-erp":      { accent: "#06B6D4", accent2: "#3B82F6", glow: "rgba(6,182,212,0.25)",   icon: Cpu },
  "transposs":     { accent: "#3B82F6", accent2: "#6366F1", glow: "rgba(59,130,246,0.25)",  icon: Truck },
  "tours-travels": { accent: "#8B5CF6", accent2: "#A855F7", glow: "rgba(139,92,246,0.25)",  icon: Plane },
  "aqua-erp":      { accent: "#38BDF8", accent2: "#0284C7", glow: "rgba(56,189,248,0.25)",  icon: Activity },
  "real-estate":   { accent: "#A855F7", accent2: "#EC4899", glow: "rgba(168,85,247,0.25)",  icon: Building },
  "manuflow":      { accent: "#F97316", accent2: "#EF4444", glow: "rgba(249,115,22,0.25)",  icon: Layers },
  "school-erp":    { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)",  icon: School },
  "college":       { accent: "#6366F1", accent2: "#8B5CF6", glow: "rgba(99,102,241,0.25)",  icon: School },
  "pg-management": { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  icon: Building },
  "resort":        { accent: "#EC4899", accent2: "#F43F5E", glow: "rgba(236,72,153,0.25)",  icon: Building },
  "logistics":     { accent: "#F97316", accent2: "#EA580C", glow: "rgba(249,115,22,0.25)",  icon: Truck },
  "gym":           { accent: "#10B981", accent2: "#059669", glow: "rgba(168,185,129,0.25)", icon: Activity },
  "salon":         { accent: "#EC4899", accent2: "#DB2777", glow: "rgba(236,72,153,0.25)",  icon: Users },
  "medical":       { accent: "#EF4444", accent2: "#DC2626", glow: "rgba(239,68,68,0.25)",   icon: Shield },
  "construction":  { accent: "var(--color-slate-400)", accent2: "var(--color-slate-500)", glow: "rgba(148,163,184,0.25)", icon: Layers },
  "warehouse":     { accent: "#6366F1", accent2: "#4F46E5", glow: "rgba(99,102,241,0.25)",  icon: Layers },
  "tasks":         { accent: "#06B6D4", accent2: "#0284C7", glow: "rgba(6,182,212,0.25)",   icon: TrendingUp },
};

const DEFAULT_ACCENT = {
  accent: "#06B6D4",
  accent2: "#3B82F6",
  glow: "rgba(6,182,212,0.25)",
  icon: Cpu,
};

export function getAccent(slug) {
  return PRODUCT_ACCENTS[slug] || DEFAULT_ACCENT;
}
