// scripts/make-light-mascot.mjs — run with `node scripts/make-light-mascot.mjs`.
// Builds public/zugee-mascot-cutout-light.webp, the mascot shown in light mode.
//
// zugee-mascot-cutout.webp was cut out of a black background, so most of the mascot's body is
// partly transparent: fine on the dark theme, but on white it fades toward white and looks washed
// out. This raises the alpha with a smoothstep curve: the body becomes opaque, while the faint
// outer glow (alpha below ~10) stays soft. Colours are untouched.
import sharp from "sharp";

const SOURCE = "public/zugee-mascot-cutout.webp";
const TARGET = "public/zugee-mascot-cutout-light.webp";
const FADE_FROM = 10; // alpha at or below this stays fully transparent
const FADE_RANGE = 140; // alpha at or above FADE_FROM + FADE_RANGE becomes fully opaque

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 3; i < data.length; i += 4) {
  const t = Math.min(1, Math.max(0, (data[i] - FADE_FROM) / FADE_RANGE));
  data[i] = Math.round(255 * t * t * (3 - 2 * t));
}
await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 100 }).toFile(TARGET);
console.log(`Wrote ${TARGET}`);
