'use client';

import { useRef, useState } from 'react';
import { SectionLabel } from '@/components/report/Primitives';
import VideoBreakdown from '@/components/report/VideoBreakdown';
import VideoExplorer from '@/components/report/VideoExplorer';
import type { ExplorerPoint } from '@/components/report/VideoExplorer';
import { formatCount } from '@/lib/format';
import type { ApiResult, VideoAnalysis } from '@/types/api';
import type { Video } from '@/types/report';

function toVideo(a: VideoAnalysis): Video {
  return {
    id: a.video_id,
    gia: a.gia_score.toFixed(1),
    score: a.gia_score,
    title: a.title || a.video_id,
    hook: a.hook_type,
    er: `${(a.engagement_rate * 100).toFixed(2)}% ER`,
    views: formatCount(a.views),
    proven: a.gia_score >= 7,
    details: {
      rawScore: a.gia_raw.toFixed(2),
      gauge: [
        {
          label: 'Shares',
          value: a.gia_breakdown.shares.toFixed(2),
          weight: '30%',
        },
        {
          label: 'Reactions',
          value: a.gia_breakdown.reactions.toFixed(2),
          weight: '25%',
        },
        {
          label: 'Comments',
          value: a.gia_breakdown.comments.toFixed(2),
          weight: '20%',
        },
        {
          label: 'Saves',
          value: a.gia_breakdown.saves.toFixed(2),
          weight: '25%',
        },
      ],
      counts: {
        views: formatCount(a.views),
        likes: formatCount(a.likes),
        shares: formatCount(a.shares),
        saves: formatCount(a.bookmarks),
        comments: formatCount(a.comment_count),
      },
      hookTrigger: a.hook_trigger_3s,
      whyItWorks: [a.why_it_works],
      improvements: [a.improvement],
      commentInsights: a.comment_insights,
      positive: a.comment_sentiment.positive,
    },
  };
}

function toPoint(a: VideoAnalysis): ExplorerPoint | null {
  const views = typeof a.views === 'string' ? parseFloat(a.views) : a.views;
  if (isNaN(views) || views <= 0) return null;
  return {
    id: a.video_id,
    title: a.title || a.video_id,
    views,
    erPct: a.engagement_rate * 100,
    hookStrength: a.hook_strength,
  };
}

export default function VideoBreakdownSection({
  handle,
  result,
}: {
  handle: string;
  result?: ApiResult | null;
}): React.ReactElement | null {
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const analyses = result?.analyses;
  if (!analyses?.length) return null;

  const videos = analyses.map(toVideo);
  const points = analyses
    .map(toPoint)
    .filter((p): p is ExplorerPoint => p !== null);

  const selectFromExplorer = (id: string) => {
    setOpenId(id);
    // Wait a frame so the card's expansion has begun before scrolling to it.
    requestAnimationFrame(() => {
      cardRefs.current
        .get(id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <SectionLabel>Video Breakdown</SectionLabel>
        <span className="text-sm text-gray-500">{videos.length} videos</span>
      </div>
      <VideoExplorer
        points={points}
        selectedId={openId}
        onSelect={selectFromExplorer}
      />
      <VideoBreakdown
        videos={videos}
        profileUrl={`https://www.tiktok.com/@${handle}`}
        openId={openId}
        onOpenChange={setOpenId}
        registerCardRef={(id, el) => {
          if (el) cardRefs.current.set(id, el);
          else cardRefs.current.delete(id);
        }}
      />
    </section>
  );
}
