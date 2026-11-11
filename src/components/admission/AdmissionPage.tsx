'use client';

import { useEffect, useState, type ReactNode } from 'react';
import SiteLink from '@/components/SiteLink';
import { STUDENT_DASHBOARD_URL, STUDENT_LOGIN_URL } from '@/lib/site';
import { useSession } from '@/lib/student/session';
import { COURSES, ELIGIBILITY, EXAM_PHASES, FAQS, FEE_STRUCTURE, NAV, PATTERNS, SCHOLARSHIPS, type Group } from './data';

// The AIAEE exam page, as on the CRM's public home page (Reactjs ExamHomePage), inside this
// site's header and footer. Gold = the site's `primary` colour, navy = `heading`.

const BUTTON = 'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-white [text-decoration:none]';

export default function AdmissionPage() {
  const [active, setActive] = useState(NAV[0][0]);
  const session = useSession();
  const student = session?.user.role === 'student' ? session.user : null;

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const markActive = () => {
      const line = 80;
      let current = NAV[0][0];
      NAV.forEach(([id]) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) current = id;
      });
      setActive((previous) => (previous === current ? previous : current));
    };
    markActive();
    window.addEventListener('scroll', markActive, { passive: true });
    return () => window.removeEventListener('scroll', markActive);
  }, []);

  return (
    <div className="bg-slate-100 text-slate-900 [&_p]:mb-0 [&_ul]:mb-0">
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen self-start overflow-y-auto border-r border-slate-200 bg-white lg:block">
          <nav className="flex h-full flex-col" aria-label="On this page">
            <p className="px-4 pb-3 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5 sm:pt-5 sm:text-sm">On this page</p>
            <div className="flex-1 space-y-1 overflow-y-auto px-2.5 pb-6 sm:px-3">
              {NAV.map(([id, label], index) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => goTo(id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm leading-5 cursor-pointer sm:gap-3 sm:px-3 sm:text-base sm:leading-6 ${active === id ? 'bg-primary/15 font-semibold text-[#6b5a12]' : 'text-slate-700 [&:hover]:bg-slate-100'}`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-sm font-semibold ${active === id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {index + 1}
                  </span>
                  <span className="min-w-0">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="bg-heading text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
              <p className="text-sm text-white/75 sm:text-base">
                <SiteLink href="/" className="text-white/75 [text-decoration:none] [&:hover]:text-white">Home</SiteLink> / AIAEE 2027 Exam
              </p>
              <h1 className="mt-2 mb-0 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">AIAEE 2027 Exam</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                Aircraft Maintenance Engineering Entrance Exam, conducted by the Indian Institute of Aircraft Engineering (IIAE), New Delhi.
              </p>
            </div>
          </div>

          <div className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            <Section id="overview" title="Overview">
              <p>
                Aircraft Maintenance Engineering Entrance Exam (AIAEE) is the entrance test for the CAR 147 (Basic) Aircraft Maintenance Engineering programme at the Indian Institute of Aircraft Engineering, New Delhi. The programme has two categories: B1.1 Mechanical and B2 Avionics.
              </p>
              <p className="mt-3">
                Qualified students can receive a scholarship of up to 100% according to their All India Rank. A candidate can take AIAEE three times. At the time of admission, age must be between 15 and 28 years.
              </p>
            </Section>

            <Section id="courses" title="AIAEE Course Offered">
              <p>
                The Indian Institute of Aircraft Engineering (IIAE) is approved by the Directorate General of Civil Aviation (DGCA), Ministry of Civil Aviation, Govt. of India to provide CAR 147 (Basic) Aircraft Maintenance Engineering (AME) Training and to award the Certificate of Recognition (C of R) to its students for competency in basic AME Category B1.1 and B2, vide Director General of Civil Aviation (DGCA) of India approval reference No. DGCA/CAR-147 (Basic)/12 dated 9th August 2018.
              </p>
              <div className="mt-5">
                <GroupedTable headers={['Degree', 'Category', 'Approval']} groups={COURSES} />
              </div>
            </Section>

            <Section id="eligibility" title="AIAEE Eligibility">
              <ul className="mb-5! list-disc space-y-2 pl-5 sm:pl-6">
                <li>Candidate age must be between 15 and 28 years at the time of admission.</li>
                <li>The maximum number of attempts which a candidate can avail at AIAEE shall be limited to 03 (three).</li>
              </ul>
              <GroupedTable headers={['Degree', 'Category', 'Eligibility']} groups={ELIGIBILITY} />
            </Section>

            <Section id="details" title="AIAEE (Aircraft Maintenance Engineering Entrance Exam) Details">
              <ul className="list-disc space-y-2 pl-5 sm:pl-6">
                <li>The AIAEE 2027 examination consists of 75 Multiple-Choice Questions (MCQs) in Physics, Chemistry and Mathematics. Each question carries 4 marks.</li>
                <li>The question paper will be available in both English and Hindi.</li>
                <li>The examination is conducted online only. Candidates do not choose an exam centre.</li>
                <li>The total duration of the examination is 1 hour 30 minutes (90 minutes).</li>
                <li>The AIAEE 2027 examination is scheduled to be held in three phases between January 2027 and June 2027.</li>
              </ul>
            </Section>

            <Section id="scholarships" title="AIAEE Scholarships">
              <p className="mb-4!">Awarded by the Indian Institute of Aircraft Engineering (IIAE).</p>
              <SimpleTable headers={['Category', 'Scholarship on tuition fees']} rows={SCHOLARSHIPS} />
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-3 text-sm leading-7 text-slate-800 sm:px-4 sm:text-base">
                <span className="font-bold">Note:- </span>
                Scholarship will be applicable on tuition fees for 1st semester fees only. AIAEE Scholarship will only be offered after taking admission through AIAEE Counselling.
              </p>
            </Section>

            <Section id="fee" title="AIAEE Examination Fee">
              <p>The examination fee for the Aircraft Maintenance Engineering Entrance Exam (AIAEE) 2027 is INR 2000/-.</p>
              <Subhead className="mt-4 sm:mt-5">Fee structure</Subhead>
              <div className="mt-4">
                <SimpleTable headers={['Particular', 'Amount']} rows={FEE_STRUCTURE} />
              </div>
              <p className="mt-4">MRO: ₹1,00,000 + GST.</p>
              <Subhead className="mt-4 sm:mt-5">Mode of Payment for AIAEE Application Form</Subhead>
              <ul className="mt-4 list-disc space-y-2 pl-5 sm:pl-6">
                <li>The registration fee is paid online by debit card, credit card, net banking, or UPI.</li>
                <li>The bank may charge a service fee and applicable taxes on card or net-banking payments.</li>
              </ul>
            </Section>

            <Section id="pattern" title="AIAEE Exam Pattern">
              <div className="space-y-8">
                {PATTERNS.map((pattern) => (
                  <div key={pattern.title}>
                    <p className="mb-3! text-lg font-semibold text-slate-900">{pattern.title}</p>
                    <SimpleTable
                      headers={['SN', 'Subjects', 'Questions', 'Marks']}
                      rows={[
                        ...pattern.rows.map((row, index) => [String(index + 1), ...row]),
                        [
                          '',
                          'Total',
                          String(pattern.rows.reduce((sum, row) => sum + Number(row[1]), 0)),
                          String(pattern.rows.reduce((sum, row) => sum + Number(row[2]), 0)),
                        ],
                      ]}
                    />
                    <p className="mt-3 text-base text-slate-700">Each question carries 4 marks.</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="dates" title="AIAEE 2027 Exam Important Dates">
              <p className="mb-6!">The AIAEE 2027 examination is scheduled to be held in three phases as follows.</p>
              <div className="space-y-8">
                {EXAM_PHASES.map((phase) => (
                  <div key={phase.title}>
                    <Subhead className="mb-3">{phase.title}</Subhead>
                    <SimpleTable headers={['SN', 'Event', 'Dates']} rows={phase.rows.map((row, index) => [String(index + 1), ...row])} />
                  </div>
                ))}
              </div>
            </Section>

            <Section id="faqs" title="FAQs">
              <FaqList items={FAQS} />
            </Section>

            <Section id="regist" title="Register / Login">
              <div className="max-w-xl space-y-4">
                {student ? (
                  <>
                    <p className="text-lg">You are signed in as {student.name}.</p>
                    <SiteLink href={STUDENT_DASHBOARD_URL} className={`${BUTTON} bg-[#0c4da2] [&:hover]:bg-[#0a3f86]`}>
                      Go to dashboard
                    </SiteLink>
                  </>
                ) : (
                  <>
                    <p>Create an account to apply, then complete the registration form from your dashboard.</p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <SiteLink href="/apply-online" className={`${BUTTON} bg-[#F82900] [&:hover]:bg-[#d92400]`}>Create account</SiteLink>
                      <SiteLink href={STUDENT_LOGIN_URL} className={`${BUTTON} bg-[#0c4da2] [&:hover]:bg-[#0a3f86]`}>Sign in</SiteLink>
                    </div>
                  </>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqList({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map(([question, answer], index) => {
        const isOpen = open === index;
        return (
          <div
            key={question}
            className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-300 ${isOpen ? 'border-primary/50 shadow-sm ring-1 ring-primary/15' : 'border-slate-200'}`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
              className={`flex w-full items-start gap-3 px-3 py-3.5 text-left cursor-pointer sm:items-center sm:gap-4 sm:px-5 sm:py-4 ${isOpen ? 'bg-primary/10' : ''}`}
            >
              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors duration-300 sm:mt-0 sm:h-9 sm:w-9 sm:text-sm ${isOpen ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`min-w-0 flex-1 text-sm font-semibold leading-6 sm:text-base ${isOpen ? 'text-[#6b5a12]' : 'text-slate-800'}`}>{question}</span>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`mt-0.5 shrink-0 text-slate-500 transition-transform duration-300 ease-out motion-reduce:transition-none sm:mt-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div aria-hidden={!isOpen} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-3 pb-4 text-sm leading-7 text-slate-600 sm:px-5 sm:pb-5 sm:pl-[4.75rem] sm:pr-6 sm:text-base">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="bg-primary px-4 py-2 [box-shadow:0_2px_4px_rgba(0,0,0,0.075)] sm:px-6 sm:py-2.5 md:px-8">
        <h2 className="m-0 text-[clamp(1.0625rem,2.2vw,1.5rem)] font-medium leading-[1.2] tracking-[0.01em] text-white">{title}</h2>
      </div>
      <div className="p-4 text-base leading-[1.75] text-slate-800 sm:p-6 sm:text-[1.0625rem] sm:leading-[1.8] md:p-8">{children}</div>
    </section>
  );
}

function Subhead({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <h3 className={`m-0 block rounded-md bg-primary px-3 py-1.5 text-[clamp(0.9375rem,1.8vw,1.125rem)] font-medium leading-[1.2] text-white ${className}`}>{children}</h3>
  );
}

const TABLE_HEAD = 'border-b-2 border-primary bg-white text-primary';

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {rows.map((row, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
            {headers.map((header, cellIndex) => (
              <div
                key={header}
                className={`grid gap-1 py-2 sm:grid-cols-[minmax(7rem,10rem)_minmax(0,1fr)] sm:gap-3 ${cellIndex ? 'border-t border-slate-100' : 'pt-0'} ${cellIndex === headers.length - 1 ? 'pb-0' : ''}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{header}</p>
                <p className="text-sm leading-6 text-slate-800 sm:text-base">{row[cellIndex]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 lg:block">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm xl:text-base">
          <thead>
            <tr className={TABLE_HEAD}>
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-2 font-semibold text-primary">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={index % 2 ? 'bg-slate-50' : 'bg-white'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-t border-slate-200 px-4 py-3 align-top leading-7 text-slate-800">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function GroupedTable({ headers, groups }: { headers: string[]; groups: Group[] }) {
  const flatRows = groups.flatMap(([category, rows]) => rows.map((row) => [category, ...row]));
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {flatRows.map((row, index) => (
          <div key={`${row[0]}-${row[1]}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
            {headers.map((header, cellIndex) => (
              <div
                key={header}
                className={`grid gap-1 py-2 sm:grid-cols-[minmax(7rem,10rem)_minmax(0,1fr)] sm:gap-3 ${cellIndex ? 'border-t border-slate-100' : 'pt-0'} ${cellIndex === headers.length - 1 ? 'pb-0' : ''}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{header}</p>
                <p className={`text-sm leading-6 sm:text-base ${cellIndex === 0 ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>{row[cellIndex]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 lg:block">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm xl:text-base">
          <thead>
            <tr className={TABLE_HEAD}>
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-2 font-semibold text-primary">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(([category, rows]) =>
              rows.map((row, index) => (
                <tr key={`${category}-${row[0]}`} className="bg-white">
                  {index === 0 && (
                    <td rowSpan={rows.length} className="border-t border-slate-200 px-4 py-3 align-top font-semibold text-slate-900">{category}</td>
                  )}
                  {row.map((cell) => (
                    <td key={cell} className="border-t border-slate-200 px-4 py-3 leading-7 text-slate-800">{cell}</td>
                  ))}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
