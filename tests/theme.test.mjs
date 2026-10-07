// tests/theme.test.mjs
// Light/dark theme: the pre-paint script picks the right theme, and the public site keeps using
// theme colours (app/globals.css, "Light / dark theme") instead of colours that only work on dark.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY, accentInk } from "../lib/theme.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

// Run the inline <head> script against a fake browser and return the data-theme it sets.
function initialTheme({ pathname = "/", stored = null, deviceLight = false, storageThrows = false }) {
  const attributes = { "data-theme": "dark" };
  const context = {
    location: { pathname },
    localStorage: {
      getItem: (key) => {
        if (storageThrows) throw new Error("blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    matchMedia: (query) => ({ matches: deviceLight && query === "(prefers-color-scheme: light)" }),
    document: { documentElement: { setAttribute: (name, value) => (attributes[name] = value) } },
  };
  vm.runInNewContext(THEME_INIT_SCRIPT, context);
  return attributes["data-theme"];
}

test("a saved choice wins over the device setting", () => {
  assert.equal(initialTheme({ stored: "light", deviceLight: false }), "light");
  assert.equal(initialTheme({ stored: "dark", deviceLight: true }), "dark");
});

test("without a saved choice the device setting is followed", () => {
  assert.equal(initialTheme({ deviceLight: true }), "light");
  assert.equal(initialTheme({ deviceLight: false }), "dark");
  assert.equal(initialTheme({ stored: "purple", deviceLight: true }), "light");
});

test("the admin portal is always dark", () => {
  assert.equal(initialTheme({ pathname: "/admin", stored: "light" }), "dark");
  assert.equal(initialTheme({ pathname: "/admin/dashboard", stored: "light", deviceLight: true }), "dark");
  assert.equal(initialTheme({ pathname: "/administration", stored: "light" }), "light");
});

test("blocked storage leaves the server default instead of throwing", () => {
  assert.equal(initialTheme({ storageThrows: true, deviceLight: true }), "dark");
});

test("accent colours used as text are darkened through the theme variable", () => {
  assert.equal(accentInk("#06B6D4"), "color-mix(in oklab, #06B6D4 var(--accent-ink), black)");
});

// The public site (everything under the marketing layout, plus shared pieces it renders).
// The admin portal is not themed and is excluded.
const PUBLIC_DIRS = ["app/(marketing)", "components/home", "components/layout", "components/legal", "components/animations"];
const PUBLIC_FILES = ["app/not-found.jsx", "components/ui/MascotLogo.jsx", "components/ui/ScrollRow.jsx"];

function publicSourceFiles() {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(js|jsx)$/.test(entry.name) ? [full] : [];
    });
  return [...PUBLIC_DIRS.flatMap((d) => walk(path.join(REPO_ROOT, d))), ...PUBLIC_FILES.map((f) => path.join(REPO_ROOT, f))];
}

function offendingLines(pattern) {
  return publicSourceFiles().flatMap((file) =>
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) => (pattern.test(line) ? [`${path.relative(REPO_ROOT, file)}:${i + 1}`] : []))
  );
}

test("public pages use theme colours, not dark-only hex backgrounds", () => {
  // e.g. bg-[#06090F]: invisible as a difference on dark, a black slab in light mode.
  // Dark = every channel below 0x30, so brand colours like #00F0FF don't count.
  const offenders = offendingLines(/\b(bg|from|via|to)-\[#[0-2][0-9A-Fa-f][0-2][0-9A-Fa-f][0-2][0-9A-Fa-f]\]/);
  assert.deepEqual(offenders, [], `Use bg-canvas, bg-canvas-alt, bg-surface… (app/globals.css):\n${offenders.join("\n")}`);
});

test("public pages tint with ink, not white", () => {
  // bg-white/[0.03], rgba(255,255,255,…) and #FFFFFF vanish on a white page; ink and fg work in both themes.
  const offenders = offendingLines(/\b(bg|border(-[trblxy])?|from|via|to|ring|divide|shadow)-white\/|rgba\(255, ?255, ?255|#FFFFFF\b/i);
  assert.deepEqual(offenders, [], `Use ink (tints, hairlines) or fg (text) instead of white:\n${offenders.join("\n")}`);
});
