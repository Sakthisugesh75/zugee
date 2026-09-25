// components/ui/PrecisionIcons.jsx
import React from "react";

export function HexCheck({ className = "w-4 h-4 text-[#1E5FB8]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M10 2.2L17 6.25V13.75L10 17.8L3 13.75V6.25L10 2.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M6.8 10.2L8.9 12.3L13.2 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalibrationMark({ className = "w-4 h-4 text-[#1E5FB8]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle
        cx="10"
        cy="10"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="10" y1="1.5" x2="10" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="16" x2="10" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NodeConnection({ className = "w-4 h-4 text-[#0284C7]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="15" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="10" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M5 8.5V11.5L8 14M15 8.5V11.5L12 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldLock({ className = "w-4 h-4 text-[#1E5FB8]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M10 2.5L16.5 5.5V10.5C16.5 14.5 13.5 17.2 10 18.5C6.5 17.2 3.5 14.5 3.5 10.5V5.5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="10" cy="9.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 11.5V13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function TerminalSpark({ className = "w-4 h-4 text-[#1E5FB8]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        d="M6.5 7.5L9.5 10L6.5 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="11" y1="12.5" x2="13.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function WorkflowRoute({ className = "w-4 h-4 text-[#1E5FB8]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect x="3" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
      <rect x="13" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
      <rect x="13" y="12" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
      <path
        d="M7 6H10C11.1 6 12 6.9 12 8V14H13"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M7 6H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function MetricBadge({ className = "w-4 h-4 text-[#0284C7]" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect
        x="10"
        y="2.5"
        width="10.5"
        height="10.5"
        rx="2"
        transform="rotate(45 10 2.5)"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
    </svg>
  );
}
