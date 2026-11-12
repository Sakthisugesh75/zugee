// components/layout/FestiveGreeting.jsx
// A one-time festival greeting popup (Diwali, Christmas, New Year…), on every public page during the
// festival's dates only (lib/festive.js). A native <dialog>: Esc, the close button, "Thank you" or a
// click outside closes it, and focus is kept inside while it is open.
//
// The top of the card is a festive night-sky scene that moves on its own on every device (phones
// have no hover or mouse to react to). Each greeting's `theme` picks the scene (THEMES below):
//   diwali     fireworks, toran lights, a turning rangoli, a lit diya with rising embers
//   christmas  falling snow, fairy lights, a turning snowflake, a Christmas tree, Tutu in a Santa hat
//   newyear    fireworks, gold lights, turning rays, the new year's number, Tutu in a party hat
// In every theme Tutu, the ZUGEE mascot, rises in, floats, follows the pointer with its eyes, winks,
// does a celebration hop every few seconds, and on a tap laughs, hops, sparkles and says the next
// line. A tap anywhere in the sky sends up a firework (or a burst of sparkle in the snow). Same
// artwork and live-eye drawing as the page mascot (lib/tutu-companion.js: tutu-genie.webp, whose
// printed eyes are removed, with eyes drawn over the visor).
//
// Light on phones: one canvas that runs only while the popup is open, CSS transforms and opacity
// only, no blur filters. Visitors who prefer reduced motion get the same scene, still.
//
// Shown once per visitor: it is marked as seen in localStorage the moment it opens, so moving to
// another page doesn't bring it back. It opens a moment after the page has loaded, so it never
// delays the page or shifts its layout.

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { activeGreeting, greetingSeenKey } from "@/lib/festive";

const OPEN_DELAY_MS = 1200;
const HOP_EVERY_MS = 5200;
const BULBS = 13;

// Everything that changes from one festival to the next. Class names are written out in full so
// Tailwind finds them.
const THEMES = {
  diwali: {
    sky: "radial-gradient(120% 90% at 50% 100%, #3B1D5A 0%, #1A1442 45%, #0B1026 100%)",
    effect: "fireworks",
    backdrop: "rangoli",
    centrepiece: "diya",
    hat: null,
    bulbs: ["#FBBF24", "#F472B6", "#22D3EE", "#F97316", "#A3E635"],
    wire: "#FDE68A",
    sparks: ["#FBBF24", "#F97316", "#FDE68A", "#F472B6", "#22D3EE"],
    fireworks: ["#FBBF24", "#F97316", "#F472B6", "#22D3EE", "#A78BFA", "#4ADE80", "#FDE68A"],
    card: "border-amber-400/40 shadow-[0_24px_80px_-12px_rgba(245,158,11,0.4)]",
    button: "from-amber-500 to-orange-600",
    tamil: "text-amber-500 light:text-amber-700",
    bubble: { background: "#FDE68A", color: "#1C1917" }
  },
  christmas: {
    sky: "radial-gradient(120% 90% at 50% 100%, #14532D 0%, #0F2A3D 50%, #071022 100%)",
    effect: "snow",
    backdrop: "snowflake",
    centrepiece: "tree",
    hat: "santa",
    bulbs: ["#EF4444", "#22C55E", "#FBBF24", "#F1F5F9", "#38BDF8"],
    wire: "#BBF7D0",
    sparks: ["#FBBF24", "#EF4444", "#F1F5F9", "#22C55E", "#FDE68A"],
    fireworks: ["#FBBF24", "#EF4444", "#22C55E", "#F1F5F9"],
    card: "border-red-400/40 shadow-[0_24px_80px_-12px_rgba(239,68,68,0.35)]",
    button: "from-red-500 to-rose-600",
    tamil: "text-red-400 light:text-red-700",
    bubble: { background: "#FECACA", color: "#1C1917" }
  },
  newyear: {
    sky: "radial-gradient(120% 90% at 50% 100%, #312E81 0%, #1E1B4B 45%, #0B1026 100%)",
    effect: "fireworks",
    backdrop: "rays",
    centrepiece: "year",
    hat: "party",
    bulbs: ["#FBBF24", "#E2E8F0", "#A78BFA", "#22D3EE", "#F472B6"],
    wire: "#E2E8F0",
    sparks: ["#FBBF24", "#A78BFA", "#22D3EE", "#F472B6", "#FDE68A"],
    fireworks: ["#FBBF24", "#A78BFA", "#22D3EE", "#F472B6", "#4ADE80", "#E2E8F0"],
    card: "border-violet-400/40 shadow-[0_24px_80px_-12px_rgba(139,92,246,0.4)]",
    button: "from-violet-500 to-fuchsia-600",
    tamil: "text-violet-400 light:text-violet-700",
    bubble: { background: "#DDD6FE", color: "#1C1917" }
  }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * The moving sky on a canvas filling its parent.
 *   fireworks  rockets rise from the bottom and burst into rings of sparks that fall and fade;
 *              one goes up every second or so
 *   snow       flakes drift down and sway
 * `apiRef.current.launch(x, y)` sends a firework to burst at that point (in snow, a sparkle burst).
 * Does nothing when the visitor prefers reduced motion.
 */
function Sky({ apiRef, effect, colours }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || prefersReducedMotion()) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const rockets = [];
    const sparks = [];
    // Snowflakes are scattered on the first frame that has a size: the canvas can mount before the
    // dialog opens, when it is still 0 px wide.
    const flakes = [];
    const scatterSnow = () => {
      for (let i = 0; i < 70; i++) {
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.8 + Math.random() * 2.2,
          speed: 0.35 + Math.random() * 0.8,
          sway: Math.random() * Math.PI * 2
        });
      }
    };

    const burst = (x, y, count = 34) => {
      const colour = pick(colours);
      const second = pick(colours);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.4 + Math.random() * 2.1;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.011 + Math.random() * 0.01,
          size: 1.4 + Math.random() * 1.3,
          colour: i % 3 === 0 ? second : colour
        });
      }
      // Keep the work bounded on slow phones.
      if (sparks.length > 420) sparks.splice(0, sparks.length - 420);
    };

    const launch = (x, y) => {
      if (effect === "snow") {
        // In the snow a tap makes a sparkle burst right where the finger is.
        burst(x ?? width / 2, y ?? height / 3, 22);
        return;
      }
      rockets.push({
        x: x ?? width * (0.12 + Math.random() * 0.76),
        y: height + 4,
        targetY: y ?? height * (0.14 + Math.random() * 0.34),
        speed: 4.2 + Math.random() * 1.6
      });
    };
    apiRef.current = { launch };

    let frame = 0;
    let last = 0;
    let nextLaunch = 250;
    const tick = (now) => {
      const step = last ? Math.min((now - last) / 16.67, 3) : 1;
      last = now;

      if (effect === "fireworks") {
        nextLaunch -= step * 16.67;
        if (nextLaunch <= 0) {
          launch();
          nextLaunch = 700 + Math.random() * 900;
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      if (effect === "snow" && !flakes.length && width > 0) scatterSnow();
      if (flakes.length) {
        ctx.fillStyle = "#E2E8F0";
        for (const f of flakes) {
          f.sway += 0.02 * step;
          f.y += f.speed * step;
          f.x += Math.sin(f.sway) * 0.35 * step;
          if (f.y > height + 4) {
            f.y = -4;
            f.x = Math.random() * width;
          }
          ctx.globalAlpha = 0.55 + f.r / 6;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "lighter";

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y -= r.speed * step;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FDE68A";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        // A short fading trail under the rocket.
        ctx.globalAlpha = 0.35;
        ctx.fillRect(r.x - 0.75, r.y + 3, 1.5, 12);
        if (r.y <= r.targetY) {
          burst(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.035 * step;
        s.x += s.vx * step;
        s.y += s.vy * step;
        s.life -= s.decay * step;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.colour;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      apiRef.current = null;
    };
  }, [apiRef, effect, colours]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/** String lights hanging in a gentle curve across the top of the sky. */
function Lights({ colours, wire }) {
  const bulbs = Array.from({ length: BULBS }, (_, i) => {
    const t = (i + 0.5) / BULBS;
    // The same quadratic curve as the wire below: low at the ends, sagging in the middle.
    const sag = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 46 + t * t * 6;
    return { left: `${t * 100}%`, top: sag + 2, colour: colours[i % colours.length], delay: `${(i * 0.12).toFixed(2)}s` };
  });
  return (
    <div className="absolute inset-x-0 top-0 h-12 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-10">
        <path d="M0 6 Q50 46 100 6" fill="none" stroke={wire} strokeOpacity="0.45" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span key={i} className="festive-bulb" style={{ left: b.left, top: `${b.top}px`, color: b.colour, animationDelay: b.delay }} />
      ))}
    </div>
  );
}

/** The large shape turning slowly behind Tutu: a rangoli, a snowflake or rays of light. */
function Backdrop({ kind }) {
  if (kind === "snowflake") {
    return (
      <svg viewBox="-100 -100 200 200" className="festive-spin w-full h-full" aria-hidden="true">
        <g stroke="#BAE6FD" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" fill="none">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 60})`}>
              <path d="M0 0 V-88" />
              <path d="M0 -36 L-16 -52 M0 -36 L16 -52" />
              <path d="M0 -62 L-14 -76 M0 -62 L14 -76" />
            </g>
          ))}
          <circle r="16" />
        </g>
      </svg>
    );
  }
  if (kind === "rays") {
    return (
      <svg viewBox="-100 -100 200 200" className="festive-spin w-full h-full" aria-hidden="true">
        <g fill="#FBBF24" fillOpacity="0.12">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M0 0 L-9 -96 L9 -96 Z" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <g fill="#FDE68A" fillOpacity="0.55">
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx="0" cy="-84" r="2" transform={`rotate(${i * 15 + 7.5})`} />
          ))}
        </g>
      </svg>
    );
  }
  // rangoli: petals and dots in rings
  return (
    <svg viewBox="-100 -100 200 200" className="festive-spin w-full h-full" aria-hidden="true">
      <g fill="none" strokeWidth="2">
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={`p${i}`} cx="0" cy="-58" rx="13" ry="30" stroke="#F59E0B" strokeOpacity="0.55" transform={`rotate(${i * 30})`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={`q${i}`} cx="0" cy="-34" rx="8" ry="18" stroke="#F472B6" strokeOpacity="0.5" transform={`rotate(${i * 30 + 15})`} />
        ))}
        <circle r="20" stroke="#22D3EE" strokeOpacity="0.45" />
        <circle r="92" stroke="#FBBF24" strokeOpacity="0.3" strokeDasharray="2 6" />
      </g>
      <g fill="#FDE68A" fillOpacity="0.6">
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={`d${i}`} cx="0" cy="-82" r="2.4" transform={`rotate(${i * 15})`} />
        ))}
      </g>
    </svg>
  );
}

/** A lit clay diya. The flame flickers unless the visitor prefers reduced motion. */
function Diya({ className = "" }) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="diya-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FDBA74" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diya-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="45%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="diya-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="34" r="34" fill="url(#diya-glow)" className="motion-safe:animate-pulse" />
      <path
        d="M60 8 C66 20 70 28 66 38 C64 44 56 44 54 38 C50 28 54 20 60 8 Z"
        fill="url(#diya-flame)"
        className="origin-[60px_42px] motion-safe:animate-[diya-flicker_1.6s_ease-in-out_infinite]"
      />
      <path d="M14 52 C30 50 90 50 106 52 C102 74 84 84 60 84 C36 84 18 74 14 52 Z" fill="url(#diya-bowl)" />
      <path d="M14 52 C30 58 90 58 106 52" fill="none" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="68" r="2.5" fill="#FDE68A" />
      <circle cx="60" cy="72" r="2.5" fill="#FDE68A" />
      <circle cx="80" cy="68" r="2.5" fill="#FDE68A" />
    </svg>
  );
}

/** A small decorated Christmas tree with a glowing star and twinkling baubles. */
function ChristmasTree({ className = "" }) {
  const baubles = [
    { cx: 50, cy: 58, fill: "#EF4444", delay: "0s" },
    { cx: 70, cy: 64, fill: "#FBBF24", delay: "0.4s" },
    { cx: 44, cy: 80, fill: "#38BDF8", delay: "0.8s" },
    { cx: 64, cy: 86, fill: "#EF4444", delay: "1.2s" },
    { cx: 78, cy: 92, fill: "#FBBF24", delay: "0.6s" },
    { cx: 36, cy: 98, fill: "#F472B6", delay: "1s" }
  ];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="22" r="18" fill="#FDE68A" fillOpacity="0.25" className="motion-safe:animate-pulse" />
      <rect x="53" y="100" width="14" height="14" rx="2" fill="#92400E" />
      <path d="M60 22 L84 56 H72 L92 84 H78 L100 106 H20 L42 84 H28 L48 56 H36 Z" fill="#16A34A" />
      <path d="M60 22 L84 56 H72 L92 84 H78 L100 106 H60 Z" fill="#15803D" />
      <path d="M38 70 Q60 80 84 66 M30 94 Q60 104 92 90" fill="none" stroke="#FDE68A" strokeWidth="2" strokeOpacity="0.8" />
      {baubles.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r="4" fill={b.fill} className="motion-safe:animate-pulse" style={{ animationDelay: b.delay }} />
      ))}
      <path
        d="M60 8 L64 18 L75 18 L66 24 L69 35 L60 28 L51 35 L54 24 L45 18 L56 18 Z"
        fill="#FBBF24"
        className="origin-[60px_22px] motion-safe:animate-[diya-flicker_2s_ease-in-out_infinite]"
      />
    </svg>
  );
}

/** Tutu's eyes and mouth for each mood, in the visor's own coordinates (from lib/tutu-companion.js). */
function Face({ mood }) {
  if (mood === "surprised") {
    return (
      <g fill="#2CEFFF">
        <ellipse cx="-52" cy="2" rx="15" ry="20" />
        <ellipse cx="52" cy="2" rx="15" ry="20" />
        <circle cx="0" cy="40" r="8" fill="none" stroke="#2CEFFF" strokeWidth="6" />
      </g>
    );
  }
  if (mood === "laugh") {
    return (
      <g fill="none" stroke="#2CEFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-74 -12 L-36 3 L-74 18" />
        <path d="M74 -12 L36 3 L74 18" />
        <path d="M-24 26 Q0 60 24 26 Z" fill="#2CEFFF" strokeWidth="4" />
      </g>
    );
  }
  if (mood === "wink") {
    return (
      <g fill="none" stroke="#2CEFFF" strokeLinecap="round">
        <path d="M-78 16 Q-52 -26 -26 16" strokeWidth="11" />
        <path d="M28 8 Q52 22 76 8" strokeWidth="10" />
        <path d="M-14 36 Q0 46 14 36" strokeWidth="6" />
      </g>
    );
  }
  // happy
  return (
    <g fill="none" stroke="#2CEFFF" strokeLinecap="round">
      <path d="M-78 16 Q-52 -26 -26 16" strokeWidth="12" />
      <path d="M26 16 Q52 -26 78 16" strokeWidth="12" />
      <path d="M-18 34 Q0 50 18 34" strokeWidth="7" />
    </g>
  );
}

/** A hat on Tutu's head, in tutu-genie.webp's coordinates (364 x 597), tilted with the head. */
function Hat({ kind }) {
  if (kind === "santa") {
    return (
      <g transform="translate(176 92) rotate(16)">
        <path d="M-82 0 C-66 -70 -10 -128 58 -122 C40 -104 52 -58 84 0 Z" fill="#DC2626" />
        <path d="M-82 0 C-66 -70 -10 -128 58 -122 C30 -112 -20 -70 -40 0 Z" fill="#EF4444" />
        <rect x="-96" y="-16" width="192" height="34" rx="17" fill="#F1F5F9" />
        <circle cx="62" cy="-122" r="20" fill="#F1F5F9" />
      </g>
    );
  }
  if (kind === "party") {
    return (
      <g transform="translate(184 84) rotate(16)">
        <path d="M-56 0 L4 -150 L60 0 Z" fill="#7C3AED" />
        <path d="M-44 -30 L48 -30 M-31 -62 L36 -62 M-18 -94 L24 -94 M-6 -124 L12 -124" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
        <rect x="-66" y="-10" width="132" height="22" rx="11" fill="#FBBF24" />
        <circle cx="4" cy="-154" r="15" fill="#F472B6" />
      </g>
    );
  }
  return null;
}

/** The night-sky scene at the top of the card, with Tutu giving the wishes. */
function FestiveScene({ greeting, theme }) {
  const lines = greeting.tutuLines;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [mood, setMood] = useState("surprised");
  const [lineIndex, setLineIndex] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [sparks, setSparks] = useState([]);
  const tutuRef = useRef(null);
  const hopRef = useRef(null);
  const lookRef = useRef(null);
  const skyRef = useRef(null);
  const moodTimer = useRef(null);
  const sparkId = useRef(0);

  /** A ring of sparks bursting out from Tutu. */
  const burst = () => {
    if (prefersReducedMotion()) return;
    const fresh = Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 80 + Math.random() * 60;
      return {
        id: ++sparkId.current,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        colour: theme.sparks[i % theme.sparks.length]
      };
    });
    setSparks((current) => [...current, ...fresh]);
    const ids = new Set(fresh.map((s) => s.id));
    setTimeout(() => setSparks((current) => current.filter((s) => !ids.has(s.id))), 1300);
  };

  /** Tutu's celebration hop. Restarts the CSS animation even if one is still running. */
  const hop = () => {
    const el = hopRef.current;
    if (!el || prefersReducedMotion()) return;
    el.classList.remove("festive-hop");
    void el.offsetWidth;
    el.classList.add("festive-hop");
  };

  /** Show a mood for a moment, then go back to happy. */
  const flashMood = (next, ms) => {
    clearTimeout(moodTimer.current);
    setMood(next);
    moodTimer.current = setTimeout(() => setMood("happy"), ms);
  };

  useEffect(() => {
    // Arrives surprised, then breaks into a smile with a burst of sparks.
    const smile = setTimeout(() => {
      setMood("happy");
      burst();
    }, 650);

    // Every few seconds, on its own (so phones see it too): a celebration hop with sparks and a laugh.
    const celebrate = setInterval(() => {
      hop();
      burst();
      clearTimeout(moodTimer.current);
      setMood("laugh");
      moodTimer.current = setTimeout(() => setMood("happy"), 900);
    }, HOP_EVERY_MS);

    // And a quick wink in between the hops.
    const winker = setInterval(() => {
      setMood((current) => (current === "happy" ? "wink" : current));
      setTimeout(() => setMood((current) => (current === "wink" ? "happy" : current)), 500);
    }, 3100);

    // The eyes follow the pointer (or a finger dragging on a phone), a few units inside the
    // visor. Written straight to the SVG, so pointer moves never re-render React.
    let frame = 0;
    const look = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = tutuRef.current?.getBoundingClientRect();
        if (!box || !lookRef.current) return;
        const dx = (event.clientX - (box.left + box.width / 2)) / (box.width * 2);
        const dy = (event.clientY - (box.top + box.height * 0.3)) / (box.height * 2);
        const clamp = (v) => Math.max(-1, Math.min(1, v));
        lookRef.current.setAttribute("transform", `translate(${clamp(dx) * 14} ${clamp(dy) * 9})`);
      });
    };
    window.addEventListener("pointermove", look);

    return () => {
      clearTimeout(smile);
      clearInterval(celebrate);
      clearInterval(winker);
      clearTimeout(moodTimer.current);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", look);
    };
    // The theme never changes while the popup is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pokeTutu = () => {
    setTapped(true);
    setLineIndex((i) => (i + 1) % lines.length);
    flashMood("laugh", 1100);
    hop();
    burst();
  };

  /** A tap anywhere in the sky (not on Tutu) sends a firework (or a sparkle) to that point. */
  const tapSky = (event) => {
    if (event.target.closest("button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    skyRef.current?.launch(event.clientX - box.left, event.clientY - box.top);
    setTapped(true);
  };

  return (
    <div onPointerDown={tapSky} className="relative h-[268px] overflow-hidden rounded-t-3xl select-none" style={{ background: theme.sky }}>
      <Sky apiRef={skyRef} effect={theme.effect} colours={theme.fireworks} />
      <Lights colours={theme.bulbs} wire={theme.wire} />

      {/* Turning slowly behind Tutu */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[230px] h-[230px] pointer-events-none" aria-hidden="true">
        <Backdrop kind={theme.backdrop} />
      </div>

      {/* Speech bubble, popping in again with each new line. Fixed colours, so it reads the same in
          the light and dark themes. Starts below the close button. */}
      <p
        key={lineIndex}
        aria-live="polite"
        className="festive-bubble absolute left-[calc(50%+46px)] top-12 z-10 max-w-[min(124px,calc(50%-58px))] px-3 py-2 rounded-2xl rounded-bl-sm text-left text-xs sm:text-[13px] font-bold leading-snug shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        style={theme.bubble}
      >
        {lines[lineIndex]}
      </p>

      <div className="festive-rise absolute left-1/2 top-8 -translate-x-1/2 z-[5]">
        <div ref={hopRef}>
          <button
            ref={tutuRef}
            type="button"
            onClick={pokeTutu}
            onPointerEnter={() => mood === "happy" && flashMood("wink", 700)}
            aria-label={`Tap Tutu for another wish: ${greeting.heading}`}
            className="festive-float block rounded-3xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            {/* The viewBox has room above the head for a hat. */}
            <svg viewBox="0 -40 364 637" className="h-[170px] w-auto overflow-visible" aria-hidden="true">
              <defs>
                <clipPath id={`${uid}-visor`}>
                  <ellipse cx="0" cy="0" rx="99.4" ry="59.9" />
                </clipPath>
                <filter id={`${uid}-glow`} x="-50%" y="-80%" width="200%" height="260%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <image href="/tutu-genie.webp" width="364" height="597" />
              {/* The visor, where lib/tutu-companion.js draws the live eyes */}
              <g transform="translate(181.4 182.2) rotate(16.2)">
                <g clipPath={`url(#${uid}-visor)`}>
                  <g ref={lookRef}>
                    {mood !== "surprised" && (
                      <g fill="#FF7AB8" opacity=".5">
                        <ellipse cx="-84" cy="30" rx="14" ry="7" />
                        <ellipse cx="84" cy="30" rx="14" ry="7" />
                      </g>
                    )}
                    <g filter={`url(#${uid}-glow)`}>
                      <Face mood={mood} />
                    </g>
                  </g>
                </g>
              </g>
              <Hat kind={theme.hat} />
            </svg>
          </button>
        </div>
      </div>

      {/* Sparks burst from Tutu's chest, drawn in front of it */}
      <div className="absolute left-1/2 top-[44%] z-10 w-0 h-0" aria-hidden="true">
        {sparks.map((s) => (
          <span key={s.id} className="festive-spark" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, color: s.colour }} />
        ))}
      </div>

      {/* What Tutu presents: the diya (with rising embers), the tree, or the new year's number */}
      {theme.centrepiece === "diya" && (
        <div className="absolute left-1/2 bottom-1 -translate-x-1/2 w-24 h-20 z-[6] pointer-events-none" aria-hidden="true">
          {[
            { left: "46%", delay: "0s", drift: "-10px" },
            { left: "52%", delay: "0.5s", drift: "8px" },
            { left: "49%", delay: "1s", drift: "-4px" },
            { left: "54%", delay: "1.5s", drift: "12px" },
            { left: "47%", delay: "1.9s", drift: "-14px" }
          ].map((e, i) => (
            <span key={i} className="festive-ember" style={{ left: e.left, top: "14px", animationDelay: e.delay, "--drift": e.drift }} />
          ))}
          <Diya className="w-full h-full" />
        </div>
      )}
      {theme.centrepiece === "tree" && (
        <div className="absolute left-[calc(50%-118px)] bottom-1 w-24 h-24 z-[4] pointer-events-none" aria-hidden="true">
          <ChristmasTree className="w-full h-full" />
        </div>
      )}
      {theme.centrepiece === "year" && greeting.year && (
        <p className="absolute inset-x-0 bottom-1 z-[6] text-center text-4xl font-black tracking-tight pointer-events-none" aria-hidden="true">
          <span className="festive-shimmer">{greeting.year}</span>
        </p>
      )}

      {!tapped && (
        <p className="absolute right-3 bottom-3 max-w-[92px] text-[11px] leading-tight text-left z-10" style={{ color: "#CBD5E1" }} aria-hidden="true">
          {greeting.tutuHint}
        </p>
      )}
    </div>
  );
}

export default function FestiveGreeting() {
  const dialogRef = useRef(null);
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    const current = activeGreeting();
    if (!current) return;
    try {
      if (localStorage.getItem(greetingSeenKey(current))) return;
    } catch {
      // Storage blocked (private mode): still greet, it just can't be remembered.
    }
    const timer = setTimeout(() => setGreeting(current), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!greeting || dialogRef.current?.open) return;
    dialogRef.current?.showModal();
    try {
      localStorage.setItem(greetingSeenKey(greeting), new Date().toISOString());
    } catch {
      // See above.
    }
  }, [greeting]);

  if (!greeting) return null;

  const theme = THEMES[greeting.theme] || THEMES.diwali;
  const close = () => dialogRef.current?.close();
  // Text lines slide up one after another once the card has popped in.
  const stagger = (i) => ({ animationDelay: `${0.35 + i * 0.12}s` });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="festive-greeting-title"
      onClose={() => setGreeting(null)}
      // A click on the backdrop lands on the <dialog> itself; clicks inside land on its children.
      onClick={(e) => e.target === e.currentTarget && close()}
      className={`festive-dialog m-auto w-[min(92vw,420px)] max-h-[94dvh] overflow-y-auto overflow-x-hidden p-0 rounded-3xl bg-surface text-fg border backdrop:bg-black/65 ${theme.card}`}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close greeting"
        className="absolute top-3 right-3 z-20 p-2 rounded-xl cursor-pointer hover:bg-amber-200/15"
        // Always over the dark night sky, in both themes.
        style={{ color: "#E2E8F0" }}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>

      {greeting.tutuLines?.length ? <FestiveScene greeting={greeting} theme={theme} /> : <Diya className="w-28 h-24 mx-auto mt-8" />}

      <div className="px-6 pt-5 pb-7 sm:px-8 text-center">
        <p lang="ta" className={`festive-in text-sm sm:text-base font-semibold ${theme.tamil}`} style={stagger(0)}>
          {greeting.tamil}
        </p>
        <h2 id="festive-greeting-title" className="festive-in mt-2 text-3xl sm:text-4xl font-black tracking-tight" style={stagger(1)}>
          <span className="festive-shimmer">{greeting.heading}</span>
        </h2>
        <p className="festive-in mt-3 text-base text-slate-300 leading-relaxed" style={stagger(2)}>
          {greeting.message}
        </p>
        <p className="festive-in mt-3 text-sm font-semibold text-slate-200" style={stagger(3)}>
          {greeting.signature}
        </p>

        <div className="festive-in" style={stagger(4)}>
          <button
            type="button"
            onClick={close}
            className={`festive-glow mt-5 w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r hover:brightness-110 cursor-pointer ${theme.button}`}
          >
            {greeting.button}
          </button>
        </div>
      </div>
    </dialog>
  );
}
