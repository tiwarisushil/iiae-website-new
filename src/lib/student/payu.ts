// PayU hosted checkout. The CRM API creates the transaction and returns the signed form
// fields; the browser posts them to PayU's payment page (a real form POST, not fetch).
// After paying, PayU posts the browser back to the API, which verifies the response and
// redirects to the page the payment started from with ?payment=<id>&result=<outcome>:
// /dashboard/student/payments for signed-in students, /pay/registration/<token> otherwise.

export type PaymentStatus = 'created' | 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';

/** An online payment as the API serializes it (amounts in paise). */
export type OnlinePayment = {
  _id: string;
  reference: string;
  payableType: string;
  description: string;
  amount: number;
  currency: string;
  method: 'checkout' | 'payment_link';
  status: PaymentStatus;
  payuPaymentId?: string;
  paymentUrl?: string;
  paidAt?: string | null;
  invoiceUrl?: string;
  failure?: { reason?: string; description?: string } | null;
  createdAt: string;
  syncError?: string;
};

export type CheckoutOrder = { action: string; params: Record<string, string | number | null | undefined> };

/** Order and status endpoints: the signed-in student's, or a registration link's (token). */
export type PaymentEndpoints = { createOrder: string; status: (id: string) => string; auth: boolean };

export const studentEndpoints: PaymentEndpoints = {
  createOrder: '/online-payments/orders',
  status: (id) => `/online-payments/${id}`,
  auth: true,
};

export const registrationEndpoints = (token: string): PaymentEndpoints => ({
  createOrder: `/online-payments/registration/${token}/orders`,
  status: (id) => `/online-payments/registration/${token}/orders/${id}`,
  auth: false,
});

/** Builds a hidden form from the API's checkout payload and submits it (leaves the page). */
export function submitPayuForm({ action, params }: CheckoutOrder) {
  if (!/^https:\/\/(test|secure)\.payu\.in\//.test(String(action || ''))) {
    throw new Error('Unexpected payment gateway address');
  }
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.style.display = 'none';
  for (const [name, value] of Object.entries(params || {})) {
    if (value === undefined || value === null) continue;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  created: 'Not paid yet',
  pending: 'Awaiting confirmation',
  paid: 'Paid',
  failed: 'Failed',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

/** Text for each ?result= value of PayU's return redirect. */
export const RETURN_RESULT_MESSAGES: Record<string, string> = {
  paid: 'Thank you. The institute has recorded this payment.',
  failed: 'The payment did not go through. No money was taken. You can try again.',
  pending:
    'PayU has received your payment and it is being confirmed. Do not pay again; check the status in a minute.',
  mismatch:
    'The payment details reported by PayU do not match this payment. It has been flagged for review; please contact the institute.',
  invalid:
    'The payment response could not be verified. If money was deducted it will be reconciled automatically; check the status in a minute.',
  error:
    'Something went wrong while confirming the payment. If money was deducted it will be reconciled automatically.',
};
