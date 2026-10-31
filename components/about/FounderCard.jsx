// components/about/FounderCard.jsx
// One person on /about's "The team". Filled from FOUNDERS in lib/about.js; the photo is optional
// (initials are shown without one).

import Image from "next/image";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function FounderCard({ founder }) {
  return (
    <article className="h-full p-6 rounded-2xl bg-card border border-line shadow-card flex flex-col items-center text-center">
      {founder.photo ? (
        <Image
          src={founder.photo}
          alt={`${founder.name}, ${founder.role}`}
          width={112}
          height={112}
          sizes="112px"
          className="w-28 h-28 rounded-full object-cover border border-line mb-5"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-28 h-28 rounded-full mb-5 flex items-center justify-center bg-tint-cyan border border-cyan-500/30 text-2xl font-black text-cyan-400"
        >
          {initials(founder.name)}
        </div>
      )}
      <h3 className="text-lg font-bold text-fg leading-snug">{founder.name}</h3>
      <p className="text-sm font-semibold text-cyan-400 mb-3">{founder.role}</p>
      {founder.bio && <p className="text-sm text-slate-300 leading-relaxed">{founder.bio}</p>}
    </article>
  );
}
