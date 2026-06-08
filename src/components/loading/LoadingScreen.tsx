'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';

// GIA's Instagram Broadcast Channel.
const BROADCAST_CHANNEL_URL =
  'https://www.instagram.com/channel/AbaXwsrEEM1hoSpY/';

interface Props {
  /** The analyzed TikTok handle, carried from the form via ?handle=…. */
  handle?: string;
}

/**
 * Full-screen maroon loading screen shown after the analyze form (Figma 90:138).
 * The page-transition flood swipes up to reveal it, so the maroon background
 * reads as one continuous surface. The gold progress bar fills once; on
 * completion the screen flips to its "done" state — only the copy and CTA
 * change, while a fixed-size image placeholder holds its space so nothing
 * shifts. The illustrations are TODO; the placeholder reserves identical room
 * for both states.
 */
export default function LoadingScreen({ handle }: Props): ReactElement {
  const [done, setDone] = useState(false);
  const reportHref = handle ? `/report/${handle}` : '/form';

  return (
    <main className="bg-brand-primary flex w-full flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        {/* 1. Image placeholder — identical in both states so the layout never
            shifts when loading → done. Swap in the real artwork later. */}
        <div className="aspect-[3/2] w-[300px] max-w-full rounded-2xl border border-white/20 bg-white/10 sm:w-[360px] md:w-[420px]" />

        {/* 2. Progress bar — gold→yellow fill that runs once, then locks full. */}
        <div
          role="status"
          aria-label={done ? 'Report ready' : 'Generating your report'}
          className="bg-brand-cream flex h-[16px] w-[553px] max-w-full rounded-full border border-black p-[2px]"
        >
          <div
            className="loading-progress rounded-full border border-black bg-[#c9920a]"
            onAnimationEnd={() => setDone(true)}
          />
        </div>

        {/* 3. Copy + CTA — broadcast invite while loading, report handoff once done. */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="font-young-serif text-[28px] leading-[1.1] tracking-[-1.12px] sm:text-[36px]">
              {done ? 'gia is done analyzing!' : 'gia is working on it!'}
            </h1>
            <p className="max-w-[580px] font-sans text-[14px] leading-[1.3] font-normal tracking-[-0.12px] sm:text-[15px] md:text-[16px] md:leading-[1.25]">
              {done
                ? 'GIA found what’s actually driving your growth.'
                : 'For creator tips, behind the scenes, & access to new features'}
            </p>
          </div>

          {done ? (
            <Button
              href={reportHref}
              variant="onBrand"
              size="default"
              withArrow
              transition
              className="px-12!"
            >
              PROCEED TO DASHBOARD
            </Button>
          ) : (
            <Button
              href={BROADCAST_CHANNEL_URL}
              variant="onBrand"
              size="default"
              withArrow
              className="px-12!"
            >
              JOIN GIA&rsquo;S BROADCAST CHANNEL
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
