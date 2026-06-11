'use client';

import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { api, ApiError } from '@/lib/api';
import { setToken } from '@/lib/auth';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function BetaGate({ onSuccess, onClose }: Props): ReactElement {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter your beta code.');
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
          : 'Something went wrong. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Beta access"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-brand-cream w-full max-w-[440px] rounded-[28px] px-8 py-10 shadow-2xl">
        <h2 className="font-young-serif text-brand-primary text-[28px] leading-tight tracking-[-0.6px]">
          enter your beta code
        </h2>
        <p className="mt-2 font-sans text-[15px] leading-[1.45] text-text/70">
          GIA is currently in private beta. Enter your code to get access.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="text"
            autoFocus
            placeholder="XXXX-XXXX"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            className="border-brand-gold h-[52px] w-full rounded-[12px] border-[3px] bg-white px-5 font-mono text-[16px] tracking-[2px] text-text shadow-[inset_0_0_0_2px_var(--color-text)] outline-none"
          />
          {error && (
            <p role="alert" className="font-pixelify text-[14px] text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary h-[52px] rounded-[12px] font-sans text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'verifying…' : 'ACCESS GIA'}
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center font-sans text-[13px] text-text/50 hover:text-text/70"
        >
          cancel
        </button>
      </div>
    </div>
  );
}
