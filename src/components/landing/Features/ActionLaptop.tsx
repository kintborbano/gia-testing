'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { observeFrameLifecycle } from '@/lib/scroll/frameLifecycle';
import {
  getFrameImage,
  releaseFrames,
  pickFrames,
  prefersFrameEviction,
  ACTION_FRAMES_FULL,
  ACTION_FRAMES_SM,
} from '@/lib/preloadAssets';

// Laptop sequence for the "GIA in action" section, scrubbed by scroll. The
// laptop is PINNED (CSS sticky) while the section's tall track scrolls past, so
// it holds centred in the viewport and the scroll position drives the frame —
// same sticky-scrub model as the Features section.
// Files: public/images/action-frames/laptop-screen000.webp ... 136.webp
// (137-frame export, sampled by ACTION_FRAMES_* in preloadAssets; phones get
// the lighter `-sm` set). The maroon background is cut out to transparent
// (process-action-frames.cjs), so the laptop floats on the section's
// brand-primary fill. The canvas backing store keeps full-res dimensions on
// every device and drawImage scales the source into it — no hydration-sensitive
// size swap.
const FRAME_W = 1100;
const FRAME_H = 618;

// Sticky track height. The laptop pins for the middle of this scroll, which is
// where the scrub plays out (1 viewport enters before the pin, 1 scrolls the
// track past while pinned).
const TRACK_VH = 200;

// The laptop holds frame 0 (open report) while it rises into view, and only
// starts scrubbing once it's PINNED dead-centre. With a 200vh track + a
// viewport-tall sticky child, the pin engages at progress 0.5 (the track top
// reaches the viewport top) and releases at 1.0 — so the scrub lives entirely
// inside the pinned window [0.5 .. SCRUB_END], finishing (laptop closed) just
// before it unpins and scrolls away.
const SCRUB_START = 0.5;
const SCRUB_END = 0.95;

export default function ActionLaptop(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [posterReady, setPosterReady] = useState(false);
  // Device-appropriate frame list, resolved once (full on desktop/tablet, the
  // lighter `-sm` set on phones). Drives the URL list + count only, never markup.
  const [frames] = useState(() =>
    pickFrames(ACTION_FRAMES_FULL, ACTION_FRAMES_SM)
  );
  const frameCount = frames.length;

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Lazily decode the frames when the section nears the viewport (so drawImage is
  // instant during the scrub), and on touch devices RELEASE them once it scrolls
  // far away — re-acquiring on approach — so the landing's scrubbers don't all
  // pin their decoded bitmaps at once. Desktop loads once and keeps them warm.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let loaded = false;
    let revealed = false;
    let timeoutId: number | undefined;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      setPosterReady(true);
    };

    // Settle each frame on success OR failure (decode reject + onerror +
    // already-complete) so a rejected decode never leaves the canvas hidden.
    const onSettled = (i: number, ok: boolean) => {
      if (i === 0) {
        reveal();
        if (ok) drawFrame(0);
      }
      if (ok && i === currentFrameRef.current) drawFrame(i);
    };

    const acquire = () => {
      if (loaded) return;
      loaded = true;
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = getFrameImage(frames[i]);
        images.push(img);
        img.decode().then(
          () => onSettled(i, true),
          () => {
            if (img.complete) onSettled(i, img.naturalWidth > 0);
            else {
              img.onload = () => onSettled(i, true);
              img.onerror = () => onSettled(i, false);
            }
          }
        );
      }
      imagesRef.current = images;
      // Safety net: reveal the canvas even if the first frame stalls.
      timeoutId = window.setTimeout(reveal, 8000);
    };

    const release = () => {
      if (!loaded) return;
      loaded = false;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      imagesRef.current = [];
      currentFrameRef.current = -1; // force a redraw when re-acquired
      releaseFrames(frames);
    };

    return observeFrameLifecycle(canvas, {
      onApproach: acquire,
      onRecede: release,
      evict: prefersFrameEviction(),
    });
  }, [frames, frameCount]);

  // Scrub by the section track's progress through the viewport. 0 = track top at
  // viewport bottom (entering), 1 = track bottom at viewport top (leaving); the
  // laptop is pinned across the middle. Frame 0 is held until SCRUB_START, then
  // the sequence plays to the closed frame by SCRUB_END, then holds. Drawn
  // directly from the shared scroll ticker — no React state per frame.
  useEffect(() => {
    return subscribeScroll((scrollY) => {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const start = el.offsetTop - vh;
      const range = el.offsetHeight;
      const progress = Math.max(0, Math.min(1, (scrollY - start) / range));
      const scrub = Math.min(
        1,
        Math.max(0, (progress - SCRUB_START) / (SCRUB_END - SCRUB_START))
      );
      const index = Math.round(scrub * (frameCount - 1));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;
      drawFrame(index);
    });
  }, [frameCount]);

  return (
    // Tall track: the sticky child pins to the viewport while this scrolls past,
    // so the laptop holds centred and the scroll position scrubs the frames.
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${TRACK_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          aria-label="GIA in action"
          className="h-auto w-full max-w-[1100px]"
          style={{
            opacity: posterReady ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
