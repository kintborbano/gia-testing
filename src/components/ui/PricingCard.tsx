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
          : 'min-h-[400px] px-[27px] pt-[24px] pb-[23px]'
      }`}
    >
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
            <span className="bg-brand-cream text-brand-primary flex h-[21px] items-center rounded-full px-[8px] font-sans text-[10px] font-bold tracking-[-0.05px]">
              {badge}
            </span>
          )}
        </div>
        <div
          className={`font-averia-serif flex flex-col items-start text-[40px] leading-[1.1] font-bold tracking-[-0.8px] ${
            featured ? 'mt-[13px]' : ''
          }`}
        >
          {originalPrice && (
            <span className="relative text-white/30">
              {originalPrice}
              {/* Scribble-out: a card-colored stroke, visible only where it
                  crosses the faded glyphs. */}
              <span
                aria-hidden="true"
                className="bg-brand-primary absolute top-1/2 left-[-9px] h-[5px] w-[155px] -translate-y-1/2 rotate-[5.72deg]"
              />
            </span>
          )}
          <span>{price}</span>
        </div>
      </div>

      {description && (
        <p
          className={`w-[290px] max-w-full font-sans text-[13px] leading-[1.45] tracking-[-0.065px] ${
            featured ? 'mt-[15px]' : 'mt-[19px]'
          }`}
        >
          {description}
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-current" />
        <p
          className={`font-sans text-[13px] leading-[1.45] tracking-[-0.065px] ${
            featured ? 'mt-[24px]' : 'mt-[8px]'
          }`}
        >
          Includes:
        </p>
        <ul
          className={`list-disc ps-[20px] font-sans text-[13px] leading-[1.45] tracking-[-0.065px] ${
            featured ? 'mt-[11px] max-w-[280px]' : 'mt-[16px]'
          }`}
        >
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {cta && <div className="mt-[28px] flex flex-col">{cta}</div>}
    </div>
  );
}
