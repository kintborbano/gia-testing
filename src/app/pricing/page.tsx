import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import Pricing from '@/components/landing/Pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'GIA report plans — one-time hook breakdowns and monthly deep dives for TikTok creators.',
};

export default function PricingPage(): React.ReactElement {
  return (
    <SubPageShell>
      <Pricing />
    </SubPageShell>
  );
}
