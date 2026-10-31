// components/layout/SmoothScrollLink.jsx
"use client";

/**
 * A real link to a homepage section ("/#contact"), so crawlers can follow it and it works without
 * JavaScript. When the section is on the current page it scrolls there smoothly, below the fixed
 * navbar, without changing the URL hash; otherwise the browser navigates to the homepage section.
 */
export default function SmoothScrollLink({ targetId, className, style, children, onClick }) {
  const handleClick = (e) => {
    // Call any additional onClick handler
    if (onClick) {
      onClick(e);
    }

    const section = document.getElementById(targetId);
    // Not on this page: let the link navigate.
    if (!section) return;
    e.preventDefault();

    // Calculate the actual navbar height
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;

    // Calculate target position with a small breathing space
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetPosition = sectionTop - navbarHeight - 16; // 16px breathing space

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth"
    });
  };

  return (
    <a href={`/#${targetId}`} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
