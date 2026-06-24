'use client';

import { Sparkles } from 'lucide-react';
import { Pill } from '@/components/report/Primitives';
import ScoreRing from '@/components/report/ScoreRing';
import Reveal from '@/components/report/Reveal';
import SlotNumber from '@/components/report/SlotNumber';
import { useInView } from '@/hooks/useInView';
import { formatCount } from '@/lib/format';
import type { ApiResult } from '@/types/api';

function MetricCard({
  label,
  value,
  format = (n) => n.toFixed(1),
  suffix,
  start,
  delay = 0,
  text,
}: {
  label: string;
  value?: number;
  format?: (n: number) => string;
  suffix?: string;
  start: boolean;
  delay?: number;
  text?: string;
}) {
  return (
    <div className="bg-brand-cream report-card rounded-2xl p-5">
      <p className="text-brand-primary-dark text-[13px]">{label}</p>
      <p className="text-brand-primary mt-1 text-[26px] leading-none font-semibold capitalize">
        {text ??
          (value != null ? (
            <SlotNumber value={format(value)} start={start} delay={delay} />
          ) : (
            '—'
          ))}
        {suffix && (
          <span className="text-[14px] font-normal opacity-70">{suffix}</span>
        )}
      </p>
    </div>
  );
}

export default function Main({
  handle,
  result,
  wrappedHref,
}: {
  handle: string;
  result?: ApiResult | null;
  wrappedHref?: string;
}): React.ReactElement {
  const [metricsRef, metricsInView] = useInView<HTMLDivElement>();

  const niche = result?.creator_profile.niche ?? '—';
  const followers = result?.creator_profile.followers;
  const avgGia = result?.overall.avg_gia_score;
  const vibe = result?.overall.creator_hook_summary ?? '';
  const dataParagraph = result?.overall.creator_profile_summary ?? '';
  const topHooks = result?.overall.top_hook_types ?? [];

  const analyses = result?.analyses ?? [];
  const avgHook = analyses.length
    ? analyses.reduce((s, a) => s + a.hook_strength, 0) / analyses.length
    : undefined;
  const avgEr = analyses.length
    ? analyses.reduce((s, a) => s + (Number(a.engagement_rate) || 0), 0) /
      analyses.length
    : undefined;
  const totalViews = analyses.length
    ? analyses.reduce((s, a) => {
        const v = typeof a.views === 'string' ? parseFloat(a.views) : a.views;
        return s + (isNaN(v) ? 0 : v);
      }, 0)
    : undefined;
  const intent = result?.overall.audience_signals.purchase_intent_level;

  return (
    <>
      <Reveal>
        <section className="flex flex-col items-center text-center">
          <h1 className="font-young-serif report-hero-title text-[32px] leading-[1.1] tracking-[-0.8px] sm:text-[40px]">
            Here&apos;s what I found!
          </h1>
        </section>
      </Reveal>

      {wrappedHref && (
        <Reveal>
          <a
            href={wrappedHref}
            className="bg-brand-primary group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl px-6 py-5 text-left text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="bg-brand-gold/25 pointer-events-none absolute -top-10 -right-8 h-40 w-40 rounded-full blur-2xl"
            />
            <span className="relative">
              <span className="text-brand-secondary flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" /> New
              </span>
              <span className="font-young-serif mt-1 block text-xl">
                Your GIA Wrapped is ready
              </span>
              <span className="mt-1 block text-sm text-white/70">
                A shareable, story-style recap of your hooks — built for the
                &apos;gram.
              </span>
            </span>
            <span className="relative shrink-0 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-white/25">
              Watch →
            </span>
          </a>
        </Reveal>
      )}

      <Reveal delay={120}>
        <section className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
          {avgGia != null && <ScoreRing score={avgGia} />}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xl font-semibold">@{handle}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
              <span className="bg-brand-cream text-brand-primary rounded-full px-3 py-1 font-medium capitalize">
                {niche}
              </span>
              {followers != null && (
                <span>{followers.toLocaleString()} followers</span>
              )}
              {analyses.length > 0 && (
                <span>
                  {followers != null && '· '}
                  {analyses.length} videos analyzed
                </span>
              )}
            </div>
            {vibe && (
              <p className="font-averia-serif text-text mt-4 text-[17px] leading-relaxed font-bold italic">
                &ldquo;{vibe}&rdquo;
              </p>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal delay={200}>
        <section
          ref={metricsRef}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <MetricCard
            label="Avg hook strength"
            value={avgHook}
            suffix=" /10"
            start={metricsInView}
          />
          <MetricCard
            label="Avg engagement"
            value={avgEr}
            suffix="%"
            start={metricsInView}
            delay={150}
          />
          <MetricCard
            label="Total views"
            value={totalViews}
            format={formatCount}
            start={metricsInView}
            delay={300}
          />
          <MetricCard
            label="Purchase intent"
            text={intent ?? '—'}
            start={metricsInView}
          />
        </section>
      </Reveal>

      {(dataParagraph || topHooks.length > 0) && (
        <Reveal>
          <section className="space-y-4">
            {dataParagraph && (
              <p className="text-base leading-relaxed text-gray-600">
                {dataParagraph}
              </p>
            )}
            {topHooks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-600">
                  Top hooks:
                </p>
                {topHooks.map((hook) => (
                  <Pill key={hook}>{hook}</Pill>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}
    </>
  );
}
