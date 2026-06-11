'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useJobPolling } from '@/hooks/useJobPolling';

const BROADCAST_CHANNEL_URL =
  'https://www.instagram.com/channel/AbaXwsrEEM1hoSpY/';

export default function LoadingScreen(): ReactElement {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') ?? '';
  const jobId = searchParams.get('job_id');

  const [animDone, setAnimDone] = useState(false);
  const { messages, done: pollDone, error } = useJobPolling(jobId);

  const done = jobId ? animDone && pollDone : animDone;

  const reportHref = handle
    ? `/report?handle=${encodeURIComponent(handle)}&job=${jobId ?? ''}`
    : '/form';

  return (
    <main className="loading-viewport bg-brand-primary flex w-full flex-col">
      <section className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        {!done && (
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/images/gia-thought-thinking.png"
              alt="GIA, the SOFI AI analyst, thinking as she works"
              width={1254}
              height={1254}
              priority
              className="h-auto w-[320px] max-w-full sm:w-[360px] md:w-[400px]"
            />

            <div
              role="status"
              aria-label="Generating your report"
              className="bg-brand-cream flex h-[16px] w-[553px] max-w-full rounded-full border border-black p-[2px]"
            >
              <div
                className="loading-progress rounded-full border border-black bg-[#c9920a]"
                onAnimationEnd={() => setAnimDone(true)}
              />
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <p className="max-w-[480px] font-sans text-[13px] leading-[1.4] text-white/70">
            {messages[messages.length - 1]}
          </p>
        )}

        {error && (
          <p className="font-pixelify text-[14px] text-red-300">{error}</p>
        )}

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="font-young-serif text-[28px] leading-[1.1] tracking-[-1.12px] sm:text-[36px]">
              {done ? 'gia is done analyzing!' : 'gia is working on it!'}
            </h1>
            <p className="max-w-[580px] font-sans text-[14px] leading-[1.3] font-normal tracking-[-0.12px] sm:text-[15px] md:text-[16px] md:leading-[1.25]">
              {done
                ? "GIA found what's actually driving your growth."
                : 'For creator tips, behind the scenes, & access to new features'}
            </p>
          </div>

          {done ? (
            <div className="flex flex-col items-stretch gap-3">
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
