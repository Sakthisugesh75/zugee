// components/ui/MascotLogo.jsx
// Brand lockup: the ZUGEE "Z" logo icon plus the ZUGEE wordmark.
// Fully optimized for both light and dark modes with premium visual treatment.

import Image from "next/image";

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
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-cyan-500/15 opacity-50 group-hover:opacity-100 blur-xl transition-all duration-500 light:opacity-30 light:group-hover:opacity-60" />
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

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
              className="object-contain filter drop-shadow-[0_0_16px_rgba(6,182,212,0.4)] group-hover:drop-shadow-[0_0_24px_rgba(6,182,212,0.6)] transition-all duration-300 light:drop-shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              priority={preload}
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`${wordmarkClasses[wordmarkSize]} font-extrabold tracking-tight font-sans flex items-baseline select-none`}>
            {/* ZUG - Using theme-aware text-fg utility (auto-adapts: white in dark, dark in light) */}
            <span className="text-fg transition-colors">
              ZUG
            </span>
            
            {/* EE - Gradient (works in both modes) */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-500 to-blue-600 light:from-cyan-600 light:via-cyan-600 light:to-blue-700 ml-[1px] relative">
              EE
              {/* Subtle glow behind gradient text - theme adaptive */}
              <span className="absolute inset-0 blur-sm bg-gradient-to-r from-cyan-400/30 to-blue-500/30 -z-10 light:from-cyan-500/20 light:to-blue-600/20" />
            </span>
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
