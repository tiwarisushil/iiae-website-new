'use client';

// Paying the exam registration fee with the registration link's token, without signing
// in: on the form's "Application submitted" screen and on /pay/registration/<token>
// (the page the API's emails link to, and where PayU returns these payments).
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { api, errorMessage } from '@/lib/student/api';
import { formatPaise } from '@/lib/student/format';
import { registrationEndpoints } from '@/lib/student/payu';
import { PaymentReturnNotice, PayuPayButton } from './payments';
import { Alert, Card, linkClass, Spinner } from './ui';
import { toast } from './toast';

type FeeInfo = {
  enabled: boolean;
  message: string;
  studentName: string;
  fee?: { amount: number; payable: boolean; paid: boolean; reason: string };
};

export function RegistrationFeePayment({ token, onLoaded }: { token: string; onLoaded?: (info: FeeInfo) => void }) {
  const [state, setState] = useState<{ loading: boolean; error: string; data: FeeInfo | null }>({ loading: true, error: '', data: null });
  const endpoints = useMemo(() => registrationEndpoints(token), [token]);

  const load = useCallback(
    () =>
      api<FeeInfo>(`/online-payments/registration/${token}`, { auth: false })
        .then((data) => {
          setState({ loading: false, error: '', data });
          onLoaded?.(data);
        })
        .catch((error) => setState({ loading: false, error: errorMessage(error, 'Could not load the registration fee'), data: null })),
    [token, onLoaded],
  );

  useEffect(() => {
    load();
  }, [load]);

  const notice = <PaymentReturnNotice endpoints={endpoints} onPaid={load} />;

  if (state.loading) return <p className="m-0 text-[15px] text-[#475569]"><Spinner /> Loading registration fee...</p>;
  if (state.error) return <Alert tone="error">{state.error}</Alert>;

  const fee = state.data?.fee;
  if (!fee || fee.amount <= 0) return notice;

  if (fee.paid) {
    return (
      <div>
        {notice}
        <Alert tone="success" title="Registration fee paid">
          Your registration fee of {formatPaise(fee.amount)} has been received.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {notice}
      <div className="rounded-[14px] border border-[#f5d58a] bg-[#fff8e6] p-[20px]">
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <div className="min-w-0 flex-1 basis-[260px]">
            <p className="m-0 text-[14px] font-semibold uppercase tracking-[0.8px] text-[#7a4b00]">Registration fee</p>
            <p className="mb-[6px] mt-[2px] font-bold text-[28px] text-heading">{formatPaise(fee.amount)}</p>
            <p className="m-0 text-[15px] text-[#475569]">
              {state.data?.enabled
                ? "Pay securely with PayU (UPI, card, net banking). You will be taken to PayU's payment page and brought back here. Your application is confirmed as soon as the payment is received."
                : state.data?.message || 'Online payment is not available right now. The institute will confirm the fee.'}
            </p>
          </div>
          {state.data?.enabled && fee.payable && (
            <PayuPayButton payableType="registration_fee" label="Pay registration fee" endpoints={endpoints} />
          )}
        </div>
        {state.data?.enabled && !fee.payable && fee.reason && <p className="mb-0 mt-[10px] text-[14px] text-[#7a4b00]">{fee.reason}</p>}
      </div>
    </div>
  );
}

const noSubscribe = () => () => {};

/** Lets the student keep the link to pay later, or send it to a parent. */
export function PaymentLinkShare({ token, studentName = '' }: { token: string; studentName?: string }) {
  // The origin is only known in the browser.
  const origin = useSyncExternalStore(noSubscribe, () => window.location.origin, () => '');
  if (!origin) return null;
  const url = `${origin}/pay/registration/${token}`;

  const message = `Dear ${studentName || 'parent'}, please pay the IIAE exam registration fee securely through PayU using this link: ${url}`;
  const action = 'inline-flex items-center gap-[6px] rounded-[8px] border border-[#cfd6e0] bg-white px-[12px] py-[7px] text-[14px] font-semibold text-heading hover:border-heading';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Payment link copied');
    } catch {
      toast.error('Could not copy. Select the link and copy it manually.');
    }
  };

  return (
    <div className="rounded-[14px] border border-[#e5e9f0] bg-[#f8fafc] p-[18px]">
      <p className="mb-[4px] font-semibold text-heading">Pay later or share the payment link</p>
      <p className="mb-[10px] text-[14px] text-[#475569]">Anyone with this link can pay the fee without signing in.</p>
      <input readOnly value={url} onFocus={(e) => e.target.select()} className="mb-[10px] block w-full rounded-[8px] border border-[#cfd6e0] bg-white px-[12px] py-[8px] font-mono text-[14px] text-[#334155]" />
      <div className="flex flex-wrap gap-[8px]">
        <button type="button" className={action} onClick={copy}>
          <i className="fa-regular fa-copy" aria-hidden="true"></i> Copy link
        </button>
        <a className={action} href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
        <a className={action} href={`mailto:?subject=${encodeURIComponent('IIAE registration fee payment link')}&body=${encodeURIComponent(message)}`}>
          <i className="fa-regular fa-envelope" aria-hidden="true"></i> Email
        </a>
      </div>
    </div>
  );
}

/** /pay/registration/<token> */
export default function RegistrationPaymentPage({ token }: { token: string }) {
  const [name, setName] = useState('');
  const onLoaded = useCallback((info: FeeInfo) => setName(info.studentName || ''), []);
  if (!/^[a-f0-9]{48}$/.test(token)) {
    return (
      <Card>
        <Alert tone="error" title="This payment link is not valid">
          Check the link in your email, or sign in to pay from your dashboard.
        </Alert>
      </Card>
    );
  }
  return (
    <Card title="Pay your registration fee" icon="fa-indian-rupee-sign">
      {name && (
        <p className="mb-[16px] text-[15px] text-[#475569]">
          Application of <strong className="text-heading">{name}</strong>
        </p>
      )}
      <RegistrationFeePayment token={token} onLoaded={onLoaded} />
      <p className="mb-0 mt-[20px] text-[14px] text-[#475569]">
        Already have your login?{' '}
        <Link href="/login?returnUrl=%2Fdashboard%2Fstudent%2Fpayments" className={linkClass}>
          Sign in
        </Link>{' '}
        to see all your payments.
      </p>
    </Card>
  );
}

