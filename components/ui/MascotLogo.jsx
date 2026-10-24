// components/ui/MascotLogo.jsx
// Brand lockup: the ZUGEE "Z" logo icon plus the ZUGEE wordmark.
// Fully optimized for both light and dark modes with premium visual treatment.

import Image from "next/image";
import { Michroma } from "next/font/google";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap"
});

export default function MascotLogo({
  size = 44,
  showWordmark = true,
  showSubline = true,
  preload = false,
  sublineClassName = "",
  className = ""
}) {
  // Responsive sizing - larger default for better visibility
  const logoSize = size;
  const wordmarkSize = size >= 44 ? "2xl" : size >= 36 ? "xl" : "lg";
  
  const wordmarkClasses = {
    "2xl": "text-2xl",
    "xl": "text-xl",
    "lg": "text-lg"
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Icon with Enhanced Visual Treatment */}
      <div className="relative flex items-center justify-center shrink-0 group">
        {/* Multi-layer glow effect - adapted for light/dark */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-cyan-500/15 opacity-50 group-hover:opacity-100 blur-xl transition-all duration-500 light:opacity-0" />
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 light:opacity-0" />

        {/* Logo Container with Glass Effect - theme adaptive */}
        <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/[0.08] group-hover:border-cyan-500/30 transition-all duration-300 group-hover:scale-105 light:bg-white light:border-slate-200 light:shadow-sm light:group-hover:border-cyan-400">
          <div
            className="relative flex items-center justify-center"
            style={{ width: logoSize, height: logoSize }}
          >
            <Image
              src="/zugee-logo-icon.png"
              alt={showWordmark ? "" : "ZUGEE"}
              width={logoSize}
              height={logoSize}
              className="object-contain transition-all duration-300 light:drop-shadow-none drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              priority={preload}
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          {/* ZUGEE - Single unified wordmark with Michroma font */}
          <div className={`${wordmarkClasses[wordmarkSize]} ${michroma.className} font-normal tracking-[0.04em] uppercase text-fg transition-colors select-none`}>
            ZUGEE
          </div>

          {/* Subline - theme adaptive */}
          {showSubline && (
            <span className={`text-[10px] sm:text-[11px] text-slate-400 light:text-slate-600 mt-0.5 sm:mt-1 whitespace-nowrap transition-colors ${sublineClassName}`}>
              Systems Technologies Pvt. Ltd.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
