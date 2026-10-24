// scripts/make-light-mascot.mjs — run with `node scripts/make-light-mascot.mjs`.
// Builds public/zugee-mascot-light.webp, the mascot shown in light mode.
//
// zugee-mascot-cutout.webp was cut out of a black background, so every dark part of the mascot
// (the visor behind the eyes, the chest behind the "Z", the neck) became transparent. On the dark
// theme the page shows through and the character looks right; on a light page those parts turn
// white and the mascot looks blank and washed out.
//
// This puts the dark back: it finds the mascot's silhouette (solid pixels, gaps closed, holes
// filled, the floor shadow left out), fills it with the dark theme's navy, and lays the original
// cutout on top. Outside the silhouette nothing changes, so the soft glow stays soft.
import sharp from "sharp";

const SOURCE = "public/zugee-mascot-cutout.webp";
const TARGET = "public/zugee-mascot-light.webp";
const SOLID_ALPHA = 40; // alpha above this counts as part of the mascot
const CLOSE_RADIUS = 22; // px: gaps narrower than ~2× this (e.g. beside the neck) are closed
const FILL = { r: 10, g: 16, b: 30 }; // dark navy, close to the dark theme's canvas
const FEATHER = 1.2; // blur sigma for the silhouette edge

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

const solid = new Uint8Array(N);
for (let p = 0; p < N; p++) solid[p] = data[p * 4 + 3] > SOLID_ALPHA ? 1 : 0;

// The floor shadow is a flat blob near the bottom. Drop it before closing gaps, or it merges with
// the tail and gets filled as a navy disc.
{
  const seen = new Uint8Array(N);
  for (let start = 0; start < N; start++) {
    if (!solid[start] || seen[start]) continue;
    const pixels = [];
    const stack = [start];
    seen[start] = 1;
    let minY = H, maxY = 0;
    while (stack.length) {
      const p = stack.pop();
      pixels.push(p);
      const x = p % W, y = (p - x) / W;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
        if (q >= 0 && q < N && solid[q] && !seen[q]) {
          seen[q] = 1;
          stack.push(q);
        }
      }
    }
    const isFloorShadow = minY > H * 0.8 && maxY - minY < H * 0.06;
    if (isFloorShadow) for (const p of pixels) solid[p] = 0;
  }
}

/** Two-pass chamfer distance (3-4 metric, divided by 3) from every pixel to the nearest `from` pixel. */
function distanceTo(from) {
  const INF = 1e9;
  const d = new Float32Array(N);
  for (let p = 0; p < N; p++) d[p] = from[p] ? 0 : INF;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (x > 0) d[p] = Math.min(d[p], d[p - 1] + 3);
      if (y > 0) {
        d[p] = Math.min(d[p], d[p - W] + 3);
        if (x > 0) d[p] = Math.min(d[p], d[p - W - 1] + 4);
        if (x < W - 1) d[p] = Math.min(d[p], d[p - W + 1] + 4);
      }
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const p = y * W + x;
      if (x < W - 1) d[p] = Math.min(d[p], d[p + 1] + 3);
      if (y < H - 1) {
        d[p] = Math.min(d[p], d[p + W] + 3);
        if (x < W - 1) d[p] = Math.min(d[p], d[p + W + 1] + 4);
        if (x > 0) d[p] = Math.min(d[p], d[p + W - 1] + 4);
      }
    }
  }
  for (let p = 0; p < N; p++) d[p] /= 3;
  return d;
}

/** Flood-fill from the image border over pixels where `open[p]` is 1; returns the reached set. */
function floodFromBorder(open) {
  const reached = new Uint8Array(N);
  const stack = [];
  const push = (p) => {
    if (open[p] && !reached[p]) {
      reached[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) push(x), push((H - 1) * W + x);
  for (let y = 0; y < H; y++) push(y * W), push(y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (p >= W) push(p - W);
    if (p < N - W) push(p + W);
  }
  return reached;
}

// 1. Close: dilate the solid pixels, fill every hole the outside can't reach, then erode back.
const toSolid = distanceTo(solid);
const outsideDilated = new Uint8Array(N);
for (let p = 0; p < N; p++) outsideDilated[p] = toSolid[p] > CLOSE_RADIUS ? 1 : 0;
const outside = floodFromBorder(outsideDilated);
const toOutside = distanceTo(outside);
const silhouette = new Uint8Array(N);
for (let p = 0; p < N; p++) silhouette[p] = toOutside[p] > CLOSE_RADIUS || (solid[p] && !outside[p]) ? 1 : 0;

// 2. Keep only the largest connected piece: the mascot, not its floor shadow.
const label = new Int32Array(N);
let best = 0;
let bestSize = 0;
for (let start = 0, next = 1; start < N; start++) {
  if (!silhouette[start] || label[start]) continue;
  const stack = [start];
  label[start] = next;
  let size = 0;
  while (stack.length) {
    const p = stack.pop();
    size++;
    const x = p % W;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
      if (q >= 0 && q < N && silhouette[q] && !label[q]) {
        label[q] = next;
        stack.push(q);
      }
    }
  }
  if (size > bestSize) (bestSize = size), (best = next);
  next++;
}

// 3. Feather the silhouette edge, then composite: navy underlay inside it, original art on top.
const maskRaw = Buffer.alloc(N);
for (let p = 0; p < N; p++) maskRaw[p] = label[p] === best ? 255 : 0;
// extractChannel keeps the output single-channel (blur would otherwise return sRGB).
const mask = await sharp(maskRaw, { raw: { width: W, height: H, channels: 1 } })
  .blur(FEATHER)
  .extractChannel(0)
  .raw()
  .toBuffer();
if (mask.length !== N) throw new Error(`mask has ${mask.length / N} channels, expected 1`);

const out = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  const i = p * 4;
  const a = data[i + 3] / 255; // the art
  const m = mask[p] / 255; // the navy underlay
  const outA = a + m * (1 - a);
  if (outA === 0) continue;
  out[i] = Math.round((data[i] * a + FILL.r * m * (1 - a)) / outA);
  out[i + 1] = Math.round((data[i + 1] * a + FILL.g * m * (1 - a)) / outA);
  out[i + 2] = Math.round((data[i + 2] * a + FILL.b * m * (1 - a)) / outA);
  out[i + 3] = Math.round(outA * 255);
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 100 }).toFile(TARGET);
console.log(`Wrote ${TARGET}`);
