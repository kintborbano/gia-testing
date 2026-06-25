'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { getToken, setSession } from '@/lib/auth';
import { signInWithGoogle } from '@/lib/firebase';

type Status =
  | 'init'
  | 'opening'
  | 'signin'
  | 'signing-in'
  | 'wrong-account'
  | 'error'
  | 'missing';

export default function UnlockShell(): React.ReactElement {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job');

  const [status, setStatus] = useState<Status>('init');
  const [errorMsg, setErrorMsg] = useState('');
  const kickedOff = useRef(false);

  const kickoff = async (job: string) => {
    if (kickedOff.current) return;
    kickedOff.current = true;
    try {
      const { checkout_url } = await api.checkoutCreate('', 'deep', {
        kind: 'unlock',
        jobId: job,
      });
      window.location.href = checkout_url;
    } catch (err) {
      kickedOff.current = false;
      if (err instanceof ApiError && err.status === 409) {
        window.location.href = `/report?job=${job}`;
      } else if (err instanceof ApiError && err.status === 403) {
        setStatus('wrong-account');
      } else {
        setErrorMsg(
          err instanceof ApiError ? err.message : 'Something went wrong.'
        );
        setStatus('error');
      }
    }
  };

  useEffect(() => {
    const init = () => {
      if (!jobId) {
        setStatus('missing');
        return;
      }
      if (getToken()) {
        setStatus('opening');
        kickoff(jobId);
      } else {
        setStatus('signin');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogle = async () => {
    if (!jobId) return;
    setStatus('signing-in');
    setErrorMsg('');
    try {
      const idToken = await signInWithGoogle();
      const { token, name, email } = await api.googleLogin(idToken);
      setSession(token, { name, email });
      setStatus('opening');
      kickoff(jobId);
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : 'Google sign-in failed. Try again.'
      );
      setStatus('signin');
    }
  };

  if (status === 'missing') {
    return (
      <main className="bg-brand-cream flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[420px] rounded-[28px] bg-white px-8 py-10 shadow-lg">
          <p className="text-brand-primary flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-4 w-4" /> GIA
          </p>
          <h1 className="font-young-serif text-brand-primary mt-2 text-[24px] leading-tight">
            Missing report reference
          </h1>
          <p className="mt-2 font-sans text-[14px] text-gray-600">
            This link is missing a report ID. Check your email and try again.
          </p>
          <a
            href="/form"
            className="bg-brand-primary mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          >
            Start a new analysis
          </a>
        </div>
      </main>
    );
  }

  if (status === 'wrong-account') {
    return (
      <main className="bg-brand-cream flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[420px] rounded-[28px] bg-white px-8 py-10 shadow-lg">
          <p className="text-brand-primary flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-4 w-4" /> GIA
          </p>
          <h1 className="font-young-serif text-brand-primary mt-2 text-[24px] leading-tight">
            Wrong account
          </h1>
          <p className="mt-2 font-sans text-[14px] text-gray-600">
            This report belongs to another account. Sign in with the correct
            account and try again.
          </p>
        </div>
      </main>
    );
  }

  if (status === 'opening') {
    return (
      <main className="bg-brand-cream flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-brand-primary flex items-center justify-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-4 w-4" /> GIA
          </p>
          <p className="font-young-serif text-brand-primary mt-3 text-[22px]">
            Opening secure checkout&hellip;
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-cream flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[420px] rounded-[28px] bg-white px-8 py-10 shadow-lg">
        <p className="text-brand-primary flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
          <Sparkles className="h-4 w-4" /> GIA
        </p>
        <h1 className="font-young-serif text-brand-primary mt-2 text-[24px] leading-tight">
          Sign in to unlock your full report
        </h1>
        <p className="mt-2 font-sans text-[14px] text-gray-600">
          Sign in with the Google account you used for this analysis, then
          we&rsquo;ll open secure checkout.
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={status === 'signing-in'}
          className="border-brand-primary text-brand-primary hover:bg-brand-primary/5 mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] border-[2px] bg-white font-sans text-[15px] font-semibold transition-colors disabled:opacity-60"
        >
          {status === 'signing-in' ? 'Signing in…' : 'Continue with Google'}
        </button>

        {errorMsg && (
          <p role="alert" className="mt-3 font-sans text-[13px] text-red-500">
            {errorMsg}
          </p>
        )}

        {status === 'error' && (
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setStatus('signin');
            }}
            className="text-brand-primary mt-4 w-full text-center font-sans text-[13px] underline"
          >
            Try again
          </button>
        )}
      </div>
    </main>
  );
}
