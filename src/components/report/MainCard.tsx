import type { ReportData } from '@/types/report';

interface MainCardProps {
  data: ReportData;
}

export default function MainCard({ data }: MainCardProps) {
  return (
    <div className="space-y-8 rounded-lg bg-white p-8 shadow-sm">
      {/* HEADER ROW — handle, category, followers */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
        <h1 className="text-3xl font-bold text-gray-900">@{data.handle}</h1>
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {data.category}
          </span>
          <span className="text-sm text-gray-600">
            {data.followerCount}K followers
          </span>
        </div>
      </div>

      {/* GIA SCORE */}
      <div className="flex items-baseline gap-3 border-t border-b border-gray-200 py-6">
        <span className="text-sm font-semibold text-gray-600">GIA SCORE</span>
        <span className="text-5xl font-bold text-gray-900">
          {data.giaScore}
        </span>
        <span className="text-2xl text-gray-400">/ {data.giaScoreMax}</span>
        <span className="flex-1 text-sm text-gray-600">
          {data.giaScoreContext}
        </span>
      </div>

      {/* GIA'S TAKE */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="text-sm font-semibold text-gray-600">
            GIA&#39;S TAKE
          </span>
        </div>
        <p className="text-lg leading-relaxed font-medium text-gray-900">
          {data.giaTake}
        </p>
      </div>

      {/* SUMMARY */}
      <p className="text-base leading-relaxed text-gray-600">{data.summary}</p>

      {/* TOP HOOKS */}
      <div className="space-y-3">
        <span className="text-sm font-semibold text-gray-600">TOP HOOKS</span>
        <div className="flex flex-wrap gap-2">
          {data.topHooks.map((hook) => (
            <span
              key={hook}
              className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {hook}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
