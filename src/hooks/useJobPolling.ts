'use client';

import { useState, useEffect, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ApiResult } from '@/types/api';

// A coarse classification of why a job failed, so the UI can describe what
// actually went down instead of showing one generic line. `null` means no
// failure. The raw `error` string is kept for logging, not for display.
export type ErrorKind = 'no_content' | 'backend' | 'network' | 'results' | null;

// The backend streams human-readable status lines; when an account has nothing
// to analyze those lines carry a recognizable signal (e.g. "...no content
// provided..."). We only ever scan for these on failure, so a benign mention
// during a healthy run can't misclassify a successful job.
const NO_CONTENT_SIGNALS = [
  'no content provided',
  'no videos',
  'other content',
  '(n/a',
];
function hasNoContentSignal(lines: string[]): boolean {
  const hay = lines.join('\n').toLowerCase();
  return NO_CONTENT_SIGNALS.some((s) => hay.includes(s));
}

interface PollingState {
  messages: string[];
  done: boolean;
  error: string | null;
  errorKind: ErrorKind;
  result: ApiResult | null;
}

export function useJobPolling(jobId: string | null): PollingState {
  const [messages, setMessages] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<ErrorKind>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const fromRef = useRef(0);
  // Every status line we've received, kept in a ref so the error branch (which
  // runs inside poll()) can scan the freshest stream without the staleness of
  // the `messages` state captured by this effect's closure.
  const seenMessagesRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    fromRef.current = 0;
    seenMessagesRef.current = [];

    const poll = async () => {
      try {
        const status = await api.getStatus(jobId, fromRef.current);
        if (cancelled) return;

        if (status.messages.length > 0) {
          setMessages((prev) => [...prev, ...status.messages]);
          seenMessagesRef.current.push(...status.messages);
          fromRef.current += status.messages.length;
        }

        if (status.done) {
          if (status.state === 'error') {
            // Distinguish "this account has nothing to analyze" from a generic
            // processing failure by reading the backend's own status stream.
            setErrorKind(
              hasNoContentSignal(seenMessagesRef.current)
                ? 'no_content'
                : 'backend'
            );
            setError('Analysis failed — please try again.');
          } else {
            try {
              const r = await api.getResults(jobId);
              if (!cancelled) setResult(r);
            } catch (e) {
              if (!cancelled) {
                setError((e as Error).message);
                setErrorKind('results');
              }
            }
          }
          setDone(true);
          return;
        }

        timerRef.current = setTimeout(poll, 3000);
      } catch (e) {
        if (!cancelled) {
          // A structured ApiError means the server answered (e.g. a 500) — that
          // reads as a backend failure, not a dropped connection. Anything else
          // (a TypeError from fetch, etc.) is a genuine network problem.
          const isNetwork = e instanceof TypeError || !(e instanceof ApiError);
          setError((e as Error).message ?? 'Connection lost — please refresh.');
          setErrorKind(isNetwork ? 'network' : 'backend');
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

  return { messages, done, error, errorKind, result };
}
