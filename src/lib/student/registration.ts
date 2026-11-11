// The exam registration application (/register/<token>): the form configuration the API
// sends, client-side validation (same rules and messages as the CRM's form) and the
// multipart payloads for each step and the final submit.
import { EMAIL_RE, MOBILE_RE, isName, PIN_RE } from '@/lib/validation';

export type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'yesno' | 'select' | 'file';
  options: string[];
  required: boolean;
  step: 1 | 2;
};

/** GET /registrations/form/<token> */
export type FormConfig = {
  open: boolean;
  phase: 'disabled' | 'scheduled' | 'closed' | 'live';
  message: string;
  registrationFee: number; // rupees
  fields: { key: string; label: string; enabled: boolean; required: boolean }[];
  customFields: CustomField[];
  categories: string[];
  genders: string[];
  courses: { _id: string; name: string }[];
  submitted?: boolean;
  lead?: { firstName: string; lastName: string; email: string; mobile: string; courseId: string };
  draft?: Draft | null;
};

export type ScoreRecord = {
  board: string;
  passingYear: string;
  school: string;
  stream: string;
  scoreType: 'percentage' | 'cgpa';
  marksObtained: string;
  maximumMarks: string;
  percentage: string;
  cgpa: string;
};

type Draft = {
  savedStep: number;
  resumeStep: number;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  category: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  parentMobile: string;
  email: string;
  parentEmail: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  courseId: string;
  academics: Record<string, Partial<Record<keyof ScoreRecord, string | number>>>;
  photoUrl: string;
  signatureUrl: string;
  extra: Record<string, string>;
  files: Record<string, string>;
};

export const EDUCATION = {
  classXII: {
    title: 'Class XII Details',
    board: 'Board',
    boardPlaceholder: 'Board name',
    school: 'School',
    schoolPlaceholder: 'School name and address',
    stream: 'Stream',
    streamPlaceholder: 'Science, Commerce or Arts',
  },
  diploma: {
    title: 'Diploma Details',
    board: 'Institute',
    boardPlaceholder: 'Institute name',
    school: 'Institute Address',
    schoolPlaceholder: 'Institute address',
    stream: 'Specialization',
    streamPlaceholder: 'Specialization',
  },
} as const;
export type Level = keyof typeof EDUCATION;
export const LEVELS = Object.keys(EDUCATION) as Level[];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
export const BIRTH_YEARS = Array.from({ length: 57 }, (_, i) => String(currentYear - 15 - i));
export const PASSING_YEARS = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => String(currentYear - i));
export const PASSING_YEAR_APPEARING = 'Appearing';
export const PASSING_YEAR_OPTIONS = [PASSING_YEAR_APPEARING, ...PASSING_YEARS];
export const isAppearingStudent = (passingYear: string) => String(passingYear || '').trim().toLowerCase() === PASSING_YEAR_APPEARING.toLowerCase();

export const blankRecord = (): ScoreRecord => ({
  board: '',
  passingYear: '',
  school: '',
  stream: '',
  scoreType: 'percentage',
  marksObtained: '',
  maximumMarks: '',
  percentage: '',
  cgpa: '',
});

export const emptyForm = () => ({
  firstName: '',
  lastName: '',
  gender: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  category: '',
  fatherName: '',
  motherName: '',
  mobile: '',
  parentMobile: '',
  email: '',
  parentEmail: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pin: '',
  courseId: '',
  academics: { classXII: blankRecord(), diploma: blankRecord() } as Record<Level, ScoreRecord>,
  extra: {} as Record<string, string>,
});
export type RegistrationValues = ReturnType<typeof emptyForm>;
type TextKey = Exclude<keyof RegistrationValues, 'academics' | 'extra'>;

export const calculatedPercentage = (obtained: string, maximum: string) => {
  if (obtained === '' || maximum === '') return '';
  const got = Number(obtained);
  const max = Number(maximum);
  if (!Number.isFinite(got) || !Number.isFinite(max) || got < 0 || max <= 0 || got > max) return '';
  return String(Math.round((got / max) * 10000) / 100);
};

export const recordStarted = (r: ScoreRecord) =>
  (['board', 'passingYear', 'school', 'stream', 'marksObtained', 'maximumMarks', 'cgpa'] as const).some((k) => String(r[k] ?? '').trim() !== '');

/** 'YYYY-MM-DD' if the three parts make a real date, else ''. */
export const buildDob = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return '';
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const valid = date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
  return valid ? date.toISOString().slice(0, 10) : '';
};

/** Is a built-in field on the form / required (admins configure both). */
export const asked = (config: FormConfig | null, key: string) => config?.fields?.find((f) => f.key === key)?.enabled ?? true;
export const must = (config: FormConfig | null, key: string) => {
  const field = config?.fields?.find((f) => f.key === key);
  return field ? field.enabled && field.required : key !== 'parentEmail';
};

export type Step = { id: 1 | 2 | 3 | 4; label: string };
export function visibleSteps(config: FormConfig | null): Step[] {
  const education =
    (asked(config, 'course') && (config?.courses ?? []).length > 0) ||
    asked(config, 'qualification') ||
    (config?.customFields ?? []).some((f) => f.step === 2);
  const steps: Step[] = [{ id: 1, label: 'Personal Details' }];
  if (education) steps.push({ id: 2, label: 'Educational Details' });
  if (asked(config, 'photo') || asked(config, 'signature')) steps.push({ id: 3, label: 'Photo & Signature' });
  steps.push({ id: 4, label: 'Review & Submit' });
  return steps;
}

/** Form values from the token's lead and saved draft. */
export function prefill(config: FormConfig): RegistrationValues {
  const form = emptyForm();
  const lead = config.lead;
  if (lead) Object.assign(form, { firstName: lead.firstName || '', lastName: lead.lastName || '', email: lead.email || '', mobile: lead.mobile || '', courseId: lead.courseId || '' });
  const d = config.draft;
  if (!d?.savedStep) return form;
  if (d.savedStep >= 1) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d.dob || ''));
    const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));
    Object.assign(form, {
      firstName: s(d.firstName), lastName: s(d.lastName), gender: s(d.gender), category: s(d.category),
      fatherName: s(d.fatherName), motherName: s(d.motherName), mobile: s(d.mobile), parentMobile: s(d.parentMobile),
      email: s(d.email), parentEmail: s(d.parentEmail), address: s(d.address), city: s(d.city), state: s(d.state),
      country: d.country || 'India', pin: s(d.pin),
      dobYear: m ? m[1] : '', dobMonth: m ? String(Number(m[2])) : '', dobDay: m ? String(Number(m[3])) : '',
      extra: { ...(d.extra || {}) },
    });
  }
  if (d.savedStep >= 2) {
    form.courseId = d.courseId || '';
    for (const level of LEVELS) {
      const r = d.academics?.[level];
      if (!r) continue;
      // Score fields are kept only when the score type was saved.
      const v = (x: unknown) => (x === null || x === undefined ? '' : String(x));
      const year = v(r.passingYear);
      if (isAppearingStudent(year)) {
        form.academics[level] = {
          board: v(r.board),
          passingYear: PASSING_YEAR_APPEARING,
          school: v(r.school),
          stream: v(r.stream),
          scoreType: 'percentage',
          marksObtained: '',
          maximumMarks: '',
          percentage: '',
          cgpa: '',
        };
        continue;
      }
      const saved = r.scoreType === 'cgpa' || r.scoreType === 'percentage';
      const cgpa = r.scoreType === 'cgpa';
      form.academics[level] = {
        board: v(r.board), passingYear: year, school: v(r.school), stream: v(r.stream),
        scoreType: saved && cgpa ? 'cgpa' : 'percentage',
        marksObtained: saved && !cgpa ? v(r.marksObtained) : '',
        maximumMarks: saved && !cgpa ? v(r.maximumMarks) : '',
        percentage: saved && !cgpa ? v(r.percentage) : '',
        cgpa: saved && cgpa ? v(r.cgpa) : '',
      };
    }
  }
  return form;
}

export type Files = { photo: File | null; signature: File | null; extra: Record<string, File | null> };
export type Saved = { photo: string; signature: string; extra: Record<string, string> };

// Same rules as the rest of the site (src/lib/validation.ts) and the CRM API.
const EMAIL = EMAIL_RE;
const TEN_DIGITS = MOBILE_RE;
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function checkExtras(config: FormConfig, step: 1 | 2, form: RegistrationValues, files: Files, saved: Saved) {
  for (const field of config.customFields.filter((f) => f.step === step)) {
    if (field.type === 'file') {
      const file = files.extra[field.id];
      if (field.required && !file && !saved.extra[field.id]) return `Upload ${field.label}`;
      if (file && !DOC_TYPES.includes(file.type)) return `${field.label} must be a PDF, JPG, PNG, or WEBP file`;
      if (file && file.size > 5 * 1024 * 1024) return `${field.label} must be 5 MB or smaller`;
      continue;
    }
    const value = String(form.extra[field.id] || '').trim();
    if (field.required && !value) return `${field.label} is required`;
    if (!value) continue;
    if (field.type === 'number' && !Number.isFinite(Number(value))) return `${field.label} must be a number`;
    if (field.type === 'select' && !field.options.includes(value)) return `Select ${field.label}`;
    if (field.type === 'yesno' && value !== 'Yes' && value !== 'No') return `Select ${field.label}`;
  }
  return '';
}

/** The first problem with a step, or ''. */
export function validateStep(step: number, config: FormConfig, form: RegistrationValues, files: Files, saved: Saved): string {
  const on = (k: string) => asked(config, k);
  const req = (k: string) => must(config, k);
  const missing = (k: TextKey) => on(k) && req(k) && !String(form[k] || '').trim();

  if (step === 1) {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Enter the first and last name';
    if (!isName(form.firstName) || !isName(form.lastName)) return 'Names may only contain letters, spaces, dots, apostrophes and hyphens';
    if (on('gender') && req('gender') && !form.gender) return 'Select a gender';
    if (on('dob')) {
      const dob = buildDob(form.dobDay, form.dobMonth, form.dobYear);
      const started = form.dobDay || form.dobMonth || form.dobYear;
      if ((req('dob') || started) && !dob) return 'Select a valid date of birth';
    }
    if (on('category') && req('category') && !form.category) return 'Select a category';
    if (missing('fatherName')) return "Father's name is required";
    if (missing('motherName')) return "Mother's name is required";
    if (form.fatherName.trim() && !isName(form.fatherName)) return "Father's name may only contain letters and spaces";
    if (form.motherName.trim() && !isName(form.motherName)) return "Mother's name may only contain letters and spaces";
    if (!TEN_DIGITS.test(form.mobile.trim())) return 'Mobile must be a valid 10-digit number starting with 6, 7, 8 or 9';
    if (on('parentMobile') && (req('parentMobile') || form.parentMobile.trim()) && !TEN_DIGITS.test(form.parentMobile.trim()))
      return "Parent's mobile must be a valid 10-digit number";
    if (form.parentMobile.trim() && form.parentMobile.trim() === form.mobile.trim()) return "Parent's mobile must be different from the student's mobile";
    if (!EMAIL.test(form.email.trim())) return 'Enter a valid student email (e.g. name@example.com)';
    if (on('parentEmail') && (req('parentEmail') || form.parentEmail.trim()) && !EMAIL.test(form.parentEmail.trim()))
      return 'Enter a valid parent email (e.g. name@example.com)';
    if (form.parentEmail.trim() && form.parentEmail.trim().toLowerCase() === form.email.trim().toLowerCase()) return "Parent's email must be different from the student's email";
    if (missing('address') || missing('city') || missing('state') || missing('country')) return 'Enter the address, district, state and country';
    if (on('pin') && (req('pin') || form.pin.trim()) && !PIN_RE.test(form.pin.trim())) return 'PIN code must be a valid 6-digit number';
    return checkExtras(config, 1, form, files, saved);
  }

  if (step === 2) {
    if (on('course') && config.courses.length > 0 && req('course') && !form.courseId) return 'Select a course';
    if (on('qualification')) {
      const started = LEVELS.filter((l) => recordStarted(form.academics[l]));
      if (!started.length) return 'Enter the Class XII details or the Diploma details (at least one)';
      for (const level of started) {
        const title = EDUCATION[level].title;
        const r = form.academics[level];
        if (!r.board.trim() || !r.passingYear || !r.school.trim() || !r.stream.trim())
          return `Complete the ${title.toLowerCase()} or leave the whole block empty`;
        if (isAppearingStudent(r.passingYear)) continue;
        if (r.scoreType === 'cgpa') {
          if (r.cgpa !== '') {
            const cgpa = Number(r.cgpa);
            if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) return `${title} CGPA must be between 0 and 10`;
          }
        } else if (r.marksObtained !== '' || r.maximumMarks !== '') {
          if (r.marksObtained === '' || r.maximumMarks === '') return `Enter the ${title} marks obtained and maximum marks`;
          const got = Number(r.marksObtained);
          const max = Number(r.maximumMarks);
          if (!Number.isFinite(got) || !Number.isFinite(max) || got < 0 || max <= 0) return `Enter valid ${title} marks`;
          if (got > max) return `${title} marks obtained cannot be more than the maximum marks`;
        }
      }
    }
    return checkExtras(config, 2, form, files, saved);
  }

  if (step === 3) {
    const image = (file: File | null, label: string, needed: boolean, savedUrl: string) => {
      if (needed && !file && !savedUrl) return `Upload a ${label.toLowerCase()} to continue`;
      if (file && !IMAGE_TYPES.includes(file.type)) return `${label} must be a JPG, PNG, or WEBP image`;
      if (file && file.size > 512 * 1024) return `${label} must be 512 KB or smaller`;
      return '';
    };
    if (on('photo')) {
      const p = image(files.photo, 'Passport size photo', req('photo'), saved.photo);
      if (p) return p;
    }
    if (on('signature')) {
      const p = image(files.signature, 'Signature', req('signature'), saved.signature);
      if (p) return p;
    }
  }
  return '';
}

/** Multipart body for one step (1-3), or for the final submit (all steps). */
export function payload(steps: (1 | 2 | 3)[], config: FormConfig, form: RegistrationValues, files: Files) {
  const on = (k: string) => asked(config, k);
  const body = new FormData();
  const text = (key: string, value: string, enabled = true) => enabled && body.append(key, value.trim());
  const extras = (fields: CustomField[]) => {
    body.append('extraAnswers', JSON.stringify(fields.filter((f) => f.type !== 'file').map((f) => ({ id: f.id, value: String(form.extra[f.id] || '').trim() }))));
    for (const f of fields) {
      const file = files.extra[f.id];
      if (f.type === 'file' && file) body.append(`extraFile_${f.id}`, file);
    }
  };

  if (steps.includes(1)) {
    const dob = buildDob(form.dobDay, form.dobMonth, form.dobYear);
    text('firstName', form.firstName);
    text('lastName', form.lastName);
    text('gender', form.gender, on('gender'));
    text('dob', dob, on('dob') && Boolean(dob));
    text('category', form.category, on('category'));
    text('fatherName', form.fatherName, on('fatherName'));
    text('motherName', form.motherName, on('motherName'));
    text('mobile', form.mobile);
    text('parentMobile', form.parentMobile, on('parentMobile'));
    text('email', form.email);
    text('parentEmail', form.parentEmail, on('parentEmail'));
    text('address', form.address, on('address'));
    text('city', form.city, on('city'));
    text('state', form.state, on('state'));
    text('country', form.country, on('country'));
    text('pin', form.pin, on('pin'));
  }
  if (steps.includes(2)) {
    text('courseId', form.courseId, on('course'));
    if (on('qualification')) {
      // Only the blocks the student started; the API validates each one.
      const started = Object.fromEntries(LEVELS.filter((l) => recordStarted(form.academics[l])).map((l) => [l, form.academics[l]]));
      body.append('academics', JSON.stringify(started));
    }
  }
  // Custom questions: per step when saving a step, all at once on the final submit.
  const fields = config.customFields.filter((f) => steps.includes(f.step));
  if (steps.length > 1) extras(config.customFields);
  else if (steps[0] !== 3) extras(fields);
  if (steps.includes(3)) {
    if (on('photo') && files.photo) body.append('photo', files.photo);
    if (on('signature') && files.signature) body.append('signature', files.signature);
  }
  return body;
}
