import { notFound } from 'next/navigation';
import Gia from '@/components/report/Gia';
import MainCard from '@/components/report/MainCard';
import { getDummyReportByHandle } from '@/lib/dummy/reportData';

interface ReportPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { handle } = await params;
  const report = getDummyReportByHandle(handle);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Gia />
        <MainCard data={report} />
      </div>
    </main>
  );
}
