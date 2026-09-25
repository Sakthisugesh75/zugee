// components/layout/SmoothScrollLink.jsx
"use client";

/**
 * Smooth scroll to a section without changing the URL hash.
 * Automatically calculates navbar height for proper positioning.
 */
export default function SmoothScrollLink({ targetId, className, children, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    
    // Call any additional onClick handler
    if (onClick) {
      onClick(e);
    }

    // Find the target section
    const section = document.getElementById(targetId);
    if (!section) {
      console.warn(`Section with id "${targetId}" not found`);
      return;
    }

    // Calculate the actual navbar height
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;

    // Calculate target position with a small breathing space
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetPosition = sectionTop - navbarHeight - 16; // 16px breathing space

    // Smooth scroll without changing URL
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth"
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
