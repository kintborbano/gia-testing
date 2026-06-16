// Builds the PHONE frame variants for the three landing-page scroll scrubbers.
//
// WHY: each scrubber decodes its frames to raw RGBA bitmaps that are held in
// memory for the page's whole life (width x height x 4 bytes per frame). At full
// resolution the three sequences together pin ~470 MB of decoded bitmaps —
// comfortably past iOS Safari's per-tab memory ceiling, which is the main cause
// of scroll lag / tab reloads on phones.
//
// Desktop and tablet keep the full-res sequences (they have the RAM and the
// display pixels to justify them). This script generates a lighter PHONE-ONLY
// variant of each, served only at <=767px (see preloadAssets `prefersSmallFrames`):
//   - FEWER frames (invisible at finger-scroll speed — a temporal cut, not a
//     spatial one), and
//   - a modest downscale to roughly the phone's physical pixel demand
//     (CSS width x devicePixelRatio), so the frames still cover the display and
//     never look soft.
//
// For each sequence this script:
//   1. picks `outCount` frames evenly across the full sequence (always incl. the
//      first and last so the animation still reaches its end state),
//   2. resizes each to `width` (height follows the source aspect),
//   3. writes a transparent/opaque WebP into the `-sm` output folder as
//      frame00.webp .. frameNN.webp (sequential — preloadAssets builds the same
//      names).
//
// Usage: `node scripts/build-mobile-frames.cjs`. Outputs are committed; only
// re-run this if the source full-res frames change. Keep the `outCount` values
// in sync with the *_FRAMES_SM lengths in src/lib/preloadAssets.ts.
const fs = require('fs');
const path = require('path');

// sharp isn't hoisted to the top-level node_modules under pnpm; resolve it from
// its package folder so this script runs without an extra install.
const sharp = require(
  require.resolve('sharp', {
    paths: [
      path.join(
        __dirname,
        '..',
        'node_modules',
        '.pnpm',
        'sharp@0.34.5',
        'node_modules'
      ),
    ],
  })
);

const IMAGES = path.join(__dirname, '..', 'public', 'images');
const pad2 = (i) => String(i).padStart(2, '0');

// Evenly spaced indices across [0, total-1], inclusive of both ends.
function pickIndices(total, count) {
  if (count >= total) return Array.from({ length: total }, (_, i) => i);
  const idx = [];
  for (let i = 0; i < count; i++) {
    idx.push(Math.round((i * (total - 1)) / (count - 1)));
  }
  return idx;
}

// One job per scrubber. `width` is the phone-variant output width (height follows
// the source aspect); `outCount` is the reduced frame count.
const JOBS = [
  {
    name: 'laptop',
    srcDir: 'laptop-frames',
    srcName: (i) => `final2_prob${3000 + i}.webp`,
    total: 120,
    outDir: 'laptop-frames-sm',
    outCount: 28,
    width: 1080, // full is 1200x800 (3:2); phone shows it ~350css x DPR3 ~= 1050px
  },
  {
    name: 'action',
    srcDir: 'action-frames',
    srcName: (i) => `laptop${pad2(i)}.webp`,
    total: 39,
    outDir: 'action-frames-sm',
    outCount: 18,
    width: 1100, // full is 1280x720 (16:9)
  },
  {
    name: 'peace',
    srcDir: 'peace',
    srcName: (i) => `gia-peace${pad2(i)}.webp`,
    total: 70,
    outDir: 'peace-sm',
    outCount: 18,
    width: 1000, // already 1000x667 at full — this variant only cuts frame count
  },
];

async function runJob(job) {
  const srcDir = path.join(IMAGES, job.srcDir);
  const outDir = path.join(IMAGES, job.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const indices = pickIndices(job.total, job.outCount);
  let out = 0;
  for (const i of indices) {
    const srcPath = path.join(srcDir, job.srcName(i));
    if (!fs.existsSync(srcPath)) {
      throw new Error(`[${job.name}] missing source frame: ${srcPath}`);
    }
    const outPath = path.join(outDir, `frame${pad2(out)}.webp`);
    await sharp(srcPath)
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);
    out += 1;
  }
  console.log(
    `[${job.name}] ${out} frames -> public/images/${job.outDir} @ ${job.width}px`
  );
}

(async () => {
  for (const job of JOBS) {
    await runJob(job);
  }
  console.log('Done. Keep outCount in sync with *_FRAMES_SM in preloadAssets.ts.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
