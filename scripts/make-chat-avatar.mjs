// scripts/make-chat-avatar.mjs — run with `node scripts/make-chat-avatar.mjs`.
// Builds public/zugee-tutu-avatar.webp: Tutu the mascot's head (with the sparkle and a hint of the
// "Z"), transparent background, for the "Ask Tutu" chat button and the chat panel header.
// Cut from the light-theme mascot (scripts/make-light-mascot.mjs), whose visor is filled, so it reads
// on light and dark backgrounds alike. 256 px for sharp rendering at 64 CSS px on 4x screens.
import sharp from "sharp";

const SOURCE = "public/zugee-mascot-light.webp";
const TARGET = "public/zugee-tutu-avatar.webp";
const CROP = { left: 150, top: 90, width: 700, height: 700 }; // head, hair and sparkle (source is 1024 x 1536)

await sharp(SOURCE)
  .extract(CROP)
  .resize(256, 256)
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(TARGET);
console.log(`Wrote ${TARGET}`);
