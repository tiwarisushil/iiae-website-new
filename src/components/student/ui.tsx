'use client';

// Building blocks of the student pages, in the site's colours (heading navy, gold,
// red buttons) and Font Awesome icons.
import { useEffect, useRef, type ReactNode } from 'react';

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

const btn =
  'inline-flex items-center justify-center gap-[8px] rounded-[10px] px-[20px] py-[11px] text-[15px] font-semibold leading-[1.2] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';
export const buttonClass = {
  primary: `${btn} bg-secondary text-white hover:bg-primary`,
  dark: `${btn} bg-heading text-white hover:bg-[#0b336b]`,
  outline: `${btn} border border-[#d5dbe3] bg-white text-heading hover:border-heading hover:bg-[#f8fafc]`,
  small: 'inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5dbe3] bg-white px-[12px] py-[7px] text-[14.5px] font-semibold leading-[1.2] text-heading transition-colors hover:border-heading disabled:opacity-60',
};

export const inputClass =
  'block w-full rounded-[8px] border border-[#d5dbe3] bg-white px-[14px] py-[11px] text-[15px] leading-[1.45] text-[#111827] outline-none transition placeholder:text-[#64748b] hover:border-[#b8c1cd] focus:border-heading focus:shadow-[0_0_0_3px_rgba(4,31,69,0.10)] disabled:cursor-not-allowed disabled:bg-[#f3f5f8] disabled:text-[#475569]';

export const linkClass = 'text-[length:inherit] font-semibold text-heading underline decoration-primary underline-offset-[3px] hover:text-secondary';

export function Spinner({ className }: { className?: string }) {
  return <i className={cx('fa-solid fa-circle-notch fa-spin', className)} aria-hidden="true"></i>;
}

export function Loading({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[60px] text-[#475569]" role="status">
      <Spinner className="text-[22px] text-primary" /> {label}
    </div>
  );
}

export function Card({
  title,
  icon,
  description,
  actions,
  children,
  className,
  flush,
}: {
  title?: ReactNode;
  icon?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** No padding around the body (tables, row lists). */
  flush?: boolean;
}) {
  return (
    <section className={cx('overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-[12px] border-b border-[#eef2f6] px-[22px] py-[16px] max-sm:px-[16px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            {icon && (
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[#fcf8e1] text-[14px] text-[#9a7f00]">
                <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="m-0 text-[16.5px] font-semibold leading-[1.3] text-[#0f172a]">{title}</h2>}
              {description && <p className="m-0 text-[14.5px] text-[#475569]">{description}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? undefined : 'p-[22px] max-sm:p-[16px]'}>{children}</div>
    </section>
  );
}

const TONES = {
  success: { box: 'border-[#b7e4c7] bg-[#ecfdf3] text-[#14532d]', icon: 'fa-circle-check' },
  warning: { box: 'border-[#f5d58a] bg-[#fff8e6] text-[#7a4b00]', icon: 'fa-triangle-exclamation' },
  error: { box: 'border-[#f5b5b5] bg-[#fff1f1] text-[#8a1c1c]', icon: 'fa-circle-xmark' },
  info: { box: 'border-[#bcd3f5] bg-[#eef5ff] text-[#173b6c]', icon: 'fa-circle-info' },
};
export type Tone = keyof typeof TONES;

export function Alert({
  tone = 'info',
  title,
  icon,
  children,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  icon?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex gap-[12px] rounded-[10px] border p-[13px_16px] text-[14.5px] leading-[1.55]', TONES[tone].box, className)}>
      <i className={`fa-solid ${icon ?? TONES[tone].icon} mt-[3px]`} aria-hidden="true"></i>
      <div className="min-w-0 flex-1">
        {title && <p className="m-0 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

const BADGE = {
  success: 'bg-[#dcfce7] text-[#166534]',
  warning: 'bg-[#fef3c7] text-[#92400e]',
  error: 'bg-[#fee2e2] text-[#991b1b]',
  info: 'bg-[#e0ecff] text-[#1e3a8a]',
  neutral: 'bg-[#eef1f5] text-[#334155]',
};

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof BADGE; children: ReactNode }) {
  return (
    <span className={cx('inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[13.5px] font-semibold leading-[1.4]', BADGE[tone])}>
      {children}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-[6px] block text-[14px] font-medium text-[#1e293b]">
        {label}
        {required && <span className="text-secondary"> *</span>}
      </label>
      {children}
      {hint && <p className="mb-0 mt-[5px] text-[14px] text-[#475569]">{hint}</p>}
    </div>
  );
}

export function PageHeading({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-[22px] flex flex-wrap items-end justify-between gap-[14px]">
      <div>
        <h1 className="m-0 text-[26px] font-bold leading-[1.25] tracking-[-0.3px] text-[#0f172a] max-sm:text-[22px]">{title}</h1>
        {subtitle && <p className="mb-0 mt-[4px] text-[15px] text-[#475569]">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white px-[24px] py-[52px] text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <span className="mx-auto mb-[16px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#fcf8e1] text-[26px] text-primary">
        <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
      </span>
      <h2 className="mb-[6px] text-[19px] font-semibold text-[#0f172a]">{title}</h2>
      {children && <p className="mx-auto mb-0 max-w-[520px] text-[15px] leading-[1.6] text-[#475569]">{children}</p>}
    </div>
  );
}

/** Label / value rows. Empty values show a dash. */
export function Details({ items, className }: { items: [label: string, value: ReactNode, wide?: boolean][]; className?: string }) {
  return (
    <dl className={cx('m-0', className)}>
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(130px,38%)_1fr] gap-[16px] border-b border-[#f1f5f9] py-[11px] last:border-b-0 max-xs:grid-cols-1 max-xs:gap-[2px]">
          <dt className="text-[14px] font-normal text-[#475569]">{label}</dt>
          <dd className="m-0 break-words text-[14.5px] font-medium text-[#0f172a]">{value === '' || value === null || value === undefined ? <span className="font-normal text-[#64748b]">—</span> : value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(4,31,69,0.55)] p-[16px]" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="w-full max-w-[420px] rounded-[16px] bg-white p-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="mb-[8px] text-[19px] font-semibold text-[#0f172a]">
          {title}
        </h2>
        <p id="confirm-message" className="mb-[22px] text-[15px] text-[#475569]">
          {message}
        </p>
        <div className="flex justify-end gap-[10px]">
          <button ref={cancelRef} type="button" className={buttonClass.outline} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={buttonClass.primary} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
