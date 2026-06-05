'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useInSection } from '@/hooks/useInSection';
import { getHeaderHeight, SCROLL_RANGE } from '@/animations/headerAnimations';
import {
  getPageBackgroundServerSnapshot,
  getPageBackgroundSnapshot,
  subscribeToPageBackground,
} from '@/stores/pageBackgroundStore';
import PoweredByPill from '@/components/ui/PoweredByPill';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'PRODUCT', href: '/meet-gia' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  // No dedicated About Us page yet — point at the footer for now.
  { label: 'ABOUT US', href: '#bg-stop-footer' },
] as const;

const linkClassName =
  'text-brand-primary font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold';

export default function StickyHeader(): React.ReactElement {
  const t = useScrollProgress(0, SCROLL_RANGE);
  const [menuOpen, setMenuOpen] = useState(false);
  // While the Features scroll-scene owns the top of the viewport, keep the
  // header hidden even when scrolling up — it only reappears in other sections.
  const inFeatures = useInSection('features-section');
  // Keep the header visible while the mobile menu is open.
  const hidden = (useScrollDirection() || inFeatures) && !menuOpen;
  const pageBg = useSyncExternalStore(
    subscribeToPageBackground,
    getPageBackgroundSnapshot,
    getPageBackgroundServerSnapshot
  );

  const headerStyle = useMemo<CSSProperties>(
    () => ({
      height: `${getHeaderHeight(t)}px`,
      background: pageBg,
      transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 350ms ease',
    }),
    [t, pageBg, hidden]
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
        <Image
          src="/logos/gia-logo.svg"
          alt="GIA"
          width={689}
          height={480}
          className="mt-2 h-[34px] w-auto sm:h-[40px]"
          priority
        />
        <PoweredByPill size="sm" />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map(({ label, href }) =>
          href.startsWith('#') ? (
            <a key={label} href={href} className={linkClassName}>
              {label}
            </a>
          ) : (
            <Link key={label} href={href} className={linkClassName}>
              {label}
            </Link>
          )
        )}
        <Button href="/action" variant="filled" size="default">
          ANALYZE MY TIKTOK
        </Button>
      </nav>

      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="text-brand-primary -mr-1 grid size-10 place-items-center md:hidden"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-black/10 px-5 pt-2 pb-6 shadow-lg sm:px-6 md:hidden"
          style={{ background: pageBg }}
        >
          {NAV_LINKS.map(({ label, href }) =>
            href.startsWith('#') ? (
              <a
                key={label}
                href={href}
                className={`${linkClassName} py-3`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className={`${linkClassName} py-3`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}
          <Button
            href="/action"
            variant="filled"
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
