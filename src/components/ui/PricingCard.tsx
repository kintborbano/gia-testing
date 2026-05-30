interface PricingCardProps {
  tier: string;
  price: string;
  billingPeriod: string;
  features: string[];
  featured?: boolean;
}

export default function PricingCard({
  tier,
  price,
  billingPeriod,
  features,
  featured,
}: PricingCardProps): React.ReactElement {
  return (
    <div
      className={`flex flex-col gap-6 rounded-[15px] border p-8 ${
        featured
          ? 'border-black bg-[#fef7dd] text-[#8c1f2e]'
          : 'border-black bg-white text-[#8c1f2e]'
      }`}
    >
      <div className="flex flex-col gap-2">
        <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
          {tier}
        </p>
        <div className="font-young-serif text-[40px] leading-[1.1] tracking-[-0.8px]">
          {price}
        </div>
        <p className="font-sans text-[15px] tracking-[-0.3px] text-black">
          {billingPeriod}
        </p>
      </div>

      <ul className="flex-1 space-y-3 text-black">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2 font-sans text-[15px] tracking-[-0.3px]"
          >
            <span className="text-[#8c1f2e]">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="h-[44px] rounded-full border border-[#8c1f2e] bg-[#8c1f2e] font-sans text-[15px] font-bold tracking-[-0.3px] text-white"
      >
        Choose Plan
      </button>
    </div>
  );
}
