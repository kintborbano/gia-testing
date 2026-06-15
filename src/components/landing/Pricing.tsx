import Image from 'next/image';
import Button from '@/components/ui/Button';
import PricingCard from '@/components/ui/PricingCard';
import { betaDeepDive } from './pricingTiers';

/*
 * Beta pricing (Figma node 122:226). Only the middle Deep Dive card is open
 * during beta; the flanking cards tease the locked QUICK SCAN / PRO STUDIO
 * tiers.
 *
 * The locked cards are pre-blurred image bakes, NOT blurred DOM — the teaser
 * copy and price must not exist in the served HTML, where inspect-element /
 * Ctrl+F / crawlers would read straight through a CSS blur. The bakes are
 * screenshots of the real cards (rendered on the dev-only /pricing/bake route)
 * with the content blurred over the card's solid background and a frost + lock
 * laid on top. To regenerate them after a copy/price/design change, edit
 * pricingTiers.tsx and run scripts/rebake-locked-cards.cjs.
 *
 * The bakes are 350x612 — the card width and its (stretched) height. Keep this
 * in sync with the rebake script's logged dimensions if the design height
 * changes.
 */
function LockedCard({ src }: { src: string }): React.ReactElement {
  return (
    <div className="w-[350px] max-w-full rounded-[30px] shadow-[0_5px_0_var(--color-brand-gold-shadow)]">
      <Image
        src={src}
        alt="Locked plan — coming soon"
        width={350}
        height={612}
        className="h-auto w-full rounded-[30px]"
      />
    </div>
  );
}

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
        <LockedCard src="/images/pricing-locked-light.webp" />
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
        <LockedCard src="/images/pricing-locked-gold.webp" />
      </div>
    </section>
  );
}
