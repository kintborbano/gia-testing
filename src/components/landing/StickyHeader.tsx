'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useInSection } from '@/hooks/useInSection';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { scrollToHashTarget } from '@/lib/scroll/navScroll';
import { startLenis, stopLenis } from '@/lib/scroll/lenisControls';
import { FLOOD_DURATION, FLOOD_EASING } from '@/animations/introTiming';
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
  onClick?: () => void;
}): React.ReactElement {
  const pathname = usePathname();
  const classes = `${baseClassName} ${className}`.trim();
  const isHash = href.startsWith('#');
  const onLanding = pathname === '/';

  // Same-page hash click: ease to the section via Lenis instead of jumping.
  const handleHashClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    if (scrollToHashTarget(href)) {
      event.preventDefault();
    }
    onClick?.();
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // The overlay should look "active" (header transparent, logo hidden) for the
  // whole time it's on screen, including the closing flood.
  const overlayActive = menuOpen || menuMounted;

  useEffect(() => subscribeScroll((y) => setScrolled(y > SCROLL_RANGE)), []);

  // Toggle the menu. Opening also mounts the overlay; closing leaves it mounted
  // so the flood effect can contract it before it unmounts itself (below).
  const toggleMenu = (): void => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
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
    // A percentage radius is resolved against the viewport, so 200% always
    // covers the screen — even after a resize — letting the animation simply
    // hold its end frame (`fill: forwards`) with no cancel/handoff that could
    // flash the page through for a frame.
    const covered = `circle(200% at ${x}px ${y}px)`;

    const anim = overlay.animate(
      menuOpen
        ? [{ clipPath: hidden }, { clipPath: covered }]
        : [{ clipPath: covered }, { clipPath: hidden }],
      { duration: FLOOD_DURATION, easing: FLOOD_EASING, fill: 'forwards' }
    );

    // On close, unmount once the disc has contracted back into the button.
    if (!menuOpen) {
      anim.finished.catch(() => {}).finally(() => setMenuMounted(false));
    }

    return () => anim.cancel();
  }, [menuOpen, menuMounted]);

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
  // the logo neither scrolls up nor refreshes. Intercept it and force a full
  // reload of '/', which lands at the top with fresh state. From any other page
  // the Link routes home as usual.
  const handleLogoClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    setMenuOpen(false);
    if (pathname === '/') {
      event.preventDefault();
      window.location.assign('/');
    }
  };

  // While the Features scroll-scene owns the top of the viewport, keep the
  // header hidden even when scrolling up — it only reappears in other sections.
  const inFeatures = useInSection('features-section');
  // The How section is black with gold accents — switch the SOFI pill to its
  // dark/gold tone only while the header sits over it.
  const inHow = useInSection('bg-stop-how');
  // Stay hidden for the whole page transition, then slide in once it ends: when
  // `active` flips false the header eases from translateY(-100%) back to 0 (its
  // existing 350ms transform transition), so it appears after the swipe settles.
  const { active: transitioning } = usePageTransition();
  // Keep the header visible while the mobile overlay is on screen.
  const hidden =
    ((useScrollDirection() || inFeatures) && !overlayActive) || transitioning;
  const { background: pageBg, foreground: pageFg } = useSyncExternalStore(
    subscribeToPageColors,
    getPageColorsSnapshot,
    getPageColorsServerSnapshot
  );

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
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        // Background is intentionally not transitioned — it snaps at the dark
        // section seams (fade: 0) and is already eased per-frame for white→cream.
        transition: 'height 250ms ease, transform 350ms ease',
      }) as CSSProperties,
    [scrolled, pageBg, pageFg, hidden, overlayActive]
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 sm:px-6 md:px-10"
        style={headerStyle}
      >
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <NavItem key={label} href={href} label={label} />
          ))}
          <Button href="/form" variant="adaptive" size="default" transition>
            ANALYZE MY TIKTOK
          </Button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className="-mr-1 grid size-10 place-items-center md:hidden"
        >
          {overlayActive ? <X size={26} /> : <Menu size={26} />}
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
          className="bg-brand-primary fixed inset-0 z-[90] flex flex-col items-center justify-center gap-[52px] px-6 text-white md:hidden"
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
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
