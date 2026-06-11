import {
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
  ThumbsDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from '@/components/report/Primitives';
import type { ApiResult } from '@/types/api';

function intentBadgeStyle(level: string): string {
  const l = level.toLowerCase();
  if (l.includes('high')) return 'bg-emerald-100 text-emerald-700';
  if (l.includes('medium') || l.includes('moderate')) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

export default function AudienceIntelligence({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const signals = result?.overall.audience_signals;
  if (!signals) return null;

  const intentLevel = signals.purchase_intent_level ?? 'low';

  const cards: { icon: LucideIcon; label: string; text: string }[] = [
    { icon: Share2, label: 'Share', text: signals.what_they_share },
    { icon: Bookmark, label: 'Save', text: signals.what_they_save },
    { icon: MessageCircle, label: 'Comment', text: signals.what_they_comment_about },
    { icon: Heart, label: 'Like', text: signals.what_they_like },
    { icon: ThumbsDown, label: 'Dislike', text: signals.what_they_dislike },
  ].filter((c) => c.text);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <SectionLabel>Audience Intelligence</SectionLabel>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${intentBadgeStyle(intentLevel)}`}>
          {intentLevel} intent
        </span>
      </div>
      <div className="space-y-3">
        {cards.map(({ icon: Icon, label, text }) => (
          <div
            key={label}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="bg-brand-primary/10 text-brand-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
