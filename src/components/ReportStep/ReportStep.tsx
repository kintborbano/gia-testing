import TabFolder from '@/components/ui/TabFolder';

const REPORT_TABS = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-2 text-gray-700">
        <h3 className="font-semibold text-gray-900">Strong opening tension</h3>
        <p>
          Your hook creates a clear reason to keep watching, but the payoff can
          be stated sooner for faster comprehension.
        </p>
      </div>
    ),
  },
  {
    id: 'engagement',
    label: 'Engagement',
    content: (
      <div className="space-y-2 text-gray-700">
        <h3 className="font-semibold text-gray-900">Conversation potential</h3>
        <p>
          The topic invites agreement and disagreement, which gives the post a
          useful comment trigger.
        </p>
      </div>
    ),
  },
  {
    id: 'audience',
    label: 'Audience',
    content: (
      <div className="space-y-2 text-gray-700">
        <h3 className="font-semibold text-gray-900">Clear viewer promise</h3>
        <p>
          The best-fit viewer understands what they will learn within the first
          few seconds.
        </p>
      </div>
    ),
  },
  {
    id: 'content',
    label: 'Content',
    content: (
      <div className="space-y-2 text-gray-700">
        <h3 className="font-semibold text-gray-900">Next hook direction</h3>
        <p>
          Lead with the result, then use the first caption line to add the
          unexpected detail that earns the watch.
        </p>
      </div>
    ),
  },
];

interface ReportStepProps {
  tiktokValue: string;
  onViewFullReport: () => void;
}

export default function ReportStep({
  tiktokValue,
  onViewFullReport,
}: ReportStepProps): React.ReactElement {
  return (
    <section className="space-y-8 rounded-lg bg-white p-8 shadow-sm">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Hook report preview
        </h2>
        <div className="inline-block rounded-lg bg-gray-100 px-4 py-2">
          <p className="text-lg font-semibold text-gray-900">
            @{tiktokValue || 'username'}
          </p>
        </div>
      </div>

      <TabFolder tabs={REPORT_TABS} />

      <button
        onClick={onViewFullReport}
        className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        View Full Report
      </button>
    </section>
  );
}
