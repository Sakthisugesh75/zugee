// lib/theme.js
// Light/dark theme for the public site. The colours live in app/globals.css ("Light / dark theme").
//
// <html data-theme> is set before first paint by THEME_INIT_SCRIPT (inlined in app/layout.jsx):
// the visitor's saved choice if they have used the toggle, otherwise their device setting.
// /admin is always dark; only the public site is themed.

export const THEME_STORAGE_KEY = "zugee-theme";
const LIGHT_QUERY = "(prefers-color-scheme: light)";
const ADMIN_PATH = /^\/admin(\/|$)/;

const isTheme = (value) => value === "light" || value === "dark";

// Runs synchronously in <head>, before React loads, so it is a self-contained string.
// The try/catch covers browsers where localStorage is blocked.
export const THEME_INIT_SCRIPT = `(function(){try{var t;if(${ADMIN_PATH}.test(location.pathname)){t="dark"}else{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=="light"&&t!=="dark")t=matchMedia(${JSON.stringify(LIGHT_QUERY)}).matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
}

export function deviceTheme() {
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

export function subscribeToDeviceTheme(callback) {
  const query = window.matchMedia(LIGHT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// A product accent colour (e.g. "#06B6D4") used as text or an icon colour. In light mode it is
// mixed toward black so it stays readable on white; in dark mode it is used as is.
export function accentInk(color) {
  return `color-mix(in oklab, ${color} var(--accent-ink), black)`;
}
