import type { Metadata } from 'next';
import NotFound from '@/components/NotFound';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFoundPage(): React.ReactElement {
  return <NotFound />;
}
