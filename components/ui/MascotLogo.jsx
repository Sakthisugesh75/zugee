// components/ui/MascotLogo.jsx
// Brand lockup: the ZUGEE "Z" logo icon plus the ZUGEE wordmark.
// The "Z" stands on its own (no ring or frame), so it reads the same on light and dark pages.

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
      {/* Logo icon: the bare "Z", no ring, frame or halo around it */}
      <div
        className="relative flex items-center justify-center shrink-0 group"
        style={{ width: logoSize, height: logoSize }}
      >
        <Image
          src="/zugee-logo-icon.png"
          alt={showWordmark ? "" : "ZUGEE"}
          width={logoSize}
          height={logoSize}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority={preload}
        />
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
