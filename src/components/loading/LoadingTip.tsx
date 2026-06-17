'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { LOADING_TIPS, LOADING_CLOSING_TIP } from '@/lib/loadingTips';

// How long each tip holds before crossfading to the next, and how long the
// fade itself takes. The fade-out and fade-in share FADE_MS so the swap lands
// at the midpoint when the line is fully transparent — no flicker of two tips.
const TIP_MS = 6000;
const FADE_MS = 350;

// Render *single-asterisk* spans as italic emphasis, leaving the markers out of
// the visible copy. Mirrors report/Emphasis (which handles **bold**), but tips
// read better with a lighter italic touch.
function withEmphasis(tip: string): ReactElement {
  const parts = tip.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="font-medium text-white italic">
            {part}
          </em>
        ) : (
          part
        )
      )}
    </>
  );
}

// A quiet, rotating creator tip shown while GIA works. Once `closing` flips true
// (the job is wrapping up) it crossfades to LOADING_CLOSING_TIP and holds there
// — so the broadcast-channel line is reliably the last thing shown before the
// bar reaches 100%, on every loading screen.
export default function LoadingTip({
  closing = false,
}: {
  closing?: boolean;
}): ReactElement {
  const [tip, setTip] = useState(LOADING_TIPS[0]);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);

  // Rotate creator tips while loading. Skipped entirely once we're closing, so
  // the closing effect below owns the final line.
  useEffect(() => {
    if (closing) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let swap: ReturnType<typeof setTimeout>;

    const advance = () => {
      indexRef.current = (indexRef.current + 1) % LOADING_TIPS.length;
      setTip(LOADING_TIPS[indexRef.current]);
    };

    // Fade in a random opening tip on the next tick so repeat visitors don't
    // always start on #1 (the async hop also keeps setState out of the effect
    // body, which the lint rules flag as a cascading render).
    const open = setTimeout(() => {
      indexRef.current = Math.floor(Math.random() * LOADING_TIPS.length);
      setTip(LOADING_TIPS[indexRef.current]);
      setVisible(true);
    }, 0);

    const cycle = setInterval(() => {
      if (reduce) {
        advance();
        return;
      }
      setVisible(false);
      swap = setTimeout(() => {
        advance();
        setVisible(true);
      }, FADE_MS);
    }, TIP_MS);

    return () => {
      clearTimeout(open);
      clearInterval(cycle);
      clearTimeout(swap);
    };
  }, [closing]);

  // The guaranteed closing beat: crossfade to the broadcast-channel line and
  // hold it. Deferred to the next tick so the setState stays out of the effect
  // body (lint) and the fade-out reads cleanly.
  useEffect(() => {
    if (!closing) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let swap: ReturnType<typeof setTimeout>;

    const start = setTimeout(() => {
      if (reduce) {
        setTip(LOADING_CLOSING_TIP);
        setVisible(true);
        return;
      }
      setVisible(false);
      swap = setTimeout(() => {
        setTip(LOADING_CLOSING_TIP);
        setVisible(true);
      }, FADE_MS);
    }, 0);

    return () => {
      clearTimeout(start);
      clearTimeout(swap);
    };
  }, [closing]);

  return (
    <div
      aria-live="polite"
      className="flex min-h-[4.4em] max-w-[560px] flex-col items-center gap-1.5 px-2"
    >
      <span className="font-sans text-[10px] font-semibold tracking-[1.5px] text-[#eed03a]/75 uppercase">
        Creator tip
      </span>
      <p
        className="font-sans text-[13px] leading-[1.4] font-normal tracking-[-0.1px] text-balance text-white/80 sm:text-[14px]"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      >
        {withEmphasis(tip)}
      </p>
    </div>
  );
}
