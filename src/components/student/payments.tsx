'use client';

// PayU payment pieces shared by the dashboard and the registration-fee page.
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '@/lib/student/api';
import { formatPaise } from '@/lib/student/format';
import {
  PAYMENT_STATUS_LABELS,
  RETURN_RESULT_MESSAGES,
  submitPayuForm,
  type CheckoutOrder,
  type OnlinePayment,
  type PaymentEndpoints,
  type PaymentStatus,
} from '@/lib/student/payu';
import { Alert, Badge, buttonClass, cx, Spinner } from './ui';
import { toast } from './toast';

const STATUS_TONE: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  created: 'info',
  pending: 'warning',
  paid: 'success',
  failed: 'error',
  expired: 'neutral',
  cancelled: 'neutral',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{PAYMENT_STATUS_LABELS[status] ?? status}</Badge>;
}

/**
 * "Pay now": asks the API for a signed PayU checkout for this fee and posts it to PayU.
 * The amount is decided by the API.
 */
export function PayuPayButton({
  payableType,
  label = 'Pay now',
  endpoints,
  className = buttonClass.primary,
}: {
  payableType: 'registration_fee' | 'tuition_fee';
  label?: string;
  endpoints: PaymentEndpoints;
  className?: string;
}) {
  const [phase, setPhase] = useState<'idle' | 'starting' | 'redirecting' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const busy = phase === 'starting' || phase === 'redirecting';

  // Coming back to the page with the browser's back button after leaving for PayU
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setPhase('idle');
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const pay = async () => {
    if (busy) return;
    setPhase('starting');
    setMessage('Preparing secure checkout...');
    let order: CheckoutOrder;
    try {
      order = await api<CheckoutOrder>(endpoints.createOrder, { body: { payableType }, auth: endpoints.auth });
    } catch (error) {
      setPhase('error');
      setMessage(errorMessage(error, 'Could not start the payment. Please try again.'));
      return;
    }
    try {
      setPhase('redirecting');
      setMessage('Taking you to PayU to complete the payment...');
      submitPayuForm(order);
    } catch (error) {
      setPhase('error');
      setMessage(error instanceof Error ? error.message : 'Could not open the PayU payment page.');
    }
  };

  const text = phase === 'starting' ? 'Preparing...' : phase === 'redirecting' ? 'Redirecting to PayU...' : phase === 'error' ? 'Try again' : label;
  return (
    <div className="flex flex-col items-start gap-[10px] sm:items-end">
      <button type="button" onClick={pay} disabled={busy} aria-busy={busy} className={className}>
        {busy ? <Spinner /> : <i className="fa-solid fa-lock" aria-hidden="true"></i>} {text}
      </button>
      {phase === 'error' && <Alert tone="error" className="max-w-[420px] text-[14px]">{message}</Alert>}
      {busy && message && (
        <p role="status" className="m-0 text-[14px] text-[#475569]">
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Banner after PayU sends the payer back with ?payment=<id>&result=<outcome>. It shows
 * the stored status of that payment, removes the query (so a refresh does not repeat
 * it) and calls onPaid once when the payment is confirmed.
 */
export function PaymentReturnNotice({ endpoints, onPaid }: { endpoints: PaymentEndpoints; onPaid?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [ret, setRet] = useState(() => {
    const result = params.get('result');
    return result ? { paymentId: params.get('payment') || '', result } : null;
  });
  const [payment, setPayment] = useState<OnlinePayment | null>(null);
  const [loading, setLoading] = useState(Boolean(ret?.paymentId));
  const [checking, setChecking] = useState(false);
  const paidReported = useRef(false);
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  });

  // Strip ?payment=&result= from the address, keeping any other parameters.
  useEffect(() => {
    if (!params.get('result')) return;
    const rest = new URLSearchParams(params.toString());
    rest.delete('payment');
    rest.delete('result');
    const query = rest.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const show = (p: OnlinePayment) => {
    setPayment(p);
    if (p.status === 'paid' && !paidReported.current) {
      paidReported.current = true;
      onPaidRef.current?.();
    }
  };

  const paymentId = ret?.paymentId;
  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    api<OnlinePayment>(endpoints.status(paymentId), { auth: endpoints.auth })
      .then((p) => !cancelled && show(p))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // endpoints is rebuilt on each render; its URLs depend only on the token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, endpoints.auth]);

  if (!ret) return null;

  // The stored status, unless it still reads "created" (not updated yet): then PayU's result.
  const fromResult: PaymentStatus = ret.result === 'paid' ? 'paid' : ret.result === 'failed' ? 'failed' : 'pending';
  const status: PaymentStatus = payment && payment.status !== 'created' ? payment.status : fromResult;
  const failed = status === 'failed' || ret.result === 'mismatch';
  const tone = status === 'paid' ? 'success' : failed ? 'error' : 'warning';
  const title = status === 'paid' ? 'Payment received' : failed ? 'Payment not completed' : 'Payment being confirmed';
  const text =
    status === 'paid'
      ? RETURN_RESULT_MESSAGES.paid
      : status === 'failed' && payment?.failure?.description
        ? payment.failure.description
        : RETURN_RESULT_MESSAGES[ret.result] ?? RETURN_RESULT_MESSAGES.pending;

  const check = async () => {
    if (!ret.paymentId) return;
    setChecking(true);
    try {
      const p = await api<OnlinePayment>(`${endpoints.status(ret.paymentId)}?sync=true`, { auth: endpoints.auth });
      show(p);
      if (p.syncError) toast.error(p.syncError);
      else toast.success(p.status === 'paid' ? 'Payment confirmed' : `Status: ${PAYMENT_STATUS_LABELS[p.status] ?? p.status}`);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not check the payment status'));
    }
    setChecking(false);
  };

  return (
    <Alert tone={tone} title={title} icon={loading ? 'fa-circle-notch fa-spin' : undefined} className="mb-[22px]">
      <p className="mb-0 mt-[4px]">{text}</p>
      {payment && (
        <p className="mb-0 mt-[6px] text-[14px] opacity-80">
          {formatPaise(payment.amount)} · Reference {payment.reference}
          {payment.payuPaymentId ? ` · PayU ID ${payment.payuPaymentId}` : ''}
        </p>
      )}
      <div className="mt-[10px] flex flex-wrap gap-[8px]">
        {status !== 'paid' && status !== 'failed' && ret.paymentId && (
          <button type="button" className={buttonClass.small} onClick={check} disabled={checking}>
            {checking ? <Spinner /> : <i className="fa-solid fa-rotate" aria-hidden="true"></i>} Check status
          </button>
        )}
        <button type="button" className={cx(buttonClass.small, 'bg-transparent')} onClick={() => setRet(null)}>
          Close
        </button>
      </div>
    </Alert>
  );
}
