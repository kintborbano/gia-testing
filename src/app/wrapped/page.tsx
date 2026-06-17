'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { DEMO_WRAPPED } from '@/lib/dummy/wrapped';
import WrappedDeck from '@/components/wrapped/WrappedDeck';
import type { Wrapped } from '@/types/wrapped';
import '@/styles/wrapped.css';

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="gw gw-stage">
      <p style={{ color: '#fef7dd', fontSize: 15, opacity: 0.8 }}>{children}</p>
    </div>
  );
}

function WrappedView(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();
  const jobId = params.get('job');
  const handle = params.get('handle') ?? '';
  const demo = !jobId && params.get('demo') === '1';

  const [data, setData] = useState<Wrapped | null>(demo ? DEMO_WRAPPED : null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (demo || !jobId) return;
    let cancelled = false;
    api
      .getWrapped(jobId)
      .then((d) => !cancelled && setData(d))
      .catch((err: ApiError) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [jobId, demo]);

  const close = () => {
    if (jobId)
      router.push(`/report?job=${jobId}&handle=${encodeURIComponent(handle)}`);
    else router.push('/');
  };

  if (error) return <Stage>Couldn&apos;t load your Wrapped — {error}</Stage>;
  if (!jobId && !demo) return <Stage>No report selected.</Stage>;
  if (!data) return <Stage>Building your GIA Wrapped…</Stage>;

  return <WrappedDeck data={data} onClose={close} />;
}

export default function WrappedPage(): React.ReactElement {
  return (
    <Suspense fallback={<Stage>Loading…</Stage>}>
      <WrappedView />
    </Suspense>
  );
}
