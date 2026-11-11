// Validation for the public forms (validate on blur, on change once a field has an error,
// and before submitting). Messages follow the old site's wording; the rules themselves are in
// src/lib/validation.ts and the CRM API validates again on its side.
import { EMAIL_MAX, isEmail, isMobile, isName, NAME_MAX, PASSWORD_MAX, PASSWORD_MIN, passwordProblem } from './validation';

export type Values = Record<string, string>;
export type Errors = Record<string, string>;
type Rule = (value: string, values: Values, attr: string) => string | null;

// Field names as they read in messages ("The full name field is required.")
const LABELS: Record<string, string> = {
  fullname: 'full name',
  newsemail: 'email',
  attend_at: 'counselling preference',
  parents_email: 'parent email',
  alternate_phone: 'alternative phone',
  first_name: 'first name',
  last_name: 'last name',
  phone: 'phone number',
  mobile: 'mobile number',
  password_confirmation: 're-enter password',
};
const label = (attr: string) => LABELS[attr] ?? attr.replace(/_/g, ' ');

const required: Rule = (v, _, a) => (v.trim() ? null : `The ${label(a)} field is required.`);
const max =
  (n: number): Rule =>
  (v, _, a) =>
    v.length > n ? `The ${label(a)} field must not be greater than ${n} characters.` : null;
const min =
  (n: number): Rule =>
  (v, _, a) =>
    v && v.length < n ? `The ${label(a)} field must be at least ${n} characters.` : null;
const email: Rule = (v, _, a) =>
  !v || isEmail(v) ? null : `The ${label(a)} field must be a valid email address (e.g. name@example.com).`;
/** Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9. */
const mobile: Rule = (v, _, a) => (!v || isMobile(v) ? null : `The ${label(a)} field must be a valid 10-digit mobile number.`);
/** A person's name: letters, spaces, dots, apostrophes and hyphens only. */
const personName: Rule = (v, _, a) =>
  !v || isName(v) ? null : `The ${label(a)} field may only contain letters and spaces (2 to ${NAME_MAX} characters).`;
const password: Rule = (v) => {
  const problem = passwordProblem(v);
  return problem ? `${problem}.` : null;
};
const oneOf =
  (options: string[]): Rule =>
  (v, _, a) =>
    !v || options.includes(v) ? null : `The selected ${label(a)} is invalid.`;
const optional =
  (...rules: Rule[]): Rule =>
  (v, values, a) => {
    if (!v.trim()) return null;
    for (const r of rules) {
      const e = r(v, values, a);
      if (e) return e;
    }
    return null;
  };

const differentFrom =
  (other: string, message: string): Rule =>
  (v, values) =>
    v.trim() && v.trim().toLowerCase() === (values[other] ?? '').trim().toLowerCase() ? message : null;

export type Schema = Record<string, Rule[]>;

const ATTEND = ['on_campus', 'online_course'];

/** Home page enquiry (Home::saveContact). */
export const shortEnquirySchema: Schema = {
  fullname: [required, personName],
  email: [required, max(EMAIL_MAX), email],
  mobile: [required, mobile],
  attend_at: [required, max(255), oneOf(ATTEND)],
};

/** Contact Us / Request Information (ContactUs::saveContact). */
export const enquirySchema: Schema = { ...shortEnquirySchema, message: [required, min(10), max(5000)] };

/** Footer newsletter (Footer::saveNewsletter), with its custom messages. */
export const newsletterSchema: Schema = {
  newsemail: [
    (v) => (v.trim() ? null : 'Please enter an email address.'),
    (v) => (v.length > EMAIL_MAX ? `Email address cannot be longer than ${EMAIL_MAX} characters.` : null),
    (v) => (!v || isEmail(v) ? null : 'Please enter a valid email address (e.g. name@example.com).'),
  ],
};

/** Apply online. Email uniqueness is checked by the CRM API. */
export const applySchema: Schema = {
  first_name: [required, personName],
  last_name: [optional(personName)],
  email: [required, max(EMAIL_MAX), email],
  parents_email: [optional(max(EMAIL_MAX), email), differentFrom('email', 'The parent email must be different from the student email.')],
  password: [required, password],
  password_confirmation: [
    (v) => (v ? null : 'Please re-enter the password.'),
    (v, values) => (v === (values.password ?? '') ? null : 'The passwords do not match.'),
  ],
  phone: [required, mobile],
  alternate_phone: [optional(mobile), differentFrom('phone', 'The alternative phone must be different from the phone number.')],
};

export { PASSWORD_MIN, PASSWORD_MAX };

export function validateField(schema: Schema, field: string, values: Values): string | null {
  for (const rule of schema[field] ?? []) {
    const error = rule(values[field] ?? '', values, field);
    if (error) return error;
  }
  return null;
}

export function validate(schema: Schema, values: Values): Errors {
  const errors: Errors = {};
  for (const field of Object.keys(schema)) {
    const error = validateField(schema, field, values);
    if (error) errors[field] = error;
  }
  return errors;
}

export type FormResponse = { ok: true; redirect?: string } | { ok: false; errors?: Errors; message?: string };
