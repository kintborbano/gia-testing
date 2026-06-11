import { SectionLabel } from '@/components/report/Primitives';
import VideoBreakdown from '@/components/report/VideoBreakdown';
import type { ApiResult, VideoAnalysis } from '@/types/api';
import type { Video } from '@/types/report';

function fmt(n: number | string): string {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(num)) return '—';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(Math.round(num));
}

function toVideo(a: VideoAnalysis): Video {
  return {
    gia: a.gia_score.toFixed(1),
    score: a.gia_score,
    title: a.title || a.video_id,
    hook: a.hook_type,
    er: `${(a.engagement_rate * 100).toFixed(2)}% ER`,
    views: fmt(a.views),
    proven: a.gia_score >= 7,
    details: {
      rawScore: a.gia_raw.toFixed(2),
      gauge: [
        { label: 'Shares', value: a.gia_breakdown.shares.toFixed(2), weight: '30%' },
        { label: 'Reactions', value: a.gia_breakdown.reactions.toFixed(2), weight: '25%' },
        { label: 'Comments', value: a.gia_breakdown.comments.toFixed(2), weight: '20%' },
        { label: 'Saves', value: a.gia_breakdown.saves.toFixed(2), weight: '25%' },
      ],
      counts: {
        views: fmt(a.views),
        likes: fmt(a.likes),
        shares: fmt(a.shares),
        saves: fmt(a.bookmarks),
        comments: fmt(a.comment_count),
      },
      hookTrigger: a.hook_trigger_3s,
      whyItWorks: [a.why_it_works],
      improvements: [a.improvement],
      commentInsights: a.comment_insights,
      positive: a.comment_sentiment.positive,
    },
  };
}

export default function VideoBreakdownSection({
  handle,
  result,
}: {
  handle: string;
  result?: ApiResult | null;
}): React.ReactElement | null {
  const analyses = result?.analyses;
  if (!analyses?.length) return null;

  const videos = analyses.map(toVideo);

  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <SectionLabel>Video Breakdown</SectionLabel>
        <span className="text-sm text-gray-500">{videos.length} videos</span>
      </div>
      <VideoBreakdown
        videos={videos}
        profileUrl={`https://www.tiktok.com/@${handle}`}
      />
    </section>
  );
}
