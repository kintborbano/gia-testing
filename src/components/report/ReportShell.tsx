'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Sparkles } from 'lucide-react';
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
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    api
      .getResults(jobId)
      .then(setResult)
      .catch((err: ApiError) => setError(err.message));
  }, [jobId]);

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
        <VideoBreakdownSection handle={handle} result={shown} />
      </Reveal>

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
              Unlock every video breakdown in this report — a one-time ₱299.
            </p>
            <button
              type="button"
              disabled={unlocking}
              onClick={async () => {
                setUnlocking(true);
                try {
                  const { checkout_url } = await api.checkoutCreate(
                    '',
                    'deep',
                    {
                      kind: 'unlock',
                      jobId: jobId!,
                    }
                  );
                  window.location.href = checkout_url;
                } catch {
                  setUnlocking(false);
                }
              }}
              className="bg-brand-gold text-brand-primary mt-4 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {unlocking ? 'Opening checkout…' : 'Unlock the full report →'}
            </button>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
          {downloadHref && (
            <a
              href={downloadHref}
              className="bg-brand-primary hover:bg-brand-primary-dark hover:shadow-brand-primary/30 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
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
