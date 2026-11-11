'use client';

import { useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/student/api';
import { formatDate } from '@/lib/student/format';
import type { PortalSettings } from '@/lib/student/types';
import { Badge, EmptyState, Loading, PageHeading } from './ui';
import { toast } from './toast';

type Exam = {
  _id: string;
  name: string;
  type: 'entrance' | 'midterm' | 'final';
  maxMarks: number;
  date: string;
  myResult: { marksObtained: number; status: 'pending' | 'passed' | 'failed'; remarks?: string } | null;
};

/** /dashboard/student/results: the student's published exam results. */
export default function ResultsPage() {
  const [state, setState] = useState<{ loading: boolean; exams: Exam[]; settings: PortalSettings | null }>({
    loading: true,
    exams: [],
    settings: null,
  });

  useEffect(() => {
    Promise.all([
      api<Exam[]>('/exams').catch((error) => {
        toast.error(errorMessage(error, 'Could not load your results'));
        return [] as Exam[];
      }),
      api<PortalSettings>('/settings').catch(() => null),
    ]).then(([exams, settings]) => setState({ loading: false, exams: Array.isArray(exams) ? exams : [], settings }));
  }, []);

  if (state.loading) return <Loading label="Loading your results..." />;

  if (state.settings && !state.settings.resultEnabled) {
    return (
      <div>
        <PageHeading title="Exam results" />
        <EmptyState icon="fa-hourglass-half" title="Results are not published yet">
          Entrance examination results are currently pending publication by the IIAE Administration. Please check back later.
        </EmptyState>
      </div>
    );
  }

  const results = state.exams.filter((e) => e.myResult);
  return (
    <div>
      <PageHeading title="Exam results" subtitle="Results published on your profile." />
      {results.length === 0 ? (
        <EmptyState icon="fa-square-poll-vertical" title="No results yet">
          No results have been published on your profile yet.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-[20px] max-md:grid-cols-1 2xl:grid-cols-3">
          {results.map((exam) => {
            const r = exam.myResult!;
            const percent = exam.maxMarks ? ((r.marksObtained / exam.maxMarks) * 100).toFixed(1) : '0.0';
            const passed = r.status === 'passed';
            return (
              <article key={exam._id} className="rounded-[14px] border border-[#e2e8f0] bg-white p-[22px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
                <div className="mb-[12px] flex flex-wrap items-center justify-between gap-[10px]">
                  <Badge tone="info">
                    <span className="capitalize">{exam.type}</span>&nbsp;test
                  </Badge>
                  <span className="text-[14px] text-[#475569]">{formatDate(exam.date)}</span>
                </div>
                <h2 className="mb-[2px] text-[19px] font-semibold text-[#0f172a]">{exam.name}</h2>
                <p className="mb-[16px] text-[14px] text-[#475569]">Maximum marks {exam.maxMarks}</p>
                <div className="flex flex-wrap items-end justify-between gap-[12px] rounded-[12px] border border-[#eef2f6] bg-[#f8fafc] p-[16px]">
                  <div>
                    <p className="m-0 text-[14.5px] font-medium text-[#475569]">Marks obtained</p>
                    <p className="m-0 text-[30px] font-bold leading-[1.15] text-[#0f172a]">
                      {r.marksObtained}
                      <span className="text-[16px] text-[#475569]"> / {exam.maxMarks}</span>
                    </p>
                  </div>
                  <Badge tone={passed ? 'success' : 'error'}>
                    {passed ? 'Passed' : 'Not passed'} · {percent}%
                  </Badge>
                </div>
                {r.remarks && <p className="mb-0 mt-[12px] text-[14px] text-[#475569]">{r.remarks}</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
