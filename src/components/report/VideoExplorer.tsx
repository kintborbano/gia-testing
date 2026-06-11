'use client';

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { formatCount } from '@/lib/format';

export interface ExplorerPoint {
  id: string;
  title: string;
  views: number;
  erPct: number;
  hookStrength: number;
}

const W = 640;
const H = 320;
const PAD = { top: 16, right: 20, bottom: 42, left: 48 };

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const QUADRANTS = [
  { corner: 'tl', label: 'Hidden gems' },
  { corner: 'tr', label: 'Crowd magnets' },
  { corner: 'bl', label: 'Warm-up acts' },
  { corner: 'br', label: 'Empty calories' },
] as const;

function niceTicks(max: number, count = 4): number[] {
  const step = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const nice = [1, 2, 2.5, 5, 10].find((m) => m * mag >= step) ?? 10;
  const tick = nice * mag;
  const ticks: number[] = [];
  for (let v = tick; v <= max + tick * 0.01; v += tick) ticks.push(v);
  return ticks;
}

export default function VideoExplorer({
  points,
  selectedId,
  onSelect,
}: {
  points: ExplorerPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}): React.ReactElement | null {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = useState<ExplorerPoint | null>(null);
  if (points.length < 3) return null;

  const maxViews = Math.max(...points.map((p) => p.views)) * 1.12;
  const maxEr = Math.max(...points.map((p) => p.erPct)) * 1.18;
  const x = (v: number) =>
    PAD.left + (v / maxViews) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    H - PAD.bottom - (v / maxEr) * (H - PAD.top - PAD.bottom);

  const midX = x(median(points.map((p) => p.views)));
  const midY = y(median(points.map((p) => p.erPct)));
  const quadrantPos = {
    tl: { x: PAD.left + 8, y: PAD.top + 12, anchor: 'start' },
    tr: { x: W - PAD.right - 8, y: PAD.top + 12, anchor: 'end' },
    bl: { x: PAD.left + 8, y: H - PAD.bottom - 8, anchor: 'start' },
    br: { x: W - PAD.right - 8, y: H - PAD.bottom - 8, anchor: 'end' },
  } as const;

  return (
    <div
      ref={ref}
      className="report-card relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <p className="text-xs text-gray-500">
        Each bubble is a video — tap one to jump to its breakdown. Size = hook
        strength.
      </p>
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Scatter plot of analyzed videos by views and engagement rate; bubble size shows hook strength"
        >
          {niceTicks(maxEr).map((t) => (
            <g key={`y${t}`}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="#1a1208"
                strokeOpacity="0.07"
              />
              <text
                x={PAD.left - 8}
                y={y(t) + 3.5}
                textAnchor="end"
                fontSize="11"
                fill="#888"
              >
                {t.toFixed(t < 1 ? 1 : 0)}%
              </text>
            </g>
          ))}
          {niceTicks(maxViews).map((t) => (
            <text
              key={`x${t}`}
              x={x(t)}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="#888"
            >
              {formatCount(t)}
            </text>
          ))}
          <text
            x={(PAD.left + W - PAD.right) / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fill="#888"
          >
            Views
          </text>
          <text
            x={14}
            y={(PAD.top + H - PAD.bottom) / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#888"
            transform={`rotate(-90 14 ${(PAD.top + H - PAD.bottom) / 2})`}
          >
            Engagement rate
          </text>

          <line
            x1={midX}
            x2={midX}
            y1={PAD.top}
            y2={H - PAD.bottom}
            className="stroke-brand-primary"
            strokeOpacity="0.18"
            strokeDasharray="4 5"
          />
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={midY}
            y2={midY}
            className="stroke-brand-primary"
            strokeOpacity="0.18"
            strokeDasharray="4 5"
          />
          {QUADRANTS.map(({ corner, label }) => (
            <text
              key={corner}
              x={quadrantPos[corner].x}
              y={quadrantPos[corner].y}
              textAnchor={quadrantPos[corner].anchor}
              fontSize="11"
              fontStyle="italic"
              className="fill-brand-primary"
              fillOpacity={inView ? 0.45 : 0}
              style={{ transition: 'fill-opacity 0.6s ease 0.9s' }}
            >
              {label}
            </text>
          ))}

          {points.map((p, i) => {
            const selected = p.id === selectedId;
            const active = selected || hovered?.id === p.id;
            return (
              <circle
                key={p.id}
                cx={x(p.views)}
                cy={y(p.erPct)}
                r={5 + p.hookStrength * 1.3}
                className={`cursor-pointer ${
                  selected
                    ? 'fill-brand-gold stroke-brand-gold-shadow report-bubble-pulse'
                    : 'fill-brand-primary stroke-brand-primary-dark'
                }`}
                fillOpacity={active ? 0.9 : 0.5}
                strokeWidth="1.5"
                onClick={() => onSelect(p.id)}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: inView ? 'scale(1)' : 'scale(0)',
                  transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 45}ms, fill-opacity 0.2s ease`,
                }}
              />
            );
          })}
        </svg>

        {hovered && (
          <div
            className="border-brand-primary/20 pointer-events-none absolute z-10 w-max max-w-[230px] -translate-x-1/2 -translate-y-full rounded-xl border bg-white px-3.5 py-2.5 shadow-lg"
            style={{
              left: `${((x(hovered.views) / W) * 100).toFixed(2)}%`,
              top: `calc(${((y(hovered.erPct) / H) * 100).toFixed(2)}% - 10px)`,
            }}
          >
            <p className="truncate text-xs font-semibold text-gray-900">
              {hovered.title}
            </p>
            <p className="text-brand-primary mt-0.5 text-xs font-medium">
              {hovered.erPct.toFixed(1)}% ER · {formatCount(hovered.views)}{' '}
              views
            </p>
            <p className="text-[11px] text-gray-500">
              Hook strength {hovered.hookStrength}/10
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
