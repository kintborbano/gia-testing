import { SectionLabel } from '@/components/report/Primitives';
import VideoBreakdown from '@/components/report/VideoBreakdown';
import { reportVideos } from '@/lib/dummy/videoBreakdown';

export default function VideoBreakdownSection({
  handle,
}: {
  handle: string;
}): React.ReactElement {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <SectionLabel>Video Breakdown</SectionLabel>
        <span className="text-sm text-gray-500">
          {reportVideos.length} videos
        </span>
      </div>
      <VideoBreakdown
        videos={reportVideos}
        profileUrl={`https://www.tiktok.com/@${handle}`}
      />
    </section>
  );
}
