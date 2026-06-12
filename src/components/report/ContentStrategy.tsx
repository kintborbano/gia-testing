import { CalendarClock, Check, X } from 'lucide-react';
import { SectionLabel } from '@/components/report/Primitives';
import Emphasis from '@/components/report/Emphasis';
import { splitBullets, toText } from '@/lib/text';
import type { ApiResult } from '@/types/api';

function ThemeList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'work' | 'avoid';
}) {
  const Icon = tone === 'work' ? Check : X;
  const iconStyle =
    tone === 'work'
      ? 'bg-verdict-strong-soft text-verdict-strong-deep'
      : 'bg-verdict-weak-soft text-verdict-weak-deep';
  return (
    <div className="report-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-sm leading-relaxed text-gray-700"
          >
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconStyle}`}
            >
              <Icon className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>
              <Emphasis text={item} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentStrategy({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const overall = result?.overall;
  if (!overall) return null;

  const postingBullets = splitBullets(overall.posting_strategy);
  const content_themes_that_work = (overall.content_themes_that_work ?? []).map(
    toText
  );
  const content_themes_to_avoid = (overall.content_themes_to_avoid ?? []).map(
    toText
  );

  return (
    <section className="space-y-4">
      <SectionLabel>Content Strategy</SectionLabel>

      {postingBullets.length > 0 && (
        <div className="bg-brand-cream report-card flex gap-4 rounded-2xl p-6">
          <div className="bg-brand-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-brand-primary text-sm font-semibold">
              Posting strategy
            </h3>
            <ul className="mt-1.5 space-y-1.5">
              {postingBullets.map((item) => (
                <li
                  key={item}
                  className="text-brand-primary-dark flex gap-2 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="bg-brand-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  <span>
                    <Emphasis text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(content_themes_that_work.length > 0 ||
        content_themes_to_avoid.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {content_themes_that_work.length > 0 && (
            <ThemeList
              title="What works"
              items={content_themes_that_work}
              tone="work"
            />
          )}
          {content_themes_to_avoid.length > 0 && (
            <ThemeList
              title="What to rethink"
              items={content_themes_to_avoid}
              tone="avoid"
            />
          )}
        </div>
      )}
    </section>
  );
}
