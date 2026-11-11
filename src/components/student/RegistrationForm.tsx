'use client';

import Link from 'next/link';
import { digitInputProps, digitsOnly } from '@/lib/validation';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { api, ApiError, errorMessage, fileUrl } from '@/lib/student/api';
import { formatRupees } from '@/lib/student/format';
import {
  asked,
  BIRTH_YEARS,
  buildDob,
  calculatedPercentage,
  EDUCATION,
  emptyForm,
  LEVELS,
  MONTHS,
  must,
  isAppearingStudent,
  PASSING_YEAR_OPTIONS,
  payload,
  prefill,
  recordStarted,
  validateStep,
  visibleSteps,
  type CustomField,
  type Files,
  type FormConfig,
  type Level,
  type RegistrationValues,
  type Saved,
  type ScoreRecord,
} from '@/lib/student/registration';
import { useSession } from '@/lib/student/session';
import { EMAIL, HELPLINE_PHONES } from '@/lib/site';
import { ImagePicker, Section, Select, StateDistrictFields, useObjectUrl, wide } from './fields';
import { PaymentLinkShare, RegistrationFeePayment } from './RegistrationFeePayment';
import { Alert, buttonClass, cx, EmptyState, Field, inputClass, linkClass, Loading, Spinner } from './ui';

type Submitted = { acknowledgementUrl: string };

/** What each step asks for, shown in the progress panel and the step header. */
const STEP_INFO: Record<number, { title: string; description: string; icon: string }> = {
  1: { title: 'Personal Details', description: 'Your name, contact details and address.', icon: 'fa-user' },
  2: { title: 'Educational Details', description: 'Your course and Class XII or Diploma results.', icon: 'fa-graduation-cap' },
  3: { title: 'Photo & Signature', description: 'Optional. Upload a recent passport size photo and your signature if you have them.', icon: 'fa-camera' },
  4: { title: 'Review & Submit', description: 'Check your details, then submit the application.', icon: 'fa-clipboard-check' },
};


function ExtraFields({
  fields,
  form,
  files,
  saved,
  onValue,
  onFile,
}: {
  fields: CustomField[];
  form: RegistrationValues;
  files: Files;
  saved: Saved;
  onValue: (id: string, value: string) => void;
  onFile: (id: string, file: File | null) => void;
}) {
  if (!fields.length) return null;
  return (
    <Section title="Additional Information" description="A few more questions from the admissions office." icon="fa-list-check">
      {fields.map((f) => {
        const id = `extra-${f.id}`;
        const value = form.extra[f.id] ?? '';
        const set = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onValue(f.id, e.target.value);
        return (
          <Field
            key={f.id}
            label={f.label}
            htmlFor={id}
            required={f.required}
            className={f.type === 'textarea' ? wide : undefined}
            hint={
              f.type === 'file' ? (
                <>
                  PDF, JPG, PNG or WEBP, up to 5 MB.{' '}
                  {saved.extra[f.id] && !files.extra[f.id] && (
                    <a href={saved.extra[f.id]} target="_blank" rel="noreferrer" className={linkClass}>
                      View uploaded file
                    </a>
                  )}
                </>
              ) : undefined
            }
          >
            {f.type === 'textarea' ? (
              <textarea id={id} rows={3} className={inputClass} value={value} onChange={set} />
            ) : f.type === 'yesno' || f.type === 'select' ? (
              <Select id={id} value={value} onChange={set} placeholder="Select">
                {(f.type === 'yesno' ? ['Yes', 'No'] : f.options).map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            ) : f.type === 'file' ? (
              <input
                id={id}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className={`${inputClass} py-[8px] file:mr-[12px] file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-[#eef1f5] file:px-[12px] file:py-[6px] file:text-[14px] file:font-semibold file:text-heading`}
                onChange={(e) => onFile(f.id, e.target.files?.[0] ?? null)}
              />
            ) : (
              <input id={id} type={f.type === 'number' ? 'number' : 'text'} className={inputClass} value={value} onChange={set} />
            )}
          </Field>
        );
      })}
    </Section>
  );
}

function EducationBlock({ level, record, onChange }: { level: Level; record: ScoreRecord; onChange: (key: keyof ScoreRecord, value: string) => void }) {
  const spec = EDUCATION[level];
  const started = recordStarted(record);
  const appearing = isAppearingStudent(record.passingYear);
  const id = (k: string) => `${level}-${k}`;
  const bind = (key: keyof ScoreRecord) => ({
    id: id(key),
    value: record[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(key, e.target.value),
  });
  return (
    <div className={cx(wide, 'rounded-[12px] border bg-white', started ? 'border-[#d9cf9a]' : 'border-[#e5e9f0]')}>
      <div className={cx('flex items-center justify-between gap-[10px] rounded-t-[12px] border-b px-[18px] py-[12px]', started ? 'border-[#efe6bd] bg-[#fdfaee]' : 'border-[#eef1f5] bg-[#f8fafc]')}>
        <p className="m-0 text-[15px] font-semibold text-heading">{spec.title}</p>
        <span className={cx('rounded-full px-[10px] py-[2px] text-[13px] font-semibold', started ? 'bg-[#fff3c4] text-[#7a5c00]' : 'bg-[#eef1f5] text-[#475569]')}>
          {started ? 'Filled in' : 'Optional if you fill the other'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[16px] p-[18px] max-md:grid-cols-1 max-sm:p-[14px] 2xl:grid-cols-3">
        <Field label={spec.board} htmlFor={id('board')} required={started}>
          <input className={inputClass} placeholder={spec.boardPlaceholder} {...bind('board')} />
        </Field>
        <Field
          label="Passing year / status"
          htmlFor={id('passingYear')}
          required={started}
          hint={appearing ? 'Select Appearing if you have not received your board results yet.' : undefined}
        >
          <Select {...bind('passingYear')} placeholder="Select year or Appearing">
            {PASSING_YEAR_OPTIONS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Select>
        </Field>
        <Field label={spec.school} htmlFor={id('school')} required={started}>
          <input className={inputClass} placeholder={spec.schoolPlaceholder} {...bind('school')} />
        </Field>
        <Field label={spec.stream} htmlFor={id('stream')} required={started}>
          <input className={inputClass} placeholder={spec.streamPlaceholder} {...bind('stream')} />
        </Field>
        {!appearing && (
          <>
            <Field label="Result Type" htmlFor={id('scoreType')} hint="Optional">
              <div className="grid grid-cols-2 gap-[8px]" role="radiogroup" aria-label={`${spec.title} result type`}>
                {(['percentage', 'cgpa'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={record.scoreType === t}
                    onClick={() => onChange('scoreType', t)}
                    className={cx(
                      'rounded-[8px] border px-[12px] py-[11px] text-[14px] font-semibold transition-colors',
                      record.scoreType === t ? 'border-heading bg-heading text-white' : 'border-[#d5dbe3] bg-white text-[#475569] hover:border-heading',
                    )}
                  >
                    {t === 'cgpa' ? 'CGPA' : 'Percentage'}
                  </button>
                ))}
              </div>
            </Field>
            {record.scoreType === 'cgpa' ? (
              <Field label="CGPA" htmlFor={id('cgpa')} hint="Optional, out of 10">
                <input type="number" min={0} max={10} step={0.01} className={inputClass} placeholder="e.g. 8.6" {...bind('cgpa')} />
              </Field>
            ) : (
              <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-[10px]">
                <Field label="Marks" htmlFor={id('marksObtained')}>
                  <input type="number" min={0} className={inputClass} {...bind('marksObtained')} />
                </Field>
                <Field label="Out of" htmlFor={id('maximumMarks')}>
                  <input type="number" min={1} className={inputClass} {...bind('maximumMarks')} />
                </Field>
                <Field label="%" htmlFor={id('percentage')}>
                  <input readOnly tabIndex={-1} className={`${inputClass} bg-[#f3f5f8] font-semibold text-heading`} {...bind('percentage')} />
                </Field>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Label / value list on the review step. */
function ReviewGroup({ title, icon, onEdit, items, children }: { title: string; icon: string; onEdit?: () => void; items?: [string, string][]; children?: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#e5e9f0]">
      <div className="flex items-center justify-between gap-[10px] border-b border-[#eef1f5] bg-[#f8fafc] px-[18px] py-[11px]">
        <p className="m-0 flex items-center gap-[8px] text-[14px] font-semibold text-heading">
          <i className={`fa-solid ${icon} text-[14px] text-primary`} aria-hidden="true"></i>
          {title}
        </p>
        {onEdit && (
          <button type="button" onClick={onEdit} className="flex items-center gap-[6px] bg-transparent p-0 text-[14px] font-semibold text-heading hover:text-secondary">
            <i className="fa-solid fa-pen text-[12.5px]" aria-hidden="true"></i> Edit
          </button>
        )}
      </div>
      {items && (
        <dl className="m-0 grid grid-cols-2 gap-x-[20px] gap-y-[14px] p-[18px] max-sm:grid-cols-1 max-sm:p-[14px] 2xl:grid-cols-3">
          {items.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[13px] font-medium text-[#475569]">{label}</dt>
              <dd className="m-0 break-words text-[14.5px] font-medium text-[#1f2937]">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
      {children && <div className="p-[18px]">{children}</div>}
    </div>
  );
}

/* ---------- the form ---------- */

/**
 * The exam registration application, opened with the lead's registration link
 * (/register/<token>). Each step is saved on the server as the student continues; the
 * last step submits the application, after which the registration fee can be paid.
 */
export default function RegistrationForm({ token }: { token: string }) {
  const session = useSession();
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [step, setStep] = useState(1);
  // Furthest step reached: earlier steps can be opened again from the progress panel.
  const [reached, setReached] = useState(1);
  const [form, setForm] = useState<RegistrationValues>(emptyForm);
  const [files, setFiles] = useState<Files>({ photo: null, signature: null, extra: {} });
  const [saved, setSaved] = useState<Saved>({ photo: '', signature: '', extra: {} });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const photoBlob = useObjectUrl(files.photo);
  const signatureBlob = useObjectUrl(files.signature);

  useEffect(() => {
    if (!/^[a-f0-9]{48}$/.test(token)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- invalid links never reach the API
      setLoadState('missing');
      return;
    }
    api<FormConfig>(`/registrations/form/${token}`, { auth: false })
      .then((data) => {
        setConfig({ ...data, customFields: data.customFields ?? [], courses: data.courses ?? [], fields: data.fields ?? [] });
        if (data.submitted) {
          setSubmitted({ acknowledgementUrl: '' });
        } else {
          setForm(prefill({ ...data, customFields: data.customFields ?? [] }));
          const d = data.draft;
          if (d) {
            setSaved({
              photo: fileUrl(d.photoUrl),
              signature: fileUrl(d.signatureUrl),
              extra: Object.fromEntries(Object.entries(d.files || {}).map(([id, url]) => [id, fileUrl(url)])),
            });
            if (d.savedStep && d.resumeStep) {
              setStep(d.resumeStep);
              setReached(d.resumeStep);
            }
          }
        }
        setLoadState('ready');
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setLoadState('missing');
        else {
          setLoadError(errorMessage(err, 'Could not load the form. Please try again in a moment.'));
          setLoadState('error');
        }
      });
  }, [token]);

  const steps = useMemo(() => visibleSteps(config), [config]);

  const scrollTop = () => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (loadState === 'loading') return <Loading label="Loading the form..." />;
  if (loadState === 'missing') {
    return (
      <EmptyState icon="fa-link-slash" title="This registration link is not valid">
        Sign in to your student account to open your registration form, or ask the admissions office for a new link.
      </EmptyState>
    );
  }
  if (loadState === 'error' || !config) return <Alert tone="error">{loadError || 'Could not load the form'}</Alert>;

  if (submitted) {
    const name = `${form.firstName} ${form.lastName}`.trim();
    return (
      <div className={'mx-auto flex max-w-[760px] flex-col gap-[20px]'}>
        <div className="overflow-hidden rounded-[16px] border border-[#e5e9f0] bg-white shadow-[0_10px_30px_rgba(4,31,69,0.06)]">
          <div className="bg-[linear-gradient(135deg,#041f45_0%,#0b336b_100%)] px-[28px] py-[30px] text-center text-white">
            <span className="mx-auto mb-[14px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary text-[28px] text-heading">
              <i className="fa-solid fa-check" aria-hidden="true"></i>
            </span>
            <h2 className="mb-[6px] font-bold text-[28px] text-white">Application submitted</h2>
            <p className="mx-auto m-0 max-w-[520px] text-[15px] text-white/90">
              Pay the registration fee below to complete your application. You can also pay later from your student dashboard.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-[10px] px-[28px] py-[20px]">
            {submitted.acknowledgementUrl && (
              <a href={fileUrl(submitted.acknowledgementUrl)} target="_blank" rel="noreferrer" className={buttonClass.outline}>
                <i className="fa-solid fa-file-pdf" aria-hidden="true"></i> Download acknowledgement (PDF)
              </a>
            )}
            <Link href={session ? '/dashboard/student/profile' : '/login?returnUrl=%2Fdashboard%2Fstudent%2Fprofile'} className={buttonClass.dark}>
              <i className="fa-solid fa-gauge" aria-hidden="true"></i> {session ? 'Go to dashboard' : 'Sign in to your dashboard'}
            </Link>
          </div>
        </div>
        <RegistrationFeePayment token={token} />
        <PaymentLinkShare token={token} studentName={name} />
      </div>
    );
  }

  if (!config.open) {
    return (
      <EmptyState icon={config.phase === 'scheduled' ? 'fa-calendar-days' : 'fa-door-closed'} title={config.message || 'Registration is closed'}>
        {config.phase === 'scheduled' ? 'Opens later. ' : ''}The form accepts new students only while it is live. Come back when registration is open.
      </EmptyState>
    );
  }

  const on = (k: string) => asked(config, k);
  const req = (k: string) => must(config, k);
  const index = Math.max(0, steps.findIndex((s) => s.id === step));
  const reachedIndex = Math.max(index, steps.findIndex((s) => s.id === reached));
  const last = index === steps.length - 1;
  const info = STEP_INFO[step];
  const courseName = config.courses.find((c) => c._id === form.courseId)?.name ?? '';
  const fee = Number(config.registrationFee) || 0;
  const progress = Math.round(((index + 1) / steps.length) * 100);

  // Numeric fields accept digits only while typing, capped at their length
  const DIGITS: Partial<Record<keyof RegistrationValues, number>> = { mobile: 10, parentMobile: 10, pin: 6 };
  const set = (key: keyof RegistrationValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const max = DIGITS[key];
    if (max) e.target.value = digitsOnly(e.target.value, max);
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };
  const bind = (key: Exclude<keyof RegistrationValues, 'academics' | 'extra'>) => ({ id: `reg-${key}`, value: form[key], onChange: set(key) });

  const setAcademic = (level: Level, key: keyof ScoreRecord, value: string) => {
    setForm((f) => {
      const r = { ...f.academics[level], [key]: value } as ScoreRecord;
      if (key === 'scoreType' || (key === 'passingYear' && isAppearingStudent(value)))
        Object.assign(r, { marksObtained: '', maximumMarks: '', percentage: '', cgpa: '' });
      if (key === 'marksObtained' || key === 'maximumMarks') r.percentage = calculatedPercentage(r.marksObtained, r.maximumMarks);
      return { ...f, academics: { ...f.academics, [level]: r } };
    });
    setError('');
  };
  const extraValue = (id: string, value: string) => {
    setForm((f) => ({ ...f, extra: { ...f.extra, [id]: value } }));
    setError('');
  };
  const extraFile = (id: string, file: File | null) => {
    setFiles((f) => ({ ...f, extra: { ...f.extra, [id]: file } }));
    setError('');
  };

  const goTo = (id: number) => {
    setError('');
    setStep(id);
    scrollTop();
  };

  const fail = (err: unknown, fallback: string) => {
    if (err instanceof ApiError && err.step && steps.some((s) => s.id === err.step)) setStep(err.step);
    setError(errorMessage(err, fallback));
  };

  const next = async () => {
    const problem = validateStep(step, config, form, files, saved);
    if (problem) return setError(problem);
    setError('');
    setSaving(true);
    try {
      const res = await api<{ photoUrl?: string; signatureUrl?: string }>(`/registrations/form/${token}/step/${step}`, {
        body: payload([step as 1 | 2 | 3], config, form, files),
        auth: false,
      });
      setSaved((s) => ({
        ...s,
        photo: res.photoUrl ? fileUrl(res.photoUrl) : s.photo,
        signature: res.signatureUrl ? fileUrl(res.signatureUrl) : s.signature,
      }));
      const nextId = steps[index + 1]?.id ?? step;
      if (steps.findIndex((s) => s.id === nextId) > steps.findIndex((s) => s.id === reached)) setReached(nextId);
      goTo(nextId);
    } catch (err) {
      fail(err, 'Could not save this section');
    }
    setSaving(false);
  };

  const submit = async () => {
    for (const s of [1, 2, 3] as const) {
      if (s !== 1 && !steps.some((x) => x.id === s)) continue;
      const problem = validateStep(s, config, form, files, saved);
      if (problem) {
        setStep(s);
        return setError(problem);
      }
    }
    if (!agreed) return setError('Confirm the declaration before submitting');
    setError('');
    setSaving(true);
    try {
      const res = await api<{ acknowledgementUrl?: string }>(`/registrations/form/${token}`, {
        body: payload([1, 2, 3], config, form, files),
        auth: false,
      });
      (window.dataLayer ||= []).push({ event: 'registration_form_submit' });
      setSubmitted({ acknowledgementUrl: res.acknowledgementUrl || '' });
      scrollTop();
    } catch (err) {
      fail(err, 'Could not submit the form');
    }
    setSaving(false);
  };

  /* ----- review step data ----- */
  const dob = buildDob(form.dobDay, form.dobMonth, form.dobYear);
  const dobText = dob ? new Date(`${dob}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
  const scoreText = (r: ScoreRecord) =>
    r.scoreType === 'cgpa' ? (r.cgpa ? `${r.cgpa} CGPA` : '') : r.marksObtained ? `${r.marksObtained} / ${r.maximumMarks}${r.percentage ? ` (${r.percentage}%)` : ''}` : '';
  const extrasFilled = config.customFields.filter((f) => (f.type === 'file' ? files.extra[f.id] || saved.extra[f.id] : String(form.extra[f.id] || '').trim()));
  const photoPreview = photoBlob || saved.photo;
  const signaturePreview = signatureBlob || saved.signature;

  const helpline = HELPLINE_PHONES[0];

  return (
    <div ref={top} className="grid w-full scroll-mt-[20px] grid-cols-[300px_minmax(0,1fr)] items-start gap-[28px] max-lg:grid-cols-1 max-lg:gap-[16px] 2xl:grid-cols-[320px_minmax(0,1fr)]">
      {/* Progress panel */}
      <aside className="sticky top-[24px] overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,#041f45_0%,#0b336b_100%)] text-white shadow-[0_10px_30px_rgba(4,31,69,0.18)] max-lg:static">
        <div className="p-[24px] max-lg:p-[20px]">
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[1.5px] text-primary">AIAEE Entrance Exam</p>
          <h2 className="mb-[4px] mt-[4px] font-bold text-[24px] leading-[1.2] text-white">Registration Form</h2>
          <p className="m-0 text-[14px] leading-[1.5] text-white/90">Each step is saved when you continue, so you can finish later.</p>

          <div className="mt-[18px]">
            <div className="mb-[6px] flex justify-between text-[13px] text-white/90">
              <span>
                Step {index + 1} of {steps.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-[6px] overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ol className="mb-0 mt-[20px] flex flex-col gap-[4px] p-0 max-lg:hidden">
            {steps.map((s, i) => {
              const done = i < reachedIndex && i !== index;
              const active = i === index;
              const open = i <= reachedIndex && !active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={!open || saving}
                    onClick={() => goTo(s.id)}
                    aria-current={active ? 'step' : undefined}
                    className={cx(
                      'flex w-full items-center gap-[12px] rounded-[10px] border-0 px-[10px] py-[10px] text-left transition-colors',
                      active ? 'bg-white/12' : open ? 'bg-transparent hover:bg-white/8' : 'cursor-default bg-transparent',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold',
                        active ? 'bg-primary text-heading' : done ? 'bg-[#16a34a] text-white' : 'border border-white/30 text-white/85',
                      )}
                    >
                      {done ? <i className="fa-solid fa-check" aria-hidden="true"></i> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={cx('block text-[14px] font-semibold leading-[1.3]', active ? 'text-white' : done ? 'text-white/90' : 'text-white/85')}>
                        {STEP_INFO[s.id].title}
                      </span>
                      <span className={cx('block text-[13px] leading-[1.35]', active ? 'text-white/90' : 'text-white/80')}>{STEP_INFO[s.id].description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="border-t border-white/10 px-[24px] py-[18px] max-lg:hidden">
          <p className="m-0 text-[13px] uppercase tracking-[1px] text-white/85">Registration fee</p>
          <p className="m-0 font-bold text-[24px] text-primary">{fee > 0 ? formatRupees(fee) : 'No fee'}</p>
          <p className="m-0 text-[13px] text-white/85">Paid online through PayU after you submit.</p>
        </div>

        <div className="border-t border-white/10 bg-black/10 px-[24px] py-[18px] text-[14px] max-lg:hidden">
          <p className="mb-[8px] font-semibold text-white">Need help?</p>
          <a href={`tel:${helpline.tel}`} className="mb-[6px] flex items-center gap-[8px] text-[14px] text-white/90 hover:text-primary">
            <i className="fa-solid fa-phone text-primary" aria-hidden="true"></i> {helpline.label}
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-[8px] break-all text-[14px] text-white/90 hover:text-primary">
            <i className="fa-solid fa-envelope text-primary" aria-hidden="true"></i> {EMAIL}
          </a>
        </div>
      </aside>

      {/* Step card */}
      <div className="min-w-0 overflow-hidden rounded-[16px] border border-[#e5e9f0] bg-white shadow-[0_10px_30px_rgba(4,31,69,0.06)]">
        <header className="flex items-start gap-[16px] border-b border-[#eef1f5] px-[28px] py-[24px] max-sm:px-[18px]">
          <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] bg-heading text-[19px] text-primary max-xs:hidden">
            <i className={`fa-solid ${info.icon}`} aria-hidden="true"></i>
          </span>
          <div>
            <p className="m-0 text-[13px] font-semibold uppercase tracking-[1.2px] text-primary">
              Step {index + 1} of {steps.length}
            </p>
            <h2 className="mb-[2px] mt-[2px] font-bold text-[24px] leading-[1.25] text-heading">{info.title}</h2>
            <p className="m-0 text-[14px] text-[#475569]">{info.description}</p>
          </div>
        </header>

        {step === 1 && (
          <>
            <Section title="Basic Information" description="As written in your Class X certificate." icon="fa-id-card">
              <Field label="First Name" htmlFor="reg-firstName" required>
                <input className={inputClass} autoComplete="given-name" autoCapitalize="words" maxLength={100} placeholder="First name" {...bind('firstName')} />
              </Field>
              <Field label="Last Name" htmlFor="reg-lastName" required>
                <input className={inputClass} autoComplete="family-name" autoCapitalize="words" maxLength={100} placeholder="Last name" {...bind('lastName')} />
              </Field>
              {on('gender') && (
                <Field label="Gender" htmlFor="reg-gender" required={req('gender')}>
                  <Select {...bind('gender')} placeholder="Select gender">
                    {config.genders.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
              )}
              {on('dob') && (
                <Field label="Date of Birth" htmlFor="reg-dobDay" required={req('dob')}>
                  <div className="grid grid-cols-[0.8fr_1.4fr_1fr] gap-[8px]">
                    <Select {...bind('dobDay')} placeholder="Day" label="Day of birth">
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={String(i + 1)}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                    <Select value={form.dobMonth} onChange={set('dobMonth')} placeholder="Month" label="Month of birth">
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1)}>
                          {m}
                        </option>
                      ))}
                    </Select>
                    <Select value={form.dobYear} onChange={set('dobYear')} placeholder="Year" label="Year of birth">
                      {BIRTH_YEARS.map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </Select>
                  </div>
                </Field>
              )}
              {on('category') && (
                <Field label="Category" htmlFor="reg-category" required={req('category')}>
                  <Select {...bind('category')} placeholder="Select category">
                    {config.categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </Field>
              )}
              {on('fatherName') && (
                <Field label="Father's Name" htmlFor="reg-fatherName" required={req('fatherName')}>
                  <input className={inputClass} placeholder="Father's full name" {...bind('fatherName')} />
                </Field>
              )}
              {on('motherName') && (
                <Field label="Mother's Name" htmlFor="reg-motherName" required={req('motherName')}>
                  <input className={inputClass} placeholder="Mother's full name" {...bind('motherName')} />
                </Field>
              )}
            </Section>

            <Section title="Contact Details" description="We send exam updates to these numbers and emails." icon="fa-address-book">
              <Field label="Mobile Number" htmlFor="reg-mobile" required>
                <input {...digitInputProps(10)} className={inputClass} autoComplete="tel-national" placeholder="10-digit mobile" {...bind('mobile')} />
              </Field>
              <Field label="Email Address" htmlFor="reg-email" required>
                <input type="email" className={inputClass} autoComplete="email" maxLength={255} placeholder="you@example.com" {...bind('email')} />
              </Field>
              {on('parentMobile') && (
                <Field label="Parent's Mobile" htmlFor="reg-parentMobile" required={req('parentMobile')}>
                  <input {...digitInputProps(10)} className={inputClass} placeholder="10-digit mobile" {...bind('parentMobile')} />
                </Field>
              )}
              {on('parentEmail') && (
                <Field label="Parent's Email" htmlFor="reg-parentEmail" required={req('parentEmail')} hint={req('parentEmail') ? undefined : 'Optional'}>
                  <input type="email" className={inputClass} maxLength={255} placeholder="parent@example.com" {...bind('parentEmail')} />
                </Field>
              )}
            </Section>

            {(on('address') || on('state') || on('city') || on('country') || on('pin')) && (
              <Section title="Address" description="Your permanent address." icon="fa-location-dot">
                {on('address') && (
                  <Field label="Address" htmlFor="reg-address" required={req('address')} className={wide}>
                    <textarea rows={2} className={inputClass} autoComplete="street-address" placeholder="House number, street, locality" {...bind('address')} />
                  </Field>
                )}
                {(on('state') || on('city')) && (
                  <StateDistrictFields
                    idPrefix="reg"
                    state={form.state}
                    district={form.city}
                    onState={(state, city) => {
                      setForm((f) => ({ ...f, state, city }));
                      setError('');
                    }}
                    onDistrict={(city) => {
                      setForm((f) => ({ ...f, city }));
                      setError('');
                    }}
                    required={{ state: req('state'), district: req('city') }}
                  />
                )}
                {on('country') && (
                  <Field label="Country" htmlFor="reg-country" required={req('country')}>
                    <input className={inputClass} autoComplete="country-name" {...bind('country')} />
                  </Field>
                )}
                {on('pin') && (
                  <Field label="PIN Code" htmlFor="reg-pin" required={req('pin')}>
                    <input {...digitInputProps(6)} className={inputClass} autoComplete="postal-code" placeholder="6-digit PIN" {...bind('pin')} />
                  </Field>
                )}
              </Section>
            )}

            <ExtraFields fields={config.customFields.filter((f) => f.step === 1)} form={form} files={files} saved={saved} onValue={extraValue} onFile={extraFile} />
          </>
        )}

        {step === 2 && (
          <>
            {on('course') && config.courses.length > 0 && (
              <Section title="Course" description="The programme you are applying for." icon="fa-plane">
                <Field label="Course" htmlFor="reg-courseId" required={req('course')} className={wide}>
                  <Select {...bind('courseId')} placeholder="Select a course">
                    {config.courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </Section>
            )}
            {on('qualification') && (
              <Section title="Qualifications" description="Fill in your Class XII details, your Diploma details, or both. At least one is required." icon="fa-graduation-cap">
                {LEVELS.map((level) => (
                  <EducationBlock key={level} level={level} record={form.academics[level]} onChange={(k, v) => setAcademic(level, k, v)} />
                ))}
              </Section>
            )}
            <ExtraFields fields={config.customFields.filter((f) => f.step === 2)} form={form} files={files} saved={saved} onValue={extraValue} onFile={extraFile} />
          </>
        )}

        {step === 3 && (
          <Section title="Upload Documents" description="Optional. JPG, PNG or WEBP images, up to 512 KB each. You can skip this step or replace files before submitting." icon="fa-image">
            {on('photo') && (
              <ImagePicker
                label="Passport size photo"
                passport
                required={req('photo')}
                file={files.photo}
                savedUrl={saved.photo}
                onFile={(photo) => {
                  setFiles((f) => ({ ...f, photo }));
                  setError('');
                }}
              />
            )}
            {on('signature') && (
              <ImagePicker
                label="Signature"
                required={req('signature')}
                file={files.signature}
                savedUrl={saved.signature}
                onFile={(signature) => {
                  setFiles((f) => ({ ...f, signature }));
                  setError('');
                }}
              />
            )}
            <div className={cx(wide, 'rounded-[12px] border border-[#e5e9f0] bg-[#f8fafc] p-[16px] text-[14px] text-[#475569]')}>
              <p className="mb-[6px] font-semibold text-heading">Photo guidelines</p>
              <ul className="m-0 grid list-disc grid-cols-2 gap-x-[24px] gap-y-[4px] pl-[18px] text-[14px] max-md:grid-cols-1">
                <li>Passport size (3.5 × 4.5 cm), portrait shape</li>
                <li>Recent colour photo, face clearly visible</li>
                <li>Plain light background, no caps or sunglasses</li>
                <li>Sign in black or blue ink on white paper</li>
                <li>Crop the signature closely before uploading</li>
              </ul>
            </div>
          </Section>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-[16px] px-[28px] py-[26px] max-sm:px-[18px]">
            <ReviewGroup
              title="Personal Details"
              icon="fa-user"
              onEdit={() => goTo(1)}
              items={[
                ['Name', `${form.firstName} ${form.lastName}`.trim()],
                ...(on('gender') ? ([['Gender', form.gender]] as [string, string][]) : []),
                ...(on('dob') ? ([['Date of birth', dobText]] as [string, string][]) : []),
                ...(on('category') ? ([['Category', form.category]] as [string, string][]) : []),
                ...(on('fatherName') ? ([["Father's name", form.fatherName]] as [string, string][]) : []),
                ...(on('motherName') ? ([["Mother's name", form.motherName]] as [string, string][]) : []),
                ['Mobile', form.mobile],
                ['Email', form.email],
                ...(on('parentMobile') ? ([["Parent's mobile", form.parentMobile]] as [string, string][]) : []),
                ...(on('parentEmail') ? ([["Parent's email", form.parentEmail]] as [string, string][]) : []),
                ['Address', [form.address, form.city, form.state, form.pin, form.country].map((v) => v.trim()).filter(Boolean).join(', ')],
              ]}
            />
            {steps.some((s) => s.id === 2) && (
              <ReviewGroup
                title="Educational Details"
                icon="fa-graduation-cap"
                onEdit={() => goTo(2)}
                items={[
                  ...(on('course') && config.courses.length ? ([['Course', courseName || 'Not selected']] as [string, string][]) : []),
                  ...LEVELS.filter((l) => recordStarted(form.academics[l])).map(
                    (l): [string, string] => [
                      EDUCATION[l].title.replace(' Details', ''),
                      [form.academics[l].board, form.academics[l].passingYear, scoreText(form.academics[l])].filter(Boolean).join(' · '),
                    ],
                  ),
                ]}
              />
            )}
            {extrasFilled.length > 0 && (
              <ReviewGroup
                title="Additional Information"
                icon="fa-list-check"
                onEdit={() => goTo(extrasFilled[0].step)}
                items={extrasFilled.map((f): [string, string] => [f.label, f.type === 'file' ? files.extra[f.id]?.name || 'Uploaded' : form.extra[f.id]])}
              />
            )}
            {steps.some((s) => s.id === 3) && (
              <ReviewGroup title="Photo & Signature" icon="fa-camera" onEdit={() => goTo(3)}>
                <div className="flex flex-wrap items-end gap-[20px]">
                  {on('photo') && (
                    <figure className="m-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Passport photo" className="h-[110px] w-[90px] rounded-[6px] border border-[#e5e9f0] object-cover" />
                      ) : (
                        <span className="block h-[110px] w-[90px] rounded-[6px] bg-[#f3f5f8]" />
                      )}
                      <figcaption className="mt-[6px] text-[13px] text-[#475569]">Photo</figcaption>
                    </figure>
                  )}
                  {on('signature') && (
                    <figure className="m-0">
                      {signaturePreview ? (
                        <img src={signaturePreview} alt="Signature" className="h-[60px] w-[180px] rounded-[6px] border border-[#e5e9f0] bg-white object-contain" />
                      ) : (
                        <span className="block h-[60px] w-[180px] rounded-[6px] bg-[#f3f5f8]" />
                      )}
                      <figcaption className="mt-[6px] text-[13px] text-[#475569]">Signature</figcaption>
                    </figure>
                  )}
                </div>
              </ReviewGroup>
            )}

            <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[12px] border border-[#efe6bd] bg-[#fdfaee] px-[20px] py-[16px]">
              <div>
                <p className="m-0 text-[13px] font-semibold uppercase tracking-[1px] text-[#7a5c00]">Registration fee</p>
                <p className="m-0 font-bold text-[26px] text-heading">{fee > 0 ? formatRupees(fee) : 'No fee'}</p>
              </div>
              <p className="m-0 max-w-[420px] text-[14.5px] text-[#475569]">
                {fee > 0
                  ? 'After you submit, pay this fee securely online with PayU (UPI, card or net banking).'
                  : 'No registration fee is set. Submit the application and the institute will confirm it.'}
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-[12px] rounded-[12px] border border-[#e5e9f0] p-[16px] text-[14px] leading-[1.5] text-[#334155]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError('');
                }}
                className="mt-[3px] h-[18px] w-[18px] shrink-0 [accent-color:#041f45]"
              />
              <span>
                I declare that the information given in this application is true and complete. I understand that the application may be rejected if any of it is found to be incorrect.
              </span>
            </label>
          </div>
        )}

        {error && (
          <div className="px-[28px] pb-[20px] max-sm:px-[18px]">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#eef1f5] bg-[#f8fafc] px-[28px] py-[18px] max-sm:flex-col-reverse max-sm:items-stretch max-sm:px-[18px]">
          {index > 0 ? (
            <button type="button" className={buttonClass.outline} onClick={() => goTo(steps[index - 1].id)} disabled={saving}>
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back
            </button>
          ) : (
            <span className="flex items-center gap-[8px] text-[14px] text-[#475569]">
              <i className="fa-solid fa-shield-halved text-primary" aria-hidden="true"></i> Your details are saved securely
            </span>
          )}
          {last ? (
            <button type="button" className={buttonClass.primary} onClick={submit} disabled={saving}>
              {saving ? <Spinner /> : <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>} {saving ? 'Submitting...' : 'Submit Application'}
            </button>
          ) : (
            <button type="button" className={buttonClass.primary} onClick={next} disabled={saving}>
              {saving ? 'Saving...' : 'Save & Continue'} {saving ? <Spinner /> : <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
