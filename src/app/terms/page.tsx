import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import LegalDocument from '@/components/legal/LegalDocument';
import { TERMS_AND_CONDITIONS } from '@/lib/legal/terms';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The Terms & Conditions that govern access to and use of GIA, powered by Sofi AI.',
};

export default function TermsPage(): React.ReactElement {
  return (
    <SubPageShell>
      <LegalDocument content={TERMS_AND_CONDITIONS} />
    </SubPageShell>
  );
}
