'use client';

import { useRef, useState } from 'react';
import {
  MessageCircle,
  Share2,
  Bookmark,
  Mic,
  Eye,
  Copy,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from '@/components/report/Primitives';
import Emphasis from '@/components/report/Emphasis';
import type { ApiResult, ScriptVariation } from '@/types/api';

function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave the
      // button in its idle state rather than showing a false "Copied".
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
        copied
          ? 'border-verdict-strong-deep text-verdict-strong-deep'
          : 'border-brand-primary text-brand-primary hover:bg-brand-cream'
      }`}
    >
      <Icon className="h-4 w-4" />
      {copied ? 'Copied' : 'Copy script'}
    </button>
  );
}

export default function HookFormulaScripts({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const [active, setActive] = useState(0);
  const overall = result?.overall;
  if (!overall) return null;

  const {
    ideal_hook_formula,
    visual_style_recommendation,
    script_hook_variations,
  } = overall;

  const goals: {
    key: string;
    label: string;
    icon: LucideIcon;
    variation: ScriptVariation;
  }[] = [
    {
      key: 'comments',
      label: 'Drive comments',
      icon: MessageCircle,
      variation: script_hook_variations.for_comments,
    },
    {
      key: 'shares',
      label: 'Drive shares',
      icon: Share2,
      variation: script_hook_variations.for_shares,
    },
    {
      key: 'saves',
      label: 'Drive saves',
      icon: Bookmark,
      variation: script_hook_variations.for_saves,
    },
  ].filter((g) => g.variation?.spoken_hook || g.variation?.visual_hook);

  const current = goals.length
    ? goals[Math.min(active, goals.length - 1)]
    : null;

  return (
    <section className="space-y-4">
      <SectionLabel>Hook Formula &amp; Scripts</SectionLabel>

      {ideal_hook_formula && (
        <div className="border-brand-primary border-l-4 py-1 pl-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Your ideal hook formula
          </h3>
          <p className="font-averia-serif text-text mt-1.5 text-[16px] leading-relaxed font-bold italic">
            <Emphasis text={ideal_hook_formula} />
          </p>
        </div>
      )}

      {visual_style_recommendation && (
        <p className="text-sm leading-relaxed text-gray-600">
          <span className="font-semibold text-gray-900">Visual style: </span>
          <Emphasis text={visual_style_recommendation} />
        </p>
      )}

      {current && (
        <>
          <div
            role="tablist"
            aria-label="Script goal"
            className="flex flex-wrap gap-2 pt-2"
          >
            {goals.map(({ key, label, icon: Icon }, i) => {
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
            className="report-panel-in report-card border-t-brand-primary rounded-2xl border border-t-4 border-gray-200 bg-white p-6 shadow-sm"
          >
            {current.variation.spoken_hook && (
              <div>
                <p className="text-brand-primary flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <Mic className="h-3.5 w-3.5" /> Say this
                </p>
                <p className="font-averia-serif text-text mt-2 text-[17px] leading-relaxed font-bold italic">
                  &ldquo;
                  <Emphasis text={current.variation.spoken_hook} />
                  &rdquo;
                </p>
              </div>
            )}
            {current.variation.visual_hook && (
              <div className="mt-5">
                <p className="text-brand-primary flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <Eye className="h-3.5 w-3.5" /> Show this
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  <Emphasis text={current.variation.visual_hook} />
                </p>
              </div>
            )}
            <div className="mt-6">
              <CopyButton
                getText={() =>
                  [
                    current.variation.spoken_hook,
                    current.variation.visual_hook &&
                      `Visual: ${current.variation.visual_hook}`,
                  ]
                    .filter(Boolean)
                    .join('\n\n')
                    .replace(/\*\*/g, '')
                }
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
