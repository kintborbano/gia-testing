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

// Laptop-opening frames for the "GIA in action" section, scrubbed by scroll.
// Files: public/images/action-frames/laptop00.webp ... laptop38.webp (frame
// list owned by ACTION_FRAMES_* in preloadAssets; phones get the lighter `-sm`
// set). The canvas backing store keeps the full-res dimensions on every device
// and drawImage scales the source into it — no hydration-sensitive size swap.
// Downscaled from 4K to display resolution; the red background is baked in and
// matches the section, so no transparency/cut-out is needed here.
const FRAME_W = 1280;
const FRAME_H = 720;

// Keep the laptop closed until halfway through the section, then open it fast
// over a short slice of progress so the open state is the highlight and the
// whole open finishes well before the section scrolls away (i.e. stays seen).
const OPEN_START = 0.5;
const OPEN_DURATION = 0.2;

export default function ActionLaptop(): React.ReactElement {
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

  // Scrub by the canvas's travel through the viewport (no pinning, so the page
  // keeps scrolling): 0 = top at viewport bottom, 1 = bottom at viewport top,
  // 0.5 = centred. Closed until OPEN_START, then a fast open across
  // OPEN_DURATION, then held open. Drawn directly from the shared scroll ticker
  // — no React state per frame.
  useEffect(() => {
    return subscribeScroll(() => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (vh - rect.top) / (vh + rect.height))
      );
      const scrub = Math.min(
        1,
        Math.max(0, (progress - OPEN_START) / OPEN_DURATION)
      );
      const index = Math.round(scrub * (frameCount - 1));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;
      drawFrame(index);
    });
  }, [frameCount]);

  return (
    <canvas
      ref={canvasRef}
      width={FRAME_W}
      height={FRAME_H}
      aria-label="GIA in action"
      className="h-auto w-full max-w-[1100px]"
      style={{ opacity: posterReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
    />
  );
}
