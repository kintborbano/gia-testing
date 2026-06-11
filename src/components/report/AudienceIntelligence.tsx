'use client';

import { useState } from 'react';
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
  if (l.includes('high'))
    return 'bg-verdict-strong-soft text-verdict-strong-deep';
  if (l.includes('medium') || l.includes('moderate'))
    return 'bg-verdict-mixed-soft text-verdict-mixed-deep';
  return 'bg-verdict-weak-soft text-verdict-weak-deep';
}

interface Signal {
  key: string;
  icon: LucideIcon;
  label: string;
  question: string;
  text: string;
}

export default function AudienceIntelligence({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const [active, setActive] = useState(0);
  const signals = result?.overall.audience_signals;
  if (!signals) return null;

  const tabs: Signal[] = [
    {
      key: 'share',
      icon: Share2,
      label: 'Share',
      question: 'What makes them hit share',
      text: signals.what_they_share,
    },
    {
      key: 'save',
      icon: Bookmark,
      label: 'Save',
      question: 'What they save for later',
      text: signals.what_they_save,
    },
    {
      key: 'comment',
      icon: MessageCircle,
      label: 'Comment',
      question: 'What pulls them into the comments',
      text: signals.what_they_comment_about,
    },
    {
      key: 'like',
      icon: Heart,
      label: 'Love',
      question: 'What they love about you',
      text: signals.what_they_like,
    },
    {
      key: 'dislike',
      icon: ThumbsDown,
      label: 'Dislike',
      question: 'What turns them away',
      text: signals.what_they_dislike,
    },
  ].filter((t) => t.text);

  if (!tabs.length) return null;
  const current = tabs[Math.min(active, tabs.length - 1)];
  const intentLevel = signals.purchase_intent_level ?? 'low';

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <SectionLabel>Audience Intelligence</SectionLabel>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${intentBadgeStyle(intentLevel)}`}
        >
          {intentLevel} intent
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Audience signals"
        className="flex flex-wrap gap-2"
      >
        {tabs.map(({ key, icon: Icon, label }, i) => {
          const selected = i === active;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                selected
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'hover:border-brand-primary/40 hover:text-brand-primary border-gray-300 text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div
        key={current.key}
        role="tabpanel"
        className="report-panel-in report-card flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="bg-brand-cream text-brand-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
          <current.icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">{current.question}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {current.text}
          </p>
        </div>
      </div>
    </section>
  );
}
