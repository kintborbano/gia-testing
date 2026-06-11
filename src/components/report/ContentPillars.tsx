import { SectionLabel } from '@/components/report/Primitives';
import type { ApiResult } from '@/types/api';

function verdictStyle(verdict: string): string {
  const v = verdict.toLowerCase();
  if (v.includes('strong')) return 'bg-emerald-100 text-emerald-700';
  if (v.includes('mixed')) return 'bg-amber-100 text-amber-700';
  if (v.includes('weak') || v.includes('poor')) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

export default function ContentPillars({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const pillars = result?.overall.content_pillars;
  if (!pillars?.length) return null;

  return (
    <section className="space-y-4">
      <SectionLabel>Content Pillars</SectionLabel>
      <div className="grid gap-4 md:grid-cols-2">
        {pillars.map((pillar) => (
          <div
            key={pillar.pillar}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{pillar.pillar}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${verdictStyle(pillar.verdict)}`}
              >
                {pillar.verdict}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {pillar.video_count} video{pillar.video_count !== 1 ? 's' : ''} ·{' '}
              {(pillar.avg_engagement_rate * 100).toFixed(1)}% ER
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
