import Image from 'next/image';
import { SectionLabel, Pill } from '@/components/report/Primitives';
import type { ApiResult } from '@/types/api';

export default function Main({
  handle,
  result,
}: {
  handle: string;
  result?: ApiResult | null;
}): React.ReactElement {
  const niche = result?.creator_profile.niche ?? '—';
  const followers = result?.creator_profile.followers != null
    ? result.creator_profile.followers.toLocaleString()
    : '—';
  const avgGia = result?.overall.avg_gia_score;
  const giaDisplay = avgGia != null ? avgGia.toFixed(1) : '—';
  const vibe = result?.overall.creator_hook_summary ?? '';
  const dataParagraph = result?.overall.creator_profile_summary ?? '';
  const topHooks = result?.overall.top_hook_types ?? [];

  return (
    <>
      {/* INTRO */}
      <section className="flex flex-col items-center text-center">
        <Image
          src="/logos/gia-logo.svg"
          alt="GIA"
          width={689}
          height={480}
          priority
          className="h-14 w-auto"
        />
        <h1 className="mt-4 text-3xl font-bold">Here&apos;s what I found!</h1>
        <p className="mt-3 text-xl font-semibold">@{handle}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
            {niche}
          </span>
          <span>{followers} followers</span>
        </div>
      </section>

      {/* GIA SCORE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
          GIA Score
        </div>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-6xl font-bold">{giaDisplay}</span>
          <span className="text-2xl text-gray-400">/ 10</span>
        </div>
        {avgGia != null && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            Average across all analyzed videos — normalized per {followers} followers.
          </p>
        )}
      </section>

      {/* GIA'S TAKE */}
      {(vibe || dataParagraph || topHooks.length > 0) && (
        <section className="space-y-4">
          <SectionLabel>GIA&apos;s Take</SectionLabel>
          {vibe && (
            <p className="text-base leading-relaxed text-gray-800">{vibe}</p>
          )}
          {dataParagraph && (
            <p className="text-base leading-relaxed text-gray-600">
              {dataParagraph}
            </p>
          )}
          {topHooks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Top hooks:</p>
              <div className="flex flex-wrap gap-2">
                {topHooks.map((hook) => (
                  <Pill key={hook}>{hook}</Pill>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
