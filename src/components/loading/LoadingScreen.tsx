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
      <section className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        {/* 1. Header — GIA illustration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gia-on-laptop.png"
          alt="GIA analyzing a TikTok account at her laptop"
          className="h-auto w-[260px] max-w-full sm:w-[330px] md:w-[390px]"
        />

        {/* 2. Loading — gold fill pulsing inside a cream track. */}
        <div
          role="status"
          aria-label="Generating your report"
          className="bg-brand-cream flex h-[16px] w-[553px] max-w-full rounded-full border border-black p-[2px]"
        >
          <div className="loading-progress rounded-full border border-black bg-[#c9920a]" />
        </div>

        {/* 3. Broadcast — headline, invite copy, and CTA. */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="font-young-serif text-[28px] leading-[1.1] tracking-[-1.12px] sm:text-[36px]">
              gia is working on it!
            </h1>
            <p className="max-w-[580px] font-sans text-[14px] leading-[1.3] font-normal tracking-[-0.12px] sm:text-[15px] md:text-[16px] md:leading-[1.25]">
              &ldquo;For creator tips, behind the scenes, &amp; access to new
              features&rdquo;
            </p>
          </div>

          <Button
            href={BROADCAST_CHANNEL_URL}
            variant="onBrand"
            size="default"
            withArrow
          >
            JOIN GIA&rsquo;S BROADCAST CHANNEL
          </Button>
        </div>
      </section>
    </main>
  );
}
