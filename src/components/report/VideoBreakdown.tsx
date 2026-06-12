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
import Emphasis from '@/components/report/Emphasis';
import type { Video, VideoDetails } from '@/types/report';

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
    <p className="text-brand-primary text-xs font-semibold tracking-wide uppercase">
      {children}
    </p>
  );
}

function scoreBadgeStyle(score: number): string {
  if (score >= 7) return 'bg-verdict-strong-soft text-verdict-strong-deep';
  if (score >= 4) return 'bg-verdict-mixed-soft text-verdict-mixed-deep';
  return 'bg-verdict-weak-soft text-verdict-weak-deep';
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
      <div className="bg-brand-cream rounded-xl p-4">
        <div className="flex items-baseline justify-between">
          <DetailLabel>GIA Score</DetailLabel>
          <span className="text-brand-primary-dark text-xs opacity-70">
            raw: {details.rawScore}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-5">
          {details.gauge.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-brand-primary text-base font-bold">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600">{metric.label}</div>
              <div className="text-[11px] text-gray-400">{metric.weight}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
        {countIcons.map(({ key, label, icon: Icon }) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <Icon className="text-brand-primary/60 h-4 w-4" />
            <span className="font-semibold">{details.counts[key]}</span>
            <span className="text-gray-500">{label}</span>
          </span>
        ))}
      </div>

      {details.hookTrigger && (
        <div className="space-y-1">
          <DetailLabel>Hook Trigger (0-3s)</DetailLabel>
          <p className="text-sm leading-relaxed text-gray-800">
            <Emphasis text={details.hookTrigger} />
          </p>
        </div>
      )}

      {(details.whyItWorks.length > 0 || details.improvements.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {details.whyItWorks.length > 0 && (
            <div className="border-verdict-strong bg-verdict-strong-soft space-y-2 rounded-xl border p-4">
              <p className="text-verdict-strong-deep text-xs font-semibold tracking-wide uppercase">
                Why It Works
              </p>
              <ul className="space-y-2">
                {details.whyItWorks.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-gray-800"
                  >
                    <span
                      aria-hidden
                      className="bg-verdict-strong mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    <span>
                      <Emphasis text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {details.improvements.length > 0 && (
            <div className="border-verdict-weak bg-verdict-weak-soft space-y-2 rounded-xl border p-4">
              <p className="text-verdict-weak text-xs font-semibold tracking-wide uppercase">
                Improvements
              </p>
              <ul className="space-y-2">
                {details.improvements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-gray-800"
                  >
                    <span
                      aria-hidden
                      className="bg-verdict-weak mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    <span>
                      <Emphasis text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <DetailLabel>Comment Insights</DetailLabel>
        <p className="text-sm leading-relaxed text-gray-700">
          <Emphasis text={details.commentInsights} />
        </p>
        {details.positive.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500">Positive</p>
            <div className="flex flex-wrap gap-2">
              {details.positive.map((comment) => (
                <span
                  key={comment}
                  className="font-averia-serif bg-brand-cream text-brand-primary-dark rounded-full px-3 py-1 text-sm font-bold italic"
                >
                  &quot;{comment}&quot;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
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
  open,
  onToggle,
  cardRef,
}: {
  video: Video;
  profileUrl: string;
  open: boolean;
  onToggle: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      className={`report-card overflow-hidden rounded-2xl border bg-white shadow-sm ${
        open ? 'border-brand-primary/50' : 'border-gray-200'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className="flex flex-col items-center">
          <span className="text-brand-primary text-xs font-semibold tracking-wide">
            GIA
          </span>
          <span className="font-young-serif text-2xl">{video.gia}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="line-clamp-2 min-w-0 font-semibold">
              {video.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${scoreBadgeStyle(video.score)}`}
            >
              {video.score}/10
            </span>
            {video.proven && (
              <span className="bg-verdict-strong-soft text-verdict-strong-deep rounded-full px-2 py-0.5 text-xs font-medium">
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
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 0fr→1fr grid keeps the expand/collapse smooth without measuring heights. */}
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          {video.details ? (
            <ExpandedDetails details={video.details} profileUrl={profileUrl} />
          ) : (
            <div className="border-t border-gray-200 px-5 py-6 text-center text-sm text-gray-400">
              No detailed breakdown available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoBreakdown({
  videos,
  profileUrl,
  openId: controlledOpenId,
  onOpenChange,
  registerCardRef,
}: {
  videos: Video[];
  profileUrl: string;
  openId?: string | null;
  onOpenChange?: (id: string | null) => void;
  registerCardRef?: (id: string, el: HTMLDivElement | null) => void;
}): React.ReactElement {
  const [internalOpenId, setInternalOpenId] = useState<string | null>(null);
  const openId =
    controlledOpenId !== undefined ? controlledOpenId : internalOpenId;
  const setOpenId = onOpenChange ?? setInternalOpenId;

  return (
    <div className="space-y-3">
      {videos.map((video, i) => {
        const id = video.id ?? `${video.title}-${i}`;
        return (
          <VideoCard
            key={id}
            video={video}
            profileUrl={profileUrl}
            open={openId === id}
            onToggle={() => setOpenId(openId === id ? null : id)}
            cardRef={
              registerCardRef ? (el) => registerCardRef(id, el) : undefined
            }
          />
        );
      })}
    </div>
  );
}
