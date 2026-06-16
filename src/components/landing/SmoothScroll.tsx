'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '@/stores/lenisStore';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // DON'T hijack scrolling on inputs that are already smooth — JS re-driving an
    // already-smooth input is what made scrolling feel laggy on WebKit. Two cases:
    //   - Touch (pointer: coarse — iPhone, iPad, Android): `syncTouch` fought the
    //     native momentum/rubber-band engine. Off → fully native, GPU-smooth.
    //   - Apple desktop (Mac trackpad / Magic Mouse): these emit fine-grained
    //     momentum wheel events that macOS already animates; Lenis `smoothWheel`
    //     only adds a competing JS-driven layer (the same double-drive, the cause
    //     of the MacBook lag). Off → native trackpad scrolling.
    // Windows/Linux mouse wheels are coarse/stepped and genuinely benefit from
    // easing, so smoothWheel stays ON there (those devices already feel fine).
    // Lenis.scrollTo still eases nav jumps everywhere; the scroll ticker polls
    // window.scrollY per frame, so the scrubbers/background stay smooth natively.
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const platform =
      typeof navigator !== 'undefined' ? (navigator.platform ?? '') : '';
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches;
    const isApple =
      /Mac|iPhone|iPad|iPod/.test(platform) || /Macintosh/.test(ua);
    const smoothWheel = !isTouch && !isApple;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel,
      lerp: 0.06,
      wheelMultiplier: 1,
      syncTouch: false,
      syncTouchLerp: 0.08,
      touchMultiplier: 1,
    });

    setLenisInstance(lenis);

    // ── Wheel inertia must YIELD to any other scroll input, never fight it ──
    // A smooth-wheel scroll keeps animating for ~1s after the last wheel tick
    // (lerp 0.06). While that animation runs Lenis IGNORES native scroll events
    // and keeps writing window.scrollTo() toward the old wheel target every
    // frame. So wheeling and then immediately grabbing the scrollbar puts two
    // writers in a tug-of-war over the scroll position — the page yanks back
    // toward the wheel target each frame (the reported flicker in Features /
    // Action / How). The guards below kill the in-flight animation the moment a
    // competing scroll source appears; wheel inertia itself is untouched.
    //
    // stop()+start() is the public-API equivalent of Lenis's internal reset():
    // it cancels the animation and resyncs animatedScroll/targetScroll to
    // wherever the page actually is. Stateless — nothing to latch or release,
    // so a missed release event can never leave scrolling broken. Never run it
    // while Lenis is deliberately stopped (intro lock, menu overlay): start()
    // would undo that lock.
    const yieldToNativeScroll = (): void => {
      if (lenis.isStopped) return;
      lenis.stop();
      lenis.start();
    };

    // Guard 1 — scrollbar grab. A press in the reserved vertical-scrollbar
    // gutter (clientX at/past clientWidth; globals.css keeps `overflow-y:
    // scroll`, so the gutter exists on every page) kills the inertia at grab
    // time, before the thumb even moves. This MUST be mousedown: Chromium
    // dispatches mouse events for native-scrollbar presses but NOT pointer
    // events, so a pointerdown listener never fires for a real scrollbar grab
    // (synthetic/test input fires both — easy to be fooled). On platforms with
    // overlay scrollbars there is no gutter (clientWidth === innerWidth) and
    // this never fires; Guard 2 covers those.
    const onGutterPress = (event: MouseEvent): void => {
      if (event.clientX >= document.documentElement.clientWidth) {
        yieldToNativeScroll();
      }
    };

    // Guard 2 — competing-writer detection, the catch-all that needs no grab
    // event at all. While a smooth animation runs, Lenis's own writes keep
    // window.scrollY within ~1px of its animatedScroll. A scroll event landing
    // further away can only come from another writer — a scrollbar drag or
    // track click, keyboard paging, find-in-page — so the inertia yields to it.
    const onExternalScroll = (): void => {
      if (lenis.isScrolling !== 'smooth') return;
      if (Math.abs(window.scrollY - lenis.animatedScroll) > 8) {
        yieldToNativeScroll();
      }
    };

    window.addEventListener('mousedown', onGutterPress, true);
    window.addEventListener('scroll', onExternalScroll, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onGutterPress, true);
      window.removeEventListener('scroll', onExternalScroll);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
