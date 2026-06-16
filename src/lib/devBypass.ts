import type { ApiResult, JobStatus } from '@/types/api';
import { DEMO_RESULT } from '@/lib/dummy/apiResult';

// Local-only escape hatch to roam the whole analyze flow (form → loading →
// report) without the paywall or a live backend. Enabled by
// NEXT_PUBLIC_DEV_BYPASS=true (see .env.local).
//
// Hard-gated to non-production builds: even if the env var leaks into a
// production deploy it can NEVER disable the real paywall, because NODE_ENV is
// 'production' there. Use it under `next dev`. (`next build && next start` runs
// as production, so the bypass is off — intentional.)
export const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_BYPASS === 'true' &&
  process.env.NODE_ENV !== 'production';

// Scripted "thinking" messages the loading bar advances on, mimicking a real
// job. Spread over time below so the loop animation plays for a bit before the
// bar completes.
const DEV_MESSAGES = [
  'Fetching the latest videos…',
  'Transcribing the hooks…',
  'Scoring retention and engagement…',
  'Reading the comments…',
  'Finding what your audience saves and shares…',
  'Writing your growth plan…',
];
const DEV_STEP_MS = 2000; // a new message roughly every 2s
const DEV_TAIL_MS = 1500; // hold after the last message before reporting done

// First time we see a given dev job, anchor its start so elapsed time can drive
// the fake progress. Keyed by job id so re-running starts fresh.
const startedAt = new Map<string, number>();

export function devStartAnalysis(): Promise<{ job_id: string }> {
  return Promise.resolve({ job_id: `dev-${Date.now()}` });
}

export function devStatus(jobId: string, from: number): JobStatus {
  const now = Date.now();
  if (!startedAt.has(jobId)) startedAt.set(jobId, now);
  const elapsed = now - (startedAt.get(jobId) as number);

  const emitted = Math.min(
    DEV_MESSAGES.length,
    Math.floor(elapsed / DEV_STEP_MS)
  );
  const done = elapsed >= DEV_MESSAGES.length * DEV_STEP_MS + DEV_TAIL_MS;

  return {
    state: done ? 'done' : 'running',
    // Only the messages the client hasn't seen yet, mirroring the real API's
    // `from` cursor.
    messages: DEV_MESSAGES.slice(from, emitted),
    done,
  };
}

export function devResults(): Promise<ApiResult> {
  return Promise.resolve(DEMO_RESULT);
}
