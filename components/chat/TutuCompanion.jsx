// components/chat/TutuCompanion.jsx
// The live "Ask Tutu" mascot: <tutu-companion> (lib/tutu-companion.js, a Web Component loaded in the
// browser only) with the genie artwork public/tutu-genie.webp, whose printed eyes are removed so the
// component draws live eyes: they follow the pointer, blink, and change with the mood.
// On the homepage Tutu flies between perches (components/chat/TutuPerch.jsx) as the visitor scrolls
// and docks on the "Ask Tutu" pill where there is none (Pricing, footer), on phones, and while the
// chat is open (ChatWidget calls dock()).
//
// `ref` receives the element: ChatWidget calls setMood() / clearMood() on it (thinking while a reply
// streams, happy when it lands, sad on an error). Clicking Tutu or the pill calls `onOpen`.
// It sits below the chat panel (z-index 30 < the panel's 40), so an open panel covers it on phones.

"use client";

import { useEffect, useRef } from "react";

const GREETED_KEY = "zugee-tutu-greeted";
const GREETING = "Hi, I'm Tutu! Ask me about ZUGEE products, setup, pricing or GST.";
const GREETING_DELAY_MS = 4000;

export default function TutuCompanion({ ref, onOpen }) {
  const elementRef = useRef(null);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const element = elementRef.current;
    import("@/lib/tutu-companion"); // registers <tutu-companion>; browser only
    const open = () => onOpenRef.current?.();
    element.addEventListener("tutu-open", open);

    // A one-time hello a few seconds after the page loads, once per tab session (not on phones,
    // where the bubble would cover the page's own buttons).
    let alreadyGreeted = false;
    try {
      alreadyGreeted = sessionStorage.getItem(GREETED_KEY) === "1";
      sessionStorage.setItem(GREETED_KEY, "1");
    } catch {
      // Storage blocked: greet anyway; it is only a hint.
    }
    const greet =
      alreadyGreeted || !window.matchMedia("(min-width: 640px)").matches
        ? null
        : setTimeout(() => {
            element.setMood?.("happy", 1500);
            element.say?.(GREETING, 6000);
          }, GREETING_DELAY_MS);

    return () => {
      element.removeEventListener("tutu-open", open);
      clearTimeout(greet);
    };
  }, []);

  return (
    <tutu-companion
      ref={(node) => {
        elementRef.current = node;
        if (ref) ref.current = node;
      }}
      src="/tutu-genie.webp"
      label="Ask Tutu"
      size="96"
      idle-sleep="9000"
      theme="auto"
      // Header (90 px) + half of Tutu (~79 px) + a margin: Tutu never perches under the sticky header.
      perch-top="180"
      style={{ "--tutu-z": 30 }}
    />
  );
}
