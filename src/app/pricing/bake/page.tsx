import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';
import PricingCard from '@/components/ui/PricingCard';
import {
  betaDeepDive,
  lockedQuickScan,
  lockedProStudio,
} from '@/components/landing/pricingTiers';

/*
 * Dev-only baking surface. Renders the three pricing tiers as real DOM so
 * scripts/rebake-locked-cards.cjs can screenshot the two flanking cards and
 * blur them into public/images/pricing-locked-*.webp. The middle Deep Dive card
 * is rendered too (not baked) only so the locked cards stretch to its height.
 *
 * Returns 404 outside development, so the locked tiers' copy + price never ship
 * in production HTML — the whole point of baking them to images.
 */
export default function PricingBakePage(): React.ReactElement {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <div className="bg-brand-cream flex items-stretch justify-center gap-[39px] p-12">
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
          <Button variant="onBrand" withArrow className="w-full">
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
  );
}
