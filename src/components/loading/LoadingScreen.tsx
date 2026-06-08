'use client';

import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';

// Replace with the real Broadcast Channel destination once it exists.
const BROADCAST_CHANNEL_URL = '#';

/**
 * Full-screen maroon loading screen shown while GIA works through an account
 * (Figma 90:138). The page-transition flood swipes up to reveal it, so the
 * maroon background reads as one continuous surface. Flat 2D, minimalist — the
 * gold progress bar pulses while the report generates. The analyzed handle is
 * carried in the URL (?handle=…) for the eventual report handoff.
 */
export default function LoadingScreen(): ReactElement {
  return (
    <main className="bg-brand-primary flex w-full flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-24 px-6 py-16 text-center">
        {/* Header — illustration with the headline below it, set apart from
            the content. */}
        <div className="flex flex-col items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/gia-on-laptop.png"
            alt="GIA analyzing a TikTok account at her laptop"
            className="h-auto w-[320px] max-w-full sm:w-[420px] md:w-[481px]"
          />
          <h1 className="font-itc-garamond text-[28px] leading-[1.1] tracking-[-1.12px] text-white sm:text-[36px]">
            gia is working on it!
          </h1>
        </div>

        {/* Content — progress bar, description, and CTA. */}
        <div className="flex flex-col items-center gap-8">
          {/* Progress bar — gold fill pulsing inside a cream track. */}
          <div
            role="status"
            aria-label="Generating your report"
            className="bg-brand-cream flex h-[22px] w-[553px] max-w-full items-center rounded-full border border-black px-[3.5px]"
          >
            <div className="loading-progress h-[17px] rounded-full border border-black bg-[#c9920a]" />
          </div>

          <p className="max-w-[580px] font-sans text-[18px] font-medium tracking-[-0.1px] text-white md:text-[20px]">
            While GIA is preparing your report, join the Broadcast Channel for
            creator tips, behind-the-scenes insights, and first access to new
            features.
          </p>

          <Button href={BROADCAST_CHANNEL_URL} variant="outlined" withArrow>
            JOIN GIA&rsquo;S BROADCAST CHANNEL
          </Button>
        </div>
      </section>
    </main>
  );
}
