'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Action(): React.ReactElement {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handle = username.replace(/^@/, '').trim();

  return (
    <section
      id="bg-stop-action"
      className="flex w-full flex-col items-center px-16 py-10"
    >
      <div className="flex w-[1152px] max-w-full flex-col items-center justify-center rounded-[24px] bg-[#8c1f2e] px-16 py-20">
        <div className="flex w-full flex-col items-center gap-6 text-center text-white">
          <p className="font-sans text-[18px] font-bold tracking-[-0.09px]">
            GIA IN ACTION
          </p>
          <h2 className="font-young-serif w-full text-[56px] leading-[1.1] tracking-[-1.12px]">
            so... gia does what?
          </h2>
          <p className="w-[628px] max-w-full font-sans text-[24px] leading-[1.25] font-medium tracking-[-0.12px]">
            GIA reads your comments, scores your hooks,
            <br />
            and tells you what your audience is actually asking for.
          </p>
          <p className="mt-6 font-sans text-[24px] leading-[1.25] font-bold tracking-[-0.12px]">
            Enter your TikTok username to try:
          </p>
          <form
            className="relative flex w-[380px] max-w-full items-center"
            onSubmit={(e) => {
              e.preventDefault();
              if (!handle) return;
              router.push(`/report/${encodeURIComponent(handle)}`);
            }}
          >
            <input
              type="text"
              aria-label="TikTok username"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[44px] w-full rounded-full border border-black bg-white px-5 font-sans text-[15px] text-black outline-none"
            />
            <button
              type="submit"
              className="absolute top-[60px] left-1/2 h-[44px] w-[178px] -translate-x-1/2 rounded-full border border-[#8c1f2e] bg-white font-sans text-[15px] font-bold tracking-[-0.3px] text-[#8c1f2e]"
            >
              Get my report
            </button>
          </form>
          <div className="h-[44px]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
