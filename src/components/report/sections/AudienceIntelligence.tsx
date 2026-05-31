import {
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
  ThumbsDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from '@/components/report/primitives';

const audienceCards: { icon: LucideIcon; label: string; text: string }[] = [
  {
    icon: Share2,
    label: 'Share',
    text: 'Viewers share content that feels personal and admired, with the top-performing untitled video (16.67% ER) having 72 shares, indicating a desire to spread positive admiration for the creator.',
  },
  {
    icon: Bookmark,
    label: 'Save',
    text: "The audience saves content that provides fashion inspiration or aesthetic appeal, as indicated by the 'untitled' video (16.67% ER) with 1.73% saves-to-views and '#levisjeans #bruh' (13.12% ER) with 1.65% saves-to-views, signaling viewers want to revisit these looks.",
  },
  {
    icon: MessageCircle,
    label: 'Comment',
    text: "Comments consistently revolve around personal admiration for the creator's appeal and direct, friendly interactions, exemplified by 'a baddie' and 'pauwi na po, anong gusto mong ulamin?' on the top untitled video.",
  },
  {
    icon: Heart,
    label: 'Like',
    text: "Viewers respond most positively to the creator's personal presence and fashion choices, with comments like 'Wow your hot' on '#levisjeans #bruh' and 'back view pls😊' on 'update : YESSS' highlighting strong visual appeal.",
  },
  {
    icon: ThumbsDown,
    label: 'Dislike',
    text: "Content lacking clear context or broader relatability, like 'ni goon …' (2.2% ER), results in no comments, shares, or bookmarks, showing disinterest when the hook is too niche or unclear.",
  },
];

export default function AudienceIntelligence(): React.ReactElement {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <SectionLabel>Audience Intelligence</SectionLabel>
        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
          low intent
        </span>
      </div>
      <div className="space-y-3">
        {audienceCards.map(({ icon: Icon, label, text }) => (
          <div
            key={label}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8c1f2e]/10 text-[#8c1f2e]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
