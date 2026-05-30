import PricingCard from '@/components/ui/PricingCard';

export default function Pricing(): React.ReactElement {
  const pricingTiers = [
    {
      tier: 'STARTER',
      price: '₱3,500',
      billingPeriod: 'One-Time Report',
      features: [
        '10 video analysis',
        'Hook scoring + breakdown',
        'Comment sentiment',
        '3 video ideas',
        'Shareable story card',
      ],
    },
    {
      tier: 'DEEP DIVE',
      price: '₱6,500',
      billingPeriod: 'One-Time Report',
      features: [
        '30 video analysis',
        'Full hook + comment deep dive',
        'GIA account score',
        '5 video ideas + hook scripts',
        '30-day content roadmap',
        'Shareable story card',
      ],
      featured: true,
    },
    {
      tier: 'MONTHLY',
      price: '₱12,000',
      billingPeriod: 'Per Month',
      features: [
        'Weekly mini-reports',
        'Monthly full deep dive',
        'Strategy calls included',
        'Priority turnaround',
        '4 story cards/month',
        'Slack access to GIA',
      ],
    },
  ];

  return (
    <section
      id="bg-stop-pricing"
      className="flex w-full flex-col items-center px-16 py-10"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center justify-center rounded-[24px] bg-[#8c1f2e] px-16 py-20">
        <div className="flex w-full flex-col items-center gap-6 text-center text-white">
          <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
            PRICING
          </p>
          <h2 className="font-young-serif w-full text-[56px] leading-[1.1] tracking-[-1.12px]">
            pick your plan, slay your feed.
          </h2>
          <p className="w-[480px] max-w-full font-sans text-[24px] leading-[1.25] font-medium tracking-[-0.12px]">
            Choose the plan that fits how often you post — and how loud you want
            to grow.
          </p>
        </div>

        <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.tier}
              tier={tier.tier}
              price={tier.price}
              billingPeriod={tier.billingPeriod}
              features={tier.features}
              featured={tier.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
