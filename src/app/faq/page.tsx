import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import FAQ from '@/components/landing/FAQ';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to the questions creators ask before subscribing to GIA — how it scores hooks, which niches it fits, and what your report includes.',
};

export default function FaqPage(): React.ReactElement {
  return (
    <SubPageShell>
      <FAQ />
    </SubPageShell>
  );
}
