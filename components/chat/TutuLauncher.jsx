// components/chat/TutuLauncher.jsx
// The "Ask Tutu" button that opens the chat. Tutu (the ZUGEE mascot) pops out of the button with a
// 3D feel: a gentle float with a shadow underneath, a tilt that follows the pointer, a hop on click,
// and a one-time greeting bubble. CSS-only motion (app/globals.css, "tutu-*"), all switched off for
// visitors who prefer reduced motion. The avatar is public/zugee-tutu-avatar.webp
// (scripts/make-chat-avatar.mjs).

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const GREETED_KEY = "zugee-tutu-greeted";
const GREETING_DELAY_MS = 4000;
const GREETING_VISIBLE_MS = 12000;
const MAX_TILT_DEG = 16;

export default function TutuLauncher({ open, onToggle }) {
  const tiltRef = useRef(null);
  const [hopping, setHopping] = useState(false);
  const [greeting, setGreeting] = useState(false);

  // A one-time "hello" a few seconds after the page loads, once per browser tab session.
  useEffect(() => {
    let alreadyGreeted = false;
    try {
      alreadyGreeted = sessionStorage.getItem(GREETED_KEY) === "1";
    } catch {
      // Storage blocked: greet anyway; it is only a hint.
    }
    if (alreadyGreeted) return;
    const show = setTimeout(() => setGreeting(true), GREETING_DELAY_MS);
    const hide = setTimeout(() => setGreeting(false), GREETING_DELAY_MS + GREETING_VISIBLE_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function rememberGreeted() {
    setGreeting(false);
    try {
      sessionStorage.setItem(GREETED_KEY, "1");
    } catch {
      // Storage blocked: nothing to remember.
    }
  }

  function handleClick() {
    rememberGreeted();
    setHopping(true);
    setTimeout(() => setHopping(false), 600);
    onToggle();
  }

  // 3D tilt toward the pointer. Writes CSS variables directly: no React re-render per mouse move.
  function handlePointerMove(e) {
    const el = tiltRef.current;
    if (!el || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
    const y = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)));
    el.style.setProperty("--tilt-y", `${(x * MAX_TILT_DEG).toFixed(1)}deg`);
    el.style.setProperty("--tilt-x", `${(-y * MAX_TILT_DEG).toFixed(1)}deg`);
  }
  function resetTilt() {
    tiltRef.current?.style.setProperty("--tilt-x", "0deg");
    tiltRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  if (open) {
    // While the panel is open: a round close button (desktop; on phones the panel has its own ×).
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded="true"
        aria-label="Close chat"
        className="fixed z-40 right-5 bottom-5 hidden sm:inline-flex items-center justify-center p-3.5 rounded-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_8px_30px_rgba(6,182,212,0.45)] hover:scale-105 transition-transform cursor-pointer"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed z-40 right-4 bottom-4 sm:right-5 sm:bottom-5">
      {greeting && (
        // Tablet and desktop only: on a phone it would cover the page's own buttons.
        <div className="tutu-bubble-in hidden sm:block absolute right-0 bottom-full mb-4 w-[230px] rounded-2xl rounded-br-md bg-surface border border-line shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] p-3 pr-8 text-left">
          <button
            type="button"
            onClick={handleClick}
            className="text-[13px] leading-snug text-slate-200 text-left cursor-pointer"
          >
            <span className="font-bold text-fg">Hi, I&apos;m Tutu! 👋</span> Ask me about ZUGEE products, setup, pricing or GST.
          </button>
          <button
            type="button"
            onClick={rememberGreeted}
            aria-label="Dismiss"
            className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-fg hover:bg-ink/[0.06] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        aria-expanded="false"
        aria-label="Ask Tutu: chat with ZUGEE's assistant"
        className="group relative inline-flex items-center rounded-full pl-[4.25rem] pr-5 py-3.5 text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_10px_30px_rgba(6,182,212,0.45)] tutu-pulse hover:shadow-[0_14px_40px_rgba(6,182,212,0.6)] transition-shadow cursor-pointer"
      >
        {/* Tutu: tilt (pointer) > hop (click) > float (idle) > image, so the motions stack. */}
        <span ref={tiltRef} className="tutu-tilt absolute left-1 -top-6 w-[64px] h-[64px] pointer-events-none" aria-hidden="true">
          <span className="tutu-shadow absolute left-1/2 bottom-[18px] w-10 h-2.5 rounded-full bg-black/40 blur-[3px]" />
          <span className={`block w-full h-full ${hopping ? "tutu-hop" : ""}`}>
            <span className="tutu-float block w-full h-full drop-shadow-[0_6px_10px_rgba(10,15,36,0.45)] transition-transform duration-300 group-hover:scale-110">
              <Image src="/zugee-tutu-avatar.webp" alt="" width={64} height={64} className="w-full h-full select-none" draggable={false} />
            </span>
          </span>
        </span>
        <span className="text-sm font-bold tracking-wide">Ask Tutu</span>
      </button>
    </div>
  );
}
