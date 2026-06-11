import { getToken } from './auth';
import type { ApiResult, JobStatus } from '@/types/api';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
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
      { method: 'POST', body: JSON.stringify({ code }) },
    );
  },

  startAnalysis(profileUrl: string, mode: 'quick' | 'deep' = 'deep') {
    return request<{ job_id: string }>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ profile_url: profileUrl, mode }),
    });
  },

  getStatus(jobId: string, from: number = 0) {
    return request<JobStatus>(`/api/status/${jobId}?from=${from}`);
  },

  getResults(jobId: string) {
    return request<ApiResult>(`/api/results/${jobId}`);
  },

  checkoutCreate(profileUrl: string, mode: 'quick' | 'deep' = 'deep') {
    return request<{ checkout_url: string }>('/api/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({ profile_url: profileUrl, mode }),
    });
  },

  checkoutRedeem(nonce: string) {
    return request<{ job_id: string; handle: string; already_redeemed: boolean }>(
      '/api/checkout/redeem',
      { method: 'POST', body: JSON.stringify({ nonce }) },
    );
  },
};
