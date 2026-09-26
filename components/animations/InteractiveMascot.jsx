// components/animations/InteractiveMascot.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Premium interactive mascot with:
 * - Mouse tracking (desktop only)
 * - Idle floating animation
 * - Proximity reactions
 * - Subtle blink animation
 * - CTA awareness
 * - Click reaction
 */
export default function InteractiveMascot({
  src = "/zugee-mascot-cutout.webp",
  size = 300,
  className = ""
}) {
  const mascotRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const blinkTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Check if reduced motion is preferred
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Check if mobile
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Random blink animation
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const scheduleBlink = () => {
      const randomDelay = 3000 + Math.random() * 3000; // 3-6 seconds
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150); // Blink duration
      }, randomDelay);
    };

    scheduleBlink();

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [prefersReducedMotion, isMobile]);

  // Mouse tracking (desktop only)
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (e) => {
      if (!mascotRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - mascotCenterX;
      const deltaY = e.clientY - mascotCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Calculate rotation based on mouse position (subtle)
      const maxRotation = 5; // Maximum 5 degrees
      const rotateY = (deltaX / window.innerWidth) * maxRotation;
      const rotateX = -(deltaY / window.innerHeight) * maxRotation;

      // Proximity reaction (scale up slightly when mouse is near)
      const proximityThreshold = 300;
      const proximityScale = distance < proximityThreshold 
        ? 1 + (1 - distance / proximityThreshold) * 0.015 
        : 1;

      // Use requestAnimationFrame for smooth performance
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        setRotation({ x: rotateX, y: rotateY });
        setScale(proximityScale);
      });
    };

    // Check for CTA hover (mascot looks at CTAs)
    const handleCTAHover = (e) => {
      if (!mascotRef.current) return;
      
      const target = e.target.closest('button, a');
      if (!target) return;

      const text = target.textContent?.toLowerCase() || '';
      if (text.includes('explore') || text.includes('book') || text.includes('demo')) {
        const rect = target.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        const mascotRect = mascotRef.current.getBoundingClientRect();
        const mascotCenterX = mascotRect.left + mascotRect.width / 2;
        const mascotCenterY = mascotRect.top + mascotRect.height / 2;

        const deltaX = targetCenterX - mascotCenterX;
        const deltaY = targetCenterY - mascotCenterY;

        const maxRotation = 5;
        const rotateY = (deltaX / window.innerWidth) * maxRotation * 2;
        const rotateX = -(deltaY / window.innerHeight) * maxRotation * 2;

        setRotation({ x: rotateX, y: rotateY });
        setScale(1.015);
      }
    };

    const handleCTALeave = () => {
      setRotation({ x: 0, y: 0 });
      setScale(1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Add hover listeners to CTAs
    const ctas = document.querySelectorAll('button, a');
    ctas.forEach(cta => {
      cta.addEventListener("mouseenter", handleCTAHover);
      cta.addEventListener("mouseleave", handleCTALeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctas.forEach(cta => {
        cta.removeEventListener("mouseenter", handleCTAHover);
        cta.removeEventListener("mouseleave", handleCTALeave);
      });
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, isMobile]);

  // Click reaction
  const handleClick = () => {
    if (prefersReducedMotion) return;
    
    setIsClicked(true);
    setScale(0.95);
    
    setTimeout(() => {
      setScale(1);
      setIsClicked(false);
      // Trigger a blink
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 200);
  };

  return (
    <div
      ref={mascotRef}
      onClick={handleClick}
      className={`relative cursor-pointer transition-all duration-300 ${className}`}
      style={{
        width: size,
        height: size * 1.5,
        transform: `
          perspective(1000px)
          rotateX(${rotation.x}deg)
          rotateY(${rotation.y}deg)
          scale(${scale})
        `,
        transformStyle: "preserve-3d",
        transition: isClicked ? "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)" : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Ambient glow that pulses gently */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full bg-[#00F0FF]/20 blur-2xl animate-pulse"
        style={{ 
          animationDuration: "4s",
          opacity: scale > 1 ? 0.4 : 0.2 
        }}
      />

      {/* Mascot image with idle floating */}
      <div
        className={`relative w-full h-full ${!prefersReducedMotion && !isMobile ? 'animate-mascot-float' : ''}`}
        style={{
          filter: isBlinking ? "brightness(0.9)" : "brightness(1)",
          transition: "filter 150ms ease-out"
        }}
      >
        <Image
          src={src}
          alt="Zugee Mascot"
          fill
          sizes={`${size}px`}
          className="object-contain select-none"
          draggable={false}
          priority
        />
      </div>

      {/* Subtle glow overlay when scaled */}
      {scale > 1 && !prefersReducedMotion && (
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,240,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />
      )}
    </div>
  );
}
