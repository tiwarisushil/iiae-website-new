'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api, errorMessage, fileUrl } from '@/lib/student/api';
import { formatDate, formatRupees, initials } from '@/lib/student/format';
import { studentEndpoints } from '@/lib/student/payu';
import type { StudentDashboard } from '@/lib/student/types';
import ProfileEditForm from './ProfileEditForm';
import { PayuPayButton } from './payments';
import { Alert, Badge, buttonClass, Card, Details, linkClass, Loading, PageHeading, Spinner } from './ui';
import { toast } from './toast';

const EMPTY: StudentDashboard['registration'] = {
  name: '', email: '', phone: '', alternatePhone: '', studentId: '', gender: '', dob: null, category: '',
  fatherName: '', motherName: '', parentMobile: '', parentEmail: '', address: '', city: '', state: '',
  country: '', pin: '', courseName: '', qualification: '', examCentreFirst: '', examCentreSecond: '',
  photoUrl: '', signatureUrl: '', registrationFeeAmount: 0, acknowledgementUrl: '', registrationFeePaid: false,
  formSubmittedAt: null, academics: {}, extraAnswers: [], documents: [],
};

const FileLink = ({ url, label = 'View file' }: { url: string; label?: string }) => (
  <a href={fileUrl(url)} target="_blank" rel="noreferrer" className={linkClass}>
    <i className="fa-solid fa-arrow-up-right-from-square mr-[6px] text-[13px]" aria-hidden="true"></i>
    {label}
  </a>
);

/** /dashboard/student/profile: the student's registration record (GET /dashboard). */
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [opening, setOpening] = useState(false);
  const [reapplying, setReapplying] = useState(false);

  const load = useCallback(
    () =>
      api<StudentDashboard>('/dashboard')
        .then(setData)
        .catch((error) => toast.error(errorMessage(error, 'Could not load your profile')))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Loading your profile..." />;

  const pending = Boolean(data?.registrationPending);
  const reg = { ...EMPTY, ...data?.registration };
  const fee = Number(reg.registrationFeeAmount) || 0;
  const feeDue = !pending && !reg.registrationFeePaid && fee > 0;
  const displayName = reg.name || 'Student';
  const address = [reg.address, reg.city, reg.state, reg.pin, reg.country].filter(Boolean).join(', ');

  const continueRegistration = async () => {
    setOpening(true);
    try {
      const { registrationPath } = await api<{ registrationPath: string }>('/registrations/continue', { method: 'POST' });
      router.push(registrationPath);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not open the registration form'));
      setOpening(false);
    }
  };

  const reapplyPhase = data?.reapplyPhase || '';
  const reapply = async () => {
    setReapplying(true);
    try {
      const { message } = await api<{ message: string }>('/registrations/reapply', { method: 'POST' });
      toast.success(message);
      await load();
    } catch (error) {
      toast.error(errorMessage(error, 'Could not register for this phase'));
    } finally {
      setReapplying(false);
    }
  };

  if (editing && data) {
    return (
      <ProfileEditForm
        registration={reg}
        pending={pending}
        onCancel={() => setEditing(false)}
        onSaved={async () => {
          await load();
          setEditing(false);
        }}
      />
    );
  }

  const twelfth = reg.academics?.classXII ?? {};
  const hasTwelfth = Object.values(twelfth).some((v) => v !== '' && v !== null && v !== undefined);
  const result =
    twelfth.scoreType === 'cgpa' ? (twelfth.cgpa !== '' && twelfth.cgpa != null ? `${twelfth.cgpa} CGPA` : '') : twelfth.percentage !== '' && twelfth.percentage != null ? `${twelfth.percentage}%` : '';
  const extras = (reg.extraAnswers ?? []).filter((a) => String(a.value ?? '').trim());

  const firstName = displayName.split(' ')[0];
  const ENTRANCE: Record<string, [string, 'success' | 'warning' | 'error' | 'info' | 'neutral']> = {
    pending: ['Awaiting admit card', 'neutral'],
    admit_card_generated: ['Admit card issued', 'info'],
    appeared: ['Exam taken', 'info'],
    passed: ['Passed', 'success'],
    failed: ['Not passed', 'error'],
  };
  const entrance = ENTRANCE[data?.profile.entranceStatus ?? 'pending'] ?? ENTRANCE.pending;
  const course = reg.courseName || (data?.profile.courseName !== 'Not Enrolled' ? data?.profile.courseName : '') || '';
  const batch = data?.profile.batchName && data.profile.batchName !== 'Not Assigned' ? data.profile.batchName : '';

  const tile = (icon: string, label: string, value: ReactNode, note?: ReactNode) => (
    <div className="flex items-start gap-[14px] rounded-[14px] border border-[#e2e8f0] bg-white p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#eef2f8] text-[15px] text-heading">
        <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[14px] font-medium text-[#475569]">{label}</p>
        <div className="mt-[2px] break-words text-[15.5px] font-semibold leading-[1.35] text-[#0f172a]">{value || <span className="font-normal text-[#64748b]">—</span>}</div>
        {note && <div className="mt-[4px]">{note}</div>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-[20px] [&>div:first-child]:mb-0">
      <PageHeading
        title={`Welcome, ${firstName}`}
        subtitle={pending ? 'Complete your registration to get your registration ID.' : 'Your registration and admission details.'}
        actions={
          <button type="button" className={buttonClass.outline} onClick={() => setEditing(true)} disabled={!data}>
            <i className="fa-solid fa-pen text-[14px]" aria-hidden="true"></i> Edit profile
          </button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-[18px]">
          {reg.photoUrl ? (
            <img src={fileUrl(reg.photoUrl)} alt="" className="h-[92px] w-[78px] rounded-[10px] border border-[#e2e8f0] object-cover" />
          ) : (
            <span className="flex h-[92px] w-[78px] items-center justify-center rounded-[10px] bg-heading text-[26px] font-bold text-primary">{initials(displayName)}</span>
          )}
          <div className="min-w-0 flex-1 basis-[240px]">
            <h2 className="m-0 text-[21px] font-bold leading-[1.3] text-[#0f172a]">{displayName}</h2>
            <p className="mb-0 mt-[4px] flex flex-wrap gap-x-[18px] gap-y-[2px] text-[14.5px] text-[#475569]">
              {reg.email && (
                <span className="break-all">
                  <i className="fa-regular fa-envelope mr-[6px] text-[#64748b]" aria-hidden="true"></i>
                  {reg.email}
                </span>
              )}
              {reg.phone && (
                <span>
                  <i className="fa-solid fa-phone mr-[6px] text-[14px] text-[#64748b]" aria-hidden="true"></i>
                  {reg.phone}
                </span>
              )}
            </p>
            <div className="mt-[10px] flex flex-wrap gap-[8px]">
              {pending ? <Badge tone="warning">Registration incomplete</Badge> : feeDue ? <Badge tone="warning">Fee unpaid</Badge> : <Badge tone="success">Registered</Badge>}
            </div>
          </div>
          {!pending && (
            <div className="rounded-[12px] border border-[#e2e8f0] bg-[#f8fafc] px-[18px] py-[12px] max-sm:w-full">
              <p className="m-0 text-[14px] font-medium text-[#475569]">Registration ID</p>
              <p className="m-0 font-mono text-[16px] font-semibold text-heading">{reg.studentId || 'Pending allocation'}</p>
            </div>
          )}
        </div>
      </Card>

      {pending ? (
        <Card className="border-[#f3dfa0]">
          <div className="flex flex-wrap items-center gap-[18px]">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#fff8e6] text-[22px] text-[#b7791f]">
              <i className="fa-solid fa-file-pen" aria-hidden="true"></i>
            </span>
            <div className="min-w-0 flex-1 basis-[260px]">
              <p className="m-0 text-[14px] font-semibold uppercase tracking-[0.8px] text-[#b7791f]">Action needed</p>
              <h2 className="mb-[4px] mt-[2px] text-[19px] font-semibold text-[#0f172a]">Finish your registration</h2>
              <p className="m-0 text-[15px] text-[#475569]">The exam application is still open. Complete the registration form to receive your ID and continue.</p>
            </div>
            <button type="button" className={buttonClass.primary} onClick={continueRegistration} disabled={opening}>
              {opening ? <Spinner /> : <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>}
              {opening ? 'Opening...' : 'Fill registration form'}
            </button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-[16px] max-xl:grid-cols-2 max-sm:grid-cols-1">
            {tile('fa-plane', 'Course', course)}
            {tile(
              'fa-indian-rupee-sign',
              'Registration fee',
              fee > 0 ? formatRupees(fee) : 'No fee',
              fee > 0 && (reg.registrationFeePaid ? <Badge tone="success">Paid</Badge> : <Badge tone="warning">Unpaid</Badge>),
            )}
            {tile('fa-clipboard-check', 'Entrance exam', entrance[0], data?.profile.entranceScore ? <span className="text-[14px] text-[#475569]">Score {data.profile.entranceScore}</span> : undefined)}
            {tile('fa-users', 'Batch', batch || 'Not assigned yet')}
          </div>

          {reapplyPhase && (
            <Card className="border-[#bfd3f2]">
              <div className="flex flex-wrap items-center gap-[18px]">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef2f8] text-[22px] text-heading">
                  <i className="fa-solid fa-rotate-right" aria-hidden="true"></i>
                </span>
                <div className="min-w-0 flex-1 basis-[260px]">
                  <p className="m-0 text-[14px] font-semibold uppercase tracking-[0.8px] text-heading">New exam phase</p>
                  <h2 className="mb-[4px] mt-[2px] text-[19px] font-semibold text-[#0f172a]">Registration for {reapplyPhase} is open</h2>
                  <p className="m-0 text-[15px] text-[#475569]">
                    Your earlier registration was in a previous session. Register for this session with the details already on file. The registration fee is charged again.
                  </p>
                </div>
                <button type="button" className={buttonClass.primary} onClick={reapply} disabled={reapplying}>
                  {reapplying ? <Spinner /> : <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>}
                  {reapplying ? 'Registering...' : `Register for ${reapplyPhase}`}
                </button>
              </div>
            </Card>
          )}

          {feeDue && (
            <div className="flex flex-wrap items-center justify-between gap-[16px] rounded-[14px] border border-[#f3dfa0] bg-[#fffbeb] px-[22px] py-[16px]">
              <div className="flex items-start gap-[12px]">
                <i className="fa-solid fa-circle-exclamation mt-[3px] text-[18px] text-[#d97706]" aria-hidden="true"></i>
                <div>
                  <p className="m-0 text-[15.5px] font-semibold text-[#78350f]">Registration fee of {formatRupees(fee)} is due</p>
                  <p className="m-0 text-[14px] text-[#92400e]">
                    Pay online to confirm your application.{' '}
                    <Link href="/dashboard/student/payments" className="font-semibold text-[#78350f] underline underline-offset-[3px]">
                      View all payments
                    </Link>
                  </p>
                </div>
              </div>
              {/* PayU returns signed-in checkouts to the payments page. */}
              <PayuPayButton payableType="registration_fee" label="Pay registration fee" endpoints={studentEndpoints} />
            </div>
          )}

          <div className="grid grid-cols-2 items-start gap-[20px] max-lg:grid-cols-1">
            <Card title="Personal details" icon="fa-user">
              <Details
                items={[
                  ['Full name', displayName],
                  ['Gender', reg.gender],
                  ['Date of birth', formatDate(reg.dob, '')],
                  ['Category', reg.category],
                  ["Father's name", reg.fatherName],
                  ["Mother's name", reg.motherName],
                  ['Mobile', reg.phone],
                  ['Alternative phone', reg.alternatePhone],
                  ['Parent mobile', reg.parentMobile],
                  ['Parent email', reg.parentEmail],
                  ['Address', address],
                ]}
              />
            </Card>

            <div className="flex flex-col gap-[20px]">
              <Card title="Registration" icon="fa-id-card">
                <Details
                  items={[
                    ['Registration ID', reg.studentId || 'Pending allocation'],
                    ...(reg.examPhase ? [['Exam phase', reg.examPhase] as [string, string]] : []),
                    ...(reg.phaseHistory?.length
                      ? [['Earlier phases', reg.phaseHistory.map((item) => `${item.examPhase || 'Earlier'} (${item.registrationFeePaid ? 'paid' : 'unpaid'})`).join(', ')] as [string, string]]
                      : []),
                    ['Registered on', formatDate(reg.formSubmittedAt, 'Not registered yet')],
                    ['Course', course],
                    ['Qualification', reg.qualification || '12th'],
                    ...(reg.examCentreFirst ? [['Exam centre 1', reg.examCentreFirst] as [string, string]] : []),
                    ...(reg.examCentreSecond ? [['Exam centre 2', reg.examCentreSecond] as [string, string]] : []),
                    ...(reg.acknowledgementUrl
                      ? [['Acknowledgement', <FileLink key="a" url={reg.acknowledgementUrl} label="Download PDF" />] as [string, ReactNode]]
                      : []),
                  ]}
                />
              </Card>

              {hasTwelfth && (
                <Card title="Class XII" icon="fa-graduation-cap">
                  <Details
                    items={[
                      ['Board', twelfth.board],
                      ['Passing year', twelfth.passingYear],
                      ['School', twelfth.school],
                      ['Stream', twelfth.stream],
                      ['Result', result],
                      ...(twelfth.scoreType !== 'cgpa' && twelfth.marksObtained !== '' && twelfth.marksObtained != null
                        ? [['Marks', `${twelfth.marksObtained} / ${twelfth.maximumMarks}`] as [string, string]]
                        : []),
                    ]}
                  />
                </Card>
              )}

              {reg.signatureUrl && (
                <Card title="Signature" icon="fa-signature">
                  <img src={fileUrl(reg.signatureUrl)} alt="Signature" className="max-h-[70px] rounded-[6px] border border-[#e2e8f0] bg-white p-[6px]" />
                </Card>
              )}
            </div>
          </div>

          {(extras.length > 0 || reg.documents?.length > 0) && (
            <div className="grid grid-cols-2 items-start gap-[20px] max-lg:grid-cols-1">
              {extras.length > 0 && (
                <Card title="Additional details" icon="fa-list-check">
                  <Details
                    items={extras.map(
                      (a): [string, ReactNode] => [
                        a.label,
                        String(a.value).startsWith('/uploads/') ? <FileLink key={a.fieldId} url={a.value} /> : a.value,
                      ],
                    )}
                  />
                </Card>
              )}
              {reg.documents?.length > 0 && (
                <Card title="Documents" icon="fa-folder-open">
                  <ul className="m-0 flex flex-col gap-[8px] p-0">
                    {reg.documents.map((doc) => (
                      <li key={`${doc.name}-${doc.url}`} className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#eef2f6] px-[14px] py-[10px]">
                        <span className="text-[14.5px] text-[#0f172a]">
                          <i className="fa-regular fa-file mr-[8px] text-[#64748b]" aria-hidden="true"></i>
                          {doc.name}
                        </span>
                        {doc.url ? <FileLink url={doc.url} label="View" /> : <span className="text-[14px] text-[#475569]">On file</span>}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {!data && <Alert tone="error">Your profile could not be loaded. Refresh the page to try again.</Alert>}
    </div>
  );
}
