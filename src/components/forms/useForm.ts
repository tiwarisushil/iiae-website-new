'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { validate, validateField, type Errors, type FormResponse, type Schema, type Values } from '@/lib/forms';
import { digitInputProps, digitsOnly } from '@/lib/validation';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Field state, validate-on-blur and submit for the public forms. `submit` sends the
 * values to the CRM API (src/lib/api.ts). On success it pushes a dataLayer event and goes
 * to /thank-you, or to the page the submit function returns (the student registration form).
 */
export function useForm({
  schema,
  submit,
  event,
  initial = {},
}: {
  schema: Schema;
  submit: (values: Values) => Promise<FormResponse>;
  /** dataLayer event pushed after a successful submission. */
  event: string;
  initial?: Values;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const check = (name: string, next: Values) => {
    if (!(name in schema)) return;
    const error = validateField(schema, name, next);
    setErrors(({ [name]: _, ...rest }) => (error ? { ...rest, [name]: error } : rest));
  };

  /**
   * Props for an input. `digits` keeps only numbers while typing and caps the length
   * (mobile numbers). A field that already shows an error is re-checked on every change,
   * so the message disappears as soon as the value is fixed.
   */
  const field = (name: string, options: { digits?: number } = {}) => ({
    name,
    value: values[name] ?? '',
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      const value = options.digits ? digitsOnly(raw, options.digits) : raw;
      const next = { ...values, [name]: value };
      setValues(next);
      if (errors[name]) check(name, next);
    },
    onBlur: () => check(name, values),
    ...(options.digits ? digitInputProps(options.digits) : {}),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>, options?: { block?: boolean }) => {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const clientErrors = validate(schema, values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length || options?.block) return;

    setSubmitting(true);
    try {
      // Bots fill the hidden honeypot field: show them the thank-you page, store nothing.
      const data: FormResponse = String(form.get('website') ?? '').trim() ? { ok: true } : await submit(values);
      if (data.ok) {
        (window.dataLayer ||= []).push({ event });
        router.push(data.redirect ?? '/thank-you');
        return;
      }
      setErrors(data.errors ?? {});
      setMessage(data.message ?? (data.errors ? null : 'Something went wrong. Please try again.'));
    } catch {
      setMessage('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return { values, errors, message, submitting, field, onSubmit };
}
