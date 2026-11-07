// components/layout/FestiveGreeting.jsx
// A one-time festival greeting popup (Diwali and others), on every public page during the festival's
// dates only (lib/festive.js). A native <dialog>: Esc, the close button, "Thank you" or a click
// outside closes it, and focus is kept inside while it is open.
//
// The top of the card is a festive night sky that moves on its own on every device (phones have no
// hover or mouse to react to):
//   - fireworks launch and burst on a small canvas; a tap anywhere in the sky launches one there
//   - a toran of string lights twinkles along the top, a rangoli turns slowly behind Tutu
//   - Tutu, the ZUGEE mascot, rises in above a lit diya with embers rising from its flame, floats,
//     follows the pointer with its eyes, winks, does a celebration hop every few seconds, and on a
//     tap laughs, hops, sparkles and says the next line of wishes
// Same artwork and live-eye drawing as the page mascot (lib/tutu-companion.js: tutu-genie.webp,
// whose printed eyes are removed, with eyes drawn over the visor).
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
const SPARK_COLOURS = ["#FBBF24", "#F97316", "#FDE68A", "#F472B6", "#22D3EE"];
const FIREWORK_COLOURS = ["#FBBF24", "#F97316", "#F472B6", "#22D3EE", "#A78BFA", "#4ADE80", "#FDE68A"];
const BULB_COLOURS = ["#FBBF24", "#F472B6", "#22D3EE", "#F97316", "#A3E635"];
const BULBS = 13;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fireworks on a canvas filling its parent. Rockets rise from the bottom and burst into a ring of
 * sparks that fall and fade. Launches on its own every second or so; `apiRef.current.launch(x, y)`
 * sends one up to burst at that point. Does nothing when the visitor prefers reduced motion.
 */
function Fireworks({ apiRef }) {
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
    const pick = (list) => list[Math.floor(Math.random() * list.length)];

    const burst = (x, y) => {
      const colour = pick(FIREWORK_COLOURS);
      const second = pick(FIREWORK_COLOURS);
      const count = 34;
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

      nextLaunch -= step * 16.67;
      if (nextLaunch <= 0) {
        launch();
        nextLaunch = 700 + Math.random() * 900;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
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
  }, [apiRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/** String lights (a toran) hanging in a gentle curve across the top of the sky. */
function Toran() {
  const bulbs = Array.from({ length: BULBS }, (_, i) => {
    const t = (i + 0.5) / BULBS;
    // The same quadratic curve as the wire below: 6px at the ends, 26px in the middle.
    const sag = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 46 + t * t * 6;
    return { left: `${t * 100}%`, top: sag + 2, colour: BULB_COLOURS[i % BULB_COLOURS.length], delay: `${(i * 0.12).toFixed(2)}s` };
  });
  return (
    <div className="absolute inset-x-0 top-0 h-12 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-10">
        <path d="M0 6 Q50 46 100 6" fill="none" stroke="#FDE68A" strokeOpacity="0.45" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span key={i} className="festive-bulb" style={{ left: b.left, top: `${b.top}px`, color: b.colour, animationDelay: b.delay }} />
      ))}
    </div>
  );
}

/** A simple rangoli: petals and dots in rings, turning slowly behind Tutu. */
function Rangoli({ className = "" }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
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

/** The night-sky scene at the top of the card, with Tutu giving the wishes. */
function FestiveScene({ lines, hint }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [mood, setMood] = useState("surprised");
  const [lineIndex, setLineIndex] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [sparks, setSparks] = useState([]);
  const tutuRef = useRef(null);
  const hopRef = useRef(null);
  const lookRef = useRef(null);
  const fireworksRef = useRef(null);
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
        colour: SPARK_COLOURS[i % SPARK_COLOURS.length]
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
  }, []);

  const pokeTutu = () => {
    setTapped(true);
    setLineIndex((i) => (i + 1) % lines.length);
    flashMood("laugh", 1100);
    hop();
    burst();
  };

  /** A tap anywhere in the sky (not on Tutu) sends a firework up to burst there. */
  const tapSky = (event) => {
    if (event.target.closest("button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    fireworksRef.current?.launch(event.clientX - box.left, event.clientY - box.top);
    setTapped(true);
  };

  return (
    <div
      onPointerDown={tapSky}
      className="relative h-[268px] overflow-hidden rounded-t-3xl select-none"
      style={{ background: "radial-gradient(120% 90% at 50% 100%, #3B1D5A 0%, #1A1442 45%, #0B1026 100%)" }}
    >
      <Fireworks apiRef={fireworksRef} />
      <Toran />

      {/* Rangoli, turning slowly behind Tutu */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[230px] h-[230px] pointer-events-none" aria-hidden="true">
        <Rangoli className="festive-spin w-full h-full" />
      </div>

      {/* Speech bubble, popping in again with each new line. Fixed colours, so it reads the same in
          the light and dark themes. Starts below the close button. */}
      <p
        key={lineIndex}
        aria-live="polite"
        className="festive-bubble absolute left-[calc(50%+46px)] top-12 z-10 max-w-[124px] px-3 py-2 rounded-2xl rounded-bl-sm text-left text-xs sm:text-[13px] font-bold leading-snug shadow-[0_6px_20px_rgba(245,158,11,0.35)]"
        style={{ background: "#FDE68A", color: "#1C1917" }}
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
            aria-label="Tap Tutu for another Diwali wish"
            className="festive-float block rounded-3xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            <svg viewBox="0 0 364 597" className="h-[160px] w-auto" aria-hidden="true">
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

      {/* Tutu presents the diya; embers rise from its flame */}
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

      {!tapped && (
        <p className="absolute right-3 bottom-3 max-w-[92px] text-[11px] leading-tight text-left z-10" style={{ color: "rgba(255,255,255,0.7)" }} aria-hidden="true">
          {hint}
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
      className="festive-dialog m-auto w-[min(92vw,420px)] max-h-[94dvh] overflow-y-auto overflow-x-hidden p-0 rounded-3xl bg-surface text-fg border border-amber-400/40 shadow-[0_24px_80px_-12px_rgba(245,158,11,0.4)] backdrop:bg-black/65"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close greeting"
        className="absolute top-3 right-3 z-20 p-2 rounded-xl cursor-pointer hover:bg-white/10"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>

      {greeting.tutuLines?.length ? (
        <FestiveScene lines={greeting.tutuLines} hint={greeting.tutuHint} />
      ) : (
        <Diya className="w-28 h-24 mx-auto mt-8" />
      )}

      <div className="px-6 pt-5 pb-7 sm:px-8 text-center">
        <p lang="ta" className="festive-in text-sm sm:text-base font-semibold text-amber-500 light:text-amber-700" style={stagger(0)}>
          {greeting.tamil}
        </p>
        <h2
          id="festive-greeting-title"
          className="festive-in mt-2 text-3xl sm:text-4xl font-black tracking-tight"
          style={stagger(1)}
        >
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
            className="festive-glow mt-5 w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 cursor-pointer"
          >
            {greeting.button}
          </button>
        </div>
      </div>
    </dialog>
  );
}
