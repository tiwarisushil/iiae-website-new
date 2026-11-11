// Display formats for the student pages. The API sends registration amounts in rupees
// (GET /dashboard, /registrations/*) and online-payment amounts in paise (/online-payments/*).

const inr = (fractionDigits: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: fractionDigits });

export const formatRupees = (rupees: number | string | null | undefined) => inr(0).format(Number(rupees) || 0);

export const formatPaise = (paise: number | string | null | undefined) => inr(2).format((Number(paise) || 0) / 100);

const valid = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "13 Oct 2026" */
export const formatDate = (value: string | Date | null | undefined, fallback = '—') =>
  valid(value)?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ?? fallback;

/** "13 Oct 2026, 4:05 pm" */
export const formatDateTime = (value: string | Date | null | undefined, fallback = '—') =>
  valid(value)?.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) ?? fallback;

/** "Tuesday, 13 October 2026" */
export const formatLongDate = (value: string | Date | null | undefined, fallback = '—') =>
  valid(value)?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) ??
  fallback;

/** "Neha Singh" -> "NS" */
export const initials = (name: string | null | undefined) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase() || 'S';
