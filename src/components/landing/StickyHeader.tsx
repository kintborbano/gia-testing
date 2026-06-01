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
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center px-6 transition-none will-change-[height,background,border-bottom]"
      style={headerStyle}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logos/gia-logo.svg"
          alt="GIA"
          width={689}
          height={480}
          className="h-[44px] w-auto"
          priority
        />
        <div className="flex h-[38px] w-auto items-center justify-center rounded-full border border-[#8c1f2e] bg-white px-5">
          <p className="flex items-center gap-1.5 font-sans text-[13px] tracking-[-0.26px] text-[#8c1f2e]">
            powered by
            <Image
              src="/logos/sofi-ai-logo.svg"
              alt="SOFI AI"
              width={1675}
              height={489}
              className="h-[15px] w-auto"
            />
          </p>
        </div>
      </div>
    </header>
  );
}
