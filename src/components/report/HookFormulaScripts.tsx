import { SectionLabel } from '@/components/report/Primitives';

const hookFormula =
  "The highest-performing videos like the untitled one (16.67% ER) and '#levisjeans #bruh' (13.12% ER) consistently use a close-up, direct eye contact shot of the creator, often with a relatable text overlay.";

const visualStyle =
  'Prioritize intimate, direct-to-camera close-ups in the first few seconds, as seen in the 16.67% ER untitled video, to establish immediate personal connection, often combined with a clear text overlay that provides context or a relatable statement.';

const scripts = [
  {
    goal: 'Drive Comments',
    say: "Uy, sino nakaka-relate? Feeling ko, 'di na 'to thesis, gera na 'to!",
    show: 'Creator looking comically exasperated at a laptop screen filled with thesis work, then quickly cuts to a confident strut in an outfit.',
  },
  {
    goal: 'Drive Shares',
    say: "POV: Ginagawa mo ang lahat para matapos ang college, kahit 'di na kaya ng katawang lupa mo. Send this to your academic burnout buddy!",
    show: 'Creator making a determined but tired face, then a quick cut to a celebratory, relieved expression, maybe throwing papers in the air (gently).',
  },
  {
    goal: 'Drive Saves',
    say: "Guys, found the perfect OOTD for 'sakit-ulo-sa-thesis' days. Pero, 'wag niyo pansinin 'yung tag! Ano sa tingin niyo?",
    show: 'Creator doing a quick 360 spin to show off an outfit, then a close-up on the clothing tag peeking out, with a playful eye roll.',
  },
];

export default function HookFormulaScripts(): React.ReactElement {
  return (
    <section className="space-y-6">
      <SectionLabel>Hook Formula &amp; Scripts</SectionLabel>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Ideal Hook Formula
        </h3>
        <p className="text-sm leading-relaxed text-gray-600">{hookFormula}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">Visual Style</h3>
        <p className="text-sm leading-relaxed text-gray-600">{visualStyle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {scripts.map((script) => (
          <div
            key={script.goal}
            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <span className="self-start rounded-full bg-[#8c1f2e]/10 px-2.5 py-0.5 text-xs font-semibold text-[#8c1f2e]">
              {script.goal}
            </span>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Say this:
              </p>
              <p className="text-sm leading-relaxed text-gray-800 italic">
                &quot;{script.say}&quot;
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Show this:
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                {script.show}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
