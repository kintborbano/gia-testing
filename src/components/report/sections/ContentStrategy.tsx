import { SectionLabel, Bullet } from '@/components/report/primitives';

const postingStrategy = [
  'Double down on relatable university student life content — videos focusing on this theme average 10.44% ER, significantly outperforming the overall average.',
  "Integrate fashion as a supporting element within relatable narratives rather than as the sole focus, leveraging the 'back view pls😊' interest from 'update : YESSS' (8.82% ER) to enhance engagement.",
  "Avoid static, purely question-based selfie hooks without additional visual or contextual elements, given 'ni goon …' only achieved 2.2% ER and no comments.",
];

const whatWorks = [
  "Relatable student life experiences resonate strongly, driving 16.67% ER for the untitled video with comments asking 'pauwi na po, anong gusto mong ulamin?' and 8.82% ER for 'update : YESSS' with its 'On my way! to offend my thesis' overlay.",
  "Personal milestones related to academics connect well, as seen by the 'to usc we sing #freedom' video achieving 5.83% ER with comments like 'WHATT PROGRAMMM?' and 'GOODLUCK MAMI😻😻😻'.",
];

const whatToAvoid = [
  "Generic question-based engagement focused solely on personal appearance without broader context falls flat, with 'ni goon …' getting only 2.2% ER and zero comments.",
];

export default function ContentStrategy(): React.ReactElement {
  return (
    <section className="space-y-6">
      <SectionLabel>Content Strategy</SectionLabel>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Posting Strategy
        </h3>
        <ul className="space-y-2">
          {postingStrategy.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">What Works</h3>
        <ul className="space-y-2">
          {whatWorks.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">What to Avoid</h3>
        <ul className="space-y-2">
          {whatToAvoid.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
