// Critical scroll-animation frame sequences. These are otherwise lazy-loaded
// only when scrolled near, which makes them pop in / fail to animate right after
// the intro loader dismisses. The loader preloads them so they are cached (and
// the page is genuinely "ready") before it reveals the page.
//
// NOTE: keep these in sync with the scrubber components:
//   - laptop-frames  -> Features/ChibiLaptopScene.tsx
//   - action-frames  -> Features/ActionLaptop.tsx
//   - peace          -> PeaceScrubber.tsx

const pad2 = (i: number) => String(i).padStart(2, '0');

// Build a frame-URL list that loads every `step`-th source frame (always
// including the last, so the animation reaches its final state). Dropping the
// in-between frames is imperceptible at scroll speed but roughly divides the
// decoded-bitmap memory AND the download by `step`. If a scrub ever looks
// steppy on a slow, deliberate scroll, lower that sequence's step toward 1.
function sampled(
  total: number,
  step: number,
  name: (i: number) => string
): string[] {
  const indices: number[] = [];
  for (let i = 0; i < total; i += step) indices.push(i);
  if (indices[indices.length - 1] !== total - 1) indices.push(total - 1);
  return indices.map(name);
}

// Single source of truth for each scrubber's frames — the scrubbers import
// these exact lists, so the preload below can never drift out of sync with what
// they actually draw. Source folders hold the full sequences (120 / 39 / 70);
// we sample them down here.
export const LAPTOP_FRAMES = sampled(
  120,
  2,
  (i) => `/images/laptop-frames/final2_prob${3000 + i}.webp`
);
export const ACTION_FRAMES = sampled(
  39,
  1,
  (i) => `/images/action-frames/laptop${pad2(i)}.webp`
);
export const PEACE_FRAMES = sampled(
  70,
  2,
  (i) => `/images/peace/gia-peace${pad2(i)}.webp`
);

const CRITICAL_URLS: string[] = [
  ...LAPTOP_FRAMES,
  ...ACTION_FRAMES,
  ...PEACE_FRAMES,
  '/images/gia-on-laptop.png',
];

// Single source of truth for every scroll-frame Image. Both the loader (warming
// the cache below) and the scrubber components request frames through
// `getFrameImage`, so each URL is downloaded, decoded, and held in memory
// exactly once. Previously the loader kept its own array AND each scrubber
// allocated a second Image per frame — doubling hundreds of MB of decoded
// bitmaps. The map keeps the fetched resources alive (cached) for the page's
// lifetime; the scrubbers read the same instances straight from it.
const frameImages = new Map<string, HTMLImageElement>();

/** Get the shared Image for a frame URL, creating + kicking off its load once. */
export function getFrameImage(url: string): HTMLImageElement {
  let img = frameImages.get(url);
  if (!img) {
    img = new Image();
    img.src = url;
    frameImages.set(url, img);
  }
  return img;
}

let promise: Promise<void> | null = null;

/** Preload (download) every critical frame so nothing pops in after reveal. */
export function preloadCriticalAssets(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (promise) return promise;

  promise = Promise.all(
    CRITICAL_URLS.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = getFrameImage(url);
          // Resolve on success or failure — never block readiness on one asset.
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);

  return promise;
}
