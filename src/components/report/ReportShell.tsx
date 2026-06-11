'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { ApiResult } from '@/types/api';
import Main from '@/components/report/Main';
import ContentPillars from '@/components/report/ContentPillars';
import ContentStrategy from '@/components/report/ContentStrategy';
import AudienceIntelligence from '@/components/report/AudienceIntelligence';
import HookFormulaScripts from '@/components/report/HookFormulaScripts';
import VideoBreakdownSection from '@/components/report/VideoBreakdownSection';

export default function ReportShell(): React.ReactElement {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') ?? '';
  const jobId = searchParams.get('job');
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId) return;
    api
      .getResults(jobId)
      .then(setResult)
      .catch((err: ApiError) => setError(err.message));
  }, [jobId]);

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

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-12 text-gray-900 sm:px-6">
      <Main handle={handle} result={result} />
      <ContentPillars result={result} />
      <ContentStrategy result={result} />
      <AudienceIntelligence result={result} />
      <HookFormulaScripts result={result} />
      <VideoBreakdownSection handle={handle} result={result} />

      <section className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
        {downloadHref && (
          <a
            href={downloadHref}
            className="bg-brand-primary hover:bg-brand-primary-dark rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white"
          >
            Download PDF Report
          </a>
        )}
        <a
          href="/form"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Start Over
        </a>
      </section>
    </main>
  );
}
