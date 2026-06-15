'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useJobPolling } from '@/hooks/useJobPolling';

const BROADCAST_CHANNEL_URL =
  'https://www.instagram.com/channel/AbaXwsrEEM1hoSpY/';

// The fill tracks real job progress rather than a fixed clock: each status
// message from the backend nudges it forward, and a slow idle creep keeps it
// alive between messages. It eases toward a ceiling well short of full and only
// reaches 100% once polling reports the job is done — so it never sits frozen
// at 100% while GIA is still working.
const START_PCT = 8;
const CEILING_PCT = 90;
// Fraction of the remaining gap to the ceiling closed per event.
const MESSAGE_STEP = 0.4;
const IDLE_STEP = 0.01;
const TICK_MS = 600;

// Warm the fill from gold to yellow as it grows (full yellow by ~83%, matching
// the original bar's palette).
const GOLD = [0xc9, 0x92, 0x0a];
const YELLOW = [0xee, 0xd0, 0x3a];
function fillColor(pct: number): string {
  const t = Math.min(1, pct / 83);
  const [r, g, b] = GOLD.map((from, i) =>
    Math.round(from + (YELLOW[i] - from) * t)
  );
  return `rgb(${r}, ${g}, ${b})`;
}

export default function LoadingScreen(): ReactElement {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') ?? '';
  const jobId = searchParams.get('job_id');

  const { messages, done: pollDone, error } = useJobPolling(jobId);

  const [pct, setPct] = useState(START_PCT);
  const [reachedFull, setReachedFull] = useState(false);

  // Mirror the latest polling state into refs so the ticker below can read it
  // without re-subscribing on every message.
  const messagesLenRef = useRef(0);
  const pollDoneRef = useRef(false);
  const seenRef = useRef(0);
  useEffect(() => {
    messagesLenRef.current = messages.length;
  }, [messages.length]);
  useEffect(() => {
    pollDoneRef.current = pollDone;
  }, [pollDone]);

  // A single ticker advances the bar. Each new status message closes a big
  // chunk of the gap to the ceiling; between messages a small idle creep keeps
  // it moving. Once polling is done (or there's no job to wait for) it fills to
  // 100% — the width transition's end then flips the screen to its done state.
  useEffect(() => {
    const id = setInterval(() => {
      if (pollDoneRef.current || !jobId) {
        setPct(100);
        return;
      }
      // Consume any new messages out here so the updater stays pure (React may
      // double-invoke it in dev, which would otherwise drop the jump).
      const gained = messagesLenRef.current - seenRef.current;
      seenRef.current = messagesLenRef.current;
      setPct((prev) => {
        let next = prev;
        for (let i = 0; i < gained; i++) {
          next += (CEILING_PCT - next) * MESSAGE_STEP;
        }
        next += (CEILING_PCT - next) * IDLE_STEP;
        return Math.min(CEILING_PCT, next);
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [jobId]);

  // `done` means the job has finished — successfully or not. `failed` splits
  // that into the error case so the heading, description and CTA can all speak
  // to the failure instead of falsely celebrating a result that never arrived.
  const done = jobId ? pollDone && reachedFull : reachedFull;
  const failed = done && error !== null;

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
              role="progressbar"
              aria-label="Generating your report"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              className="bg-brand-cream flex h-[16px] w-[553px] max-w-full rounded-full border border-black p-[2px]"
            >
              <div
                className="rounded-full border border-black"
                style={{
                  width: `${pct}%`,
                  backgroundColor: fillColor(pct),
                  transition: 'width 600ms ease, background-color 600ms ease',
                }}
                onTransitionEnd={(e) => {
                  if (e.propertyName === 'width' && pct >= 100)
                    setReachedFull(true);
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-white">
            <h1 className="font-young-serif text-[28px] leading-[1.1] tracking-[-1.12px] sm:text-[36px]">
              {failed
                ? "gia couldn't finish this one"
                : done
                  ? 'gia is done analyzing!'
                  : 'gia is working on it!'}
            </h1>
            <p className="max-w-[580px] font-sans text-[14px] leading-[1.3] font-normal tracking-[-0.12px] sm:text-[15px] md:text-[16px] md:leading-[1.25]">
              {failed
                ? (error ?? 'Something went wrong — please try again.')
                : done
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
                withArrow={!failed}
                transition
                disabled={failed}
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
