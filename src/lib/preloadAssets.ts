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

// Hold references so the browser keeps the fetched resources cached; the
// scrubber components then load the same URLs instantly from cache.
const held: HTMLImageElement[] = [];

let promise: Promise<void> | null = null;

/** Preload (download) every critical frame so nothing pops in after reveal. */
export function preloadCriticalAssets(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (promise) return promise;

  promise = Promise.all(
    CRITICAL_URLS.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          held.push(img);
          // Resolve on success or failure — never block readiness on one asset.
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  ).then(() => undefined);

  return promise;
}
