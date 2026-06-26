'use client';

import { useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { SectionLabel } from '@/components/report/Primitives';
import VideoBreakdown from '@/components/report/VideoBreakdown';
import VideoExplorer from '@/components/report/VideoExplorer';
import type { ExplorerPoint } from '@/components/report/VideoExplorer';
import { formatCount } from '@/lib/format';
import { splitBullets, toText } from '@/lib/text';
import type { ApiResult, VideoAnalysis } from '@/types/api';
import type { Video } from '@/types/report';

// Display order + weights mirror compute_gia_score in the backend.
const GAUGE_METRICS = [
  { key: 'view_rate', label: 'Views', weight: '30%' },
  { key: 'share_rate', label: 'Shares', weight: '25%' },
  { key: 'reaction_rate', label: 'Reactions', weight: '20%' },
  { key: 'comment_rate', label: 'Comments', weight: '15%' },
  { key: 'save_rate', label: 'Saves', weight: '10%' },
] as const;

function toVideo(a: VideoAnalysis): Video {
  const breakdown = a.gia_breakdown ?? {};
  return {
    id: a.video_id,
    url: a.url,
    gia: a.gia_score.toFixed(1),
    score: a.gia_score,
    title: a.title || a.video_id,
    hook: a.hook_type,
    er: `${Number(a.engagement_rate).toFixed(2)}% ER`,
    views: formatCount(a.views),
    proven: a.gia_score >= 7,
    details: {
      rawScore: a.gia_raw.toFixed(2),
      gauge: GAUGE_METRICS.map(({ key, label, weight }) => ({
        label,
        value: breakdown[key] != null ? `${breakdown[key].toFixed(2)}%` : '—',
        weight,
      })),
      counts: {
        views: formatCount(a.views),
        likes: formatCount(a.likes),
        shares: formatCount(a.shares),
        saves: formatCount(a.bookmarks),
        comments: formatCount(a.comment_count),
      },
      hookTrigger: toText(a.hook_trigger_3s) || null,
      whyItWorks: splitBullets(a.why_it_works),
      improvements: splitBullets(a.improvement),
      commentInsights: toText(a.comment_insights),
      positive: a.comment_sentiment?.positive ?? [],
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
    erPct: Number(a.engagement_rate) || 0,
    hookStrength: a.hook_strength,
  };
}

export default function VideoBreakdownSection({
  handle,
  result,
  locked,
  unlockHref,
}: {
  handle: string;
  result?: ApiResult | null;
  locked?: boolean;
  unlockHref?: string;
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
      {locked ? (
        <a href={unlockHref} className="relative block">
          <div className="pointer-events-none blur-sm">
            <VideoExplorer
              points={points}
              selectedId={null}
              onSelect={() => {}}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-sans text-sm font-semibold text-gray-700 shadow">
              <Lock className="h-4 w-4" /> Click to unlock
            </span>
          </div>
        </a>
      ) : (
        <VideoExplorer
          points={points}
          selectedId={openId}
          onSelect={selectFromExplorer}
        />
      )}
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
