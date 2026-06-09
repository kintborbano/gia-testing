'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useInSection } from '@/hooks/useInSection';
import { useNavWrapDetection } from '@/hooks/useNavWrapDetection';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { scrollToHashTarget, scrollToTop } from '@/lib/scroll/navScroll';
import { startLenis, stopLenis } from '@/lib/scroll/lenisControls';
import {
  EXIT_EASING,
  FLOOD_DURATION,
  FLOOD_EASING,
} from '@/animations/introTiming';
import {
  HEADER_HEIGHT_LARGE,
  HEIGHT_SMALL,
  SCROLL_RANGE,
} from '@/animations/headerAnimations';
import {
  getPageColorsServerSnapshot,
  getPageColorsSnapshot,
  subscribeToPageColors,
} from '@/stores/pageBackgroundStore';
import GiaLogo from '@/components/ui/GiaLogo';
import PoweredByPill from '@/components/ui/PoweredByPill';
import Button from '@/components/ui/Button';
import { usePageTransition } from '@/components/transition/PageTransitionProvider';

type NavLink = {
  label: string;
  // A leading-hash href (e.g. '#features-section') targets a section on the
  // landing page: it scrolls in place when already on '/', and routes home
  // first (then scrolls on arrival) from any other page.
  href: string;
};

const NAV_LINKS: readonly NavLink[] = [
  { label: 'PRODUCT', href: '#features-section' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  { label: 'ABOUT US', href: '/about' },
];

// The fullscreen mobile menu lists the same routes plus the primary CTA, which
// appears here as a plain text link (not the desktop pill) per the Figma menu.
const MOBILE_NAV_LINKS: readonly NavLink[] = [
  ...NAV_LINKS,
  { label: 'ANALYZE MY TIKTOK', href: '/form' },
];

// Color is intentionally omitted — links inherit the header's `currentColor`
// so they tint with the active section's foreground.
const linkClassName =
  'font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold';

// Typography for the fullscreen mobile menu items: centered white bold text
// matching the Figma design, in fixed-height rows.
const mobileLinkClassName =
  'font-sans text-[15px] font-bold tracking-[-0.075px] text-white transition-opacity hover:opacity-70';

// Close choreography: the X spins away while the maroon flood drains (both start
// together), then the bare header slides back in like the intro reveal. The
// close starts from an exact screen-covering disc (no off-screen overshoot) and
// retracts at a constant rate, so it begins on frame one and finishes cleanly —
// no slow tail, no "wait". A touch quicker than the open so it feels snappy.
const FLOOD_CLOSE_DURATION = 420;
const HEADER_REENTRY_MS = 700;

// Radius that guarantees a disc centred at (x, y) covers the whole viewport —
// the distance from the origin to its farthest corner.
function floodRadius(x: number, y: number): number {
  const dx = Math.max(x, window.innerWidth - x);
  const dy = Math.max(y, window.innerHeight - y);
  return Math.hypot(dx, dy);
}

// Phases of the header's post-close re-entrance. `hidden` parks it off-screen
// with no transition; `sliding` eases it back down; `idle` is normal behaviour.
type HeaderEntry = 'idle' | 'hidden' | 'sliding';

// One nav entry. A hash target points at a landing-page section: on '/' it
// scrolls in place through Lenis (eased like the Hero's "see how it works"
// link — a native anchor jump bypasses Lenis and hard-cuts); from any other
// page it routes to '/<hash>' so the landing page scrolls there on arrival.
// Plain routes use next/link. Shared by the desktop and mobile menus.
function NavItem({
  href,
  label,
  className = '',
  baseClassName = linkClassName,
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  /** Typography/color base; defaults to the desktop nav style. */
  baseClassName?: string;
  /** Receives the click event; calling preventDefault takes over navigation
   *  entirely (the mobile menu uses this to defer nav until it has closed). */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}): React.ReactElement {
  const pathname = usePathname();
  const classes = `${baseClassName} ${className}`.trim();
  const isHash = href.startsWith('#');
  const onLanding = pathname === '/';

  // Same-page hash click: let the handler run first — if it took over (the
  // mobile menu defers nav until close), bail; otherwise ease to the section
  // via Lenis instead of jumping.
  const handleHashClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (scrollToHashTarget(href)) {
      event.preventDefault();
    }
  };

  if (isHash && onLanding) {
    return (
      <a href={href} className={classes} onClick={handleHashClick}>
        {label}
      </a>
    );
  }

  // From another page a hash target must first route home; everywhere else is
  // a plain route. `/${'#features-section'}` → '/#features-section'.
  const linkHref = isHash ? `/${href}` : href;
  return (
    <Link href={linkHref} className={classes} onClick={onClick}>
      {label}
    </Link>
  );
}

export default function StickyHeader(): React.ReactElement {
  // Two-state collapse: full height until scrolled past SCROLL_RANGE, then the
  // small height — animated by a CSS transition. Tracking a boolean (not a
  // per-frame progress value) means the header re-renders only when it flips,
  // not on every scroll frame.
  const [scrolled, setScrolled] = useState(false);
  // `menuOpen` is the intent (driven by the toggle); `menuMounted` keeps the
  // overlay in the DOM through its closing flood so it can contract before it
  // unmounts.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  // Drives the header's slide-back-in after the closing flood drains.
  const [headerEntry, setHeaderEntry] = useState<HeaderEntry>('idle');
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // A nav target captured from an overlay link, fired only once the close
  // choreography (flood retract + header slide-in) has fully played out — so a
  // cached/prefetched route can't swap the page out mid-animation.
  const pendingNavRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { active: transitioning } = usePageTransition();
  // Collapse to the hamburger header the moment the full nav row would wrap —
  // catching the lower end of the tablet range where it runs out of horizontal
  // room — instead of relying on a fixed pixel breakpoint. The `md:` classes
  // below stay as the phone/desktop baseline; `isWrapped` only adds collapsing
  // within the tablet range (and never un-collapses the phone view).
  const { probeRef, isWrapped } = useNavWrapDetection();

  // The overlay should look "active" (header transparent, logo hidden) for the
  // whole time it's on screen, including the closing flood.
  const overlayActive = menuOpen || menuMounted;
  // The closing window: overlay still mounted but intent is closed — the beat
  // during which the X spins away and the flood drains.
  const closing = menuMounted && !menuOpen;

  // Run the nav captured from an overlay link. Same-page hash → ease via Lenis;
  // a route (or cross-page hash) → a plain client navigation, no special
  // transition or loading screen. Stable identity so the re-entry effect's
  // timeout isn't reset by re-renders.
  const runPendingNav = useCallback((): void => {
    const href = pendingNavRef.current;
    if (!href) return;
    pendingNavRef.current = null;
    if (href.startsWith('#')) {
      if (pathname === '/') {
        scrollToHashTarget(href);
      } else {
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }
  }, [pathname, router]);

  // Overlay link handler: swallow the click's own navigation, remember where it
  // was headed, and start closing. `runPendingNav` fires when the close ends.
  const deferNavigate =
    (href: string) =>
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      // Leave modifier-clicks (open in new tab/window) to the browser.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      pendingNavRef.current = href;
      setMenuOpen(false);
    };

  useEffect(() => subscribeScroll((y) => setScrolled(y > SCROLL_RANGE)), []);

  // Toggle the menu. Opening also mounts the overlay; closing leaves it mounted
  // so the flood effect can contract it before it unmounts itself (below).
  const toggleMenu = (): void => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      // Re-opening: drop any nav queued by a previous close and cancel an
      // in-flight re-entrance.
      pendingNavRef.current = null;
      setHeaderEntry('idle');
      setMenuMounted(true);
      setMenuOpen(true);
    }
  };

  // Paint-bucket flood: grow a maroon disc out of the toggle button to cover the
  // screen on open, and contract it back into the button on close — the same
  // gesture as the form's "Continue to checkout" transition.
  useEffect(() => {
    const overlay = overlayRef.current;
    const toggle = toggleRef.current;
    if (!overlay || !toggle) return;

    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const hidden = `circle(0px at ${x}px ${y}px)`;
    // Open: a 200% radius is resolved against the viewport, so it always covers
    // the screen — even after a resize — letting the open hold its end frame
    // (`fill: forwards`) with no cancel/handoff that could flash the page.
    const openCover = `circle(200% at ${x}px ${y}px)`;
    // Close: start from an exact screen-covering disc (no off-screen overshoot)
    // so the retract is visible from frame one and tracks the X spin. Going from
    // the held 200% to this slightly smaller disc is an invisible jump — both
    // still cover the screen.
    const closeCover = `circle(${floodRadius(x, y)}px at ${x}px ${y}px)`;

    const anim = overlay.animate(
      menuOpen
        ? [{ clipPath: hidden }, { clipPath: openCover }]
        : [{ clipPath: closeCover }, { clipPath: hidden }],
      {
        // The open bursts out (ease-out) and hides its slow tail off-screen. The
        // close retracts on-screen the whole way, so it uses a constant rate over
        // a shorter duration — it starts instantly with the X and finishes clean,
        // with no slow tail to read as sluggish.
        duration: menuOpen ? FLOOD_DURATION : FLOOD_CLOSE_DURATION,
        easing: menuOpen ? FLOOD_EASING : 'linear',
        fill: 'forwards',
      }
    );

    // On close, once the disc has drained: unmount the overlay and hand off to
    // the header re-entrance (parked off-screen, then it slides back in).
    if (!menuOpen) {
      anim.finished
        .catch(() => {})
        .finally(() => {
          setMenuMounted(false);
          setHeaderEntry('hidden');
        });
    }

    return () => anim.cancel();
  }, [menuOpen, menuMounted]);

  // Header re-entrance after a close: park it off-screen (no transition), then
  // on the next frame ease it back down — the intro's slide-in, replayed.
  useEffect(() => {
    if (headerEntry === 'hidden') {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setHeaderEntry('sliding'));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    if (headerEntry === 'sliding') {
      const id = window.setTimeout(() => {
        setHeaderEntry('idle');
        // The full close has now played out (flood drained + header slid down):
        // safe to navigate to the link the user picked, if any.
        runPendingNav();
      }, HEADER_REENTRY_MS);
      return () => window.clearTimeout(id);
    }
  }, [headerEntry, runPendingNav]);

  // While the overlay is on screen, freeze the page behind it: stop Lenis and
  // pin overflow so the brand overlay owns the viewport. Escape also closes it.
  useEffect(() => {
    if (!overlayActive) return;
    stopLenis();
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      startLenis();
    };
  }, [overlayActive]);

  // On the landing page a `<Link href="/">` click is a no-op (same route), so
  // the logo neither scrolls up nor refreshes. Intercept it and refresh in
  // place: snap to the top and re-fetch the route. A full `location.assign('/')`
  // reload was the obvious choice, but it tears the document down and the
  // server always re-renders the intro overlay (a white panel — sessionStorage,
  // which records that the intro already played, can't be read during SSR), so
  // mobile devices flash a white screen until hydration hides it. `router.refresh`
  // re-fetches without unmounting, so there's no blank frame. From any other
  // page the Link routes home as usual.
  const handleLogoClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    setMenuOpen(false);
    if (pathname === '/') {
      event.preventDefault();
      scrollToTop();
      router.refresh();
    }
  };

  // While the Features scroll-scene owns the top of the viewport, keep the
  // header hidden even when scrolling up — it only reappears in other sections.
  const inFeatures = useInSection('features-section');
  // The How section is black with gold accents — switch the SOFI pill to its
  // dark/gold tone only while the header sits over it.
  const inHow = useInSection('bg-stop-how');
  // `transitioning` (from usePageTransition, read at the top): stay hidden for
  // the whole page transition, then slide in once it ends — when `active` flips
  // false the header eases from translateY(-100%) back to 0 (its existing 350ms
  // transform transition), so it appears after the swipe settles.
  // Keep the header visible while the mobile overlay is on screen.
  const hidden =
    ((useScrollDirection() || inFeatures) && !overlayActive) || transitioning;
  const { background: pageBg, foreground: pageFg } = useSyncExternalStore(
    subscribeToPageColors,
    getPageColorsSnapshot,
    getPageColorsServerSnapshot
  );

  // The post-close re-entrance overrides the normal hidden/visible transform:
  // `hidden` parks it up with no transform transition (so it snaps off-screen),
  // `sliding` eases it back down with the intro easing.
  const offscreen =
    headerEntry === 'hidden' || (hidden && headerEntry !== 'sliding');
  const transformTransition =
    headerEntry === 'hidden'
      ? 'transform 0ms'
      : headerEntry === 'sliding'
        ? `transform ${HEADER_REENTRY_MS}ms ${EXIT_EASING}`
        : 'transform 350ms ease';

  const headerStyle = useMemo<CSSProperties>(
    () =>
      ({
        height: `${scrolled ? HEIGHT_SMALL : HEADER_HEIGHT_LARGE}px`,
        // While the overlay is on screen the brand flood sits behind the header,
        // so go transparent and force a white icon for the close button.
        background: overlayActive ? 'transparent' : pageBg,
        // Drives `currentColor` for the nav text, menu icon, and GIA logo.
        color: overlayActive ? '#ffffff' : pageFg,
        // Exposed to the adaptive CTA button so it tracks the section palette.
        '--page-bg': pageBg,
        '--page-fg': pageFg,
        transform: offscreen ? 'translateY(-100%)' : 'translateY(0)',
        // Background is intentionally not transitioned — it snaps at the dark
        // section seams (fade: 0) and is already eased per-frame for white→cream.
        transition: `height 250ms ease, ${transformTransition}`,
      }) as CSSProperties,
    [scrolled, pageBg, pageFg, offscreen, overlayActive, transformTransition]
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 sm:px-6 md:px-10"
        style={headerStyle}
      >
        {/* Hidden full-width measurement probe — a mirror of the header row
            (logo block + nav group) used only to detect when those two stop
            fitting on one line. It's absolutely positioned (out of the visible
            flex flow) and shares the header's horizontal padding so its inner
            width equals the real available width. Always rendered, so it's never
            the element we hide — that's what keeps the threshold from
            oscillating. `shrink-0` makes the children wrap instead of squeezing
            onto one row; `flex-wrap` lets the nav group drop to row two. */}
        <div
          ref={probeRef}
          aria-hidden
          className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap items-center gap-8 px-5 sm:px-6 md:px-10"
        >
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <GiaLogo className="mt-2 h-[34px] w-auto sm:h-[40px]" />
            <PoweredByPill size="sm" tone={inHow ? 'onDark' : 'default'} />
          </div>
          <div className="flex shrink-0 items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <NavItem key={label} href={href} label={label} />
            ))}
            <Button href="/form" variant="adaptive" size="default" transition>
              ANALYZE MY TIKTOK
            </Button>
          </div>
        </div>

        <Link
          href="/"
          aria-label="Go to homepage"
          // Hidden (but in-flow) while the overlay is on screen so its centered
          // logo stands alone and the close button stays right-aligned.
          className={`flex items-center gap-2 sm:gap-3 ${overlayActive ? 'invisible' : ''}`}
          onClick={handleLogoClick}
        >
          <GiaLogo className="mt-2 h-[34px] w-auto sm:h-[40px]" />
          <PoweredByPill size="sm" tone={inHow ? 'onDark' : 'default'} />
        </Link>

        {/* Desktop nav. Hidden on phone by the `md:` baseline, and additionally
            hidden across the tablet/desktop range whenever the row would wrap. */}
        <nav
          className={`items-center gap-8 ${isWrapped ? 'hidden' : 'hidden md:flex'}`}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <NavItem key={label} href={href} label={label} />
          ))}
          <Button href="/form" variant="adaptive" size="default" transition>
            ANALYZE MY TIKTOK
          </Button>
        </nav>

        {/* Menu toggle: shown on phone by the `md:hidden` baseline, plus anywhere
            the nav would wrap (lower tablet) once `isWrapped` drops that class. */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className={`-mr-1 grid size-10 place-items-center ${isWrapped ? '' : 'md:hidden'}`}
        >
          {overlayActive ? (
            // On close, the X spins away and fades before the flood drains.
            <X size={26} className={closing ? 'menu-x-exit' : undefined} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </header>

      {/* Fullscreen mobile menu overlay. A sibling of the header (not a child):
          the header's `transform` would otherwise make it the containing block
          for this `fixed` element, clipping it to the header's height. The
          clip-path floods out of the toggle button (animated imperatively); the
          inline value is the resting state before/after that animation runs. */}
      {menuMounted && (
        <div
          ref={overlayRef}
          // Resting state: fully clipped (invisible) until the flood animation
          // takes over on mount. The open flood holds its covered end frame.
          style={{ clipPath: 'circle(0px)' }}
          className={`bg-brand-primary fixed inset-0 z-[90] flex flex-col items-center justify-center gap-[52px] px-6 text-white ${isWrapped ? '' : 'md:hidden'}`}
        >
          <GiaLogo className="h-[62px] w-auto" />
          <nav className="flex flex-col items-center text-center">
            {MOBILE_NAV_LINKS.map(({ label, href }) => (
              <NavItem
                key={label}
                href={href}
                label={label}
                baseClassName={mobileLinkClassName}
                className="flex h-[72px] items-center justify-center"
                onClick={deferNavigate(href)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
