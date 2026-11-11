'use client';

import { ATTEND_OPTIONS } from '@/lib/site';
import { enquirySchema, shortEnquirySchema } from '@/lib/forms';
import { useForm } from './useForm';
import { submitEnquiry } from '@/lib/api';

/** Light red that stays readable on the dark blue and footer backgrounds. */
export const fieldErrorClass = 'mt-[6px] block text-[13px] font-semibold leading-[1.4] text-red-300';

export const FieldError = ({ message, className = fieldErrorClass }: { message?: string; className?: string }) =>
  message ? (
    <span className={className} role="alert">
      {message}
    </span>
  ) : null;

/** Visually hidden trap field; people never see or fill it. */
export const Honeypot = () => (
  <div className="absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden" aria-hidden="true">
    <label>
      Website
      <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
);

/**
 * "Tell Us About Yourself" enquiry form. `short` is the home page version (no
 * message field); the full version is used on /contact-us and /request-information.
 */
export default function EnquiryForm({ variant }: { variant: 'short' | 'full' }) {
  const full = variant === 'full';
  const { errors, message, submitting, field, onSubmit } = useForm({
    schema: full ? enquirySchema : shortEnquirySchema,
    submit: submitEnquiry,
    event: 'enquiry_form_submit',
  });

  const disclaimer = (
    <p className="mt-[20px] mb-0 text-[14px] text-[#ffffff]">
      By submitting this form, you agree to be contacted by IIAE Delhi, Mumbai &amp; Bangalore by email, phone or text
      message.View our{' '}
      <a className="text-primary text-[14px]" href="/terms-conditions" target="_blank">
        Terms of Service <i className="fa-solid fa-arrow-up-right-from-square"></i>
      </a>{' '}
      and{' '}
      <a className="text-primary text-[14px]" href="/privacy-policy" target="_blank">
        Privacy Policy <i className="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
      .
    </p>
  );

  return (
    <form  onSubmit={onSubmit}>
      <Honeypot />
      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[15px] shrink-0 mb-[16px] md:grow-0 md:basis-auto">
          <label className="block text-[#ffffff] mb-[3px] text-[14px]" htmlFor={`${variant}-fullname`}>
            Full Name <small> * </small>
          </label>
          <input id={`${variant}-fullname`} type="text" className="text-[15px] leading-[1.5] w-full text-[#212529] [appearance:none] bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] font-normal block h-[45px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[0.375rem_0.75rem] [transition:border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [border-image:none] motion-reduce:[transition:none] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:disabled]:opacity-[1] [&::file-selector-button]:text-[#212529] [&::file-selector-button]:bg-[#f8f9fa] [&::file-selector-button]:pointer-events-none [&::file-selector-button]:[border-inline-end-width:1px] [&::file-selector-button]:[margin-inline-end:0.75rem] [&::file-selector-button]:[border-width:0px] [&::file-selector-button]:[border-style:solid] [&::file-selector-button]:[border-color:inherit] [&::file-selector-button]:rounded-none [&::file-selector-button]:m-[-0.375rem_-0.75rem] [&::file-selector-button]:p-[0.375rem_0.75rem] [&::file-selector-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::file-selector-button]:bg-[#e9ecef] [&:hover:disabled::file-selector-button]:bg-[#f8f9fa] motion-reduce:[&::file-selector-button]:[transition:none] [&::-webkit-date-and-time-value]:min-w-[85px] [&::-webkit-date-and-time-value]:h-[1.5em] [&::-webkit-date-and-time-value]:m-0 [&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:p-0 [&::placeholder]:text-[rgba(33,37,41,0.75)] [&::placeholder]:opacity-[1] [&::placeholder]:text-[14px] [&::-webkit-file-upload-button]:text-[#212529] [&::-webkit-file-upload-button]:bg-[#f8f9fa] [&::-webkit-file-upload-button]:pointer-events-none [&::-webkit-file-upload-button]:[border-inline-end-width:1px] [&::-webkit-file-upload-button]:[margin-inline-end:0.75rem] [&::-webkit-file-upload-button]:[border-width:0px] [&::-webkit-file-upload-button]:[border-style:solid] [&::-webkit-file-upload-button]:[border-color:inherit] [&::-webkit-file-upload-button]:rounded-none [&::-webkit-file-upload-button]:m-[-0.375rem_-0.75rem] [&::-webkit-file-upload-button]:p-[0.375rem_0.75rem] [&::-webkit-file-upload-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::-webkit-file-upload-button]:bg-[#e9ecef] [&:hover:disabled::-webkit-file-upload-button]:bg-[#f8f9fa]" placeholder="Full name" autoComplete="name" autoCapitalize="words" maxLength={100} {...field('fullname')} />
          <FieldError message={errors.fullname} />
        </div>
      </div>
      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
        <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[15px] shrink-0 mb-[16px] max-md:w-full md:grow-0 md:basis-auto">
          <label className="block text-[#ffffff] mb-[3px] text-[14px]" htmlFor={`${variant}-email`}>
            Email<small> * </small>
          </label>
          <input id={`${variant}-email`} type="email" className="text-[15px] leading-[1.5] w-full text-[#212529] [appearance:none] bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] font-normal block h-[45px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[0.375rem_0.75rem] [transition:border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [border-image:none] motion-reduce:[transition:none] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:disabled]:opacity-[1] [&::file-selector-button]:text-[#212529] [&::file-selector-button]:bg-[#f8f9fa] [&::file-selector-button]:pointer-events-none [&::file-selector-button]:[border-inline-end-width:1px] [&::file-selector-button]:[margin-inline-end:0.75rem] [&::file-selector-button]:[border-width:0px] [&::file-selector-button]:[border-style:solid] [&::file-selector-button]:[border-color:inherit] [&::file-selector-button]:rounded-none [&::file-selector-button]:m-[-0.375rem_-0.75rem] [&::file-selector-button]:p-[0.375rem_0.75rem] [&::file-selector-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::file-selector-button]:bg-[#e9ecef] [&:hover:disabled::file-selector-button]:bg-[#f8f9fa] motion-reduce:[&::file-selector-button]:[transition:none] [&::-webkit-date-and-time-value]:min-w-[85px] [&::-webkit-date-and-time-value]:h-[1.5em] [&::-webkit-date-and-time-value]:m-0 [&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:p-0 [&::placeholder]:text-[rgba(33,37,41,0.75)] [&::placeholder]:opacity-[1] [&::placeholder]:text-[14px] [&::-webkit-file-upload-button]:text-[#212529] [&::-webkit-file-upload-button]:bg-[#f8f9fa] [&::-webkit-file-upload-button]:pointer-events-none [&::-webkit-file-upload-button]:[border-inline-end-width:1px] [&::-webkit-file-upload-button]:[margin-inline-end:0.75rem] [&::-webkit-file-upload-button]:[border-width:0px] [&::-webkit-file-upload-button]:[border-style:solid] [&::-webkit-file-upload-button]:[border-color:inherit] [&::-webkit-file-upload-button]:rounded-none [&::-webkit-file-upload-button]:m-[-0.375rem_-0.75rem] [&::-webkit-file-upload-button]:p-[0.375rem_0.75rem] [&::-webkit-file-upload-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::-webkit-file-upload-button]:bg-[#e9ecef] [&:hover:disabled::-webkit-file-upload-button]:bg-[#f8f9fa]" placeholder="Enter email address" autoComplete="email" maxLength={255} {...field('email')} />
          <FieldError message={errors.email} />
        </div>
        <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[15px] shrink-0 mb-[16px] max-md:w-full md:grow-0 md:basis-auto">
          <label className="block text-[#ffffff] mb-[3px] text-[14px]" htmlFor={`${variant}-mobile`}>
            Mobile No.<small> * </small>
          </label>
          <input id={`${variant}-mobile`} className="text-[15px] leading-[1.5] w-full text-[#212529] [appearance:none] bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] font-normal block h-[45px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[0.375rem_0.75rem] [transition:border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [border-image:none] motion-reduce:[transition:none] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:disabled]:opacity-[1] [&::file-selector-button]:text-[#212529] [&::file-selector-button]:bg-[#f8f9fa] [&::file-selector-button]:pointer-events-none [&::file-selector-button]:[border-inline-end-width:1px] [&::file-selector-button]:[margin-inline-end:0.75rem] [&::file-selector-button]:[border-width:0px] [&::file-selector-button]:[border-style:solid] [&::file-selector-button]:[border-color:inherit] [&::file-selector-button]:rounded-none [&::file-selector-button]:m-[-0.375rem_-0.75rem] [&::file-selector-button]:p-[0.375rem_0.75rem] [&::file-selector-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::file-selector-button]:bg-[#e9ecef] [&:hover:disabled::file-selector-button]:bg-[#f8f9fa] motion-reduce:[&::file-selector-button]:[transition:none] [&::-webkit-date-and-time-value]:min-w-[85px] [&::-webkit-date-and-time-value]:h-[1.5em] [&::-webkit-date-and-time-value]:m-0 [&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:p-0 [&::placeholder]:text-[rgba(33,37,41,0.75)] [&::placeholder]:opacity-[1] [&::placeholder]:text-[14px] [&::-webkit-file-upload-button]:text-[#212529] [&::-webkit-file-upload-button]:bg-[#f8f9fa] [&::-webkit-file-upload-button]:pointer-events-none [&::-webkit-file-upload-button]:[border-inline-end-width:1px] [&::-webkit-file-upload-button]:[margin-inline-end:0.75rem] [&::-webkit-file-upload-button]:[border-width:0px] [&::-webkit-file-upload-button]:[border-style:solid] [&::-webkit-file-upload-button]:[border-color:inherit] [&::-webkit-file-upload-button]:rounded-none [&::-webkit-file-upload-button]:m-[-0.375rem_-0.75rem] [&::-webkit-file-upload-button]:p-[0.375rem_0.75rem] [&::-webkit-file-upload-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::-webkit-file-upload-button]:bg-[#e9ecef] [&:hover:disabled::-webkit-file-upload-button]:bg-[#f8f9fa]" placeholder="10-digit mobile number" autoComplete="tel-national" {...field('mobile', { digits: 10 })} />
          <FieldError message={errors.mobile} />
        </div>
      </div>
      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-[15px] shrink-0 mb-[16px] md:grow-0 md:basis-auto">
          <label className="block text-[#ffffff] mb-[3px] text-[14px]" htmlFor={`${variant}-attend`}>
            {full ? 'How would you like to be counseled? *' : 'How would you like to attend? *'}
          </label>
          <select id={`${variant}-attend`} className="text-[15px] leading-[1.5] w-full text-[#212529] [appearance:none] bg-[rgba(255,255,255,0.9)] [background-image:url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23343a40%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%272%27%20d=%27m2%205%206%206%206-6%27/%3e%3c/svg%3e),_none] [background-position-x:right_0.75rem] [background-position-y:center] [background-repeat:no-repeat] [background-size:16px_12px] font-normal block h-[45px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[0.375rem_2.25rem_0.375rem_0.75rem] [transition:border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [border-image:none] motion-reduce:[transition:none] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem]" aria-label="Default select example" {...field('attend_at')}>
            <option value="">Please Select...</option>
            {ATTEND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.attend_at} />
          {full && (
            <div className="mt-[15px] mb-[16px] md:w-full md:[flex:0_0_auto]">
              <label className="block text-[#ffffff] mb-[3px] text-[14px]" htmlFor={`${variant}-message`}>Regarding Admission: Only 10+2 PCM Students Are Eligible.</label>
              <textarea id={`${variant}-message`} className="text-[15px] leading-[1.5] w-full text-[#212529] [appearance:none] bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] font-normal block min-h-[calc(1.5em_+_2px_+_0.75rem)] h-[80px] [border-width:medium] [border-style:none] [border-color:currentcolor] rounded-[10px] p-[0.375rem_0.75rem] [transition:border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [border-image:none] motion-reduce:[transition:none] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] [&:disabled]:opacity-[1] [&::file-selector-button]:text-[#212529] [&::file-selector-button]:bg-[#f8f9fa] [&::file-selector-button]:pointer-events-none [&::file-selector-button]:[border-inline-end-width:1px] [&::file-selector-button]:[margin-inline-end:0.75rem] [&::file-selector-button]:[border-width:0px] [&::file-selector-button]:[border-style:solid] [&::file-selector-button]:[border-color:inherit] [&::file-selector-button]:rounded-none [&::file-selector-button]:m-[-0.375rem_-0.75rem] [&::file-selector-button]:p-[0.375rem_0.75rem] [&::file-selector-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::file-selector-button]:bg-[#e9ecef] [&:hover:disabled::file-selector-button]:bg-[#f8f9fa] motion-reduce:[&::file-selector-button]:[transition:none] [&::-webkit-date-and-time-value]:min-w-[85px] [&::-webkit-date-and-time-value]:h-[1.5em] [&::-webkit-date-and-time-value]:m-0 [&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:p-0 [&::placeholder]:text-[rgba(33,37,41,0.75)] [&::placeholder]:opacity-[1] [&::placeholder]:text-[14px] [&::-webkit-file-upload-button]:text-[#212529] [&::-webkit-file-upload-button]:bg-[#f8f9fa] [&::-webkit-file-upload-button]:pointer-events-none [&::-webkit-file-upload-button]:[border-inline-end-width:1px] [&::-webkit-file-upload-button]:[margin-inline-end:0.75rem] [&::-webkit-file-upload-button]:[border-width:0px] [&::-webkit-file-upload-button]:[border-style:solid] [&::-webkit-file-upload-button]:[border-color:inherit] [&::-webkit-file-upload-button]:rounded-none [&::-webkit-file-upload-button]:m-[-0.375rem_-0.75rem] [&::-webkit-file-upload-button]:p-[0.375rem_0.75rem] [&::-webkit-file-upload-button]:[transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover::-webkit-file-upload-button]:bg-[#e9ecef] [&:hover:disabled::-webkit-file-upload-button]:bg-[#f8f9fa]" {...field('message')}></textarea>
              <FieldError message={errors.message} />
            </div>
          )}
          {disclaimer}
        </div>
      </div>
      <div className="mt-[15px] mb-[16px] md:w-full md:[flex:0_0_auto]">
        <button type="submit" className="font-trip text-[15px] leading-[1.5] font-normal text-[#ffffff] text-center align-middle select-none bg-secondary inline-flex items-center justify-center rounded-[15px] p-[15px_40px] gap-[5px] [transition:0.3s] [text-decoration:none] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem] [&:focus-visible]:[outline:0px] [&:disabled]:pointer-events-none [&:disabled]:opacity-[0.65]" disabled={submitting}>
          {' '}
          SEND ME PROGRAM INFORMATION{' '}
        </button>
        {message && <FieldError message={message} className={`${fieldErrorClass} mt-[12px]`} />}
      </div>
    </form>
  );
}
