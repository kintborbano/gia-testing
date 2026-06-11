import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import Pricing from '@/components/landing/Pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'GIA beta pricing — get the Deep Dive report: hook scoring, comment intelligence, and performance patterns across your 20 most recent TikToks.',
};

export default function PricingPage(): React.ReactElement {
  return (
    <SubPageShell
      headerBackground="rgb(254, 247, 221)"
      surfaceClassName="bg-brand-cream"
      footerVariant="cream"
    >
      <Pricing />
    </SubPageShell>
  );
}
