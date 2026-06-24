'use client';

import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { setToken, setSession } from '@/lib/auth';
import { signInWithGoogle } from '@/lib/firebase';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  profileUrl: string;
  mode?: 'quick' | 'deep';
  freeSpent?: boolean;
}

// Keep in sync with CHECKOUT_PRICE_CENTS on the backend (default ₱299).
const PRICE = '₱299';

export default function BetaGate({
  onSuccess,
  onClose,
  profileUrl,
  mode = 'deep',
  freeSpent = false,
}: Props): ReactElement {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const busy = loading || buying;

  const handleBuy = async () => {
    setBuying(true);
    setError('');
    try {
      const { checkout_url } = await api.checkoutCreate(profileUrl, mode);
      window.location.href = checkout_url;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start checkout. Try again.'
      );
      setBuying(false);
    }
  };

  const handleRedeem = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter your voucher code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token } = await api.redeemBeta(code.trim());
      setToken(token);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'That code didn’t work. Check it and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setBuying(false);
    setLoading(true);
    setError('');
    try {
      const idToken = await signInWithGoogle();
      const { token, name, email } = await api.googleLogin(idToken);
      setSession(token, { name, email });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Google sign-in failed. Try again or use another option.'
      );
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Unlock your analysis"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-brand-cream w-full max-w-[420px] rounded-[28px] px-8 py-9 shadow-2xl">
        <div className="text-brand-primary flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
          <Sparkles className="h-4 w-4" /> GIA
        </div>
        <h2 className="font-young-serif text-brand-primary mt-2 text-[26px] leading-tight tracking-[-0.6px]">
          Unlock your full analysis
        </h2>
        <p className="text-text/70 mt-2 font-sans text-[14px] leading-[1.5]">
          Your complete GIA report — 20 videos scored, hook breakdowns, audience
          insights, the PDF, and your shareable GIA Wrapped.
        </p>

        {!freeSpent && (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="border-brand-primary text-brand-primary hover:bg-brand-primary/5 mt-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] border-[2px] bg-white font-sans text-[15px] font-semibold transition-colors disabled:opacity-60"
          >
            Continue with Google — free
          </button>
        )}

        {freeSpent && (
          <p className="text-text/70 mt-5 font-sans text-[14px] leading-[1.5]">
            You&rsquo;ve used your free analysis. Buy your full report or enter
            a voucher code.
          </p>
        )}

        {/* Primary path — buy */}
        <button
          type="button"
          onClick={handleBuy}
          disabled={busy}
          className="bg-brand-primary hover:bg-brand-primary-dark mt-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] font-sans text-[15px] font-semibold text-white transition-colors disabled:opacity-60"
        >
          {buying ? (
            'Opening checkout…'
          ) : (
            <>
              Get my report — {PRICE} <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="text-text/50 mt-2 text-center font-sans text-[12px]">
          One-time payment · GCash, card, Maya, QRPH
        </p>

        {/* Secondary path — voucher code */}
        <div className="mt-6 mb-3.5 flex items-center gap-3">
          <span className="bg-text/15 h-px flex-1" />
          <span className="text-text/45 font-sans text-[11px] tracking-[0.1em] uppercase">
            Have a voucher code?
          </span>
          <span className="bg-text/15 h-px flex-1" />
        </div>

        <form onSubmit={handleRedeem} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            className="border-brand-gold text-text h-[46px] min-w-0 flex-1 rounded-[12px] border-[2px] bg-white px-4 font-mono text-[15px] tracking-[2px] outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="border-brand-primary text-brand-primary hover:bg-brand-primary/5 h-[46px] shrink-0 rounded-[12px] border-[2px] bg-white px-5 font-sans text-[14px] font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Redeem'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 font-sans text-[13px] text-red-500">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="text-text/50 hover:text-text/70 mt-6 w-full text-center font-sans text-[13px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
