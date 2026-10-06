// tests/mobile-scroll-performance.test.mjs
// On phones, a fast fling froze the homepage half-drawn: the GPU re-ran a dozen large blur filters
// and backdrop blurs on every scrolled frame and fell behind. These rules keep that from coming back.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(js|jsx|mjs|css)$/.test(entry.name) ? [full] : [];
  });
}

const files = ["app", "components"].flatMap((dir) => sourceFiles(path.join(REPO_ROOT, dir)));
const globalsCss = fs.readFileSync(path.join(REPO_ROOT, "app/globals.css"), "utf8");

// Blur radius in px of a Tailwind blur utility, or null if it isn't one.
const NAMED_BLUR_PX = { "blur-xs": 4, "blur-sm": 8, "blur-md": 12, "blur-lg": 16, "blur-xl": 24, "blur-2xl": 40, "blur-3xl": 64 };
const MAX_MOBILE_BLUR_PX = 24;

function offendingLines(pattern) {
  return files.flatMap((file) =>
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) => (pattern(line) ? [`${path.relative(REPO_ROOT, file)}:${i + 1}`] : []))
  );
}

test("no large blur filter applies below the lg breakpoint", () => {
  // An unprefixed `blur-*` utility (not `lg:blur-*`, not `backdrop-blur-*`) applies on phones.
  const unprefixedBlur = /(?<![\w:-])blur-(\[(\d+)px\]|xs|sm|md|lg|xl|2xl|3xl)(?![\w-])/g;
  const offenders = offendingLines((line) =>
    [...line.matchAll(unprefixedBlur)].some((m) => (m[2] ? Number(m[2]) : NAMED_BLUR_PX[`blur-${m[1]}`]) > MAX_MOBILE_BLUR_PX)
  );
  assert.deepEqual(
    offenders,
    [],
    `Large blur filters stall scrolling on phones. Use "ambient-glow lg:blur-[...]" for glow blobs instead:\n${offenders.join("\n")}`
  );
});

test("no inline or CSS blur filter larger than the mobile limit", () => {
  const cssBlur = /\bfilter\s*:\s*["'`]?[^;"'`]*\bblur\((\d+)px\)/g;
  const offenders = offendingLines((line) =>
    [...line.matchAll(cssBlur)].some((m) => Number(m[1]) > MAX_MOBILE_BLUR_PX)
  );
  assert.deepEqual(offenders, [], `Large blur filters stall scrolling on phones:\n${offenders.join("\n")}`);
});

test("no fixed backgrounds (they force a full repaint on every scroll frame on mobile)", () => {
  const offenders = offendingLines((line) => /background-attachment\s*:\s*fixed|(?<![\w:-])bg-fixed\b/.test(line));
  assert.deepEqual(offenders, [], offenders.join("\n"));
});

test("globals.css switches off backdrop-filter and blur-free glows below lg", () => {
  const mobileBlock = globalsCss.match(/@media \(max-width: 1023px\) \{([\s\S]*?)\n\}/g)?.join("\n") ?? "";
  assert.match(mobileBlock, /backdrop-filter:\s*none\s*!important/, "mobile backdrop-filter guard is missing");
  assert.match(mobileBlock, /-webkit-backdrop-filter:\s*none\s*!important/, "mobile -webkit-backdrop-filter guard is missing");
  assert.match(mobileBlock, /\.ambient-glow\s*\{[^}]*mask-image:\s*radial-gradient/, "mobile .ambient-glow mask is missing");
});

test("every ambient glow blob blurs on desktop only", () => {
  const offenders = offendingLines((line) => line.includes("ambient-glow") && !/\blg:blur-/.test(line) && !line.trim().startsWith("*") && !line.includes("{"));
  assert.deepEqual(offenders, [], `ambient-glow elements need an lg:blur-* utility:\n${offenders.join("\n")}`);
});
