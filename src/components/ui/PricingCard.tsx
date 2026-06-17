import { CircleCheckBig } from 'lucide-react';

type PricingCardVariant = 'light' | 'featured' | 'gold';

interface PricingCardProps {
  /** Tier name; '\n' stacks lines like the design's "DEEP / DIVE". */
  tier: string;
  price: string;
  /** Pre-beta price, rendered scribbled out above `price` (featured card). */
  originalPrice?: string;
  /** Small cream pill under the tier name, e.g. "BETA PRICING". */
  badge?: string;
  description?: string;
  /** Bullet list under "Includes:" — entries may carry bold spans. */
  features: React.ReactNode[];
  /** Optional CTA rendered full-width at the bottom of the card. */
  cta?: React.ReactNode;
  variant?: PricingCardVariant;
}

const CARD_PALETTE: Record<PricingCardVariant, string> = {
  light: 'bg-white text-brand-primary',
  featured: 'bg-brand-primary text-white',
  gold: 'bg-[#c9920a] text-white',
};

// Divider hairline: a lightened tint of each card's surface (~30% toward
// white). The white `light` card can't be lightened, so its rule borrows the
// card's maroon text instead, as a pale dusty rose.
const DIVIDER_COLOR: Record<PricingCardVariant, string> = {
  light: 'bg-[#d7b1b6]',
  featured: 'bg-[#af626d]',
  gold: 'bg-[#d9b354]',
};

export default function PricingCard({
  tier,
  price,
  originalPrice,
  badge,
  description,
  features,
  cta,
  variant = 'light',
}: PricingCardProps): React.ReactElement {
  const featured = variant === 'featured';

  return (
    <div
      className={`border-brand-gold relative flex w-[350px] max-w-full flex-col rounded-[30px] border-[3px] shadow-[0_5px_0_var(--color-brand-gold-shadow)] ${
        CARD_PALETTE[variant]
      } ${
        featured
          ? 'px-[27px] pt-[33px] pb-[47px]'
          : 'min-h-[400px] px-[27px] pt-[33px] pb-[47px]'
      }`}
    >
      {/* Header + teaser copy + a flexible spacer share a fixed-height region
          so the "Includes:" heading below it lands on the same y across all
          three cards, even though each header carries a different amount of
          copy (badge, scribbled price, description). The divider lives in the
          spacer and is vertically centered there, so it always falls midway
          between the header copy and "Includes:" no matter how tall the
          header is. */}
      <div className="flex min-h-[170px] flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start gap-[14px]">
            <p
              className={`font-sans font-bold whitespace-pre-line ${
                featured
                  ? 'text-[25px] leading-[1.14] tracking-[-0.125px]'
                  : 'text-[20px] leading-[1.45] tracking-[-0.1px]'
              }`}
            >
              {tier}
            </p>
            {badge && (
              <span className="bg-brand-cream text-brand-primary flex h-[24px] items-center rounded-full px-[12px] font-sans text-[10px] font-bold tracking-[-0.05px]">
                {badge}
              </span>
            )}
          </div>
          <div className="font-averia-serif flex flex-col items-start gap-[12px] text-[40px] leading-[1.1] font-bold tracking-[-0.8px]">
            {originalPrice && (
              <span className="relative text-white/30">
                {originalPrice}
                {/* Scribble-out: a bright maroon-red stroke through the faded
                    old price, so it reads against the maroon surface; rounded
                    ends so it looks like a drawn slash. */}
                <span
                  aria-hidden="true"
                  className="bg-brand-cream absolute top-1/2 left-[-9px] h-[5px] w-[155px] -translate-y-1/2 rotate-[5.72deg] rounded-full"
                />
              </span>
            )}
            <span>{price}</span>
          </div>
        </div>

        {description && (
          <p className="mt-[15px] w-[290px] max-w-full font-sans text-[13px] leading-[1.45] tracking-[-0.065px]">
            {description}
          </p>
        )}

        {/* mt-auto drops the divider to the bottom of the fixed-height region
            and mb lifts it a fixed amount off that (shared) bottom edge — so
            the divider lands on the same y across all three cards regardless of
            how tall each header is, while still sitting in the gap between the
            header copy and "Includes:". */}
        <div className="mt-auto mb-[26px]">
          <div
            className={`h-[2px] w-full rounded-full ${DIVIDER_COLOR[variant]}`}
          />
        </div>
      </div>

      {/* "Includes:" flows directly under the fixed-height header region (no
          mt-auto), so it stays aligned regardless of how many feature bullets
          follow. */}
      <div>
        <p className="font-sans text-[13px] leading-[1.45] tracking-[-0.065px]">
          Includes:
        </p>
        <ul
          className={`space-y-[10px] font-sans text-[13px] leading-[1.45] tracking-[-0.065px] ${
            featured ? 'mt-[11px] max-w-[280px]' : 'mt-[16px]'
          }`}
        >
          {features.map((feature, index) => (
            <li key={index} className="flex gap-[16px]">
              <CircleCheckBig
                aria-hidden="true"
                className="mt-[2px] size-[15px] shrink-0"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* mt-auto drops the CTA to the bottom of the (equal-height) card; the
          pt keeps a minimum gap from the last bullet on the tallest card. */}
      {cta && <div className="mt-auto flex flex-col pt-[40px]">{cta}</div>}
    </div>
  );
}
