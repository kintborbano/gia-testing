import { notFound } from 'next/navigation';
import { normalizeReportHandle } from '@/lib/dummy/reportData';
import Main from '@/components/report/Main';
import ContentPillars from '@/components/report/ContentPillars';
import ContentStrategy from '@/components/report/ContentStrategy';
import AudienceIntelligence from '@/components/report/AudienceIntelligence';
import HookFormulaScripts from '@/components/report/HookFormulaScripts';
import VideoBreakdownSection from '@/components/report/VideoBreakdownSection';

interface ReportPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ReportPage({
  params,
}: ReportPageProps): Promise<React.ReactElement> {
  const { handle: rawHandle } = await params;
  const handle = normalizeReportHandle(rawHandle);

  if (!handle) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-12 text-gray-900 sm:px-6">
      <Main handle={handle} />
      <ContentPillars />
      <ContentStrategy />
      <AudienceIntelligence />
      <HookFormulaScripts />
      <VideoBreakdownSection handle={handle} />

      {/* FOOTER ACTIONS */}
      <section className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
        <button
          type="button"
          className="rounded-full bg-[#8c1f2e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#751a26]"
        >
          Download PDF Report
        </button>
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Start Over
        </button>
      </section>
    </main>
  );
}
