'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, ApiError, errorMessage } from '@/lib/student/api';
import { formatDateTime, formatPaise } from '@/lib/student/format';
import type { PaymentStatus } from '@/lib/student/payu';
import { Alert, buttonClass, Card, linkClass, Loading, Spinner, type Tone } from './ui';

type PublicPayment = {
  reference: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string | null;
  paymentUrl?: string;
  syncError?: string;
};

const VIEW: Record<PaymentStatus, { tone: Tone; title: string }> = {
  paid: { tone: 'success', title: 'Payment received' },
  pending: { tone: 'warning', title: 'Payment being confirmed' },
  created: { tone: 'info', title: 'Payment due' },
  failed: { tone: 'error', title: 'Payment failed' },
  expired: { tone: 'warning', title: 'Link expired' },
  cancelled: { tone: 'warning', title: 'Link cancelled' },
};

/** /payment/<reference>: status of a PayU payment link the institute sent. */
export default function PaymentLinkStatus({ reference }: { reference: string }) {
  const valid = /^IIAE-\d{6}-[A-F0-9]{10}$/.test(reference);
  const [payment, setPayment] = useState<PublicPayment | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>(valid ? 'loading' : 'missing');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!valid) return;
    api<PublicPayment>(`/online-payments/public/${reference}`, { auth: false })
      .then((p) => {
        setPayment(p);
        setState('ready');
      })
      .catch((err) => setState(err instanceof ApiError && err.status === 404 ? 'missing' : 'error'));
  }, [reference, valid]);

  const check = async () => {
    setChecking(true);
    try {
      setPayment(await api<PublicPayment>(`/online-payments/public/${reference}/sync`, { method: 'POST', auth: false }));
    } catch (err) {
      setPayment((p) => (p ? { ...p, syncError: errorMessage(err, 'Could not check the status. Please try again.') } : p));
    }
    setChecking(false);
  };

  let body;
  if (state === 'loading') body = <Loading label="Loading payment details..." />;
  else if (state === 'missing')
    body = <Alert tone="error" title="Payment not found">This payment reference does not exist. Check the link you were sent.</Alert>;
  else if (state === 'error' || !payment)
    body = <Alert tone="error" title="Something went wrong">We could not load this payment. Please try again in a moment.</Alert>;
  else {
    const view = VIEW[payment.status] ?? VIEW.pending;
    const checkButton = (
      <button type="button" className={buttonClass.outline} onClick={check} disabled={checking}>
        {checking ? <Spinner /> : <i className="fa-solid fa-rotate" aria-hidden="true"></i>} Check status with PayU
      </button>
    );
    body = (
      <div className="flex flex-col gap-[18px]">
        <Alert tone={view.tone} title={view.title}>
          {payment.status === 'paid' && <p className="mb-0 mt-[4px]">Thank you. The institute has recorded this payment on {formatDateTime(payment.paidAt)}.</p>}
          {payment.status === 'pending' && (
            <p className="mb-0 mt-[4px]">{payment.syncError || 'PayU has received your payment and it is being confirmed. Do not pay again.'}</p>
          )}
          {payment.status === 'failed' && <p className="mb-0 mt-[4px]">The last attempt did not go through. Open the link you were sent to try again.</p>}
          {(payment.status === 'expired' || payment.status === 'cancelled') && (
            <p className="mb-0 mt-[4px]">Please contact the institute for a new payment link.</p>
          )}
          {payment.status === 'created' && payment.syncError && <p className="mb-0 mt-[4px]">{payment.syncError}</p>}
        </Alert>
        <div className="rounded-[14px] border border-[#e5e9f0] bg-[#f8fafc] p-[18px]">
          <p className="m-0 text-[15px] text-[#475569]">{payment.description}</p>
          <p className="m-0 font-bold text-[28px] text-heading">{formatPaise(payment.amount)}</p>
          <p className="m-0 font-mono text-[14px] text-[#475569]">Reference {payment.reference}</p>
        </div>
        <div className="flex flex-wrap gap-[10px]">
          {payment.status === 'created' && payment.paymentUrl && (
            <a href={payment.paymentUrl} className={buttonClass.primary}>
              <i className="fa-solid fa-lock" aria-hidden="true"></i> Pay now
            </a>
          )}
          {payment.status === 'failed' && payment.paymentUrl && (
            <a href={payment.paymentUrl} className={buttonClass.primary}>
              Try again
            </a>
          )}
          {(payment.status === 'created' || payment.status === 'pending' || payment.status === 'failed') && checkButton}
        </div>
        {payment.status === 'created' && <p className="m-0 text-[14px] text-[#475569]">Already paid? Check the status with PayU.</p>}
      </div>
    );
  }

  return (
    <Card title="Payment" icon="fa-receipt" className="mx-auto max-w-[620px]">
      {body}
      <p className="mb-0 mt-[22px] text-[14px] text-[#475569]">
        Students can see all their payments after{' '}
        <Link href="/login?returnUrl=%2Fdashboard%2Fstudent%2Fpayments" className={linkClass}>
          signing in
        </Link>
        .
      </p>
    </Card>
  );
}
