// Field rules shared by every form on the site (public enquiry / newsletter / apply forms
// in src/lib/forms.ts, and the student login, registration and profile forms). The CRM API
// applies the same rules (Nodejs/src/utils/validators.js), so keep the two files in step.

/** Practical email check: one @, a domain with a dot and a 2+ letter TLD, no spaces. */
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
/** Indian mobile number: exactly 10 digits, starting 6-9. */
export const MOBILE_RE = /^[6-9]\d{9}$/;
/** Person names: letters (any script), spaces, dots, apostrophes and hyphens. */
export const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
/** Indian PIN code: 6 digits, not starting with 0. */
export const PIN_RE = /^[1-9]\d{5}$/;
export const OTP_RE = /^\d{6}$/;

export const EMAIL_MAX = 255;
export const NAME_MAX = 100;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const isEmail = (value: string) => {
  const v = value.trim();
  return v.length <= EMAIL_MAX && EMAIL_RE.test(v);
};
export const isMobile = (value: string) => MOBILE_RE.test(value.trim());
export const isName = (value: string) => {
  const v = value.trim();
  return v.length >= 2 && v.length <= NAME_MAX && NAME_RE.test(v);
};
export const isPin = (value: string) => PIN_RE.test(value.trim());

/** Keeps only digits while typing, capped at `max` characters (mobile numbers, PIN, OTP). */
export const digitsOnly = (value: string, max: number) => value.replace(/\D/g, '').slice(0, max);

/** Attributes for a numeric text field: numeric keypad on phones, no letters, fixed length. */
export const digitInputProps = (max: number) => ({ type: 'tel' as const, inputMode: 'numeric' as const, maxLength: max, pattern: '[0-9]*' });

/** The first problem with a password, or ''. */
export const passwordProblem = (password: string) => {
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`;
  if (password.length > PASSWORD_MAX) return `Password must be ${PASSWORD_MAX} characters or fewer`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must contain at least one letter and one number';
  return '';
};
