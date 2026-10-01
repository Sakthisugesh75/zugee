// tests/site-content.test.mjs
// The FAQ is rendered on the homepage AND emitted as FAQPage structured data, so these rules
// cover both.
import test from "node:test";
import assert from "node:assert/strict";
import { FAQ_ITEMS, HOW_WE_WORK } from "../lib/site-content.js";

const allCopy = [
  ...FAQ_ITEMS.flatMap((f) => [f.question, f.answer]),
  ...HOW_WE_WORK.flatMap((s) => [s.title, s.body])
].join("\n");

test("the FAQ never claims a shared login or shared database across products", () => {
  assert.ok(!/unified zugee account|unified account|single login|one login|one account|one operating system/i.test(allCopy));
  assert.ok(!/shared (login|users|database)/i.test(allCopy));

  const multi = FAQ_ITEMS.find((f) => f.question === "Can I use more than one ZUGEE product?");
  assert.ok(multi);
  assert.match(multi.answer, /^Yes\./);
  assert.match(multi.answer, /own login/i);
  assert.match(multi.answer, /side by side/i);
  assert.ok(!/coming soon/i.test(multi.answer));
});
