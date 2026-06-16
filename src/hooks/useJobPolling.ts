'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { ApiResult } from '@/types/api';

interface PollingState {
  messages: string[];
  done: boolean;
  error: string | null;
  result: ApiResult | null;
}

export function useJobPolling(jobId: string | null): PollingState {
  const [messages, setMessages] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const fromRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    fromRef.current = 0;

    const poll = async () => {
      try {
        const status = await api.getStatus(jobId, fromRef.current);
        if (cancelled) return;

        if (status.messages.length > 0) {
          setMessages((prev) => [...prev, ...status.messages]);
          fromRef.current += status.messages.length;
        }

        if (status.done) {
          if (status.state === 'error') {
            setError('Analysis failed — please try again.');
          } else {
            try {
              const r = await api.getResults(jobId);
              if (!cancelled) setResult(r);
            } catch (e) {
              if (!cancelled) setError((e as Error).message);
            }
          }
          setDone(true);
          return;
        }

        timerRef.current = setTimeout(poll, 3000);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message ?? 'Connection lost — please refresh.');
          setDone(true);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [jobId]);

  return { messages, done, error, result };
}
