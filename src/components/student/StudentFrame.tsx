import type { ReactNode } from 'react';

/** Light band for the public student pages (login, registration, payment); no banner or breadcrumbs. */
export default function StudentFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-[#f5f6fa] px-[12px] xs:px-[16px] md:px-[24px] xl:px-[32px] 2xl:px-[40px] py-[48px] max-md:py-[24px]">
      <h1 className="sr-only">{title}</h1>
      <div className="w-full">{children}</div>
    </section>
  );
}
