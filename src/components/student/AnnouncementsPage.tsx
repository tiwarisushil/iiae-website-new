'use client';

import { useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/student/api';
import { formatDate } from '@/lib/student/format';
import { EmptyState, Loading, PageHeading } from './ui';
import { toast } from './toast';

type Announcement = {
  _id: string;
  title: string;
  content: string;
  createdBy?: { name?: string; role?: string };
  createdAt: string;
};

/** /dashboard/announcements: notices for students from the institute. */
export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[] | null>(null);

  useEffect(() => {
    api<Announcement[]>('/announcements')
      .then((list) => setItems(Array.isArray(list) ? list : []))
      .catch((error) => {
        toast.error(errorMessage(error, 'Failed to load notices'));
        setItems([]);
      });
  }, []);

  if (!items) return <Loading label="Loading announcements..." />;

  return (
    <div>
      <PageHeading title="Announcements" subtitle="Updates and notices from the institute." />
      {items.length === 0 ? (
        <EmptyState icon="fa-bullhorn" title="No announcements">
          There are no announcements right now.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {items.map((a) => (
            <article key={a._id} className="flex gap-[16px] rounded-[14px] border border-[#e2e8f0] bg-white p-[22px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#eef2f8] text-[16px] text-heading max-xs:hidden">
                <i className="fa-solid fa-bullhorn" aria-hidden="true"></i>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="mb-[6px] text-[18px] font-semibold text-[#0f172a]">{a.title}</h2>
                <p className="mb-[12px] max-w-[85ch] whitespace-pre-line text-[15px] leading-[1.65] text-[#334155]">{a.content}</p>
                <p className="m-0 text-[14px] text-[#475569]">
                  {a.createdBy?.name && (
                    <>
                      By {a.createdBy.name}
                      {a.createdBy.role ? ` (${a.createdBy.role})` : ''} ·{' '}
                    </>
                  )}
                  Published {formatDate(a.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
