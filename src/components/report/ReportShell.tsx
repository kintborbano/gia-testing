'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Lock, Sparkles } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { DEMO_RESULT } from '@/lib/dummy/apiResult';
import type { ApiResult } from '@/types/api';
import Main from '@/components/report/Main';
import Reveal from '@/components/report/Reveal';
import ContentPillars from '@/components/report/ContentPillars';
import ContentStrategy from '@/components/report/ContentStrategy';
import AudienceIntelligence from '@/components/report/AudienceIntelligence';
import HookFormulaScripts from '@/components/report/HookFormulaScripts';
import VideoBreakdownSection from '@/components/report/VideoBreakdownSection';

const PLACEHOLDER_CAP = 6;

function LockedVideoPlaceholders({
  count,
  unlockHref,
}: {
  count: number;
  unlockHref: string;
}): React.ReactElement | null {
  if (count <= 0) return null;
  const visible = Math.min(count, PLACEHOLDER_CAP);
  const overflow = count - visible;
  return (
    <a href={unlockHref} className="block">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: visible }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-gray-400 select-none"
          >
            <Lock className="h-4 w-4 shrink-0" />
            <span className="font-sans text-sm">Click to unlock</span>
          </div>
        ))}
      </div>
      {overflow > 0 && (
        <p className="mt-2 text-center font-sans text-xs text-gray-400">
          +{overflow} more locked video{overflow === 1 ? '' : 's'}
        </p>
      )}
    </a>
  );
}

export default function ReportShell(): React.ReactElement {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job');
  // Design-iteration mode: ?demo=1 renders a bundled fixture instead of
  // fetching a job (the frontend twin of the backend's test_pdf_sample.py).
  const demo = !jobId && searchParams.get('demo') === '1';
  const handle =
    searchParams.get('handle') ?? (demo ? DEMO_RESULT.profile_handle : '');
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [fetchSeq, setFetchSeq] = useState(0);

  useEffect(() => {
    const cs = new URLSearchParams(window.location.search).get('cs');
    if (!cs) return;
    (async () => {
      try {
        await api.unlockRedeem(cs);
        setUnlockError('');
      } catch {
        setUnlockError(
          "We couldn't confirm your unlock. Try the unlock button again — if you've already paid, you won't be charged twice."
        );
      } finally {
        const url = new URL(window.location.href);
        url.searchParams.delete('cs');
        window.history.replaceState({}, '', url.toString());
        setFetchSeq((n) => n + 1);
      }
    })();
  }, []);

  useEffect(() => {
    if (!jobId) return;
    api
      .getResults(jobId)
      .then(setResult)
      .catch((err: ApiError) => setError(err.message));
  }, [jobId, fetchSeq]);

  const shown = demo ? DEMO_RESULT : result;

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="font-sans text-[15px] text-red-500">{error}</p>
      </main>
    );
  }

  const downloadHref = jobId
    ? `/api/download/${jobId}?token=${getToken() ?? ''}`
    : undefined;

  const wrappedHref = jobId
    ? `/wrapped?job=${jobId}&handle=${encodeURIComponent(handle)}`
    : demo
      ? '/wrapped?demo=1'
      : undefined;

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-12 text-gray-900 sm:px-6">
      {unlockError && (
        <div className="border-brand-gold bg-brand-gold/10 text-brand-primary rounded-xl border px-4 py-3 text-sm font-semibold">
          {unlockError}
        </div>
      )}
      <Main handle={handle} result={shown} />

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

      <Reveal>
        <ContentPillars result={shown} />
      </Reveal>
      <Reveal>
        <ContentStrategy result={shown} />
      </Reveal>
      <Reveal>
        <AudienceIntelligence result={shown} />
      </Reveal>
      <Reveal>
        <HookFormulaScripts result={shown} />
      </Reveal>
      <Reveal>
        <VideoBreakdownSection
          handle={handle}
          result={shown}
          locked={shown?.locked}
          unlockHref={
            shown?.locked && jobId ? `/unlock?job=${jobId}` : undefined
          }
        />
      </Reveal>

      {shown?.locked && jobId && (
        <Reveal>
          <LockedVideoPlaceholders
            count={shown.hidden_video_count ?? 0}
            unlockHref={`/unlock?job=${jobId}`}
          />
        </Reveal>
      )}

      {shown?.locked && (
        <Reveal>
          <section className="bg-brand-primary rounded-2xl px-6 py-8 text-center text-white">
            <p className="text-brand-secondary text-xs font-semibold tracking-widest uppercase">
              Locked
            </p>
            <h2 className="font-young-serif mt-1 text-2xl">
              You&rsquo;re seeing 1 of {(shown.hidden_video_count ?? 0) + 1}{' '}
              videos
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Unlock every video breakdown in this report — a one-time
              &#8369;299.
            </p>
            <a
              href={jobId ? `/unlock?job=${jobId}` : '/form'}
              className="bg-brand-gold text-brand-primary mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
            >
              Unlock the full report &#8594;
            </a>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
          {downloadHref && !shown?.locked && (
            <a
              href={downloadHref}
              className="bg-brand-primary hover:bg-brand-primary-dark hover:shadow-brand-primary/30 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
            </a>
          )}
          {shown?.locked && jobId && (
            <a
              href={`/unlock?job=${jobId}`}
              className="bg-brand-primary hover:bg-brand-primary-dark inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              <Lock className="h-4 w-4" />
              Unlock to download the full PDF
            </a>
          )}
          <a
            href="/form"
            className="hover:border-brand-primary hover:text-brand-primary rounded-full border border-gray-300 px-6 py-2.5 text-center text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Over
          </a>
        </section>
      </Reveal>
    </main>
  );
}
