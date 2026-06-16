'use client';

import { Suspense } from 'react';
import ReportShell from '@/components/report/ReportShell';

export default function ReportPage(): React.ReactElement {
  return (
    <Suspense>
      <ReportShell />
    </Suspense>
  );
}
