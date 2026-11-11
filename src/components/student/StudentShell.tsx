'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/student/api';
import { initials } from '@/lib/student/format';
import { clearSession, updateUser, useSession, type StudentUser } from '@/lib/student/session';
import { ConfirmDialog, cx, Loading } from './ui';

const NAV = [
  { href: '/dashboard/student/profile', label: 'Profile', short: 'Profile', icon: 'fa-id-card' },
  { href: '/dashboard/student/payments', label: 'Payments', short: 'Payments', icon: 'fa-indian-rupee-sign' },
  { href: '/dashboard/student/admit-card', label: 'Admit Card', short: 'Admit Card', icon: 'fa-ticket' },
  { href: '/dashboard/student/results', label: 'Exam Results', short: 'Results', icon: 'fa-square-poll-vertical' },
  { href: '/dashboard/announcements', label: 'Announcements', short: 'Notices', icon: 'fa-bullhorn' },
];

/**
 * The signed-in student area: checks the session with the API (GET /auth/me), sends
 * signed-out visitors to the login page, and shows the student bar and tabs.
 */
export default function StudentShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const [verifiedToken, setVerifiedToken] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const signingOut = useRef(false);

  const token = session?.user.role === 'student' ? session.token : null;

  useEffect(() => {
    if (session === undefined) return; // not read yet
    if (!token) {
      if (session) clearSession(); // a staff account's session
      if (signingOut.current) return;
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (verifiedToken === token) return;
    let cancelled = false;
    api<StudentUser>('/auth/me')
      .then((me) => {
        if (cancelled) return;
        if (me.role !== 'student') {
          clearSession();
          return;
        }
        updateUser({ name: me.name, email: me.email, phone: me.phone, role: me.role });
        setVerifiedToken(token);
      })
      // A 401 has cleared the session (and this effect then redirects). Other errors
      // (API down) keep the stored session; the pages show their own load errors.
      .catch(() => !cancelled && setVerifiedToken(token));
    return () => {
      cancelled = true;
    };
  }, [session, token, verifiedToken, pathname, router]);

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);
  const signOut = () => {
    setConfirmOpen(false);
    signingOut.current = true;
    clearSession();
    router.replace('/login');
  };

  if (!token || verifiedToken !== token) {
    return (
      <div className="bg-[#f5f6fa]">
        <Loading label={session === null ? 'Redirecting to login...' : 'Loading your account...'} />
      </div>
    );
  }

  const user = session!.user;
  const signOutButton = (className: string) => (
    <button type="button" className={className} onClick={() => setConfirmOpen(true)}>
      <i className="fa-solid fa-right-from-bracket w-[18px] text-center" aria-hidden="true"></i> Sign out
    </button>
  );
  return (
    <div className="bg-[#f4f6fa] pb-[60px] pt-[28px] max-lg:pb-[40px] max-lg:pt-[16px]">
      <div className="grid w-full grid-cols-[256px_minmax(0,1fr)] items-start gap-[24px] px-[12px] xs:px-[16px] md:px-[24px] xl:px-[32px] 2xl:px-[40px] max-lg:grid-cols-1 max-lg:gap-[16px] 2xl:grid-cols-[280px_minmax(0,1fr)] 2xl:gap-[32px]">
        <aside className="sticky top-[20px] overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] max-lg:static print:hidden">
          <div className="flex items-center gap-[12px] border-b border-[#eef2f6] p-[18px]">
            <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-heading text-[16px] font-semibold text-primary">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[15.5px] font-semibold leading-[1.3] text-[#0f172a]">{user.name || 'Student'}</p>
              <p className="m-0 truncate text-[14px] text-[#475569]">{user.email}</p>
            </div>
            {signOutButton(
              'flex h-[38px] items-center gap-[6px] rounded-[8px] border border-[#e2e8f0] bg-white px-[10px] text-[14.5px] font-medium text-[#475569] hover:border-[#fca5a5] hover:text-[#b91c1c] lg:hidden',
            )}
          </div>
          <nav aria-label="Student dashboard" className="p-[10px]">
            <p className="mb-[6px] mt-[4px] px-[12px] text-[13px] font-semibold uppercase tracking-[0.8px] text-[#64748b] max-lg:hidden">Menu</p>
            <ul className="m-0 flex flex-col gap-[2px] p-0 max-lg:grid max-lg:grid-cols-5 max-lg:gap-[6px] max-sm:grid-cols-3">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cx(
                        'flex items-center gap-[12px] rounded-[8px] px-[12px] py-[10px] text-[14.5px] transition-colors max-lg:h-full max-lg:flex-col max-lg:justify-center max-lg:gap-[4px] max-lg:px-[6px] max-lg:py-[9px] max-lg:text-center max-lg:text-[13.5px]',
                        active ? 'bg-heading font-semibold text-white' : 'font-medium text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a] max-lg:bg-[#f8fafc]',
                      )}
                    >
                      <i className={cx(`fa-solid ${item.icon} w-[18px] text-center text-[14px]`, active ? 'text-primary' : 'text-[#64748b]')} aria-hidden="true"></i>
                      <span className="max-lg:hidden">{item.label}</span>
                      <span className="lg:hidden">{item.short}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-[#eef2f6] p-[10px] max-lg:hidden">
            {signOutButton(
              'flex w-full items-center gap-[12px] rounded-[8px] bg-transparent px-[12px] py-[10px] text-left text-[14.5px] font-medium text-[#475569] transition-colors hover:bg-[#fef2f2] hover:text-[#b91c1c]',
            )}
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        message="You will be signed out of the IIAE student dashboard on this device."
        confirmLabel="Sign out"
        onConfirm={signOut}
        onCancel={closeConfirm}
      />
    </div>
  );
}
