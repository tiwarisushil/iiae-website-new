// The public website's forms post straight from the browser to the IIAE CRM API
// (Node.js, /Users/azhar/Desktop/iiae/Nodejs). Calling it from the browser keeps the
// API's per-visitor rate limits working (they key on the caller's IP).
import type { Errors, FormResponse, Values } from './forms';
import { STUDENT_DASHBOARD_URL } from './site';
import { saveSession } from './student/session';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

type ApiResult = { status: number; body: { message?: string; errors?: Record<string, string> } & Record<string, unknown> };

async function post(path: string, body: Record<string, unknown>): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

// As the old site's forms did (PHP ucwords): "neha singh" -> "Neha Singh"
const titleCase = (s = '') => s.trim().replace(/(^|\s)(\S)/g, (_, sp, c) => sp + c.toUpperCase());

const failure = (r: ApiResult, fieldErrors: Errors = {}): FormResponse =>
  Object.keys(fieldErrors).length
    ? { ok: false, errors: fieldErrors }
    : { ok: false, message: r.status === 429 ? r.body.message : 'Something went wrong. Please try again.' };

/** "Tell Us About Yourself" (home, contact-us, request-information) -> website lead. */
export async function submitEnquiry(v: Values): Promise<FormResponse> {
  const r = await post('/website/enquiry', {
    name: v.fullname,
    email: v.email,
    phone: v.mobile,
    counsellingMode: v.attend_at,
    message: v.message ?? '',
    page: window.location.pathname,
  });
  if (r.status === 201) return { ok: true };
  // API field names -> form field names
  const map: Record<string, string> = { name: 'fullname', email: 'email', phone: 'mobile', counsellingMode: 'attend_at', message: 'message' };
  const errors = Object.fromEntries(Object.entries(r.body.errors ?? {}).map(([k, m]) => [map[k] ?? k, m]));
  return failure(r, errors);
}

/** Footer newsletter. Subscribing an address twice still counts as subscribed. */
export async function submitNewsletter(v: Values): Promise<FormResponse> {
  const r = await post('/newsletters/subscribe', { email: v.newsemail });
  if (r.status === 201 || r.status === 200 || (r.status === 400 && /already subscribed/i.test(r.body.message ?? ''))) return { ok: true };
  return failure(r, r.status === 400 && r.body.message ? { newsemail: r.body.message } : {});
}

/**
 * Apply Online: creates the student account in the CRM and signs the student in. Then,
 * as in the CRM's portal, it opens the student's exam registration form; when the form
 * is not open (registration closed) the student goes to the dashboard.
 */
export async function submitApplication(v: Values): Promise<FormResponse> {
  const r = await post('/auth/register', {
    firstName: titleCase(v.first_name),
    lastName: titleCase(v.last_name),
    email: v.email,
    parentEmail: v.parents_email,
    phone: v.phone,
    alternatePhone: v.alternate_phone,
    password: v.password,
  });
  if (r.status === 201) {
    const user = r.body as { token?: string; _id?: string; name?: string; email?: string; phone?: string; role?: string };
    if (!user.token) return { ok: true, redirect: '/login' };
    saveSession({ ...user, token: user.token });
    try {
      const res = await fetch(`${API_BASE_URL}/registrations/continue`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${user.token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && /^\/register\/[a-f0-9]{48}$/.test(body.registrationPath ?? '')) return { ok: true, redirect: body.registrationPath };
    } catch {
      // The dashboard offers the form again.
    }
    return { ok: true, redirect: STUDENT_DASHBOARD_URL };
  }
  if (r.status === 409) return failure(r, { email: r.body.message ?? 'An account with this email already exists.' });
  if (r.status === 400 && r.body.message) return { ok: false, message: r.body.message };
  return failure(r);
}
