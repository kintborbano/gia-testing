import type { Metadata } from 'next';
import LoadingScreen from '@/components/loading/LoadingScreen';

export const metadata: Metadata = {
  title: 'Analyzing…',
  description: 'GIA is analyzing the TikTok account you submitted.',
};

interface LoadingPageProps {
  searchParams: Promise<{ handle?: string }>;
}

export default async function LoadingPage({
  searchParams,
}: LoadingPageProps): Promise<React.ReactElement> {
  const { handle } = await searchParams;
  return <LoadingScreen handle={handle} />;
}
