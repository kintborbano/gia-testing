'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { getFrameImage, ACTION_FRAMES } from '@/lib/preloadAssets';

// Laptop-opening frames for the "GIA in action" section, scrubbed by scroll.
// Files: public/images/action-frames/laptop00.webp ... laptop38.webp (frame
// list owned by ACTION_FRAMES in preloadAssets).
// Downscaled from 4K to display resolution; the red background is baked in and
// matches the section, so no transparency/cut-out is needed here.
const FRAME_COUNT = ACTION_FRAMES.length;
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

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
  };

  // Lazily preload + decode the frames once the section nears the viewport.
  // Decoding up front keeps drawImage instant during the scroll scrub.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let timeoutId: number | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        let revealed = false;
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

        const images: HTMLImageElement[] = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
          // Shared with the loader's preload — decoded and held once.
          const img = getFrameImage(ACTION_FRAMES[i]);
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
      },
      { rootMargin: '100% 0px' } // begin ~1 viewport early
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

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
      const index = Math.round(scrub * (FRAME_COUNT - 1));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;
      drawFrame(index);
    });
  }, []);

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
