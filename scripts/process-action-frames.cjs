// Removes the baked maroon background from the "GIA in action" laptop frames,
// turning it transparent so the laptop floats on the section's brand-primary
// fill (the export's maroon #871D2B is a hair off the section's #8c1f2e, so a
// baked-in background would seam — hence the cut-out).
//
// Source: public/images/laptop-screen-frames/laptop-frames000.png .. 136.png
//   (1100x618, full-rate export — the raw, uncommitted source of truth).
// Output: public/images/action-frames/laptop-screen000.webp .. 136.webp
//   (transparent; preloadAssets `sampled()` loads every Nth at runtime, the rest
//   stay on disk so the count can be retuned without re-exporting).
//
// HOW THE CUT-OUT WORKS: a flood fill from the image borders clears only the
// CONNECTED maroon background. The reddish bars inside the laptop screen are
// enclosed by the laptop, unreachable from the border, so they survive. A
// distance band feathers the laptop edge for a clean, halo-free cut.
//
// Usage: `node scripts/process-action-frames.cjs`. Re-run only if the raw export
// changes; then re-run build-mobile-frames.cjs to refresh the `-sm` set.
const fs = require('fs');
const path = require('path');
const sharp = require(
  require.resolve('sharp', {
    paths: [
      path.join(__dirname, '..', 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules'),
    ],
  })
);

const IMAGES = path.join(__dirname, '..', 'public', 'images');
const SRC_DIR = path.join(IMAGES, 'laptop-screen-frames');
const OUT_DIR = path.join(IMAGES, 'action-frames');
const TOTAL = 137; // laptop-screen000.png .. laptop-screen136.png
const pad3 = (i) => String(i).padStart(3, '0');

// dist <= LOW  -> fully transparent (pure background)
// dist >= HIGH -> fully opaque (laptop); the flood stops here
// Kept narrow / close to pure maroon on purpose: a wider band ate into the
// laptop's anti-aliased corners. Erring tight leaves at most a faint maroon
// fringe, which is invisible against the section's same-maroon fill.
const TOL_LOW = 38;
const TOL_HIGH = 70;

function keyOut(d, w, h) {
  const corner = (x, y) => {
    const o = (y * w + x) * 4;
    return [d[o], d[o + 1], d[o + 2]];
  };
  const cs = [corner(1, 1), corner(w - 2, 1), corner(1, h - 2), corner(w - 2, h - 2)];
  const bg = [0, 1, 2].map((k) => Math.round(cs.reduce((s, c) => s + c[k], 0) / 4));
  const dist = (o) => {
    const dr = d[o] - bg[0], dg = d[o + 1] - bg[1], db = d[o + 2] - bg[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  const visited = new Uint8Array(w * h);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p] || dist(p * 4) >= TOL_HIGH) return;
    visited[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x++) { pushIf(x, 0); pushIf(x, h - 1); }
  for (let y = 0; y < h; y++) { pushIf(0, y); pushIf(w - 1, y); }

  while (stack.length) {
    const p = stack.pop();
    const o = p * 4;
    const dv = dist(o);
    d[o + 3] = dv <= TOL_LOW ? 0 : Math.round((255 * (dv - TOL_LOW)) / (TOL_HIGH - TOL_LOW));
    const x = p % w, y = (p / w) | 0;
    pushIf(x + 1, y); pushIf(x - 1, y); pushIf(x, y + 1); pushIf(x, y - 1);
  }
  return d;
}

(async () => {
  // Start clean so the old laptop00.webp..38.webp set can't linger as stale art.
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < TOTAL; i++) {
    const src = path.join(SRC_DIR, `laptop-frames${pad3(i)}.png`);
    if (!fs.existsSync(src)) throw new Error(`missing source frame: ${src}`);
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    keyOut(data, info.width, info.height);
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(path.join(OUT_DIR, `laptop-screen${pad3(i)}.webp`));
  }
  console.log(`Done. ${TOTAL} transparent frames -> public/images/action-frames`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
