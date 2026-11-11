'use client';

import { useState, type FormEvent } from 'react';
import { applySchema } from '@/lib/forms';
import { STUDENT_LOGIN_URL } from '@/lib/site';
import { FieldError, Honeypot, fieldErrorClass } from './EnquiryForm';
import { useForm } from './useForm';
import { submitApplication } from '@/lib/api';
import SiteLink from '@/components/SiteLink';
import TermsModal from './TermsModal';

const FIELDS: [name: string, label: string, type: string, autoComplete: string][][] = [
  [
    ['first_name', 'First Name *', 'text', 'given-name'],
    ['last_name', 'Last Name', 'text', 'family-name'],
  ],
  [
    ['email', 'Email Address *', 'email', 'email'],
    ['parents_email', 'Parent  Email Address', 'email', 'off'],
  ],
  [
    ['password', 'Password *', 'password', 'new-password'],
    ['password_confirmation', 'Re-Enter Password', 'password', 'new-password'],
  ],
  [
    ['phone', 'Phone Number *', 'tel', 'tel-national'],
    ['alternate_phone', 'Alternative  Phone Number', 'tel', 'off'],
  ],
];

/**
 * Student account registration. The account is created in the IIAE CRM
 * (POST /api/auth/register); the student is then signed in and taken to the exam
 * registration form (or the dashboard when the form is not open).
 */
export default function ApplyForm() {
  const { errors, message, submitting, field, onSubmit } = useForm({
    schema: applySchema,
    submit: submitApplication,
    event: 'apply_online_submit',
  });
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!agreed) setTermsError('Please agree to the terms and conditions.');
    else setTermsError('');
    onSubmit(event, { block: !agreed });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Honeypot />
      <div >
        {/* Same heading block as the CRM's apply page (Reactjs StudentSignupPage). */}
        <div className="text-left mb-[32px]">
          <h1 className="text-[#ffffff] text-[30px] leading-[1.2] font-semibold tracking-[-0.025em] mb-0! max-md:text-[26px]">AIAEE 2027, AME Entrance Exam</h1>
          <p className="text-[rgba(255,255,255,0.9)] text-[18px] font-semibold mt-[8px] mb-0!">Registration Form</p>
          <div className="mt-[8px] h-[4px] w-[56px] rounded-[4px] bg-[#F5C400]" aria-hidden="true"></div>
        </div>

        {FIELDS.map((row) => (
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex" key={row[0][0]}>
            {row.map(([name, label, type, autoComplete]) => (
              <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 mb-[16px] max-sm:w-full sm:grow-0 sm:basis-auto" key={name}>
                <label className="block mb-[3px] text-[#ffffff] text-[14px]" htmlFor={`apply-${name}`}>
                  {label}
                </label>
                <input
                  id={`apply-${name}`}
                  type={type}
                  className={`text-[16px] w-full border-2 rounded-[12px] p-[14px_18px] bg-white outline-none transition-[border-color] ${errors[name] ? 'border-[#ff4d4d]' : 'border-transparent'}`}
                  placeholder={type === 'tel' ? '10-digit mobile number' : ''}
                  autoComplete={autoComplete}
                  autoCapitalize={autoComplete === 'given-name' || autoComplete === 'family-name' ? 'words' : undefined}
                  maxLength={type === 'email' ? 255 : type === 'text' ? 100 : type === 'password' ? 72 : undefined}
                  aria-invalid={errors[name] ? true : undefined}
                  {...field(name, type === 'tel' ? { digits: 10 } : {})}
                />
                <FieldError message={errors[name]} />
              </div>
            ))}
          </div>
        ))}

        <div className="justify-between items-center mb-[15px] text-[14px] flex">
          <div className="items-center flex gap-[8px]">
            <input
              type="checkbox"
              className="w-[16px] h-[16px] accent-[#667eea]"
              id="remember"
              checked={agreed}
              aria-invalid={termsError ? true : undefined}
              onChange={(event) => {
                setAgreed(event.target.checked);
                if (event.target.checked) setTermsError('');
              }}
            />
            <label htmlFor="remember" className="block text-[#ffffff] text-[14px] m-0">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="[background:none] [border:none] p-0 text-[14px] font-semibold text-[#ffffff] underline underline-offset-2 cursor-pointer [&:hover]:text-[#F5C400]"
              >
                terms and conditions
              </button>
            </label>
          </div>
          <SiteLink href={`${STUDENT_LOGIN_URL}?forgot=1`} className="text-[#ffffff]">
            Forgot password?
          </SiteLink>
        </div>
        <FieldError className={`${fieldErrorClass} mb-[12px]`} message={termsError || undefined} />

        <button type="submit" className="text-[16px] text-[#ffffff] w-full font-semibold relative rounded-[12px] p-[20px] [background:#ff2a00] overflow-hidden [transition:0.3s]" disabled={submitting}>
          Create Account
        </button>

        <div className="text-center mt-[20px] p-0">
          <p className="text-[15px] text-[#ffffff]">
            Already have an account?{' '}
            <SiteLink href={STUDENT_LOGIN_URL} className="text-[#ffffff] text-[15px]">
              Sign in
            </SiteLink>
          </p>
        </div>

        {message && (
          <FieldError className={`${fieldErrorClass} mt-[16px]`} message={message} />
        )}
      </div>
      <TermsModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAccept={() => {
          setAgreed(true);
          setTermsOpen(false);
        }}
      />
    </form>
  );
}
