'use client';

import { newsletterSchema } from '@/lib/forms';
import { FieldError, Honeypot } from './EnquiryForm';
import { useForm } from './useForm';
import { submitNewsletter } from '@/lib/api';

export default function NewsletterForm() {
  const { errors, message, submitting, field, onSubmit } = useForm({
    schema: newsletterSchema,
    submit: submitNewsletter,
    event: 'newsletter_subscribe',
  });
  return (
    <form  onSubmit={onSubmit}>
      <Honeypot />
      <input className="text-[15px] text-[#ffffff] w-full h-[45px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[10px_15px] [background:rgba(255,255,255,0.1)] [border-image:none] [&::placeholder]:text-[#ffffff] [&::placeholder]:text-[14px]" type="email" placeholder="Enter email address" aria-label="Email address" autoComplete="email" maxLength={255} {...field('newsemail')} />
      <FieldError message={errors.newsemail ?? message ?? undefined} />
      <input className="font-trip-medium mt-[10px] rounded-[12px] p-[15px_30px] [background:#f6c606]" type="submit" value="Subscribe Now!" disabled={submitting} />
    </form>
  );
}
