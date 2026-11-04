// scripts/generate-og-images.mjs
// Generate 1200x630 Open Graph share images: one per available product page
// (public/og/{pageSlug}.jpg) plus blog post images (public/og/blog-*.jpg).
// Run: npm run og:generate
//
// Each image is an SVG rendered by sharp (librsvg, system fonts) and saved as a
// mozjpeg JPEG. Keep files small (< ~60 KB): WhatsApp/LinkedIn drop large previews.

import sharp from 'sharp';
import { mkdirSync, readFileSync, statSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outDir = join(rootDir, 'public', 'og');
const LOGO = join(rootDir, 'public', 'zugee-logo-icon.png');

const { PRODUCTS } = await import(pathToFileURL(join(rootDir, 'lib', 'products.js')).href);

const W = 1200;
const H = 630;
const PAD = 80;
const FONT = "'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const CANVAS = '#05070B';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Rough text width estimate for bold sans text (em-relative average advance).
const estWidth = (text, size, avg = 0.6) => text.length * size * avg;

// Largest font size (<= max) whose estimated width fits in maxWidth.
function fitSize(text, max, maxWidth, avg) {
  let size = max;
  while (size > 24 && estWidth(text, size, avg) > maxWidth) size -= 2;
  return size;
}

// "college-management-software" -> "College Management Software"
const ACRONYMS = { erp: 'ERP', crm: 'CRM', pg: 'PG' };
const WORDS = { and: '&' };
function humanizeSlug(slug) {
  return slug.split('-')
    .map((w) => ACRONYMS[w] ?? WORDS[w] ?? w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function svg({ chip, title, subtitle, note }) {
  const maxText = W - PAD * 2;
  const titleSize = fitSize(title, 104, maxText, 0.62);
  const subSize = fitSize(subtitle, 46, maxText, 0.56);
  const chipSize = 24;
  const chipW = Math.round(estWidth(chip, chipSize, 0.58) + 48);

  const chipY = 196;
  const titleY = chipY + 70 + titleSize * 0.95;
  const subY = titleY + subSize + 30;
  const noteY = subY + 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#06B6D4"/>
      <stop offset="0.5" stop-color="#3B82F6"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.88" cy="0.12" r="0.6">
      <stop offset="0" stop-color="#3B82F6" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.05" cy="1" r="0.55">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${CANVAS}"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#brand)"/>

  <text x="${PAD + 76}" y="${PAD + 40}" font-family="${FONT}" font-size="40" font-weight="800" letter-spacing="1" fill="#FFFFFF">ZUG<tspan fill="#22D3EE">EE</tspan></text>

  <rect x="${PAD}" y="${chipY}" width="${chipW}" height="46" rx="23" fill="#3B82F6" fill-opacity="0.14" stroke="#3B82F6" stroke-opacity="0.55" stroke-width="1.5"/>
  <text x="${PAD + chipW / 2}" y="${chipY + 31}" text-anchor="middle" font-family="${FONT}" font-size="${chipSize}" font-weight="600" fill="#BFDBFE">${esc(chip)}</text>

  <text x="${PAD}" y="${titleY}" font-family="${FONT}" font-size="${titleSize}" font-weight="800" fill="#FFFFFF">${esc(title)}</text>
  <text x="${PAD}" y="${subY}" font-family="${FONT}" font-size="${subSize}" font-weight="700" fill="url(#brand)">${esc(subtitle)}</text>
  ${note ? `<text x="${PAD}" y="${noteY}" font-family="${FONT}" font-size="28" font-weight="400" fill="#94A3B8">${esc(note)}</text>` : ''}

  <rect x="${PAD}" y="${H - 92}" width="${W - PAD * 2}" height="1" fill="#FFFFFF" fill-opacity="0.12"/>
  <text x="${PAD}" y="${H - 48}" font-family="${FONT}" font-size="26" font-weight="600" fill="#CBD5E1">getzugee.com</text>
  <rect x="${W - PAD - 160}" y="${H - 58}" width="160" height="6" rx="3" fill="url(#brand)"/>
</svg>`;
}

async function render(spec, file) {
  const logo = await sharp(readFileSync(LOGO)).resize(60, 60, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const out = join(outDir, file);
  await sharp(Buffer.from(svg(spec)))
    .composite([{ input: logo, left: PAD, top: PAD - 10 }])
    .flatten({ background: CANVAS })
    .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toFile(out);
  const meta = await sharp(out).metadata();
  const kb = (statSync(out).size / 1024).toFixed(1);
  console.log(`${file.padEnd(42)} ${meta.width}x${meta.height}  ${kb} KB`);
}

mkdirSync(outDir, { recursive: true });

const products = PRODUCTS.filter((p) => p.status === 'available' && p.pageSlug);
for (const p of products) {
  await render(
    {
      chip: p.categoryLabel,
      title: p.name,
      subtitle: humanizeSlug(p.pageSlug),
      note: 'Built for Indian businesses',
    },
    `${p.pageSlug}.jpg`,
  );
}

const BLOG = [
  {
    file: 'blog-trip-sheet-format.jpg',
    chip: 'Fleet & Transport',
    title: 'Trip Sheet Format',
    subtitle: 'Free template for transport businesses',
  },
  {
    file: 'blog-truck-trip-profit-calculation.jpg',
    chip: 'Fleet & Transport',
    title: 'Truck Trip Profit',
    subtitle: 'How to calculate it, with a worked example',
  },
];
for (const { file, ...spec } of BLOG) await render(spec, file);

console.log(`\nDone: ${products.length + BLOG.length} images in public/og/`);
