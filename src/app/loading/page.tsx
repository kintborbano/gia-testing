import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoadingScreen from '@/components/loading/LoadingScreen';

export const metadata: Metadata = {
  title: 'Analyzing…',
  description: 'GIA is analyzing the TikTok account you submitted.',
};

export default function LoadingPage(): React.ReactElement {
  return (
    <Suspense fallback={<main className="bg-brand-primary flex w-full flex-1 flex-col" />}>
      <LoadingScreen />
    </Suspense>
  );
}
