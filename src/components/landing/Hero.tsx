'use client';

import HeroBubbles from '@/components/ui/HeroBubbles';
import type { CSSProperties } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import {
  SCROLL_RANGE,
  getLeftChibiStyle,
  getRightChibiStyle,
  getSpeechBubbleOpacity,
} from '@/animations/chibiAnimations';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

const FLOAT_BASE: CSSProperties = {
  animationName: 'chibi-float',
  animationDuration: '2s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
  willChange: 'transform',
};

type HeroProps = {
  showBubbles?: boolean;
};

export default function Hero({
  showBubbles = true,
}: HeroProps = {}): React.ReactElement {
  const t = useScrollProgress(0, SCROLL_RANGE);
  const bubbleOpacity = getSpeechBubbleOpacity(t);

  return (
    <section
      id="bg-stop-hero"
      className="relative flex items-center justify-center overflow-hidden px-16"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_LARGE}px)` }}
    >
      {/* Left chibi — hidden for now */}
      {false && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: 280,
            marginTop: -210,
            zIndex: 20,
          }}
        >
          <div style={getLeftChibiStyle(t)}>
            <div style={{ ...FLOAT_BASE, animationDelay: '0s' }}>
              <div
                style={{
                  width: 280,
                  height: 420,
                  background: '#8c1f2e',
                  borderRadius: 16,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right chibi — hidden for now */}
      {false && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            width: 280,
            marginTop: -210,
            zIndex: 20,
          }}
        >
          <div style={getRightChibiStyle(t)}>
            <div style={{ ...FLOAT_BASE, animationDelay: '0.3s' }}>
              <div
                style={{
                  width: 280,
                  height: 420,
                  background: '#fef7dd',
                  borderRadius: 16,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className="relative z-10 flex w-[1152px] max-w-full flex-col items-center justify-center py-10"
        style={{ marginBottom: HEADER_HEIGHT_LARGE }}
      >
        <div className="text-brand-primary flex w-full flex-col items-center justify-center gap-10 text-center">
          <h1 className="font-young-serif text-[56px] leading-[1.1] tracking-[-1.12px]">
            your tiktok finally has
            <br />
            someone watching...
          </h1>
          <p className="font-sans text-[20px] leading-[1.25] font-medium tracking-[-0.12px]">
            GIA watches your content, reads your comments, studies your
            patterns,
            <br />
            and tells you exactly what to post next.
          </p>

          {/* Design calls for Instrument Sans Bold (700); only 400/600 are loaded — falls back to 600 */}
          <div className="flex items-center justify-center gap-[34px]">
            <button
              type="button"
              className="border-brand-primary text-brand-primary flex h-[60px] w-[266px] items-center justify-center rounded-[34px] border bg-white font-sans text-[16px] font-bold tracking-[-0.32px] shadow-[5px_5px_5px_0px_var(--brand-primary)]"
            >
              ANALYZE MY TIKTOK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
            </button>
            <button
              type="button"
              className="border-brand-primary bg-brand-primary flex h-[60px] w-[266px] items-center justify-center rounded-[34px] border font-sans text-[16px] font-bold tracking-[-0.32px] text-white"
            >
              SEE HOW IT WORKS
            </button>
          </div>

          <p className="font-sans text-[14px] leading-[1.4] tracking-[-0.08px]">
            used by creators, founders, students, freelancers, and
            <br />
            people secretly stalking their own account from a burner account.
          </p>
        </div>
      </div>

      {false && showBubbles && <HeroBubbles opacity={bubbleOpacity} />}
    </section>
  );
}
