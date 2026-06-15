import { Fragment } from 'react';
import Button from '@/components/ui/Button';
import PricingCard from '@/components/ui/PricingCard';

/*
 * Beta pricing (Figma node 122:226). Only the middle Deep Dive card is open
 * during beta; the flanking cards tease the full-price tier.
 *
 * TEMPORARY — the flanking cards are rendered as real PricingCard DOM (not the
 * blurred image bakes) so we can finalize the UI: match all three cards in
 * width, height, and content before re-baking. Once the design is signed off,
 * swap the two locked cards back to <LockedCard> image bakes (see git history +
 * scripts/rebake-locked-cards.cjs) so the teaser copy and price stay out of the
 * served HTML, where inspect-element / Ctrl+F / crawlers could read straight
 * through a CSS blur.
 */

const betaDeepDive = {
  tier: 'DEEP\nDIVE',
  originalPrice: '₱799.00',
  price: '₱299.00',
  badge: 'BETA PRICING',
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

// The two locked tiers teased on either side of the open beta card. The copy
// is placeholder — these cards ship blurred, so exact wording doesn't matter,
// only that each card reads as a distinct tier (different name, price, and
// bullet shapes) even through the blur. Keep five bullets and short lines so
// the three cards stay the same height. Mirrored into the image bakes via
// scripts/rebake-locked-cards.cjs once finalized.
const lockedQuickScan = {
  tier: 'QUICK\nSCAN',
  price: '₱499.00',
  description:
    'A fast pulse-check on your posts — the quickest way to see what is landing and what is not.',
  features: [
    <Fragment key="hooks">
      <b>Top 3 hooks</b> from your recent posts, ranked by what stopped the
      scroll
    </Fragment>,
    <Fragment key="engagement">
      A quick <b>engagement read</b> on every video so you know what to repeat
    </Fragment>,
    <Fragment key="pattern">
      <b>One standout pattern</b> we noticed across your last few weeks
    </Fragment>,
    <Fragment key="captions">
      <b>Caption tips</b> shaped around the style of your next upload
    </Fragment>,
    <Fragment key="timing">
      <b>Best time to post</b> for your audience, based on your own data
    </Fragment>,
  ],
};

const lockedProStudio = {
  tier: 'PRO\nSTUDIO',
  price: '₱999.00',
  description:
    'The full creative system — deeper analysis, more videos, and guidance to scale what works.',
  features: [
    <Fragment key="everything">
      <b>Everything in Deep Dive</b>, plus a deeper layer of strategy and review
    </Fragment>,
    <Fragment key="videos">
      Analysis across your <b>50 most recent videos</b>, not just the top
      performers
    </Fragment>,
    <Fragment key="calls">
      <b>Monthly strategy calls</b> to map out your next content moves
    </Fragment>,
    <Fragment key="scripts">
      <b>Custom hook scripts</b> written for you and ready to film this week
    </Fragment>,
    <Fragment key="support">
      <b>Priority support</b> and early access to every new GIA feature
    </Fragment>,
  ],
};

export default function Pricing(): React.ReactElement {
  // The divider on the cards sits a fixed distance K below the top of the page
  // (static layout): K ~= 600px stacked (mobile), ~= 572px once the cards sit
  // in a row (md+). To land that divider on the fold on ANY screen height, the
  // gap above the cards tracks the viewport: gap = 100svh - K. clamp() keeps
  // the prices on-screen on short viewports (min) and caps the whitespace on
  // very tall ones (max). The space below the cards (cards -> footer) is kept
  // equal to the gap by offsetting pb by the shell's py-10 (40px), so both the
  // clamp bounds and the calc stay in lockstep.
  return (
    <section className="flex w-full flex-col items-center gap-[clamp(48px,calc(100svh_-_600px),400px)] px-5 pt-8 pb-[clamp(8px,calc(100svh_-_640px),360px)] sm:px-8 md:gap-[clamp(48px,calc(100svh_-_572px),400px)] md:px-16 md:pb-[clamp(8px,calc(100svh_-_612px),360px)]">
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

      {/* Three fixed 350px cards. They only fit side-by-side once the row has
          ~1128px of content (desktop, `xl`). Below that we stack a single
          centered column rather than letting flex-wrap strand the third card on
          a second row — the staggered 2-up state that looked broken on iPad. */}
      <div className="flex w-full flex-col items-center justify-center gap-[39px] xl:flex-row xl:items-stretch">
        <PricingCard
          variant="light"
          {...lockedQuickScan}
          cta={
            <Button variant="filled" disabled className="w-full">
              Coming Soon
            </Button>
          }
        />
        <PricingCard
          variant="featured"
          {...betaDeepDive}
          cta={
            <Button
              href="/form"
              variant="onBrand"
              withArrow
              transition
              className="w-full"
            >
              Get your Report
            </Button>
          }
        />
        <PricingCard
          variant="gold"
          {...lockedProStudio}
          cta={
            <Button variant="onGold" disabled className="w-full">
              Coming Soon
            </Button>
          }
        />
      </div>
    </section>
  );
}
