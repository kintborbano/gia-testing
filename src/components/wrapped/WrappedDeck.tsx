'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { BEATS } from '@/components/wrapped/cards';
import type { Wrapped } from '@/types/wrapped';

const CANVAS_W = 400;
const CANVAS_H = 820;
// Exported share image is taller than the on-screen card so Instagram's top
// username overlay and bottom reply bar fall on safe bands, not on content.
const EXPORT_H = 908;
const SPEED = 6; // seconds per card
const TRANS = ['fade', 'zoom', 'rise', 'slide'] as const;

export default function WrappedDeck({
  data,
  onClose,
}: {
  data: Wrapped;
  onClose?: () => void;
}): React.ReactElement {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [settled, setSettled] = useState(false);
  const [scale, setScale] = useState(1);
  const [fluid, setFluid] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const last = BEATS.length - 1;

  const go = useCallback(
    (next: number, d: 'fwd' | 'back') => {
      const clamped = Math.max(0, Math.min(last, next));
      setDir(d);
      setIdx(clamped);
      setProgress(0);
      setSettled(false);
    },
    [last]
  );

  // Phones: the frame fills the viewport edge-to-edge (fluid) and the card's
  // flex column + spacers reflow to the height — no scaling, so no side/letterbox
  // bars. Desktop/tablet: contain a fixed phone frame, capped at 1.
  // visualViewport (not innerHeight) is the area actually visible behind mobile
  // browser toolbars, so bottom controls stay on-screen.
  useEffect(() => {
    const fit = () => {
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      const vh = vv?.height ?? window.innerHeight;
      const isMobile = vw < 600;
      setFluid(isMobile);
      setScale(
        isMobile ? 1 : Math.min(1, (vh - 40) / CANVAS_H, (vw - 40) / CANVAS_W)
      );
    };
    fit();
    window.addEventListener('resize', fit);
    window.visualViewport?.addEventListener('resize', fit);
    window.visualViewport?.addEventListener('scroll', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.visualViewport?.removeEventListener('resize', fit);
      window.visualViewport?.removeEventListener('scroll', fit);
    };
  }, []);

  // Settle guarantee: after ~1.2s the active card is forced to final state so
  // any capture/screenshot path shows fully-painted content.
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 1200);
    return () => clearTimeout(t);
  }, [idx]);

  // rAF-driven auto-advance + progress bar (pause-accurate).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: longer dwell, no animated bar fill.
      const t = setTimeout(() => {
        if (idx < last) go(idx + 1, 'fwd');
      }, SPEED * 1000);
      return () => clearTimeout(t);
    }
    let raf = 0;
    let prev = performance.now();
    let p = 0;
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      if (!pausedRef.current) {
        p += dt / SPEED;
        if (p >= 1) {
          setProgress(1);
          if (idx < last) go(idx + 1, 'fwd');
          return; // stop; effect re-runs for the next card (or holds on finale)
        }
        setProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, last, go]);

  const setPause = (v: boolean) => {
    pausedRef.current = v;
    setPaused(v);
  };

  // Tap zone: quick tap = nav (left third = prev), hold = pause.
  const downAt = useRef(0);
  const onPointerDown = () => {
    downAt.current = performance.now();
    setPause(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setPause(false);
    const held = performance.now() - downAt.current;
    if (held < 240) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      if (x < 0.32) go(idx - 1, 'back');
      else go(idx + 1, 'fwd');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') go(idx + 1, 'fwd');
      else if (e.key === 'ArrowLeft') go(idx - 1, 'back');
      else if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, go, onClose]);

  const [exporting, setExporting] = useState(false);
  // Exports the beat the user is currently viewing — captured from an off-screen,
  // unscaled, fully-settled clone of the active card so the image matches the page
  // on screen. Tries the native share sheet first (→ IG Stories on mobile), falls
  // back to a PNG download.
  const share = async () => {
    if (!shareRef.current || exporting) return;
    setPause(true);
    setExporting(true);
    try {
      const opts = {
        pixelRatio: 3,
        cacheBust: true,
        width: CANVAS_W,
        height: EXPORT_H,
      };
      // Warm-up pass: html-to-image's first capture frequently drops webfonts
      // and not-yet-decoded images (the QR), so the real capture is the second.
      await toBlob(shareRef.current, opts);
      const blob = await toBlob(shareRef.current, opts);
      if (!blob) return;
      const file = new File(
        [blob],
        `gia-wrapped-${data.handle.replace('@', '')}.png`,
        {
          type: 'image/png',
        }
      );
      const canShareFiles =
        typeof navigator !== 'undefined' &&
        !!navigator.canShare &&
        navigator.canShare({ files: [file] });
      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: 'My GIA Wrapped',
          text: 'GIA read my hooks. what’s your creator type? gia.sofi.ai',
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // best-effort; user can still screen-capture
    } finally {
      setExporting(false);
      setPause(false);
    }
  };

  const beat = BEATS[idx];
  const trans = TRANS[idx % TRANS.length];
  const isFinale = idx === last;

  return (
    <div className="gw gw-stage">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 80,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(254,247,221,.1)',
            color: '#fef7dd',
            border: '1px solid rgba(254,247,221,.2)',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      )}

      <button
        className="gw-nav"
        style={{ left: 'max(12px, calc(50% - 260px))' }}
        onClick={() => go(idx - 1, 'back')}
        disabled={idx === 0}
        aria-label="Previous"
      >
        ‹
      </button>

      <div
        ref={frameRef}
        className="gw-frame"
        style={
          fluid
            ? {
                width: '100dvw',
                height: '100dvh',
                transform: 'none',
                borderRadius: 0,
                boxShadow: 'none',
              }
            : { transform: `scale(${scale})` }
        }
      >
        <div className="gw-progress">
          {BEATS.map((b, i) => (
            <span key={b.key} className="gw-seg">
              <i
                style={{
                  ['--p' as string]: i < idx ? 1 : i === idx ? progress : 0,
                }}
              />
            </span>
          ))}
        </div>

        <div
          key={idx}
          className="card"
          data-active
          data-theme={beat.theme}
          data-trans={trans}
          data-dir={dir === 'back' ? 'back' : undefined}
          {...(settled ? { 'data-settled': '' } : {})}
        >
          <beat.render w={data} />
          {/* Per-page watermark so any single screenshot stays branded. */}
          <span className="gw-watermark">{data.handle} · gia wrapped</span>
        </div>

        <div
          className="gw-tap"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setPause(false)}
        />

        <div className="gw-action">
          {isFinale && (
            <button
              className="gw-pill"
              onClick={(e) => {
                e.stopPropagation();
                go(0, 'fwd');
              }}
            >
              ↺ Replay
            </button>
          )}
          <button
            className="gw-pill"
            disabled={exporting}
            onClick={(e) => {
              e.stopPropagation();
              share();
            }}
          >
            {exporting ? 'Preparing…' : '↗ Share my card'}
          </button>
        </div>
      </div>

      {/* Off-screen, unscaled, fully-settled clone of the CURRENT beat — the image
          Save/Share exports, so it matches the page on screen. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={shareRef}
          className="gw-frame"
          style={{
            width: CANVAS_W,
            height: EXPORT_H,
            transform: 'none',
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          <div
            className="card"
            data-active
            data-settled
            data-theme={beat.theme}
            // Extra top/bottom safe bands for the exported image so Instagram's
            // username overlay (top) and reply bar (bottom) don't cover content.
            style={{ padding: '150px 34px 150px' }}
          >
            <beat.render w={data} />
            <span className="gw-watermark">{data.handle} · gia wrapped</span>
          </div>
        </div>
      </div>

      <button
        className="gw-nav"
        style={{ right: 'max(12px, calc(50% - 260px))' }}
        onClick={() => go(idx + 1, 'fwd')}
        disabled={idx === last}
        aria-label="Next"
      >
        ›
      </button>

      {paused && null}
    </div>
  );
}
