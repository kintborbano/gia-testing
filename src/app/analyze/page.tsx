'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

function AnalyzeContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cs = searchParams.get('cs');

  useEffect(() => {
    if (!cs) {
      router.replace('/form');
      return;
    }

    api
      .checkoutRedeem(cs)
      .then(({ job_id, handle }) => {
        const h = handle.replace(/^@/, '');
        router.replace(`/loading?job_id=${job_id}&handle=${encodeURIComponent(h)}`);
      })
      .catch((err: ApiError) => {
        router.replace(`/form?error=${encodeURIComponent(err.message)}`);
      });
  }, [cs, router]);

  return (
    <main className="bg-brand-primary flex min-h-screen flex-col items-center justify-center">
      <p className="font-young-serif text-[24px] text-white">
        verifying payment…
      </p>
    </main>
  );
}

export default function AnalyzePage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <main className="bg-brand-primary min-h-screen" />
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
