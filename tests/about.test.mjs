// tests/about.test.mjs
// /about, /case-studies and the homepage testimonials: owner details that are not filled in stay
// hidden (never placeholder text), and no customer, case study or testimonial is invented.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as about from "../lib/about.js";
import { CASE_STUDIES, caseStudiesRobots, publishedCaseStudies } from "../lib/case-studies.js";
import { FEATURES } from "../lib/features.js";
import { TESTIMONIALS } from "../lib/testimonials.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

const FILES = [
  path.join("app", "(marketing)", "about", "page.jsx"),
  path.join("app", "(marketing)", "case-studies", "page.jsx"),
  path.join("app", "(marketing)", "case-studies", "[slug]", "page.jsx"),
  path.join("components", "about", "PageIntro.jsx"),
  path.join("components", "about", "DemoCTA.jsx"),
  path.join("components", "about", "FounderCard.jsx"),
  path.join("components", "home", "TestimonialsSection.jsx")
];

/** Source with every JS and JSX comment removed, so only what can reach the page is left. */
function withoutComments(source) {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

/** Every string in a value, flattened. */
function allStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

test("lib/about.js exports every owner field", () => {
  for (const name of ["FOUNDER_STORY", "FOUNDERS", "ADDRESS", "CIN", "GSTIN", "isFilled"]) {
    assert.ok(name in about, `lib/about.js must export ${name}`);
  }
  assert.ok(Array.isArray(about.FOUNDERS), "FOUNDERS must be an array");
  assert.equal(about.isFilled(null), false);
  assert.equal(about.isFilled(""), false);
  assert.equal(about.isFilled([]), false);
  assert.equal(about.isFilled("x"), true);
  assert.equal(about.isFilled(["x"]), true);
});

test("owner data holds no placeholder text", () => {
  const values = [about.FOUNDER_STORY, about.FOUNDERS, about.ADDRESS, about.CIN, about.GSTIN];
  for (const text of allStrings(values)) {
    assert.ok(!/TODO|lorem|placeholder|\[.*\]/i.test(text), `placeholder found in lib/about.js: ${text}`);
  }
  for (const founder of about.FOUNDERS) {
    assert.ok(founder.name && founder.role, "each founder needs a name and role");
  }
});

test("no rendered string on the new pages contains TODO", () => {
  for (const file of FILES) {
    const source = withoutComments(fs.readFileSync(path.join(REPO_ROOT, file), "utf8"));
    assert.ok(!/TODO/.test(source), `${file} renders TODO text`);
  }
});

test("/about keeps the TODO(owner) markers at each hidden spot", () => {
  const source = fs.readFileSync(path.join(REPO_ROOT, FILES[0]), "utf8");
  assert.ok((source.match(/TODO\(owner/g) ?? []).length >= 4);
});

test("no case study or testimonial is invented, and testimonials are off", () => {
  assert.deepEqual(CASE_STUDIES, []);
  assert.deepEqual(TESTIMONIALS, []);
  assert.equal(FEATURES.testimonials, false);
});

test("case-study routes are noindex while nothing is published", () => {
  assert.equal(publishedCaseStudies().length, 0);
  assert.deepEqual(caseStudiesRobots(), { index: false, follow: true });
});
