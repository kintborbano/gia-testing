import { getToken, clearToken } from './auth';
import {
  DEV_BYPASS,
  devResults,
  devStartAnalysis,
  devStatus,
} from './devBypass';
import type { ApiResult, JobStatus } from '@/types/api';
import type { Wrapped } from '@/types/wrapped';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) clearToken();
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // keep statusText
    }
    throw new ApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

export const api = {
  redeemBeta(code: string) {
    return request<{ token: string; name: string; email: string }>(
      '/api/beta/redeem',
      { method: 'POST', body: JSON.stringify({ code }) }
    );
  },

  googleLogin(idToken: string) {
    return request<{ token: string; name: string; email: string }>(
      '/api/auth/google',
      { method: 'POST', body: JSON.stringify({ id_token: idToken }) }
    );
  },

  startAnalysis(
    profileUrl: string,
    opts: {
      mode?: 'quick' | 'deep';
      email?: string;
      goal?: string;
      accountType?: string;
    } = {}
  ) {
    if (DEV_BYPASS) return devStartAnalysis();
    return request<{ job_id: string }>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        profile_url: profileUrl,
        mode: opts.mode ?? 'deep',
        email: opts.email,
        goal: opts.goal,
        account_type: opts.accountType,
      }),
    });
  },

  getStatus(jobId: string, from: number = 0) {
    if (DEV_BYPASS) return Promise.resolve(devStatus(jobId, from));
    return request<JobStatus>(`/api/status/${jobId}?from=${from}`);
  },

  getResults(jobId: string) {
    if (DEV_BYPASS) return devResults();
    return request<ApiResult>(`/api/results/${jobId}`);
  },

  getWrapped(jobId: string) {
    return request<Wrapped>(`/api/wrapped/${jobId}`);
  },

  checkoutCreate(profileUrl: string, mode: 'quick' | 'deep' = 'deep') {
    return request<{ checkout_url: string }>('/api/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({ profile_url: profileUrl, mode }),
    });
  },

  checkoutRedeem(nonce: string) {
    return request<{
      job_id: string;
      handle: string;
      already_redeemed: boolean;
      token: string;
    }>('/api/checkout/redeem', {
      method: 'POST',
      body: JSON.stringify({ nonce }),
    });
  },
};
