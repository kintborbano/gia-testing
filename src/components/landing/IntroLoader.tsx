'use client';

import { useEffect, useRef } from 'react';

// Two-part loader animation, drawn to a canvas. NOTE: the source folder names
// are reversed relative to playback role —
//   1. intro plays once   -> public/images/loader-loop/frameNN.webp
//   2. loop repeats while the page is loading -> public/images/loader-intro/frameNN.webp
// Frames are 600x600 transparent (shown on the white intro panel).
const INTRO_COUNT = 28;
const LOOP_COUNT = 85;
const FPS = 30;
const FRAME_MS = 1000 / FPS;
const FRAME_W = 600;
const FRAME_H = 600;

const introPath = (i: number) =>
  `/images/loader-loop/frame${String(i).padStart(2, '0')}.webp`;
const loopPath = (i: number) =>
  `/images/loader-intro/frame${String(i).padStart(2, '0')}.webp`;

interface Props {
  // True once the site is prepared. The loop keeps running until this flips.
  ready: boolean;
  // Called once the intro has played and the loop has finished a cycle while ready.
  onFinished: () => void;
}

export default function IntroLoader({
  ready,
  onFinished,
}: Props): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let finished = false;

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

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      onFinishedRef.current();
    };

    (async () => {
      // Decode the first frame ASAP for an instant poster, then the rest.
      const first = await loadDecode(introPath(0));
      if (cancelled) return;
      draw(first);

      const intro = [
        first,
        ...(await Promise.all(
          Array.from({ length: INTRO_COUNT - 1 }, (_, k) =>
            loadDecode(introPath(k + 1))
          )
        )),
      ];
      const loop = await Promise.all(
        Array.from({ length: LOOP_COUNT }, (_, k) => loadDecode(loopPath(k)))
      );
      if (cancelled) return;

      let introStart = 0;
      let loopStart = 0;
      let mode: 'intro' | 'loop' = 'intro';

      const tick = (now: number) => {
        if (cancelled || finished) return;
        if (introStart === 0) introStart = now;

        if (mode === 'intro') {
          const f = Math.floor((now - introStart) / FRAME_MS);
          if (f < INTRO_COUNT) {
            draw(intro[f]);
            raf = requestAnimationFrame(tick);
            return;
          }
          // Intro finished — switch to the loading loop.
          mode = 'loop';
          loopStart = now;
        }

        const total = Math.floor((now - loopStart) / FRAME_MS);
        const cycleFrame = ((total % LOOP_COUNT) + LOOP_COUNT) % LOOP_COUNT;
        draw(loop[cycleFrame]);
        // Once ready, end cleanly on the last frame of a completed loop cycle.
        if (
          readyRef.current &&
          total >= LOOP_COUNT - 1 &&
          cycleFrame === LOOP_COUNT - 1
        ) {
          finish();
          return;
        }
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
      aria-label="Loading"
      style={{ width: 'clamp(160px, 35vw, 380px)', height: 'auto' }}
    />
  );
}
