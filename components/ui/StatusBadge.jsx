// components/ui/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ status = "new", className = "" }) {
  const configs = {
    new: {
      label: "New",
      bg: "rgba(0, 240, 255, 0.12)",
      text: "#00F0FF",
      border: "rgba(0, 240, 255, 0.3)"
    },
    contacted: {
      label: "Contacted",
      bg: "rgba(27, 111, 248, 0.15)",
      text: "#38BDF8",
      border: "rgba(27, 111, 248, 0.35)"
    },
    qualified: {
      label: "Qualified",
      bg: "rgba(16, 185, 129, 0.15)",
      text: "#34D399",
      border: "rgba(16, 185, 129, 0.35)"
    },
    archived: {
      label: "Archived",
      bg: "rgba(255, 255, 255, 0.05)",
      text: "#94A3B8",
      border: "rgba(255, 255, 255, 0.1)"
    }
  };

  const current = configs[status.toLowerCase()] || configs.new;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium shadow-sm ${className}`}
      style={{
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: current.text }}
      />
      {current.label}
    </span>
  );
}
