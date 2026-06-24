'use client';

import { useEffect, useRef } from 'react';

// Looping "GIA thinking" animation drawn to a canvas — the animated replacement
// for the static gia-thought-thinking.png on the loading screen. Same frame
// player as the intro/transition loaders, minus the finish logic: the loading
// screen unmounts this the moment the job is done, so the loop simply runs for
// as long as it's mounted. Frames are transparent WebP, ~400px wide; see
// scripts/build-thinking-frames.cjs for how they're generated.
const FRAME_COUNT = 241;
const FPS = 30;
const FRAME_MS = 1000 / FPS;
// Encoded frame size — 1200x1104 source downscaled to 400px wide.
const FRAME_W = 400;
const FRAME_H = 368;

const framePath = (i: number) =>
  `/images/thinking-loop/frame${String(i).padStart(3, '0')}.webp`;

export default function ThinkingLoader(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;

    const draw = (img: HTMLImageElement | undefined) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, FRAME_W, FRAME_H);
      ctx.drawImage(img, 0, 0, FRAME_W, FRAME_H);
    };

    const loadDecode = (path: string): Promise<HTMLImageElement> => {
      const img = new Image();
      img.src = path;
      return img.decode().then(
        () => img,
        () => img
      );
    };

    (async () => {
      // Decode the first frame ASAP for an instant poster, then the rest.
      const first = await loadDecode(framePath(0));
      if (cancelled) return;
      draw(first);

      const frames = [
        first,
        ...(await Promise.all(
          Array.from({ length: FRAME_COUNT - 1 }, (_, k) =>
            loadDecode(framePath(k + 1))
          )
        )),
      ];
      if (cancelled) return;

      let loopStart = 0;
      const tick = (now: number) => {
        if (cancelled) return;
        if (loopStart === 0) loopStart = now;
        const total = Math.floor((now - loopStart) / FRAME_MS);
        const frame = ((total % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
        draw(frames[frame]);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={FRAME_W}
      height={FRAME_H}
      aria-label="GIA, the SOFI AI analyst, thinking as she works"
      className="h-auto w-[260px] max-w-full sm:w-[300px] md:w-[330px]"
    />
  );
}
