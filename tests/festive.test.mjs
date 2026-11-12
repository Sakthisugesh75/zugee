// tests/festive.test.mjs
// The festival greeting popup shows only inside its date window, counted in India time.
import test from "node:test";
import assert from "node:assert/strict";
import { FESTIVE_GREETINGS, activeGreeting, greetingSeenKey, indiaDate } from "../lib/festive.js";

test("every greeting is complete and its window is valid", () => {
  const ids = new Set();
  for (const g of FESTIVE_GREETINGS) {
    for (const field of ["id", "from", "to", "heading", "message", "signature", "button"]) {
      assert.ok(g[field], `${g.id}: ${field} is missing`);
    }
    assert.match(g.from, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(g.to, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(g.from <= g.to, `${g.id}: from is after to`);
    assert.ok(!ids.has(g.id), `${g.id}: duplicate id`);
    ids.add(g.id);
    assert.ok(!/TODO/.test(JSON.stringify(g)), `${g.id}: unfilled text`);
  }
});

test("dates are counted in India time, whatever the visitor's time zone", () => {
  // 20:00 UTC on 5 Nov is 01:30 IST on 6 Nov.
  assert.equal(indiaDate(new Date("2026-11-05T20:00:00Z")), "2026-11-06");
  assert.equal(indiaDate(new Date("2026-11-05T18:00:00Z")), "2026-11-05");
});

test("the Diwali greeting shows during Diwali and not outside it", () => {
  assert.equal(activeGreeting(new Date("2026-11-05T12:00:00+05:30")), null);
  assert.equal(activeGreeting(new Date("2026-11-06T00:00:00+05:30"))?.id, "diwali-2026");
  assert.equal(activeGreeting(new Date("2026-11-08T10:00:00+05:30"))?.id, "diwali-2026");
  assert.equal(activeGreeting(new Date("2026-11-11T23:59:00+05:30"))?.id, "diwali-2026");
  assert.equal(activeGreeting(new Date("2026-11-12T00:00:00+05:30")), null);
});

test("each greeting is remembered under its own key", () => {
  assert.equal(greetingSeenKey({ id: "diwali-2026" }), "zugee-greeting-diwali-2026");
});

test("every greeting uses a known theme and the windows never overlap", async () => {
  const { FESTIVE_THEMES } = await import("../lib/festive.js");
  for (const g of FESTIVE_GREETINGS) assert.ok(FESTIVE_THEMES.includes(g.theme), `${g.id}: unknown theme ${g.theme}`);
  const sorted = [...FESTIVE_GREETINGS].sort((a, b) => a.from.localeCompare(b.from));
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(sorted[i].from > sorted[i - 1].to, `${sorted[i - 1].id} and ${sorted[i].id} overlap`);
  }
});

test("Christmas and New Year switch on and off by themselves", () => {
  assert.equal(activeGreeting(new Date("2026-12-22T23:59:00+05:30")), null);
  assert.equal(activeGreeting(new Date("2026-12-23T00:00:00+05:30"))?.id, "christmas-2026");
  assert.equal(activeGreeting(new Date("2026-12-25T10:00:00+05:30"))?.id, "christmas-2026");
  assert.equal(activeGreeting(new Date("2026-12-28T10:00:00+05:30")), null);
  assert.equal(activeGreeting(new Date("2026-12-31T10:00:00+05:30"))?.id, "new-year-2027");
  assert.equal(activeGreeting(new Date("2027-01-01T00:05:00+05:30"))?.id, "new-year-2027");
  assert.equal(activeGreeting(new Date("2027-01-04T00:00:00+05:30")), null);
});
