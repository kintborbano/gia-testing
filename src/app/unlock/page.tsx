'use client';

import { Suspense } from 'react';
import UnlockShell from '@/components/unlock/UnlockShell';

export default function UnlockPage(): React.ReactElement {
  return (
    <Suspense>
      <UnlockShell />
    </Suspense>
  );
}
