// scripts/generate-icons.mjs
// Generate all ZUGEE icons from the master Z logo (public/zugee-logo-icon.png).
// Run: node scripts/generate-icons.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const BRAND_NAVY = '#0A0F24';
const BRAND_BLUE = '#2563FF';
const SOURCE_LOGO = join(rootDir, 'public', 'zugee-logo-icon.png');

// Helper: Create rounded rectangle SVG mask
function createRoundedMask(size, radius) {
  return Buffer.from(`
    <svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>
  `);
}

// Helper: Create rounded tile with optional inner edge
async function createRoundedTile(zLogoBuffer, size, zScale, addInnerEdge = false) {
  const radius = Math.round(size * 0.225); // 22.5% corner radius
  const zSize = Math.round(size * zScale);
  
  // Create navy background
  let tile = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_NAVY
    }
  });
  
  // Resize and composite the Z logo
  const resizedZ = await sharp(zLogoBuffer)
    .resize(zSize, zSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  
  tile = tile.composite([{
    input: resizedZ,
    gravity: 'center'
  }]);
  
  // Add inner edge stroke if requested (for sizes >= 192px)
  if (addInnerEdge && size >= 192) {
    const strokeWidth = Math.max(2, Math.round(size / 96)); // 2px-equivalent, scales with size
    const innerRadius = radius - strokeWidth;
    
    const stroke = Buffer.from(`
      <svg width="${size}" height="${size}">
        <rect x="${strokeWidth/2}" y="${strokeWidth/2}" 
              width="${size - strokeWidth}" height="${size - strokeWidth}" 
              rx="${innerRadius}" ry="${innerRadius}"
              fill="none" stroke="${BRAND_BLUE}" stroke-width="${strokeWidth}" opacity="0.45"/>
      </svg>
    `);
    
    tile = tile.composite([{
      input: stroke,
      gravity: 'center'
    }]);
  }
  
  // Apply rounded mask (transparent corners)
  const mask = createRoundedMask(size, radius);
  tile = tile.composite([{
    input: mask,
    blend: 'dest-in'
  }]);
  
  return tile;
}

async function main() {
  console.log('🎨 ZUGEE Icon Generation');
  console.log('========================\n');
  
  // Load source logo
  const sourceLogo = readFileSync(SOURCE_LOGO);
  const sourceMetadata = await sharp(sourceLogo).metadata();
  console.log(`Source: ${sourceMetadata.width}x${sourceMetadata.height}, ${(sourceLogo.length / 1024).toFixed(1)} KB\n`);
  
  // 1. Optimize navbar logo (trim + square pad + compress)
  console.log('1️⃣  Optimizing navbar logo...');
  const trimmed = await sharp(sourceLogo).trim().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  
  // Pad to square with ~6% margin
  const margin = Math.round(Math.max(trimmedMeta.width, trimmedMeta.height) * 0.06);
  const squareSize = Math.max(trimmedMeta.width, trimmedMeta.height) + margin * 2;
  
  const navbarPNG = await sharp(trimmed)
    .resize(256, 256, { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  
  writeFileSync(join(rootDir, 'public', 'zugee-logo-icon.png'), navbarPNG);
  console.log(`   ✓ zugee-logo-icon.png: 256x256, ${(navbarPNG.length / 1024).toFixed(1)} KB`);
  
  const navbarWebP = await sharp(trimmed)
    .resize(256, 256, { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .webp({ quality: 90 })
    .toBuffer();
  
  writeFileSync(join(rootDir, 'public', 'zugee-logo-icon.webp'), navbarWebP);
  console.log(`   ✓ zugee-logo-icon.webp: 256x256, ${(navbarWebP.length / 1024).toFixed(1)} KB\n`);
  
  // 2. Generate app/icon.png (32x32, Next.js will auto-generate favicon.ico)
  console.log('2️⃣  Generating app/icon.png...');
  const appIcon = await (await createRoundedTile(sourceLogo, 32, 0.72, false))
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  
  writeFileSync(join(rootDir, 'app', 'icon.png'), appIcon);
  console.log(`   ✓ app/icon.png: 32x32, ${(appIcon.length / 1024).toFixed(1)} KB\n`);
    
  // 3. Generate app/home-screen icons
  console.log('3️⃣  Generating app/home-screen icons...');
  
  // icon-192.png (rounded tile with inner edge)
  const icon192 = await (await createRoundedTile(sourceLogo, 192, 0.65, true))
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(rootDir, 'public', 'icon-192.png'), icon192);
  console.log(`   ✓ icon-192.png: 192x192, ${(icon192.length / 1024).toFixed(1)} KB`);
  
  // icon-512.png (rounded tile with inner edge)
  const icon512 = await (await createRoundedTile(sourceLogo, 512, 0.65, true))
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(rootDir, 'public', 'icon-512.png'), icon512);
  console.log(`   ✓ icon-512.png: 512x512, ${(icon512.length / 1024).toFixed(1)} KB`);
  
  // icon-maskable-512.png (full-bleed square, no rounding, smaller Z for safe zone)
  const resizedZMaskable = await sharp(sourceLogo)
    .resize(Math.round(512 * 0.55), Math.round(512 * 0.55), { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .toBuffer();
  
  const iconMaskable = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: BRAND_NAVY
    }
  })
    .composite([{
      input: resizedZMaskable,
      gravity: 'center'
    }])
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  
  writeFileSync(join(rootDir, 'public', 'icon-maskable-512.png'), iconMaskable);
  console.log(`   ✓ icon-maskable-512.png: 512x512 (full-bleed), ${(iconMaskable.length / 1024).toFixed(1)} KB`);
  
  // apple-touch-icon.png (180x180, full-bleed square, no transparency, iOS applies rounding)
  const resizedZApple = await sharp(sourceLogo)
    .resize(Math.round(180 * 0.65), Math.round(180 * 0.65), { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .toBuffer();
  
  const appleIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 3, // RGB only, no alpha
      background: BRAND_NAVY
    }
  })
    .composite([{
      input: resizedZApple,
      gravity: 'center'
    }])
    .flatten({ background: BRAND_NAVY }) // Remove any transparency
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  
  writeFileSync(join(rootDir, 'public', 'apple-touch-icon.png'), appleIcon);
  console.log(`   ✓ apple-touch-icon.png: 180x180 (no transparency), ${(appleIcon.length / 1024).toFixed(1)} KB\n`);
  
  console.log('✅ All icons generated successfully!');
}

main().catch(console.error);

