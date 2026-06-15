import type { Metadata } from 'next';
import SubPageShell from '@/components/landing/SubPageShell';
import LegalDocument from '@/components/legal/LegalDocument';
import { PRIVACY_POLICY } from '@/lib/legal/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How GIA, powered by Sofi AI, collects, processes, and protects information when you use the platform.',
};

export default function PrivacyPage(): React.ReactElement {
  return (
    <SubPageShell>
      <LegalDocument content={PRIVACY_POLICY} />
    </SubPageShell>
  );
}
