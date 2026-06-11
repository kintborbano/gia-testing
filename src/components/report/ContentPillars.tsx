'use client';

import { SectionLabel } from '@/components/report/Primitives';
import { useInView } from '@/hooks/useInView';
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

export default function ContentPillars({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const [ref, inView] = useInView<HTMLDivElement>();
  const pillars = result?.overall.content_pillars;
  if (!pillars?.length) return null;

  const sorted = [...pillars].sort(
    (a, b) => b.avg_engagement_rate - a.avg_engagement_rate
  );
  const maxEr = Math.max(...sorted.map((p) => p.avg_engagement_rate), 0.0001);

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

      <div
        ref={ref}
        className="report-card space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
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
                    width: inView
                      ? `${Math.max((pillar.avg_engagement_rate / maxEr) * 100, 4)}%`
                      : '0%',
                    transition: `width 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                {Number(pillar.avg_engagement_rate).toFixed(1)}% ER ·{' '}
                {pillar.video_count} video{pillar.video_count !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
