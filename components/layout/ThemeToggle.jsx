// components/layout/ThemeToggle.jsx
// Sun/moon button that switches the public site between light and dark and remembers the choice.
// Until the visitor uses it, the site follows their device setting (see lib/theme.js).

"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
  applyTheme,
  currentTheme,
  deviceTheme,
  readStoredTheme,
  storeTheme,
  subscribeToDeviceTheme,
} from "@/lib/theme";

export default function ThemeToggle({ className = "" }) {
  useLayoutEffect(() => {
    // The inline script in app/layout.jsx sets the theme on a full page load. Re-apply it here for
    // client-side navigation from /admin (always dark) and for React's dev-mode remount, which
    // clears attributes it doesn't manage from <html>.
    applyTheme(readStoredTheme() ?? deviceTheme());

    // Follow device changes (e.g. automatic dark mode at sunset) until the visitor picks a theme.
    return subscribeToDeviceTheme(() => {
      if (!readStoredTheme()) applyTheme(deviceTheme());
    });
  }, []);

  const toggle = () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    storeTheme(next);
    applyTheme(next);
  };

  // Which icon shows is pure CSS (the `light:` variant), so the server render never mismatches.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className={`inline-flex items-center justify-center rounded-xl bg-ink/[0.05] border border-ink/[0.1] text-fg light:bg-surface light:shadow-card hover:border-cyan-400/60 hover:text-cyan-400 transition-colors cursor-pointer ${className}`}
    >
      <Sun className="w-[18px] h-[18px] light:hidden" aria-hidden="true" />
      <Moon className="w-[18px] h-[18px] hidden light:block" aria-hidden="true" />
    </button>
  );
}
