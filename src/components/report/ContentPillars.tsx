'use client';

import { useEffect, useState } from 'react';
import { SectionLabel } from '@/components/report/Primitives';
import { toText } from '@/lib/text';
import type { ApiResult } from '@/types/api';

type VerdictKey = 'strong' | 'mixed' | 'weak';

function verdictKey(verdict: string): VerdictKey {
  const v = verdict.toLowerCase();
  if (v.includes('strong')) return 'strong';
  if (v.includes('weak') || v.includes('poor')) return 'weak';
  return 'mixed';
}

const VERDICT_STYLES: Record<VerdictKey, { bar: string; badge: string }> = {
  strong: {
    bar: 'bg-verdict-strong',
    badge: 'bg-verdict-strong-soft text-verdict-strong-deep',
  },
  mixed: {
    bar: 'bg-verdict-mixed',
    badge: 'bg-verdict-mixed-soft text-verdict-mixed-deep',
  },
  weak: {
    bar: 'bg-verdict-weak',
    badge: 'bg-verdict-weak-soft text-verdict-weak-deep',
  },
};

const LEGEND: { key: VerdictKey; label: string }[] = [
  { key: 'strong', label: 'Strong' },
  { key: 'mixed', label: 'Mixed' },
  { key: 'weak', label: 'Weak' },
];

interface NormalizedPillar {
  pillar: string;
  er: number;
  videoCount: number;
  verdict: string;
}

// Gemini's pillars drift: avg_engagement_rate arrives as "9.8%" strings,
// verdict goes missing, keys vary. Normalize like the backend PDF does
// instead of trusting the typed shape.
function normalizePillars(raw: unknown): NormalizedPillar[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p): NormalizedPillar => {
      const r = (p ?? {}) as Record<string, unknown>;
      return {
        pillar: toText(r.pillar ?? r.name),
        er:
          parseFloat(
            String(r.avg_engagement_rate ?? r.er ?? '').replace('%', '')
          ) || 0,
        videoCount: Number(r.video_count) || 0,
        verdict: toText(r.verdict) || 'mixed',
      };
    })
    .filter((p) => p.pillar);
}

export default function ContentPillars({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  // Fill on mount rather than a scroll observer: the one-shot useInView was
  // unreliable inside the Reveal wrapper and left the bars stuck at 0%.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const pillars = normalizePillars(result?.overall.content_pillars);
  if (!pillars.length) return null;

  const sorted = [...pillars].sort((a, b) => b.er - a.er);
  const maxEr = Math.max(...sorted.map((p) => p.er), 0.0001);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Content Pillars</SectionLabel>
        <div className="flex gap-4 text-xs text-gray-500">
          {LEGEND.map(({ key, label }) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-sm ${VERDICT_STYLES[key].bar}`}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="report-card space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {sorted.map((pillar, i) => {
          const key = verdictKey(pillar.verdict);
          const styles = VERDICT_STYLES[key];
          return (
            <div key={pillar.pillar}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="min-w-0 truncate text-sm font-semibold">
                  {pillar.pillar}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles.badge}`}
                >
                  {pillar.verdict}
                </span>
              </div>
              <div className="mt-2 h-[22px] overflow-hidden rounded-md bg-gray-100">
                <div
                  className={`report-bar-glint relative h-full overflow-hidden rounded-md ${styles.bar}`}
                  style={{
                    width: filled
                      ? `${Math.max((pillar.er / maxEr) * 100, 4)}%`
                      : '0%',
                    transition: `width 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                {pillar.er.toFixed(1)}% ER · {pillar.videoCount} video
                {pillar.videoCount !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
