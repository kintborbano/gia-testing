'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
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
      <Main handle={handle} result={shown} wrappedHref={wrappedHref} />
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
