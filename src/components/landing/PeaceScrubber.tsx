'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { observeFrameLifecycle } from '@/lib/scroll/frameLifecycle';
import {
  getFrameImage,
  releaseFrames,
  pickFrames,
  prefersFrameEviction,
  PEACE_FRAMES_FULL,
  PEACE_FRAMES_SM,
} from '@/lib/preloadAssets';

// Peace-sign / wink animation for the CTA, scrubbed by scroll.
// Files: public/images/peace/gia-peace00.webp ... gia-peace69.webp (frame list
// owned by PEACE_FRAMES_* in preloadAssets; phones get the lighter `-sm` set,
// which keeps the same 1000px resolution and only cuts the frame count).
// Downscaled from 1764px; the white background matches the white CTA section,
// so no cut-out is needed.
const FRAME_W = 1000;
const FRAME_H = 667;

export default function PeaceScrubber(): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [posterReady, setPosterReady] = useState(false);
  // Device-appropriate frame list, resolved once (full on desktop/tablet, the
  // lighter `-sm` set on phones). Drives the URL list + count only, never markup.
  const [frames] = useState(() =>
    pickFrames(PEACE_FRAMES_FULL, PEACE_FRAMES_SM)
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

  // Lazily decode the frames when the CTA nears the viewport (so the scrub never
  // blocks on a synchronous decode), and on touch devices RELEASE them once it
  // scrolls far away — re-acquiring on approach — so the landing's scrubbers
  // don't all pin their decoded bitmaps at once. Desktop loads once, keeps warm.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

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

    return observeFrameLifecycle(wrap, {
      onApproach: acquire,
      onRecede: release,
      evict: prefersFrameEviction(),
    });
  }, [frames, frameCount]);

  // Scrub by the wrapper's travel through the viewport (no pinning, so the page
  // keeps scrolling): 0 = top at viewport bottom, 1 = bottom at viewport top.
  // Drawn directly from the shared scroll ticker — no React state per frame.
  useEffect(() => {
    return subscribeScroll(() => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const index = Math.round(p * (frameCount - 1));
      if (index === currentFrameRef.current) return;
      currentFrameRef.current = index;
      drawFrame(index);
    });
  }, [frameCount]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        aria-label="GIA holding a phone on a ringlight"
        className="h-auto w-full"
        style={{
          opacity: posterReady ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
