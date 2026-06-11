import { SectionLabel, Bullet } from '@/components/report/Primitives';
import type { ApiResult } from '@/types/api';

export default function ContentStrategy({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const overall = result?.overall;
  if (!overall) return null;

  const { posting_strategy, content_themes_that_work, content_themes_to_avoid } = overall;

  return (
    <section className="space-y-6">
      <SectionLabel>Content Strategy</SectionLabel>

      {posting_strategy && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Posting Strategy</h3>
          <p className="text-sm leading-relaxed text-gray-600">{posting_strategy}</p>
        </div>
      )}

      {content_themes_that_work.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">What Works</h3>
          <ul className="space-y-2">
            {content_themes_that_work.map((item) => (
              <Bullet key={item} text={item} />
            ))}
          </ul>
        </div>
      )}

      {content_themes_to_avoid.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">What to Avoid</h3>
          <ul className="space-y-2">
            {content_themes_to_avoid.map((item) => (
              <Bullet key={item} text={item} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
