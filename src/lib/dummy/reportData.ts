import type { ReportData } from '@/types/report';

export const dummyReport: ReportData = {
  handle: 'demo',
  category: 'Lifestyle',
  followerCount: 124,
  giaScore: 87,
  giaScoreMax: 100,
  giaScoreContext: 'Top 8% of creators in your category',
  giaTake:
    'Your hooks are punchy and visually driven — you lead with tension before the payoff, which keeps viewers past the 3-second mark consistently.',
  summary:
    'Strong pattern-interrupt openers with above-average retention. Your best-performing videos front-load a relatable frustration or bold claim within the first two seconds. Pacing and caption alignment are your biggest growth levers.',
  topHooks: [
    'POV: you finally...',
    'Nobody talks about this but...',
    'Stop doing this if you want...',
    "The reason you're not seeing results",
    'I tested this for 30 days',
  ],
};

const HANDLE_PATTERN = /^[a-zA-Z0-9._]{2,24}$/;

export function normalizeReportHandle(handle: string): string | null {
  try {
    const normalizedHandle = decodeURIComponent(handle)
      .replace(/^@/, '')
      .trim();

    if (!HANDLE_PATTERN.test(normalizedHandle)) {
      return null;
    }

    return normalizedHandle;
  } catch {
    return null;
  }
}

export function getDummyReportByHandle(handle: string): ReportData | null {
  const normalizedHandle = normalizeReportHandle(handle);

  if (!normalizedHandle) {
    return null;
  }

  return {
    ...dummyReport,
    handle: normalizedHandle,
  };
}
