// The signed-in student: the CRM API's JWT and a few user fields, kept in localStorage
// under the same keys as the CRM's React portal. The API is token-only (no cookies), so
// pages read the session in the browser and render nothing student-specific on the server.
import { useSyncExternalStore } from 'react';

const TOKEN_KEY = 'iiae_token';
const USER_KEY = 'iiae_user';

export type StudentUser = { _id: string; name: string; email: string; phone: string; role: string };
export type Session = { token: string; user: StudentUser };

const listeners = new Set<() => void>();
let cache: { raw: string; session: Session | null } = { raw: '', session: null };

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function write(entries: Record<string, string | null>) {
  try {
    for (const [key, value] of Object.entries(entries)) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
  } catch {
    // Storage blocked (private mode): the session lasts until the page is reloaded.
  }
  listeners.forEach((l) => l());
}

// Only these fields are kept: GET /auth/me also returns internal ones (OTP hash, ...).
const pickUser = (u: Partial<StudentUser>): StudentUser => ({
  _id: String(u._id ?? ''),
  name: String(u.name ?? ''),
  email: String(u.email ?? ''),
  phone: String(u.phone ?? ''),
  role: String(u.role ?? ''),
});

export function getSession(): Session | null {
  const token = read(TOKEN_KEY);
  const user = read(USER_KEY);
  const raw = `${token}\n${user}`;
  if (raw !== cache.raw) {
    let session: Session | null = null;
    try {
      if (token && user) session = { token, user: pickUser(JSON.parse(user)) };
    } catch {
      session = null;
    }
    cache = { raw, session };
  }
  return cache.session;
}

/** Stores the login / register response ({ _id, name, email, role, phone, token }). */
export function saveSession({ token, ...user }: Partial<StudentUser> & { token: string }) {
  write({ [TOKEN_KEY]: token, [USER_KEY]: JSON.stringify(pickUser(user)) });
}

export function updateUser(partial: Partial<StudentUser>) {
  const session = getSession();
  if (session) write({ [USER_KEY]: JSON.stringify(pickUser({ ...session.user, ...partial })) });
}

export function clearSession() {
  write({ [TOKEN_KEY]: null, [USER_KEY]: null });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Signing in or out in another tab
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === TOKEN_KEY || e.key === USER_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * The current session, or null. `undefined` during server rendering and hydration,
 * before localStorage can be read.
 */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, getSession, () => undefined);
}

/** A return path from ?returnUrl=, accepted only when it stays on this site. */
export function safeReturnPath(value: string | null | undefined, fallback = '/dashboard/student/profile') {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback;
}
