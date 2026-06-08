'use client';

import { useEffect, useRef } from 'react';

// Loop-only frame player — the endless second half of the intro loader, reused
// as a page-transition cover. The loop frames live under
// public/images/loader-intro/ (the folder names are reversed relative to
// playback role; see IntroLoader). 600x600 transparent frames on white.
const LOOP_COUNT = 85;
const FPS = 60;
const FRAME_MS = 1000 / FPS;
const FRAME_W = 600;
const FRAME_H = 600;

const loopPath = (i: number) =>
  `/images/loader-intro/frame${String(i).padStart(2, '0')}.webp`;

interface Props {
  // Once true, the loop ends cleanly on the next completed cycle boundary, so
  // at least one full cycle always plays even if the route is ready instantly.
  ready: boolean;
  onFinished: () => void;
}

export default function LoopLoader({
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
      const first = await loadDecode(loopPath(0));
      if (cancelled) return;
      draw(first);

      const loop = [
        first,
        ...(await Promise.all(
          Array.from({ length: LOOP_COUNT - 1 }, (_, k) =>
            loadDecode(loopPath(k + 1))
          )
        )),
      ];
      if (cancelled) return;

      let loopStart = 0;

      const tick = (now: number) => {
        if (cancelled || finished) return;
        if (loopStart === 0) loopStart = now;

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
