// scripts/make-tutu-genie.mjs — run with `node scripts/make-tutu-genie.mjs`.
// Builds public/tutu-genie.webp for the live mascot (lib/tutu-companion.js, src="/tutu-genie.webp"):
// the whole genie Tutu with its printed eyes painted out, so the component can draw live eyes
// (tracking, blinking, moods) on the visor.
//
// Source: the light-theme mascot (scripts/make-light-mascot.mjs), whose visor is solid navy, so the
// figure reads on light and dark pages alike.
// Steps: flood-fill the visor from its centre (dark pixels inside the white bezel); repaint it from
// a smooth colour gradient fitted to its plain (eye-free) pixels;
// fit an ellipse to the visor; crop to the component's 364 x 597 proportion.
// Prints the visor ellipse in the component's 364 x 597 units: copy it into GENIE_VISOR in
// lib/tutu-companion.js whenever the artwork changes.
import sharp from "sharp";

const SOURCE = "public/zugee-mascot-light.webp";
const TARGET = "public/tutu-genie.webp";
const VISOR_SEED = { x: 512, y: 470 }; // a point inside the visor (source is 1024 x 1536)
// Hair tip to tail tip, sparkle included, at the component's 364:597 aspect ratio.
const CROP = { left: 98, top: 60, width: 814, height: 1335 };
const OUT = { width: 728, height: 1194 }; // 2x the component's logical 364 x 597

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const at = (x, y) => (y * W + x) * 4;

// 1. Visor: connected pixels that are dark-ish in red (navy and cyan glow both are; the white bezel is not).
const visor = new Uint8Array(W * H);
const stack = [[VISOR_SEED.x, VISOR_SEED.y]];
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H || visor[y * W + x]) continue;
  const i = at(x, y);
  if (data[i] > 150 || data[i + 3] < 200) continue;
  visor[y * W + x] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// 2. Repaint the visor. Its plain navy pixels (no eye glow) are fitted with a smooth cubic colour
//    gradient, and every visor pixel more than 2 px inside its edge is redrawn from that fit. That
//    removes the eyes and their whole soft glow; the white highlight streak is bezel-bright, so it is
//    not part of the visor and stays.
const inside = new Uint8Array(W * H); // the visor eroded by 2 px, so the anti-aliased rim is kept
for (let y = 2; y < H - 2; y++) {
  for (let x = 2; x < W - 2; x++) {
    let all = visor[y * W + x];
    for (let d = 1; all && d <= 2; d++) all = visor[y * W + x + d] && visor[y * W + x - d] && visor[(y + d) * W + x] && visor[(y - d) * W + x];
    inside[y * W + x] = all ? 1 : 0;
  }
}
// Plain visor: dim green (the eyes' glow is bright cyan; the navy gradient stays under G 70).
const plain = (p) => inside[p] && data[p * 4 + 1] < 70;
const terms = (u, v) => [1, u, v, u * u, u * v, v * v, u * u * u, u * u * v, u * v * v, v * v * v];
const K = 10;
const A = Array.from({ length: K }, () => new Float64Array(K));
const B = [0, 1, 2].map(() => new Float64Array(K));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (!plain(p)) continue;
    const t = terms((x - VISOR_SEED.x) / 250, (y - VISOR_SEED.y) / 250);
    for (let i = 0; i < K; i++) {
      for (let j = 0; j < K; j++) A[i][j] += t[i] * t[j];
      for (let c = 0; c < 3; c++) B[c][i] += t[i] * data[p * 4 + c];
    }
  }
}
/** Solves A x = b (Gaussian elimination with partial pivoting). */
function solve(matrix, rhs) {
  const m = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < K; col++) {
    let pivot = col;
    for (let r = col + 1; r < K; r++) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    [m[col], m[pivot]] = [m[pivot], m[col]];
    for (let r = 0; r < K; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let c = col; c <= K; c++) m[r][c] -= f * m[col][c];
    }
  }
  return m.map((row, i) => row[K] / row[i]);
}
const coef = B.map((b) => solve(A, b));
let repainted = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (!inside[p]) continue;
    const t = terms((x - VISOR_SEED.x) / 250, (y - VISOR_SEED.y) / 250);
    for (let c = 0; c < 3; c++) data[p * 4 + c] = Math.max(0, Math.min(255, Math.round(t.reduce((s, v, i) => s + v * coef[c][i], 0))));
    repainted++;
  }
}

// 4. Visor ellipse from the mask's moments (uniform ellipse: variance = semi-axis² / 4).
let n = 0, sx = 0, sy = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (visor[y * W + x]) (n++, (sx += x), (sy += y));
const cx = sx / n, cy = sy / n;
let xx = 0, yy = 0, xy = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!visor[y * W + x]) continue;
    xx += (x - cx) ** 2;
    yy += (y - cy) ** 2;
    xy += (x - cx) * (y - cy);
  }
}
xx /= n; yy /= n; xy /= n;
const common = Math.sqrt(((xx - yy) / 2) ** 2 + xy ** 2);
const major = 2 * Math.sqrt((xx + yy) / 2 + common);
const minor = 2 * Math.sqrt((xx + yy) / 2 - common);
const angle = (0.5 * Math.atan2(2 * xy, xx - yy) * 180) / Math.PI;

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .extract(CROP)
  .resize(OUT.width, OUT.height)
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(TARGET);

const k = 364 / CROP.width;
const fixed = (v) => Number(v.toFixed(1));
console.log(`Wrote ${TARGET} (${OUT.width} x ${OUT.height})`);
console.log(`Visor: ${n} px; repainted: ${repainted} px`);
console.log(
  "GENIE_VISOR =",
  JSON.stringify({ cx: fixed((cx - CROP.left) * k), cy: fixed((cy - CROP.top) * k), rx: fixed(major * k), ry: fixed(minor * k), angle: fixed(angle) })
);
