import { Fragment } from 'react';
import Image from 'next/image';
import PricingCard from '@/components/ui/PricingCard';

/*
 * Beta pricing (Figma node 122:226). Only the middle Deep Dive card is open
 * during beta; the flanking cards tease the full-price tier behind a frosted
 * lock.
 *
 * The locked cards are pre-blurred screenshots, not blurred DOM — the teaser
 * copy and price must not exist in the HTML, where inspect-element /
 * Ctrl+F / crawlers would read straight through a CSS backdrop blur. To
 * change them, restore the card markup from git history (PricingCard's
 * `locked` overlay, removed in the same commit that added these images),
 * tweak it, and re-capture at 2x.
 */

const betaDeepDive = {
  tier: 'DEEP\nDIVE',
  originalPrice: '₱799.00',
  price: '₱299.00',
  badge: 'BETA PRICING',
  description:
    "Get the full report and be one of the first creators to know exactly what's driving your growth.",
  features: [
    <Fragment key="videos">
      Analysis across your <b>20 most recent videos</b>
    </Fragment>,
    <Fragment key="scoring">
      <b>Hook scoring:</b> see what made people stop, skip, or stay
    </Fragment>,
    <Fragment key="comments">
      <b>Comment intelligence:</b> what your audience keeps asking for, turned
      into ideas
    </Fragment>,
    // Plain-string tails: this Next's JSX transform drops the space between
    // an element and a following text node that contains an entity.
    <Fragment key="patterns">
      <b>Performance patterns:</b>
      {" what's actually driving your saves, shares, and views"}
    </Fragment>,
    <Fragment key="pdf">
      A <b>downloadable PDF</b> of your GIA report.
    </Fragment>,
    <Fragment key="wrapped">
      <b>GIA Wrapped:</b> a shareable recap on your wins.
    </Fragment>,
  ],
};

function LockedCard({ src }: { src: string }): React.ReactElement {
  return (
    <div className="w-[350px] max-w-full overflow-hidden rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <Image
        src={src}
        alt="Locked plan — coming soon"
        width={350}
        height={401}
        className="h-auto w-full"
      />
    </div>
  );
}

export default function Pricing(): React.ReactElement {
  return (
    <section className="flex w-full flex-col items-center gap-[65px] px-5 pt-8 pb-24 sm:px-8 md:px-16 md:pb-[165px]">
      <div className="text-brand-primary flex w-full flex-col items-center gap-6 text-center">
        <p className="bg-brand-primary flex h-[34px] w-[350px] max-w-full items-center justify-center rounded-full font-sans text-[15px] leading-[1.45] font-bold tracking-[-0.075px] text-white">
          BETA IS OPEN, FOR NOW.
        </p>
        <h1 className="font-averia-serif w-full text-[32px] leading-[1.1] font-bold tracking-[-1.12px] sm:text-[44px] md:text-[56px]">
          stop guessing. <span className="italic">start growing.</span>
        </h1>
        <p className="w-[736px] max-w-full font-sans text-[17px] md:text-[20px]">
          Your content deserves more than a hunch. GIA gives you the data, the
          strategy, and the hooks to back it up. Get your report now.
        </p>
      </div>

      <div className="flex w-full flex-wrap items-start justify-center gap-[39px]">
        <LockedCard src="/images/pricing-locked-light.webp" />
        <PricingCard variant="featured" {...betaDeepDive} />
        <LockedCard src="/images/pricing-locked-gold.webp" />
      </div>
    </section>
  );
}
