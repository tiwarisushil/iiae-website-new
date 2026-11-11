'use client';

// Short-lived messages ("Profile updated", "Could not refresh") for the student pages.
import { useSyncExternalStore } from 'react';
import { cx } from './ui';

type Toast = { id: number; tone: 'success' | 'error'; message: string };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function show(tone: Toast['tone'], message: string) {
  const id = nextId++;
  toasts = [...toasts.slice(-3), { id, tone, message }];
  emit();
  setTimeout(() => dismiss(id), tone === 'error' ? 6000 : 4000);
}

export const toast = {
  success: (message: string) => show('success', message),
  error: (message: string) => show('error', message),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: Toast[] = [];

export function Toaster() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => EMPTY);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[16px] z-[1200] flex flex-col items-center gap-[8px] px-[16px]" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className={cx(
            'pointer-events-auto flex max-w-[480px] items-start gap-[10px] rounded-[12px] px-[16px] py-[12px] text-[15px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]',
            t.tone === 'error' ? 'bg-[#b91c1c]' : 'bg-heading',
          )}
        >
          <i className={`fa-solid ${t.tone === 'error' ? 'fa-circle-xmark' : 'fa-circle-check text-primary'} mt-[3px]`} aria-hidden="true"></i>
          <span className="flex-1">{t.message}</span>
          <button type="button" className="bg-transparent p-0 text-white/90 hover:text-white" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
