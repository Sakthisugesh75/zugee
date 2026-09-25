// components/ui/MascotLogo.jsx
// Brand lockup: the Zugee mascot (head + "Z" chest crop) as the icon, plus the ZUGEE wordmark.
// Used in both server and client components, so no client-only hooks here.

import Image from "next/image";

export default function MascotLogo({
  size = 40,
  showWordmark = true,
  showSubline = true,
  // Only the above-the-fold instance (the navbar) should preload the icon.
  preload = false,
  sublineClassName = "",
  className = ""
}) {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
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
            preload={preload}
          />
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-2xl font-extrabold tracking-tight font-sans flex items-center select-none">
            <span className="text-white">ZUG</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#38BDF8] ml-[0.5px]">
              EE
            </span>
          </span>

          {showSubline && (
            <span className={`text-[11px] text-slate-400 mt-1 whitespace-nowrap ${sublineClassName}`}>
              Systems Technologies Pvt. Ltd.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
