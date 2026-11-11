// Requests from the student pages to the IIAE CRM API. Signed-in requests send the
// session's JWT as a Bearer token; a 401 on one of them ends the session (the student
// area then sends the student to the login page).
import { API_BASE_URL } from '@/lib/api';
import { clearSession, getSession } from './session';

/** Origin that serves uploaded files (photos, acknowledgements, invoices): the API host. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

/** Absolute URL of a file the API stored as "/uploads/...". */
export function fileUrl(url: string | null | undefined) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

export class ApiError extends Error {
  status: number;
  /** Registration form step the error belongs to. */
  step?: number;
  code?: string;
  constructor(status: number, message: string, body: { step?: number; code?: string } = {}) {
    super(message);
    this.status = status;
    this.step = body.step;
    this.code = body.code;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT';
  /** JSON object, or FormData for uploads (the browser sets the multipart boundary). */
  body?: Record<string, unknown> | FormData;
  /** Send the session token (default). Public endpoints pass false. */
  auth?: boolean;
};

export async function api<T = unknown>(path: string, { method, body, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = auth ? getSession()?.token : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: method ?? (body ? 'POST' : 'GET'),
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) clearSession();
    throw new ApiError(res.status, typeof data?.message === 'string' && data.message ? data.message : '', data ?? {});
  }
  return data as T;
}

/** A signed-in file download (e.g. a PDF) as a Blob. */
export async function apiBlob(path: string): Promise<Blob> {
  const token = getSession()?.token;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    if (res.status === 401 && token) clearSession();
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, typeof data?.message === 'string' ? data.message : '', data ?? {});
  }
  return res.blob();
}

/** The server's message for a failed request, or the fallback. */
export const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError && error.message ? error.message : fallback;
