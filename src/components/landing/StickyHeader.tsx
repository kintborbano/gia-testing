'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useInSection } from '@/hooks/useInSection';
import { subscribeScroll } from '@/lib/scroll/scrollTicker';
import { scrollToHashTarget } from '@/lib/scroll/navScroll';
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

// Color is intentionally omitted — links inherit the header's `currentColor`
// so they tint with the active section's foreground.
const linkClassName =
  'font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold';

// One nav entry. A hash target points at a landing-page section: on '/' it
// scrolls in place through Lenis (eased like the Hero's "see how it works"
// link — a native anchor jump bypasses Lenis and hard-cuts); from any other
// page it routes to '/<hash>' so the landing page scrolls there on arrival.
// Plain routes use next/link. Shared by the desktop and mobile menus.
function NavItem({
  href,
  label,
  className = '',
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}): React.ReactElement {
  const pathname = usePathname();
  const classes = `${linkClassName} ${className}`.trim();
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => subscribeScroll((y) => setScrolled(y > SCROLL_RANGE)), []);

  // While the Features scroll-scene owns the top of the viewport, keep the
  // header hidden even when scrolling up — it only reappears in other sections.
  const inFeatures = useInSection('features-section');
  // The How section is black with gold accents — switch the SOFI pill to its
  // dark/gold tone only while the header sits over it.
  const inHow = useInSection('bg-stop-how');
  // Keep the header visible while the mobile menu is open.
  const hidden = (useScrollDirection() || inFeatures) && !menuOpen;
  const { background: pageBg, foreground: pageFg } = useSyncExternalStore(
    subscribeToPageColors,
    getPageColorsSnapshot,
    getPageColorsServerSnapshot
  );

  const headerStyle = useMemo<CSSProperties>(
    () =>
      ({
        height: `${scrolled ? HEIGHT_SMALL : HEADER_HEIGHT_LARGE}px`,
        background: pageBg,
        // Drives `currentColor` for the nav text, menu icon, and GIA logo.
        color: pageFg,
        // Exposed to the adaptive CTA button so it tracks the section palette.
        '--page-bg': pageBg,
        '--page-fg': pageFg,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        // Background is intentionally not transitioned — it snaps at the dark
        // section seams (fade: 0) and is already eased per-frame for white→cream.
        transition: 'height 250ms ease, transform 350ms ease',
      }) as CSSProperties,
    [scrolled, pageBg, pageFg, hidden]
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 sm:px-6 md:px-10"
      style={headerStyle}
    >
      <Link
        href="/"
        aria-label="Go to homepage"
        className="flex items-center gap-2 sm:gap-3"
        onClick={() => setMenuOpen(false)}
      >
        <GiaLogo className="mt-2 h-[34px] w-auto sm:h-[40px]" />
        <PoweredByPill size="sm" tone={inHow ? 'onDark' : 'default'} />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map(({ label, href }) => (
          <NavItem key={label} href={href} label={label} />
        ))}
        <Button href="/form" variant="adaptive" size="default">
          ANALYZE MY TIKTOK
        </Button>
      </nav>

      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="-mr-1 grid size-10 place-items-center md:hidden"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-black/10 px-5 pt-2 pb-6 shadow-lg sm:px-6 md:hidden"
          style={{ background: pageBg }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <NavItem
              key={label}
              href={href}
              label={label}
              className="py-3"
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <Button
            href="/form"
            variant="adaptive"
            size="default"
            className="mt-3 w-full"
          >
            ANALYZE MY TIKTOK
          </Button>
        </nav>
      )}
    </header>
  );
}
