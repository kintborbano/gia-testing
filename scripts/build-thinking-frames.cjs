// Builds the looping "GIA thinking" loader frames served on /loading.
//
// The source renders in public/images/thinking-frames/ (gia-thinking000..240.png,
// 1200x1104) ship GIA on a SOLID maroon background and weigh ~367 MB total — far
// too heavy to serve, and opaque where the loading screen expects her to float
// transparently on its maroon page (like the old static gia-thought-thinking.png).
//
// For each frame this script:
//   1. removes the maroon background by FLOOD-FILLING from the borders (a global
//      color key would punch holes in GIA, who is herself maroon-brand colored;
//      flooding only from the edges erases the contiguous background and leaves
//      her interior maroon intact),
//   2. downscales to 400px wide (the loader displays at <=400px; this keeps the
//      241 decoded frames' in-memory footprint on par with the other loaders),
//   3. encodes a transparent WebP into public/images/thinking-loop/frameNNN.webp.
//
// Usage: `node scripts/build-thinking-frames.cjs`. Re-run after tweaking TOLERANCE
// if the chroma key fringes or eats into GIA. After a good run, delete the source
// thinking-frames/ folder — only the generated thinking-loop/ webp are committed.
const fs = require('fs');
const path = require('path');

// sharp isn't hoisted to the top-level node_modules under pnpm; resolve it from
// its package folder so this script runs without an extra install.
const sharp = require(
  require.resolve('sharp', {
    paths: [
      path.join(__dirname, '..', 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules'),
    ],
  })
);

const SRC_DIR = path.join(__dirname, '..', 'public', 'images', 'thinking-frames');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'thinking-loop');
const FRAME_COUNT = 241;
const OUT_WIDTH = 400;
// Squared Euclidean distance (in RGB) within which a pixel counts as background.
// ~50 linear; tune up if a maroon halo survives, down if it bleeds into GIA.
const TOLERANCE = 50 * 50;

const srcPath = (i) =>
  path.join(SRC_DIR, `gia-thinking${String(i).padStart(3, '0')}.png`);
const outPath = (i) =>
  path.join(OUT_DIR, `frame${String(i).padStart(3, '0')}.webp`);

// Erase the contiguous background touching the image border. Seeds every border
// pixel that matches the corner-sampled key color, then 4-connected floods to
// neighbours within TOLERANCE, zeroing their alpha. Interior maroon (GIA) is not
// connected to the border, so it is preserved.
function keyOutBackground(data, width, height) {
  // Sample the key color from the top-left corner — uniformly maroon across the set.
  const kr = data[0];
  const kg = data[1];
  const kb = data[2];

  const near = (idx) => {
    const dr = data[idx] - kr;
    const dg = data[idx + 1] - kg;
    const db = data[idx + 2] - kb;
    return dr * dr + dg * dg + db * db <= TOLERANCE;
  };

  const visited = new Uint8Array(width * height);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (near(p * 4)) stack.push(p);
  };

  for (let x = 0; x < width; x++) {
    pushIf(x, 0);
    pushIf(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIf(0, y);
    pushIf(width - 1, y);
  }

  while (stack.length) {
    const p = stack.pop();
    data[p * 4 + 3] = 0; // transparent
    const x = p % width;
    const y = (p - x) / width;
    pushIf(x - 1, y);
    pushIf(x + 1, y);
    pushIf(x, y - 1);
    pushIf(x, y + 1);
  }
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < FRAME_COUNT; i++) {
    const { data, info } = await sharp(srcPath(i))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    keyOutBackground(data, info.width, info.height);

    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      // sharp resizes with premultiplied alpha, so soft edges don't pick up a
      // maroon halo from the (now transparent) background pixels.
      .resize({ width: OUT_WIDTH })
      .webp({ quality: 80, alphaQuality: 90, effort: 6 })
      .toFile(outPath(i));

    if (i % 20 === 0 || i === FRAME_COUNT - 1) {
      console.log(`  ${i + 1}/${FRAME_COUNT}`);
    }
  }

  console.log(`Done — ${FRAME_COUNT} frames written to ${OUT_DIR}`);
})();
