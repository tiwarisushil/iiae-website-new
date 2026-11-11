'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { digitInputProps, digitsOnly, isEmail, isMobile, isName, isPin } from '@/lib/validation';
import { api, errorMessage, fileUrl } from '@/lib/student/api';
import { updateUser } from '@/lib/student/session';
import type { AcademicRecord, StudentDashboard } from '@/lib/student/types';
import { ImagePicker, imageProblem, Section, Select, StateDistrictFields, wide } from './fields';
import { Alert, buttonClass, Field, inputClass, PageHeading, Spinner } from './ui';
import { toast } from './toast';

const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

const dateInput = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const str = (v: unknown) => (v === null || v === undefined || v === 0 ? '' : String(v));
const recordFrom = (r: AcademicRecord = {}) => ({
  board: str(r.board),
  passingYear: str(r.passingYear),
  school: str(r.school),
  stream: str(r.stream),
  scoreType: r.scoreType === 'cgpa' ? 'cgpa' : 'percentage',
  marksObtained: str(r.marksObtained),
  maximumMarks: str(r.maximumMarks),
  percentage: str(r.percentage),
  cgpa: str(r.cgpa),
});

/**
 * Edit profile (PUT /api/registrations/me, multipart). Before the registration form is
 * submitted only the account details can be edited.
 */
export default function ProfileEditForm({
  registration: reg,
  pending,
  onCancel,
  onSaved,
}: {
  registration: StudentDashboard['registration'];
  pending: boolean;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState(() => ({
    name: reg.name || '',
    email: reg.email || '',
    phone: reg.phone || '',
    alternatePhone: reg.alternatePhone || '',
    parentEmail: reg.parentEmail || '',
    parentMobile: reg.parentMobile || '',
    gender: reg.gender || '',
    dob: dateInput(reg.dob),
    category: reg.category || '',
    fatherName: reg.fatherName || '',
    motherName: reg.motherName || '',
    address: reg.address || '',
    city: reg.city || '',
    state: reg.state || '',
    country: reg.country || '',
    pin: reg.pin || '',
  }));
  const [twelfth, setTwelfth] = useState(() => recordFrom(reg.academics?.classXII));
  const [photo, setPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  type Key = keyof typeof form;
  // Numeric fields accept digits only while typing, capped at their length
  const DIGITS: Partial<Record<Key, number>> = { phone: 10, alternatePhone: 10, parentMobile: 10, pin: 6 };
  const bind = (key: Key) => ({
    id: `profile-${key}`,
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const max = DIGITS[key];
      const value = max ? digitsOnly(e.target.value, max) : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    },
  });

  /** The first problem with the form, or ''. Same rules as the registration form and the API. */
  const problemWith = () => {
    const f = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])) as typeof form;
    if (!f.name) return 'Enter your name';
    if (!isName(f.name)) return 'Name may only contain letters, spaces, dots, apostrophes and hyphens';
    if (!isEmail(f.email)) return 'Enter a valid email address (e.g. name@example.com)';
    if (!isMobile(f.phone)) return 'Mobile number must be a valid 10-digit number starting with 6, 7, 8 or 9';
    if (f.alternatePhone && !isMobile(f.alternatePhone)) return 'Alternative phone must be a valid 10-digit mobile number';
    if (f.alternatePhone && f.alternatePhone === f.phone) return 'Alternative phone must be different from the mobile number';
    if (f.parentEmail && !isEmail(f.parentEmail)) return "Enter a valid parent's email address";
    if (f.parentEmail && f.parentEmail.toLowerCase() === f.email.toLowerCase()) return "Parent's email must be different from your email";
    if (f.parentMobile && !isMobile(f.parentMobile)) return "Parent's mobile must be a valid 10-digit mobile number";
    if (f.fatherName && !isName(f.fatherName)) return "Father's name may only contain letters and spaces";
    if (f.motherName && !isName(f.motherName)) return "Mother's name may only contain letters and spaces";
    if (f.pin && !isPin(f.pin)) return 'PIN code must be a valid 6-digit number';
    return '';
  };
  const bindRecord = (key: keyof typeof twelfth) => ({
    id: `profile-xii-${key}`,
    value: twelfth[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setTwelfth((r) => ({ ...r, [key]: e.target.value })),
  });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const problem = problemWith() || imageProblem(photo, 'Photo') || imageProblem(signature, 'Signature');
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value.trim()));
      body.append('academics', JSON.stringify({ classXII: twelfth }));
      body.append('qualification', '12th');
      if (photo) body.append('photo', photo);
      if (signature) body.append('signature', signature);
      const saved = await api<{ name: string; email: string; phone: string }>('/registrations/me', { method: 'PUT', body });
      updateUser(saved);
      toast.success('Profile updated');
      await onSaved();
    } catch (err) {
      setError(errorMessage(err, 'Could not update the profile'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save}>
      <PageHeading
        title="Edit profile"
        subtitle="Update the details on your student record."
        actions={
          <button type="button" className={buttonClass.outline} onClick={onCancel} disabled={saving}>
            <i className="fa-solid fa-arrow-left text-[14px]" aria-hidden="true"></i> Back to profile
          </button>
        }
      />
      <div className="overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <Section title="Account" description="Used to sign in and to contact you." icon="fa-user-gear">
          <Field label="Full name" htmlFor="profile-name" required>
            <input className={inputClass} required autoComplete="name" autoCapitalize="words" maxLength={100} {...bind('name')} />
          </Field>
          <Field label="Email address" htmlFor="profile-email" required>
            <input type="email" className={inputClass} required autoComplete="email" maxLength={255} {...bind('email')} />
          </Field>
          <Field label="Mobile number" htmlFor="profile-phone" required>
            <input {...digitInputProps(10)} className={inputClass} required autoComplete="tel" placeholder="10-digit mobile" {...bind('phone')} />
          </Field>
          <Field label="Alternative phone" htmlFor="profile-alternatePhone">
            <input {...digitInputProps(10)} className={inputClass} placeholder="10-digit mobile" {...bind('alternatePhone')} />
          </Field>
          <Field label="Parent's email" htmlFor="profile-parentEmail">
            <input type="email" className={inputClass} maxLength={255} {...bind('parentEmail')} />
          </Field>
        </Section>

        {!pending && (
          <>
            <Section title="Personal Details" description="As written in your Class X certificate." icon="fa-id-card">
              <Field label="Gender" htmlFor="profile-gender">
                <Select {...bind('gender')} placeholder="Select gender">
                  {GENDERS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Date of birth" htmlFor="profile-dob">
                <input type="date" className={inputClass} {...bind('dob')} />
              </Field>
              <Field label="Category" htmlFor="profile-category">
                <Select {...bind('category')} placeholder="Select category">
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Parent's mobile" htmlFor="profile-parentMobile">
                <input {...digitInputProps(10)} className={inputClass} {...bind('parentMobile')} />
              </Field>
              <Field label="Father's name" htmlFor="profile-fatherName">
                <input className={inputClass} {...bind('fatherName')} />
              </Field>
              <Field label="Mother's name" htmlFor="profile-motherName">
                <input className={inputClass} {...bind('motherName')} />
              </Field>
            </Section>

            <Section title="Address" description="Your permanent address." icon="fa-location-dot">
              <Field label="Address" htmlFor="profile-address" className={wide}>
                <textarea rows={2} className={inputClass} {...bind('address')} />
              </Field>
              <StateDistrictFields
                idPrefix="profile"
                state={form.state}
                district={form.city}
                onState={(state, city) => setForm((f) => ({ ...f, state, city }))}
                onDistrict={(city) => setForm((f) => ({ ...f, city }))}
              />
              <Field label="Country" htmlFor="profile-country">
                <input className={inputClass} {...bind('country')} />
              </Field>
              <Field label="PIN code" htmlFor="profile-pin">
                <input {...digitInputProps(6)} className={inputClass} {...bind('pin')} />
              </Field>
            </Section>

            <Section title="Class XII" description="Your Class XII board examination." icon="fa-graduation-cap">
              <Field label="Board" htmlFor="profile-xii-board">
                <input className={inputClass} {...bindRecord('board')} />
              </Field>
              <Field label="Passing year" htmlFor="profile-xii-passingYear">
                <input inputMode="numeric" maxLength={4} className={inputClass} {...bindRecord('passingYear')} />
              </Field>
              <Field label="School" htmlFor="profile-xii-school">
                <input className={inputClass} {...bindRecord('school')} />
              </Field>
              <Field label="Stream" htmlFor="profile-xii-stream">
                <input className={inputClass} {...bindRecord('stream')} />
              </Field>
              <Field label="Result type" htmlFor="profile-xii-scoreType">
                <Select {...bindRecord('scoreType')} placeholder="Select">
                  <option value="percentage">Percentage</option>
                  <option value="cgpa">CGPA</option>
                </Select>
              </Field>
              {twelfth.scoreType === 'cgpa' ? (
                <Field label="CGPA" htmlFor="profile-xii-cgpa" hint="Out of 10">
                  <input type="number" min={0} max={10} step={0.01} className={inputClass} {...bindRecord('cgpa')} />
                </Field>
              ) : (
                <div className="grid grid-cols-2 gap-[12px]">
                  <Field label="Marks obtained" htmlFor="profile-xii-marksObtained">
                    <input type="number" min={0} className={inputClass} {...bindRecord('marksObtained')} />
                  </Field>
                  <Field label="Maximum marks" htmlFor="profile-xii-maximumMarks">
                    <input type="number" min={1} className={inputClass} {...bindRecord('maximumMarks')} />
                  </Field>
                </div>
              )}
            </Section>

            <Section title="Photo & Signature" description="JPG, PNG or WEBP images, up to 512 KB each." icon="fa-camera">
              <ImagePicker label="Photo" passport file={photo} savedUrl={fileUrl(reg.photoUrl)} onFile={setPhoto} />
              <ImagePicker label="Signature" file={signature} savedUrl={fileUrl(reg.signatureUrl)} onFile={setSignature} />
            </Section>
          </>
        )}

        {error && (
          <div className="px-[28px] pb-[20px] max-sm:px-[18px]">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-end gap-[10px] border-t border-[#eef1f5] bg-[#f8fafc] px-[28px] py-[16px] max-sm:flex-col-reverse max-sm:items-stretch max-sm:px-[18px]">
          <button type="button" className={buttonClass.outline} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className={buttonClass.primary} disabled={saving}>
            {saving ? <Spinner /> : <i className="fa-solid fa-check" aria-hidden="true"></i>} {saving ? 'Saving...' : 'Save changes'}
          </button>
        </footer>
      </div>
    </form>
  );
}
