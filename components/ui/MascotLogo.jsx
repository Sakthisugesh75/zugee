// components/ui/MascotLogo.jsx
// Brand lockup: the Zugee mascot (head + "Z" chest crop) as the icon, plus the ZUGEE wordmark.
// Used in both server and client components, so no client-only hooks here.

import Image from "next/image";

export default function MascotLogo({
  size = 40,
  showWordmark = true,
  showSubline = true,
  showTagline = false,
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

        {/* The mascot art sits on pure black, so a black tile makes the crop edge invisible */}
        <div
          className="relative overflow-hidden rounded-xl bg-black border border-white/[0.12] shadow-lg shadow-black/50"
          style={{ width: size + 12, height: size + 12 }}
        >
          <Image
            src="/zugee-mascot-icon.png"
            alt="Zugee"
            fill
            sizes={`${size + 12}px`}
            className="object-cover"
            priority
          />
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
