'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage, fileUrl } from '@/lib/student/api';
import { formatDateTime, formatPaise } from '@/lib/student/format';
import { PAYMENT_STATUS_LABELS, studentEndpoints, type OnlinePayment } from '@/lib/student/payu';
import { PaymentReturnNotice, PaymentStatusBadge, PayuPayButton } from './payments';
import { Alert, buttonClass, Card, linkClass, Loading, PageHeading, Spinner } from './ui';
import { toast } from './toast';

type Payable = {
  type: 'registration_fee' | 'tuition_fee';
  label: string;
  amount: number;
  payable: boolean;
  paid: boolean;
  reason: string;
};
type Payables = { enabled: boolean; message: string; items: Payable[] };

function Stat({ label, value, caption, icon }: { label: string; value: string; caption: string; icon: string }) {
  return (
    <div className="flex items-center gap-[14px] rounded-[14px] border border-[#e2e8f0] bg-white p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#eef2f8] text-[17px] text-heading">
        <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
      </span>
      <div>
        <p className="m-0 text-[14.5px] font-medium text-[#475569]">{label}</p>
        <p className="m-0 text-[22px] font-bold leading-[1.25] text-[#0f172a]">{value}</p>
        <p className="m-0 text-[14px] text-[#475569]">{caption}</p>
      </div>
    </div>
  );
}

/**
 * /dashboard/student/payments: fees due (pay through PayU) and payment history. It is
 * also where PayU returns signed-in students (?payment=&result=).
 */
export default function PaymentsPage() {
  const [payables, setPayables] = useState<Payables | null>(null);
  const [payments, setPayments] = useState<OnlinePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checking, setChecking] = useState('');

  const load = useCallback(
    () =>
      Promise.all([api<Payables>('/online-payments/payables'), api<OnlinePayment[]>('/online-payments/mine')]).then(([p, mine]) => {
        setPayables(p);
        setPayments(Array.isArray(mine) ? mine : []);
      }),
    [],
  );

  useEffect(() => {
    load()
      .catch((error) => toast.error(errorMessage(error, 'Could not load your payments')))
      .finally(() => setLoading(false));
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not refresh'));
    }
    setRefreshing(false);
  };

  const onPaid = useCallback(() => {
    load().catch(() => {});
  }, [load]);

  const checkStatus = async (payment: OnlinePayment) => {
    setChecking(payment._id);
    try {
      const updated = await api<OnlinePayment>(`/online-payments/${payment._id}?sync=true`);
      setPayments((list) => list.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
      if (updated.syncError) toast.error(updated.syncError);
      else if (updated.status === 'paid') {
        toast.success('Payment confirmed');
        onPaid();
      } else toast.success(`Status: ${PAYMENT_STATUS_LABELS[updated.status] ?? updated.status}`);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not check the payment status'));
    }
    setChecking('');
  };

  if (loading) return <Loading label="Loading your payments..." />;

  const items = payables?.items ?? [];
  const due = items.filter((i) => i.payable);
  const notDue = items.filter((i) => !i.payable);
  const dueTotal = due.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const enabled = Boolean(payables?.enabled);

  return (
    <div>
      <PageHeading
        title="Payments"
        subtitle="Pay fees through PayU and keep a record of every payment."
        actions={
          <button type="button" className={buttonClass.outline} onClick={refresh} disabled={refreshing}>
            {refreshing ? <Spinner /> : <i className="fa-solid fa-rotate" aria-hidden="true"></i>} Refresh
          </button>
        }
      />

      <PaymentReturnNotice endpoints={studentEndpoints} onPaid={onPaid} />

      <div className="mb-[22px] grid grid-cols-3 gap-[18px] max-md:grid-cols-1">
        <Stat label="Due now" value={String(due.length)} caption={due.length === 1 ? 'Fee waiting' : 'Fees waiting'} icon="fa-hourglass-half" />
        <Stat label="Amount due" value={due.length ? formatPaise(dueTotal) : '—'} caption={enabled ? 'Payable online' : 'Online pay is off'} icon="fa-indian-rupee-sign" />
        <Stat label="Payments" value={String(payments.length)} caption="On this account" icon="fa-receipt" />
      </div>

      {payables && !enabled && (
        <Alert tone="warning" className="mb-[22px]">
          {payables.message || 'Online payments are not available right now. Please contact the accounts office.'}
        </Alert>
      )}

      <Card title="Fees due" description="Pay securely online with PayU: UPI, card or net banking." icon="fa-file-invoice" className="mb-[20px]">
        {due.length === 0 ? (
          <p className="m-0 flex items-center gap-[8px] text-[15px] text-[#475569]"><i className="fa-solid fa-circle-check text-[#16a34a]" aria-hidden="true"></i> Nothing is due right now.</p>
        ) : (
          <ul className="m-0 flex flex-col gap-[12px] p-0">
            {due.map((item) => (
              <li key={item.type} className="flex flex-wrap items-center justify-between gap-[14px] rounded-[12px] border border-[#e2e8f0] p-[16px]">
                <div>
                  <p className="m-0 text-[15px] font-medium text-[#334155]">{item.label}</p>
                  <p className="m-0 text-[21px] font-bold text-[#0f172a]">{formatPaise(item.amount)}</p>
                </div>
                {enabled && <PayuPayButton payableType={item.type} endpoints={studentEndpoints} />}
              </li>
            ))}
          </ul>
        )}
        {notDue.length > 0 && (
          <ul className="mb-0 mt-[16px] flex flex-col gap-[8px] border-t border-[#eef1f5] p-0 pt-[14px]">
            {notDue.map((item) => (
              <li key={item.type} className="flex flex-wrap justify-between gap-[10px] text-[15px]">
                <span className="text-[#334155]">{item.label}</span>
                <span className="text-[#475569]">
                  {item.paid && <i className="fa-solid fa-circle-check mr-[6px] text-[#16a34a]" aria-hidden="true"></i>}
                  {item.reason}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Payment history" icon="fa-clock-rotate-left" flush>
        {payments.length === 0 ? (
          <p className="m-0 p-[22px] text-[15px] text-[#475569]">You have not made any online payments yet.</p>
        ) : (
          <>
          <div className="overflow-x-auto max-xl:hidden">
            <table className="m-0 w-full border-0 text-left text-[14px] [&_td]:border-0 [&_td]:border-t [&_td]:border-[#eef2f6] [&_td]:px-[14px] [&_td]:py-[14px] [&_td]:align-middle [&_td]:text-[14.5px] [&_td]:text-[#1e293b] [&_th]:border-0 [&_th]:px-[14px] [&_th]:py-[11px] [&_th]:font-semibold">
              <thead className="bg-[#f8fafc] text-[13.5px] uppercase tracking-[0.5px] text-[#475569]">
                <tr>
                  <th>Date</th>
                  <th>Fee</th>
                  <th>Reference</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td className="whitespace-nowrap">{formatDateTime(p.paidAt || p.createdAt)}</td>
                    <td>
                      {p.description}
                      <span className="block text-[14px] text-[#475569]">{p.method === 'payment_link' ? 'Payment link' : 'Website'}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="font-mono text-[14.5px]">{p.reference}</span>
                      {p.payuPaymentId && <span className="block text-[14px] text-[#475569]">PayU {p.payuPaymentId}</span>}
                    </td>
                    <td className="whitespace-nowrap text-right font-semibold">{formatPaise(p.amount)}</td>
                    <td>
                      <PaymentStatusBadge status={p.status} />
                    </td>
                    <td>
                      <div className="flex flex-wrap justify-end gap-[8px]">
                        {p.invoiceUrl && (
                          <a href={fileUrl(p.invoiceUrl)} target="_blank" rel="noreferrer" className={linkClass}>
                            Invoice
                          </a>
                        )}
                        {(p.status === 'created' || p.status === 'pending') && (
                          <button type="button" className={buttonClass.small} onClick={() => checkStatus(p)} disabled={checking === p._id}>
                            {checking === p._id && <Spinner />} <span className="whitespace-nowrap">Check status</span>
                          </button>
                        )}
                        {p.status === 'created' && p.method === 'payment_link' && p.paymentUrl && (
                          <a href={p.paymentUrl} target="_blank" rel="noreferrer" className={linkClass}>
                            Open link
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Narrower screens: one card per payment */}
          <ul className="m-0 flex flex-col p-0 xl:hidden">
            {payments.map((p) => (
              <li key={p._id} className="border-t border-[#eef2f6] px-[16px] py-[14px] first:border-t-0">
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="min-w-0">
                    <p className="m-0 text-[15px] font-semibold text-[#0f172a]">{p.description}</p>
                    <p className="m-0 text-[14px] text-[#475569]">{formatDateTime(p.paidAt || p.createdAt)}</p>
                  </div>
                  <p className="m-0 whitespace-nowrap text-[15.5px] font-bold text-[#0f172a]">{formatPaise(p.amount)}</p>
                </div>
                <div className="mt-[8px] flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
                  <PaymentStatusBadge status={p.status} />
                  <span className="break-all font-mono text-[14px] text-[#334155]">{p.reference}</span>
                  <span className="text-[14px] text-[#475569]">{p.method === 'payment_link' ? 'Payment link' : 'Website'}</span>
                </div>
                {(p.invoiceUrl || p.status === 'created' || p.status === 'pending') && (
                  <div className="mt-[10px] flex flex-wrap gap-[10px]">
                    {p.invoiceUrl && (
                      <a href={fileUrl(p.invoiceUrl)} target="_blank" rel="noreferrer" className={buttonClass.small}>
                        <i className="fa-solid fa-file-invoice" aria-hidden="true"></i> Invoice
                      </a>
                    )}
                    {(p.status === 'created' || p.status === 'pending') && (
                      <button type="button" className={buttonClass.small} onClick={() => checkStatus(p)} disabled={checking === p._id}>
                        {checking === p._id ? <Spinner /> : <i className="fa-solid fa-rotate" aria-hidden="true"></i>} Check status
                      </button>
                    )}
                    {p.status === 'created' && p.method === 'payment_link' && p.paymentUrl && (
                      <a href={p.paymentUrl} target="_blank" rel="noreferrer" className={buttonClass.small}>
                        Open link
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          </>
        )}
      </Card>
    </div>
  );
}
