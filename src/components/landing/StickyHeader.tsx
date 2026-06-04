'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
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

const NAV_LINKS = [
  { label: 'MEET GIA', href: '#features-section' },
  { label: 'PRICING', href: '#bg-stop-pricing' },
  { label: 'FAQs', href: '#bg-stop-faq' },
  { label: 'ABOUT US', href: '#bg-stop-footer' },
] as const;

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
      <div className="flex items-center gap-3">
        <Image
          src="/logos/gia-logo.svg"
          alt="GIA"
          width={689}
          height={480}
          className="mt-2 h-[40px] w-auto"
          priority
        />
        <PoweredByPill size="sm" />
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-brand-primary font-sans text-[14px] font-medium tracking-[0.5px] hover:font-bold"
          >
            {label}
          </a>
        ))}
        <a
          href="#bg-stop-cta"
          className="bg-brand-primary flex items-center rounded-full px-5 py-2.5 font-sans text-[14px] font-medium tracking-[0.5px] text-white hover:font-bold"
        >
          GET IN TOUCH
        </a>
      </nav>
    </header>
  );
}
