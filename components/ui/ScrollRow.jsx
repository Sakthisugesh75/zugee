// components/ui/ScrollRow.jsx
// Horizontal row that scrolls when its items don't fit, and says so: an edge fade plus an arrow
// button appears on each side that has hidden items. When everything fits (e.g. the row wraps on
// larger screens), no fade or arrow is shown.

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ children, className = "", fadeColor = "var(--color-canvas)", label }) {
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const start = el.scrollLeft > 4;
      const end = max > 4 && el.scrollLeft < max - 4;
      // Only re-render when an edge actually changes, not on every scroll frame.
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={scrollerRef} role="group" aria-label={label} className={`flex overflow-x-auto no-scrollbar ${className}`}>
        {children}
      </div>

      {edges.start && (
        <div
          className="absolute inset-y-0 left-0 w-14 flex items-center justify-start pointer-events-none"
          style={{ background: `linear-gradient(to right, ${fadeColor} 35%, transparent)` }}
        >
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll left"
            className="pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center bg-ink/[0.08] border border-ink/[0.15] text-fg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {edges.end && (
        <div
          className="absolute inset-y-0 right-0 w-14 flex items-center justify-end pointer-events-none"
          style={{ background: `linear-gradient(to left, ${fadeColor} 35%, transparent)` }}
        >
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll right"
            className="pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center bg-ink/[0.08] border border-ink/[0.15] text-fg cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
