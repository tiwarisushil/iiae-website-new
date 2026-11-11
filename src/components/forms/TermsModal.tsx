'use client';

import { useEffect } from 'react';

// Terms shown before creating an account; the same text as the CRM's apply page
// (Reactjs/src/components/TermsModal.jsx). Edit TERMS to change the content in both places.
export const TERMS = [
  {
    title: 'Eligibility',
    body: 'Candidates must satisfy the eligibility criteria for the AIAEE 2027 (AME Entrance Exam) published by the Indian Institute of Aircraft Engineering. Registration does not by itself confirm eligibility; documents are verified before admission.',
  },
  {
    title: 'Accuracy of information',
    body: 'All details entered in the registration form (name, date of birth, contact details, education and uploaded documents) must be true and complete. Any false or misleading information can lead to cancellation of the registration, the examination result or the admission, without refund.',
  },
  {
    title: 'Registration fee',
    body: 'The registration fee is payable online through the payment gateway. The fee is non-refundable and non-transferable once paid, except where a payment is debited but the registration is not confirmed, in which case the amount is reconciled or refunded by the institute.',
  },
  {
    title: 'Examination',
    body: 'The admit card, examination date, centre and mode are communicated by the institute by email and on the student dashboard. The institute may change the examination schedule or centre; candidates will be informed. Use of unfair means during the examination results in disqualification.',
  },
  {
    title: 'Communication',
    body: 'By registering you agree to receive emails, SMS and WhatsApp messages from the institute about your application, payment, examination and admission. Keep your email and mobile number active and up to date.',
  },
  {
    title: 'Personal data',
    body: 'The information and documents you provide are used only for processing your application, examination and admission, and are stored securely. They are not sold or shared with third parties except as required for the payment gateway, examination conduct or by law.',
  },
  {
    title: 'Account',
    body: 'You are responsible for keeping your login password confidential. Any activity under your account is treated as yours. Inform the institute immediately if you suspect misuse.',
  },
  {
    title: 'Decisions of the institute',
    body: 'The decision of the Indian Institute of Aircraft Engineering on all matters relating to the registration, examination, results and admission is final. Disputes are subject to the jurisdiction of the courts at New Delhi.',
  },
];

type Props = { open: boolean; onClose: () => void; onAccept?: () => void };

export default function TermsModal({ open, onClose, onAccept }: Props) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(15,23,42,0.6)] p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="flex max-h-[85vh] w-full max-w-[42rem] flex-col overflow-hidden rounded-[16px] bg-white text-[#1e293b] [font-family:system-ui,-apple-system,Segoe_UI,Roboto,sans-serif] [box-shadow:0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] px-6 py-4">
          <div>
            <h2 id="terms-title" className="m-0 text-[20px] font-bold leading-[1.3] text-[#0f172a]">Terms and Conditions</h2>
            <p className="mt-[2px] mb-0 text-[14px] text-[#64748b]">AIAEE 2027, AME Entrance Exam registration</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-[#64748b] [background:none] [border:none] cursor-pointer [&:hover]:bg-[#f1f5f9] [&:hover]:text-[#0f172a]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <ol className="m-0 list-none space-y-4 p-0 text-[14px] leading-[1.65]">
            {TERMS.map((item, index) => (
              <li key={item.title}>
                <p className="m-0 font-bold text-[#0f172a]">{index + 1}. {item.title}</p>
                <p className="mt-1 mb-0 text-[#475569]">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#e2e8f0] px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-[8px] border border-[#cbd5e1] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#334155] cursor-pointer [&:hover]:bg-[#f8fafc]">
            Close
          </button>
          {onAccept && (
            <button type="button" onClick={onAccept} className="rounded-[8px] border-0 bg-[#2F5C95] px-4 py-2.5 text-[14px] font-semibold text-white cursor-pointer [&:hover]:bg-[#244a7a]">
              I agree
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
