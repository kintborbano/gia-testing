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

function sequence(count: number, name: (i: number) => string): string[] {
  return Array.from({ length: count }, (_, i) => name(i));
}

const CRITICAL_URLS: string[] = [
  ...sequence(120, (i) => `/images/laptop-frames/final2_prob${3000 + i}.webp`),
  ...sequence(39, (i) => `/images/action-frames/laptop${pad2(i)}.webp`),
  ...sequence(70, (i) => `/images/peace/gia-peace${pad2(i)}.webp`),
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
