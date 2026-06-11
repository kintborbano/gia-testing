import { SectionLabel } from '@/components/report/Primitives';
import type { ApiResult } from '@/types/api';

export default function HookFormulaScripts({
  result,
}: {
  result?: ApiResult | null;
}): React.ReactElement | null {
  const overall = result?.overall;
  if (!overall) return null;

  const { ideal_hook_formula, visual_style_recommendation, script_hook_variations } = overall;

  const scripts = [
    { goal: 'Drive Comments', variation: script_hook_variations.for_comments },
    { goal: 'Drive Shares', variation: script_hook_variations.for_shares },
    { goal: 'Drive Saves', variation: script_hook_variations.for_saves },
  ].filter((s) => s.variation?.spoken_hook || s.variation?.visual_hook);

  return (
    <section className="space-y-6">
      <SectionLabel>Hook Formula &amp; Scripts</SectionLabel>

      {ideal_hook_formula && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Ideal Hook Formula</h3>
          <p className="text-sm leading-relaxed text-gray-600">{ideal_hook_formula}</p>
        </div>
      )}

      {visual_style_recommendation && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Visual Style</h3>
          <p className="text-sm leading-relaxed text-gray-600">{visual_style_recommendation}</p>
        </div>
      )}

      {scripts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {scripts.map(({ goal, variation }) => (
            <div
              key={goal}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <span className="bg-brand-primary/10 text-brand-primary self-start rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {goal}
              </span>
              {variation.spoken_hook && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Say this:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-800 italic">
                    &quot;{variation.spoken_hook}&quot;
                  </p>
                </div>
              )}
              {variation.visual_hook && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Show this:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">{variation.visual_hook}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
