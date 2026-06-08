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
import { EXIT_EASING, WRAPPER_EXIT_DURATION } from '@/animations/introTiming';
import { stopLenis } from '@/lib/scroll/lenisControls';
import LoopLoader from './LoopLoader';

// Connected swipe — same stacked-document model as the intro. The loader panel
// and the page move together as one continuous document: on cover the current
// page slides up while the loader rises from below to take its place; on reveal
// the loader slides off the top while the destination rises into view. The
// reveal reuses the intro's easing/duration; the cover is a touch quicker.
const COVER_ENTER_DURATION = 650;

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

interface TransitionContextValue {
  // Begin a transition to `href`: cover with the loop, navigate, then reveal.
  navigate: (href: string) => void;
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const releaseScrollRef = useRef<(() => void) | null>(null);
  const pushedRef = useRef(false);
  // Animations on the persistent page wrapper must be cancelled by hand (the
  // element outlives the transition); overlay animations die with its unmount.
  const pageAnimRef = useRef<Animation | null>(null);

  const active = target !== null;
  // The new route is mounted once the live pathname matches the destination
  // path (query/hash stripped). This flips the loop into its finish cycle.
  const routeReady = target !== null && pathname === target.split(/[?#]/)[0];

  const navigate = useCallback((href: string) => {
    // Ignore re-entrant calls while a transition is already running.
    setTarget((current) => current ?? href);
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
  }, [target, router]);

  // Reveal: the loop has played a full cycle and the route is mounted — slide
  // the loader off the top (0 → -100vh) and the new page up into place
  // (100vh → 0) together, exactly like the intro reveal. The later animation
  // wins for `transform`, so the held cover frame needs no explicit cancel.
  const handleLoopFinished = useCallback(() => {
    const overlay = overlayRef.current;
    const page = pageRef.current;
    const cleanup = () => {
      pageAnimRef.current?.cancel();
      pageAnimRef.current = null;
      releaseScrollRef.current?.();
      releaseScrollRef.current = null;
      if (page) {
        page.style.transform = '';
        page.style.willChange = '';
      }
      setTarget(null);
    };
    if (!overlay || !page) {
      cleanup();
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
    revealOut.finished.catch(() => {}).finally(cleanup);
  }, []);

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
          // Starts off-screen below; the cover-in animation slides it up.
          style={{ transform: 'translateY(100vh)' }}
        >
          <LoopLoader ready={routeReady} onFinished={handleLoopFinished} />
        </div>
      )}
    </TransitionContext.Provider>
  );
}
