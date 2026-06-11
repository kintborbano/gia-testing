'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import Image from 'next/image';
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
 * The page-transition flood fades into it, so the maroon background reads as one
 * continuous surface. While loading, a placeholder illustration sits above a
 * gold progress bar that fills once; when it completes the screen flips to its
 * "done" state — the illustration and bar are removed, leaving the updated copy
 * and two CTAs (see your GIA Wrapped, proceed to dashboard).
 */
export default function LoadingScreen({ handle }: Props): ReactElement {
  const [done, setDone] = useState(false);
  const reportHref = handle ? `/report/${handle}` : '/form';
  // GIA Wrapped — carries the handle on the same way the loading route received
  // it. The /wrapped page itself is a separate build.
  const wrappedHref = handle ? `/wrapped?handle=${handle}` : '/form';

  return (
    <main className="loading-viewport bg-brand-primary flex w-full flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        {/* While loading: a placeholder illustration above a progress bar that
            fills once. Both are removed the instant loading completes — the done
            state is just copy + CTAs. (The bar's animation-end flips `done`, so
            it has to render during loading to drive that transition.) */}
        {!done && (
          <>
            {/* GIA, mid-analysis — sits above the progress bar while loading. */}
            <Image
              src="/images/gia-thinking-sitting.png"
              alt="GIA, the SOFI AI analyst, thinking as she works"
              width={1254}
              height={1254}
              priority
              className="h-auto w-[240px] max-w-full sm:w-[280px] md:w-[320px]"
            />

            {/* Progress bar — gold→yellow fill that runs once, then locks full. */}
            <div
              role="status"
              aria-label="Generating your report"
              className="bg-brand-cream flex h-[16px] w-[553px] max-w-full rounded-full border border-black p-[2px]"
            >
              <div
                className="loading-progress rounded-full border border-black bg-[#c9920a]"
                onAnimationEnd={() => setDone(true)}
              />
            </div>
          </>
        )}

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
            <div className="flex flex-col items-center gap-3">
              <Button
                href={reportHref}
                variant="onBrand"
                size="default"
                withArrow
                transition
                className="px-12!"
              >
                DOWNLOAD YOUR GIA REPORT
              </Button>
              <Button
                href={wrappedHref}
                variant="glass"
                size="default"
                withArrow
                transition
                className="px-12!"
              >
                SEE YOUR GIA WRAPPED
              </Button>
            </div>
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
