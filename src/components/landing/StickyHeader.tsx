'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useInSection } from '@/hooks/useInSection';
import { getHeaderHeight, SCROLL_RANGE } from '@/animations/headerAnimations';
import {
  getPageColorsServerSnapshot,
  getPageColorsSnapshot,
  subscribeToPageColors,
} from '@/stores/pageBackgroundStore';
import GiaLogo from '@/components/ui/GiaLogo';
import PoweredByPill from '@/components/ui/PoweredByPill';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'PRODUCT', href: '#features-section' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  // No dedicated About Us page yet — point at the footer for now.
  { label: 'ABOUT US', href: '#bg-stop-footer' },
] as const;

// Color is intentionally omitted — links inherit the header's `currentColor`
// so they tint with the active section's foreground.
const linkClassName =
  'font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold';

// One nav entry — a hash target stays a plain <a> (same-page anchor); a route
// uses next/link. Shared by the desktop and mobile menus.
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
  const classes = `${linkClassName} ${className}`.trim();
  return href.startsWith('#') ? (
    <a href={href} className={classes} onClick={onClick}>
      {label}
    </a>
  ) : (
    <Link href={href} className={classes} onClick={onClick}>
      {label}
    </Link>
  );
}

export default function StickyHeader(): React.ReactElement {
  const t = useScrollProgress(0, SCROLL_RANGE);
  const [menuOpen, setMenuOpen] = useState(false);
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
        height: `${getHeaderHeight(t)}px`,
        background: pageBg,
        // Drives `currentColor` for the nav text, menu icon, and GIA logo.
        color: pageFg,
        // Exposed to the adaptive CTA button so it tracks the section palette.
        '--page-bg': pageBg,
        '--page-fg': pageFg,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 350ms ease',
      }) as CSSProperties,
    [t, pageBg, pageFg, hidden]
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 transition-none will-change-[height,background,transform] sm:px-6 md:px-10"
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
