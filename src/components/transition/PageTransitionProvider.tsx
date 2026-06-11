'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  EXIT_EASING,
  FLOOD_DURATION,
  FLOOD_EASING,
  WRAPPER_EXIT_DURATION,
} from '@/animations/introTiming';
import { stopLenis } from '@/lib/scroll/lenisControls';
import { BRAND } from '@/styles/palette';
import LoopLoader from './LoopLoader';

// Connected swipe — same stacked-document model as the intro. The loader panel
// and the page move together as one continuous document: on cover the current
// page slides up while the loader rises from below to take its place; on reveal
// the loader slides off the top while the destination rises into view. The
// reveal reuses the intro's easing/duration; the cover is a touch quicker.
const COVER_ENTER_DURATION = 650;

// Flood reveal: the maroon cover and the loading screen behind it are the same
// colour, and the destination is already in place — so there's nothing to swipe.
// The cover just fades out, letting the loading screen's content simply appear.
const FLOOD_REVEAL_DURATION = 400;

// Where a flood transition originates, in viewport coordinates.
interface FloodOrigin {
  x: number;
  y: number;
}

// Radius that guarantees a disc centred at (x, y) covers the whole viewport:
// the distance from the origin to its farthest corner.
function floodRadius({ x, y }: FloodOrigin): number {
  const dx = Math.max(x, window.innerWidth - x);
  const dy = Math.max(y, window.innerHeight - y);
  return Math.hypot(dx, dy);
}

// Freeze scrolling in place for the duration of the transition. Unlike the
// intro's lock, this must NOT reset to the top: the current page stays visible
// as it slides up, so a scrollTo(0,0) would flash a jump.
function freezeScroll(): () => void {
  const { documentElement: html, body } = document;
  const prevHtml = html.style.overflow;
  const prevBody = body.style.overflow;
  stopLenis();
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  return () => {
    html.style.overflow = prevHtml;
    body.style.overflow = prevBody;
  };
}

interface NavigateOptions {
  // Paint-bucket variant: a maroon disc floods out from this viewport point to
  // cover the screen, then the connected swipe reveals the destination. Without
  // it, the default white loop-loader cover runs instead.
  flood?: FloodOrigin;
}

interface TransitionContextValue {
  // Begin a transition to `href`: cover (loop or flood), navigate, then reveal.
  navigate: (href: string, options?: NavigateOptions) => void;
  // True while a transition is on screen (cover → loop → reveal).
  active: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition(): TransitionContextValue {
  // No-op fallback so consumers stay safe if rendered outside the provider.
  return useContext(TransitionContext) ?? { navigate: () => {}, active: false };
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  // The destination href, or null when idle. Drives the whole transition.
  const [target, setTarget] = useState<string | null>(null);
  // Origin of the paint-bucket flood, or null for the default loop cover.
  const [flood, setFlood] = useState<FloodOrigin | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const releaseScrollRef = useRef<(() => void) | null>(null);
  const pushedRef = useRef(false);
  // Guards against re-entrant navigate() calls for the whole transition; reset
  // in the reveal cleanup once we're idle again.
  const runningRef = useRef(false);
  // Animations on the persistent page wrapper must be cancelled by hand (the
  // element outlives the transition); overlay animations die with its unmount.
  const pageAnimRef = useRef<Animation | null>(null);

  const active = target !== null;
  // The new route is mounted once the live pathname matches the destination
  // path (query/hash stripped). This flips the loop into its finish cycle.
  const routeReady = target !== null && pathname === target.split(/[?#]/)[0];

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    // Ignore re-entrant calls while a transition is already running.
    if (runningRef.current) return;
    runningRef.current = true;
    setFlood(options?.flood ?? null);
    setTarget(href);
  }, []);

  // Cover: slide the current page up (-100vh) and the loader up from below
  // (100vh → 0) as one unit. Once covered, park the page just below the fold
  // and swap the route there so it's staged to be revealed.
  useEffect(() => {
    if (target === null) return;
    const overlay = overlayRef.current;
    const page = pageRef.current;
    if (!overlay || !page) return;

    releaseScrollRef.current = freezeScroll();
    pushedRef.current = false;
    overlay.style.willChange = 'transform';
    page.style.willChange = 'transform';

    // Flood cover: the page holds still while a maroon disc spreads out from the
    // click origin to fill the screen. Once it has, park the page below the fold
    // and swap the route — staged for the connected swipe to reveal it (driven
    // by the routeReady effect below, since there's no loop loader to finish).
    if (flood) {
      overlay.style.willChange = 'clip-path';
      const r = floodRadius(flood);
      const floodIn = overlay.animate(
        [
          { clipPath: `circle(0px at ${flood.x}px ${flood.y}px)` },
          { clipPath: `circle(${r}px at ${flood.x}px ${flood.y}px)` },
        ],
        { duration: FLOOD_DURATION, easing: FLOOD_EASING, fill: 'forwards' }
      );
      floodIn.finished
        .catch(() => {})
        .finally(() => {
          if (pushedRef.current) return;
          pushedRef.current = true;
          // No park below the fold: the destination is itself maroon, so it
          // renders exactly where it belongs under the identical-coloured cover,
          // ready to be revealed by a simple fade rather than a swipe.
          router.push(target);
        });
      return () => {
        floodIn.cancel();
      };
    }

    const timing = {
      duration: COVER_ENTER_DURATION,
      easing: EXIT_EASING,
      fill: 'forwards' as const,
    };
    const pageOut = page.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-100vh)' }],
      timing
    );
    const coverIn = overlay.animate(
      [{ transform: 'translateY(100vh)' }, { transform: 'translateY(0)' }],
      timing
    );
    pageAnimRef.current = pageOut;

    coverIn.finished
      .catch(() => {})
      .finally(() => {
        if (pushedRef.current) return;
        pushedRef.current = true;
        // Park the page below the fold (hidden under the opaque cover) before
        // navigating, so the destination renders there ready to rise up.
        pageOut.cancel();
        page.style.transform = 'translateY(100vh)';
        router.push(target);
      });

    return () => {
      pageOut.cancel();
      coverIn.cancel();
    };
  }, [target, router, flood]);

  // Reveal: the cover is fully on screen and the route is mounted — slide the
  // cover off the top (0 → -100vh) and the new page up into place (100vh → 0)
  // together, exactly like the intro reveal. The later animation wins for
  // `transform`, so the held cover frame needs no explicit cancel.
  // Reset every transition handle back to idle. Shared by both reveal paths.
  const finishTransition = useCallback(() => {
    const page = pageRef.current;
    pageAnimRef.current?.cancel();
    pageAnimRef.current = null;
    releaseScrollRef.current?.();
    releaseScrollRef.current = null;
    if (page) {
      page.style.transform = '';
      page.style.willChange = '';
    }
    runningRef.current = false;
    setFlood(null);
    setTarget(null);
  }, []);

  const handleLoopFinished = useCallback(() => {
    const overlay = overlayRef.current;
    const page = pageRef.current;
    if (!overlay || !page) {
      finishTransition();
      return;
    }
    const timing = {
      duration: WRAPPER_EXIT_DURATION,
      easing: EXIT_EASING,
      fill: 'forwards' as const,
    };
    const pageIn = page.animate(
      [{ transform: 'translateY(100vh)' }, { transform: 'translateY(0)' }],
      timing
    );
    pageAnimRef.current = pageIn;
    const revealOut = overlay.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-100vh)' }],
      timing
    );
    revealOut.finished.catch(() => {}).finally(finishTransition);
  }, [finishTransition]);

  // Flood reveal: the destination loading screen is already in place behind an
  // identical-maroon cover, so there's nothing to swipe. Fade the cover out and
  // its content simply appears against the unchanging maroon.
  const handleFloodReveal = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      finishTransition();
      return;
    }
    overlay.style.willChange = 'opacity';
    const fadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FLOOD_REVEAL_DURATION,
      easing: 'ease-out',
      fill: 'forwards' as const,
    });
    fadeOut.finished.catch(() => {}).finally(finishTransition);
  }, [finishTransition]);

  // Flood transitions have no loop loader to signal completion, so the reveal is
  // driven by the route mounting under the maroon cover: as soon as it's there,
  // fade the cover away. (The default loop cover instead reveals from
  // LoopLoader.onFinished with a swipe.)
  useEffect(() => {
    if (!flood || !routeReady || !pushedRef.current) return;
    const id = requestAnimationFrame(() => handleFloodReveal());
    return () => cancelAnimationFrame(id);
  }, [flood, routeReady, handleFloodReveal]);

  return (
    <TransitionContext.Provider value={{ navigate, active }}>
      {/* Idle: `contents` generates no box, so the page keeps `<body>` as its
          flex parent (the form's flex-1 fill depends on it). During a
          transition the wrapper becomes a real flex column — mirroring the
          body's role so layout is unchanged — that we can transform. */}
      <div
        ref={pageRef}
        className={active ? 'flex min-h-full flex-1 flex-col' : 'contents'}
      >
        {children}
      </div>
      {active && (
        <div
          ref={overlayRef}
          className="page-transition-overlay"
          style={
            flood
              ? {
                  // Sits over the viewport, maroon, clipped to a zero-radius disc
                  // at the origin; the flood animation grows it to full screen.
                  transform: 'translateY(0)',
                  backgroundColor: BRAND.primary,
                  clipPath: `circle(0px at ${flood.x}px ${flood.y}px)`,
                }
              : // Starts off-screen below; the cover-in animation slides it up.
                { transform: 'translateY(100vh)' }
          }
        >
          {/* The flood's destination is itself a maroon loading screen, so it
              needs no loop loader — the maroon plane holds, then fades away. */}
          {!flood && (
            <LoopLoader ready={routeReady} onFinished={handleLoopFinished} />
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
}
