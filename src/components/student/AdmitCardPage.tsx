'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { api, apiBlob, errorMessage, fileUrl } from '@/lib/student/api';
import type { PortalSettings, StudentDashboard } from '@/lib/student/types';
import { buttonClass, EmptyState, Loading, PageHeading, Spinner } from './ui';
import { toast } from './toast';

type AdmitCard = {
  student?: { name?: string; phone?: string; email?: string };
  rollNumber: string;
  examDate: string;
  examTime: string;
  /** "10:00" / "13:00" (India time) on cards released for a whole exam phase */
  startTime?: string;
  endTime?: string;
  examPhase?: string;
  examMode?: string;
  /** Cleaned on the server (utils/instructionsHtml.js): only text formatting and lists */
  instructionsHtml?: string;
  instructions: string;
  createdAt: string;
};

type Registration = StudentDashboard['registration'] | undefined;

// "14:30" -> "2:30 PM"
const clock = (value: string) => {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) return value;
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const timing = (card: AdmitCard) => (card.startTime && card.endTime ? `${clock(card.startTime)} to ${clock(card.endTime)}` : card.examTime);

// dd/mm/yyyy; exam dates are India midnights, dates of birth UTC midnights
const ddmmyyyy = (value: string | null | undefined, timeZone: 'Asia/Kolkata' | 'UTC') =>
  value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone }) : '';

const examYear = (card: AdmitCard) =>
  card.examDate ? new Date(card.examDate).toLocaleDateString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' }) : String(new Date().getFullYear());

// Same layout as the PDF (the earlier AIAEE admit card without its exam centre details, as
// the exam is online): centred logo and titles, Reg. No. and Phase, details table with the photo,
// Admission Head, instructions.
function HallTicket({ card, photo, registration }: { card: AdmitCard; photo: string; registration: Registration }) {
  const year = examYear(card);
  const phase = card.examPhase || registration?.examPhase || '';
  const cell = 'border border-[#c2c2c2] px-[4px] py-[3px] align-top';
  const rows: [string, ReactNode][] = [
    ['Student Name', card.student?.name],
    ["Father's Name", registration?.fatherName],
    ['Gender', registration?.gender],
    ['Address', registration?.address],
    ['City & State', [registration?.city, registration?.state].filter(Boolean).join(', ')],
    ['PIN', registration?.pin],
    ['Date of Birth', ddmmyyyy(registration?.dob, 'UTC') || 'N/A'],
    ['Examination Date', ddmmyyyy(card.examDate, 'Asia/Kolkata') || 'N/A'],
    ['Examination Mode', card.examMode || 'Online'],
    ['Exam Timing', timing(card) || 'N/A'],
  ];
  const plainInstructions = (card.instructions || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean);

  return (
    <article className="bg-white px-[24px] py-[20px] font-['DejaVu_Sans',Verdana,sans-serif] text-[14px] text-[#333] max-sm:px-[12px] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
      <img src="/assets/web/images/admit-card-logo.png" alt="Indian Institute of Aircraft Engineering" className="mx-auto block w-[150px] max-sm:w-[110px]" />
      <h2 className="mb-[2px] mt-[8px] text-center text-[18px] font-bold">AIAEE {year} Exam Admit Card</h2>
      <h3 className="m-0 text-center text-[16px] font-bold">All India AME Entrance Examination (AIAEE {year})</h3>

      <table className="mb-[15px] mt-[6px] w-full border-collapse">
        <tbody>
          <tr>
            <td className={cell}>
              <strong>Reg. No.:</strong> {registration?.studentId}
            </td>
            {phase ? (
              <td className={`${cell} whitespace-nowrap text-right`}>
                <strong>Phase:</strong> {phase}
              </td>
            ) : null}
          </tr>
        </tbody>
      </table>

      <table className="mb-[15px] w-full border-collapse">
        <tbody>
          {rows.map(([label, value], index) => (
            <tr key={String(label)}>
              <td className={`${cell} w-[31%] font-bold max-sm:w-[38%]`}>{label}</td>
              <td className={`${cell} w-[38%] max-sm:w-auto`}>{value}</td>
              {index === 0 && (
                <td rowSpan={rows.length} className={`${cell} text-center max-sm:hidden`}>
                  {photo ? (
                    <img src={photo} alt="Candidate photo" className="mx-auto mt-[20px] h-[180px] w-[150px] border border-[#c2c2c2] object-cover" />
                  ) : (
                    <span className="mx-auto mt-[20px] flex h-[180px] w-[150px] items-center justify-center bg-[#dcdcdc] text-[13px] text-[#555]">No Image</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-[12px] leading-[1.6]">
        <strong>Admission Head</strong>
        <br />
        Indian Institute of Aircraft Engineering (IIAE)
        <br />
        www.iiae.in
      </p>

      <h4 className="mb-[6px] mt-[14px] text-[16px] font-bold">Instructions:</h4>
      {card.instructionsHtml ? (
        <div
          className="text-[12px] leading-[1.6] [&_h3]:mb-[4px] [&_h3]:mt-[8px] [&_h3]:text-[14px] [&_h3]:font-bold [&_li]:mb-[2px] [&_ol]:list-decimal [&_ol]:pl-[40px] [&_p]:mb-[6px] [&_ul]:list-disc [&_ul]:pl-[40px]"
          dangerouslySetInnerHTML={{ __html: card.instructionsHtml }}
        />
      ) : (
        <ol className="list-decimal pl-[40px] text-[12px] leading-[1.6]">
          {plainInstructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      )}
      <hr className="mt-[10px] border-0 border-t-[3px] border-double border-[#b5b5b5]" />
    </article>
  );
}

/** /dashboard/student/admit-card: the hall ticket, printed from the browser. */
export default function AdmitCardPage() {
  const [state, setState] = useState<{ loading: boolean; card: AdmitCard | null; settings: PortalSettings | null; dash: StudentDashboard | null }>({
    loading: true,
    card: null,
    settings: null,
    dash: null,
  });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const quiet = <T,>(p: Promise<T>) => p.catch(() => null);
    Promise.all([
      quiet(api<AdmitCard>('/exams/admit-card/me')),
      quiet(api<PortalSettings>('/settings')),
      quiet(api<StudentDashboard>('/dashboard')),
    ]).then(([card, settings, dash]) => setState({ loading: false, card, settings, dash }));
  }, []);

  if (state.loading) return <Loading label="Loading your admit card..." />;

  const { card, settings, dash } = state;
  // If the settings could not be loaded the card is shown.
  if (settings && !settings.admitCardEnabled) {
    return (
      <div>
        <PageHeading title="Admit card" />
        <EmptyState icon="fa-lock" title="Downloads temporarily disabled">
          Entrance examination admit card downloading is currently deactivated by the IIAE Administration. Please check back later.
        </EmptyState>
      </div>
    );
  }

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await apiBlob('/exams/admit-card/me/pdf');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admit-card-${card?.rollNumber || 'iiae'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not download your admit card'));
    } finally {
      setDownloading(false);
    }
  };

  const photo = fileUrl(dash?.registration?.photoUrl);

  return (
    <div>
      <PageHeading
        title="Admit card"
        subtitle="View or print your hall ticket for the entrance examination."
        actions={
          card && (
            <div className="flex flex-wrap gap-[10px]">
              <button type="button" className={buttonClass.primary} onClick={downloadPdf} disabled={downloading}>
                {downloading ? <Spinner /> : <i className="fa-solid fa-file-arrow-down" aria-hidden="true"></i>}
                {downloading ? 'Preparing...' : 'Download PDF'}
              </button>
              <button type="button" className={buttonClass.outline} onClick={() => window.print()}>
                <i className="fa-solid fa-print" aria-hidden="true"></i> Print ticket
              </button>
            </div>
          )
        }
      />
      {card ? (
        <>
          <div className="mx-auto max-w-[760px]">
            <HallTicket card={card} photo={photo} registration={dash?.registration} />
            <p className="mb-0 mt-[12px] text-center text-[14px] text-[#475569]">
              Download the PDF or print this page. Bring a printed copy and a photo ID to the exam.
            </p>
          </div>
          {/* Printing shows only this copy (see the print rule in globals.css). */}
          {createPortal(
            <div data-print-root className="hidden p-[10mm] print:block">
              <HallTicket card={card} photo={photo} registration={dash?.registration} />
            </div>,
            document.body,
          )}
        </>
      ) : (
        <EmptyState icon="fa-ticket" title="No admit card yet">
          Your admit card for the entrance examination has not been generated yet. Please contact the admissions office once your registration is complete.
        </EmptyState>
      )}
    </div>
  );
}
