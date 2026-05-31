'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface VideoDetails {
  rawScore: string;
  gauge: { label: string; value: string; weight: string }[];
  counts: {
    views: string;
    likes: string;
    shares: string;
    saves: string;
    comments: string;
  };
  hookTrigger: string;
  whyItWorks: string[];
  improvements: string[];
  commentInsights: string;
  positive: string[];
}

export interface Video {
  gia: string;
  score: number;
  title: string;
  hook: string;
  er: string;
  views: string;
  proven: boolean;
  details?: VideoDetails;
}

const countIcons: {
  key: keyof VideoDetails['counts'];
  label: string;
  icon: LucideIcon;
}[] = [
  { key: 'views', label: 'Views', icon: Eye },
  { key: 'likes', label: 'Likes', icon: Heart },
  { key: 'shares', label: 'Shares', icon: Share2 },
  { key: 'saves', label: 'Saves', icon: Bookmark },
  { key: 'comments', label: 'Comments', icon: MessageCircle },
];

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-[#8c1f2e] uppercase">
      {children}
    </p>
  );
}

function ExpandedDetails({
  details,
  profileUrl,
}: {
  details: VideoDetails;
  profileUrl: string;
}) {
  return (
    <div className="space-y-6 border-t border-gray-200 px-5 py-5">
      {/* GIA SCORE GAUGE */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-baseline justify-between">
          <DetailLabel>GIA Score</DetailLabel>
          <span className="text-xs text-gray-400">raw: {details.rawScore}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-5">
          {details.gauge.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-base font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600">{metric.label}</div>
              <div className="text-[11px] text-gray-400">{metric.weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COUNTS ROW */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
        {countIcons.map(({ key, label, icon: Icon }) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{details.counts[key]}</span>
            <span className="text-gray-500">{label}</span>
          </span>
        ))}
      </div>

      {/* HOOK TRIGGER */}
      <div className="space-y-1">
        <DetailLabel>Hook Trigger (0-3s)</DetailLabel>
        <p className="text-sm leading-relaxed text-gray-800">
          {details.hookTrigger}
        </p>
      </div>

      {/* WHY IT WORKS / IMPROVEMENTS */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <DetailLabel>Why It Works</DetailLabel>
          <ul className="space-y-2">
            {details.whyItWorks.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-gray-700"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8c1f2e]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <DetailLabel>Improvements</DetailLabel>
          <ul className="space-y-2">
            {details.improvements.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-gray-700"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8c1f2e]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COMMENT INSIGHTS */}
      <div className="space-y-2">
        <DetailLabel>Comment Insights</DetailLabel>
        <p className="text-sm leading-relaxed text-gray-700">
          {details.commentInsights}
        </p>
        {details.positive.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500">Positive</p>
            <div className="flex flex-wrap gap-2">
              {details.positive.map((comment) => (
                <span
                  key={comment}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 italic"
                >
                  &quot;{comment}&quot;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIEW ON TIKTOK */}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8c1f2e] hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        View on TikTok
      </a>
    </div>
  );
}

function VideoCard({
  video,
  profileUrl,
}: {
  video: Video;
  profileUrl: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">GIA</span>
          <span className="text-2xl font-bold">{video.gia}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold">{video.title}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {video.score}/10
            </span>
            {video.proven && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                proven
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">{video.hook}</p>
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>{video.er}</span>
            <span>{video.views}</span>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open &&
        (video.details ? (
          <ExpandedDetails details={video.details} profileUrl={profileUrl} />
        ) : (
          <div className="border-t border-gray-200 px-5 py-6 text-center text-sm text-gray-400">
            No detailed breakdown available yet.
          </div>
        ))}
    </div>
  );
}

export default function VideoBreakdown({
  videos,
  profileUrl,
}: {
  videos: Video[];
  profileUrl: string;
}): React.ReactElement {
  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <VideoCard key={video.title} video={video} profileUrl={profileUrl} />
      ))}
    </div>
  );
}
