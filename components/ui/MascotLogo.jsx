// components/ui/MascotLogo.jsx
"use client";

import React, { useId } from "react";
import Image from "next/image";

/**
 * Precision SVG of the Official Zugee 3D Folded Ribbon 'Z' Mark
 */
export function ZugeeRibbonGlyph({ size = 36, className = "" }) {
  // Unique gradient IDs per instance: the logo renders in both navbar and footer, and duplicate
  // SVG ids make the gradients disappear when the first instance is hidden (e.g. display:none).
  const uid = useId().replace(/:/g, "");
  const topId = `ribbonTop-${uid}`;
  const diagId = `ribbonDiag-${uid}`;
  const bottomId = `ribbonBottom-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Top Fold Gradient: Dark Navy to Royal Blue */}
        <linearGradient id={topId}x1="10" y1="15" x2="85" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#071E4A" />
          <stop offset="30%" stopColor="#0E46B8" />
          <stop offset="100%" stopColor="#1B6FF8" />
        </linearGradient>

        {/* Diagonal Ribbon: Vibrant Royal Blue to Electric Cyan */}
        <linearGradient id={diagId}x1="15" y1="65" x2="85" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="40%" stopColor="#147BFF" />
          <stop offset="100%" stopColor="#0837A3" />
        </linearGradient>

        {/* Bottom Fold Gradient: Electric Cyan to Deep Azure */}
        <linearGradient id={bottomId}x1="8" y1="58" x2="90" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#0B56E2" />
          <stop offset="100%" stopColor="#072A80" />
        </linearGradient>

      </defs>

      {/* Top horizontal stroke */}
      <path
        d="M12 28 C12 24 16 22 22 22 L86 22 C92 22 95 27 91 32 L72 54 L38 54 L58 32 L20 32 C15 32 12 30 12 28 Z"
        fill={`url(#${topId})`}
      />

      {/* Diagonal folded band */}
      <path
        d="M88 24 L34 78 L12 78 C8 78 6 73 10 68 L60 24 Z"
        fill={`url(#${diagId})`}
      />

      {/* Bottom fold and base horizontal stroke */}
      <path
        d="M12 78 C8 78 7 74 11 69 L32 46 L68 46 L46 70 L80 70 C86 70 90 73 90 78 C90 82 86 84 80 84 L18 84 C13 84 12 81 12 78 Z"
        fill={`url(#${bottomId})`}
      />
    </svg>
  );
}

export default function MascotLogo({
  size = 40,
  showWordmark = true,
  showSubline = true,
  showTagline = false,
  showMascotThumbnail = false,
  sublineClassName = "",
  taglineClassName = "",
  className = ""
}) {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Brand Icon Lockup */}
      <div className="relative flex items-center justify-center shrink-0 group">
        {/* Ambient subtle cyan/blue backglow */}
        <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-[#1B6FF8]/30 to-[#00F0FF]/30 opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center justify-center rounded-xl bg-[#090E1A] border border-white/[0.12] p-1.5 shadow-lg shadow-black/50">
          {showMascotThumbnail ? (
            <div className="relative overflow-hidden rounded-lg" style={{ width: size, height: size }}>
              <Image
                src="/zugee-mascot-3d.png"
                alt="Zugee Cyber Genie"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          ) : (
            <ZugeeRibbonGlyph size={size} />
          )}
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          {/* Main Wordmark "ZUGEE" — Solid, Crisp, High-Tech Brand Typography */}
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-black tracking-tight font-sans flex items-center select-none"
              style={{ letterSpacing: "-0.01em" }}
            >
              <span className="text-white">ZUG</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#38BDF8] ml-[0.5px]">
                EE
              </span>
            </span>

            {/* Pulsing Live indicator */}
            <span className="relative flex h-2 w-2 ml-1" title="Zugee Core Online">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]" />
            </span>
          </div>

          {showSubline && (
            <span
              className={`text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1 whitespace-nowrap ${sublineClassName}`}
              style={{ letterSpacing: "0.08em" }}
            >
              Systems Technologies Pvt. Ltd.
            </span>
          )}

          {showTagline && (
            <div className={`flex items-center gap-2 mt-1.5 ${taglineClassName}`}>
              <span className="hidden sm:block h-px w-6 shrink-0 bg-gradient-to-r from-transparent to-[#00F0FF]/50" />
              <span
                className="text-[10px] leading-snug text-[#00F0FF] font-mono font-medium uppercase"
                style={{ letterSpacing: "0.12em" }}
              >
                Engineered for operational precision.
              </span>
              <span className="hidden sm:block h-px w-6 shrink-0 bg-gradient-to-l from-transparent to-[#00F0FF]/50" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
