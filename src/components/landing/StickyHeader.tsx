'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import {
  getHeaderHeight,
  getHeaderBorderOpacity,
  SCROLL_RANGE,
} from '@/animations/headerAnimations';
import {
  getPageBackgroundServerSnapshot,
  getPageBackgroundSnapshot,
  subscribeToPageBackground,
} from '@/stores/pageBackgroundStore';
import PoweredByPill from '@/components/ui/PoweredByPill';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'MEET GIA', href: '/meet-gia' },
  { label: 'PRICING', href: '/pricing' },
  { label: 'FAQs', href: '/faq' },
  // No dedicated About Us page yet — point at the footer for now.
  { label: 'ABOUT US', href: '#bg-stop-footer' },
] as const;

const linkClassName =
  'text-brand-primary font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold';

export default function StickyHeader(): React.ReactElement {
  const t = useScrollProgress(0, SCROLL_RANGE);
  const pageBg = useSyncExternalStore(
    subscribeToPageBackground,
    getPageBackgroundSnapshot,
    getPageBackgroundServerSnapshot
  );

  const headerStyle = useMemo<CSSProperties>(
    () => ({
      height: `${getHeaderHeight(t)}px`,
      background: pageBg,
      borderBottom: `1px solid rgba(0, 0, 0, ${getHeaderBorderOpacity(t)})`,
    }),
    [t, pageBg]
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 transition-none will-change-[height,background,border-bottom] md:px-10"
      style={headerStyle}
    >
      <Link
        href="/"
        aria-label="Go to homepage"
        className="flex items-center gap-3"
      >
        <Image
          src="/logos/gia-logo.svg"
          alt="GIA"
          width={689}
          height={480}
          className="mt-2 h-[40px] w-auto"
          priority
        />
        <PoweredByPill size="sm" />
      </Link>
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
        <Button href="#bg-stop-footer" variant="filled" size="default">
          GET IN TOUCH
        </Button>
      </nav>
    </header>
  );
}
