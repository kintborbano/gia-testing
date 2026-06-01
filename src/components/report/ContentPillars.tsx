import { SectionLabel } from '@/components/report/Primitives';

const contentPillars = [
  {
    title: 'University Student Life & Relatability',
    badge: 'strong',
    badgeTone: 'bg-emerald-100 text-emerald-700',
    stats: '3 videos · 10.4% ER',
  },
  {
    title: 'Fashion & Personal Style',
    badge: 'mixed',
    badgeTone: 'bg-amber-100 text-amber-700',
    stats: '2 videos · 7.7% ER',
  },
];

export default function ContentPillars(): React.ReactElement {
  return (
    <section className="space-y-4">
      <SectionLabel>Content Pillars</SectionLabel>
      <div className="grid gap-4 md:grid-cols-2">
        {contentPillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{pillar.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${pillar.badgeTone}`}
              >
                {pillar.badge}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">{pillar.stats}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
