import Image from 'next/image';
import { SectionLabel, Pill } from '@/components/report/primitives';

const giaTakeHooks = [
  'relatable everyday experience',
  'milestone announcement',
  'relatability + personal connection',
];

export default function Main({
  handle,
}: {
  handle: string;
}): React.ReactElement {
  const vibe = `@${handle} is out here showing off relatable student life moments, dropping casual fashion inspo, and sharing big life updates, and tbh we're rooting for them. It's like having that one friend who just gets you, all while serving looks.`;
  const dataParagraph = `As a lifestyle creator focusing on university student life and fashion, @${handle} maintains an average engagement rate of 9.33% across analyzed videos, slightly outperforming the 9.2% niche benchmark by 0.13%.`;

  return (
    <>
      {/* INTRO */}
      <section className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="GIA"
          width={689}
          height={480}
          priority
          className="h-14 w-auto"
        />
        <h1 className="mt-4 text-3xl font-bold">Here&apos;s what I found!</h1>
        <p className="mt-3 text-xl font-semibold">@{handle}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
            lifestyle
          </span>
          <span>13.8K followers</span>
        </div>
      </section>

      {/* GIA SCORE */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="text-xs font-semibold tracking-widest text-[#8c1f2e] uppercase">
          GIA Score
        </div>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-6xl font-bold">3.2</span>
          <span className="text-2xl text-gray-400">/ 10</span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
          Average across all analyzed videos — normalized per 13.8K followers.
          Below average — content underperforming relative to audience size.
        </p>
      </section>

      {/* GIA'S TAKE */}
      <section className="space-y-4">
        <SectionLabel>GIA&apos;s Take</SectionLabel>
        <p className="text-base leading-relaxed text-gray-800">{vibe}</p>
        <p className="text-base leading-relaxed text-gray-600">
          {dataParagraph}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">Top hooks:</p>
          <div className="flex flex-wrap gap-2">
            {giaTakeHooks.map((hook) => (
              <Pill key={hook}>{hook}</Pill>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
