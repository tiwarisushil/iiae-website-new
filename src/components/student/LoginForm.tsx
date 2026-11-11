'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { isEmail, OTP_RE, passwordProblem } from '@/lib/validation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, errorMessage } from '@/lib/student/api';
import { clearSession, safeReturnPath, saveSession, useSession, type StudentUser } from '@/lib/student/session';
import { Alert, Spinner } from './ui';
import { toast } from './toast';

type Mode = 'login' | 'forgot' | 'reset';
type Submit = { preventDefault: () => void };

// Shown under the logo on the forgot / reset password steps.
const TITLES: Record<Exclude<Mode, 'login'>, [string, string]> = {
  forgot: ['Forgot Password?', 'We will email you a 6-digit OTP.'],
  reset: ['Reset Password', 'Enter the OTP from your email.'],
};

// The card follows the old site's login page (iiae.in/student): gold banner, the round
// IIAE logo, plain inputs and a full-width gold button.
const GOLD = 'bg-[#aa8d00]';
const labelClass = 'mb-[6px] block text-[14px] font-semibold text-[#1f2937]';
const fieldClass =
  'block w-full rounded-[4px] border border-[#ced4da] bg-white px-[12px] py-[10px] text-[15px] leading-[1.5] text-[#111827] outline-none transition-colors placeholder:text-[#64748b] focus:border-[#aa8d00] read-only:bg-[#eff2f7]';

function PasswordInput({ id, value, onChange, autoComplete }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex">
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        className={`${fieldClass} rounded-r-none`}
        placeholder={autoComplete === 'new-password' ? 'At least 8 characters' : 'Enter password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        minLength={autoComplete === 'new-password' ? 8 : undefined}
        required
      />
      <button
        type="button"
        className="flex w-[39px] shrink-0 items-center justify-center rounded-r-[4px] border border-[#eff2f7] bg-[#eff2f7] text-[14px] text-black hover:bg-[#e2e6ee]"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        <i className={`fa-regular ${shown ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}

/**
 * Student sign-in (POST /api/auth/login), with forgot / reset password by emailed OTP.
 * ?forgot=1 opens the forgot-password step; ?returnUrl=/path is where to go after signing in.
 */
export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const [mode, setMode] = useState<Mode>(params.get('forgot') ? 'forgot' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const returnPath = safeReturnPath(params.get('returnUrl'));
  const signedIn = session?.user.role === 'student';

  // Already signed in: straight to the dashboard (or the page that asked for a login).
  useEffect(() => {
    if (signedIn && mode === 'login' && !busy) router.replace(returnPath);
  }, [signedIn, mode, busy, returnPath, router]);

  const switchTo = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
    setPassword('');
    setConfirm('');
    if (next !== 'reset') setOtp('');
  };

  const run = async (e: Submit, action: () => Promise<void>) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const badEmail = () => {
    if (isEmail(email)) return false;
    setError('Enter a valid email address (e.g. name@example.com)');
    return true;
  };

  const login = (e: Submit) =>
    run(e, async () => {
      if (badEmail()) return;
      if (!password) {
        setError('Enter your password');
        return;
      }
      try {
        const user = await api<StudentUser & { token: string }>('/auth/login', {
          body: { email: email.trim(), password },
          auth: false,
        });
        // The CRM's staff accounts sign in to the CRM, not here.
        if (user.role !== 'student') {
          setError('This login is for students. Staff members sign in to the IIAE CRM.');
          return;
        }
        // The effect above then goes to the dashboard.
        saveSession(user);
        toast.success(`Welcome back, ${user.name.split(' ')[0] || 'student'}`);
      } catch (err) {
        setError(errorMessage(err, 'Login failed. Please check your email and password.'));
      }
    });

  const sendOtp = (e: Submit) =>
    run(e, async () => {
      if (badEmail()) return;
      try {
        const res = await api<{ message?: string }>('/auth/forgot-password', { body: { email: email.trim() }, auth: false });
        setOtp('');
        setPassword('');
        setConfirm('');
        setMode('reset');
        setNotice(res.message || 'OTP sent to your email');
      } catch (err) {
        setError(errorMessage(err, 'Could not send the OTP. Please try again.'));
      }
    });

  const reset = (e: Submit) =>
    run(e, async () => {
      if (!OTP_RE.test(otp)) {
        setError('Enter the 6-digit OTP from your email');
        return;
      }
      const weak = passwordProblem(password);
      if (weak) {
        setError(weak);
        return;
      }
      if (password !== confirm) {
        setError('Passwords do not match');
        return;
      }
      try {
        const res = await api<{ message?: string }>('/auth/reset-password', {
          body: { email: email.trim(), otp, password },
          auth: false,
        });
        // The reset signs out every device, this one included.
        clearSession();
        switchTo('login');
        setNotice(res.message || 'Password updated. You can log in now.');
      } catch (err) {
        setError(errorMessage(err, 'Could not reset the password'));
      }
    });

  const submitLabel = { login: 'Log In', forgot: 'Send OTP', reset: 'Reset Password' }[mode];

  return (
    <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-[4px] bg-white text-[14px] text-[#334155] shadow-[0_12px_30px_rgba(18,38,63,0.06)]">
      <div className="px-[28px] pb-[28px] pt-[28px] max-xs:px-[18px]">
        <div className="mb-[8px] text-center">
          <img src="/assets/web/images/IIAE-LOGO.png" alt="IIAE – Indian Institute of Aircraft Engineering" width={250} className="mx-auto w-[250px] max-w-full" />
        </div>

        {mode !== 'login' && (
          <div className="mb-[4px] px-[8px] text-center">
            <h2 className="mb-[4px] text-[16.25px] font-medium leading-[1.2] text-[#495057]">{TITLES[mode][0]}</h2>
            <p className="m-0 text-[14px] text-[#475569]">{TITLES[mode][1]}</p>
          </div>
        )}

        <form onSubmit={mode === 'login' ? login : mode === 'forgot' ? sendOtp : reset} className="flex flex-col gap-[16px] p-[8px]">
          {notice && <Alert tone="success" className="text-[14px]">{notice}</Alert>}

          <div>
            <label htmlFor="login-email" className={labelClass}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={fieldClass}
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={255}
              readOnly={mode === 'reset'}
              required
            />
          </div>

          {mode === 'login' && (
            <div>
              <div className="flex items-baseline justify-between gap-[10px]">
                <label htmlFor="login-password" className={labelClass}>
                  Password
                </label>
                <button type="button" className="bg-transparent p-0 text-[14px] font-medium text-[#475569] hover:text-[#aa8d00]" onClick={() => switchTo('forgot')}>
                  Forgot password?
                </button>
              </div>
              <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label htmlFor="login-otp" className={labelClass}>
                  OTP
                </label>
                <input
                  id="login-otp"
                  className={`${fieldClass} tracking-[4px]`}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  required
                />
                <p className="mb-0 mt-[5px] text-[13px] text-[#475569]">The code is valid for 10 minutes.</p>
              </div>
              <div>
                <label htmlFor="login-new-password" className={labelClass}>
                  New password
                </label>
                <PasswordInput id="login-new-password" value={password} onChange={setPassword} autoComplete="new-password" />
              </div>
              <div>
                <label htmlFor="login-confirm-password" className={labelClass}>
                  Confirm password
                </label>
                <PasswordInput id="login-confirm-password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
              </div>
            </>
          )}

          {error && <Alert tone="error" className="text-[14px]">{error}</Alert>}

          <button
            type="submit"
            className={`${GOLD} mt-[24px] flex w-full items-center justify-center gap-[8px] rounded-[4px] border border-[#aa8d00] px-[12px] py-[11px] text-[15px] font-semibold text-white transition-colors hover:bg-[#917800] disabled:opacity-65`}
            disabled={busy}
          >
            {busy && <Spinner />} {submitLabel}
          </button>

          {mode === 'reset' && (
            <button type="button" className="bg-transparent p-0 text-[14px] text-[#aa8d00] hover:underline" onClick={sendOtp} disabled={busy}>
              Resend OTP
            </button>
          )}
          {mode !== 'login' && (
            <button type="button" className="bg-transparent p-0 text-[14px] text-[#475569] hover:text-[#495057]" onClick={() => switchTo('login')}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to login
            </button>
          )}
        </form>

        {mode === 'login' && (
          <p className="mb-0 mt-[16px] text-center text-[14px] text-[#475569]">
            New to IIAE?{' '}
            <Link href="/apply-online" className="text-[14px] font-medium text-[#aa8d00] hover:underline">
              Create your account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
