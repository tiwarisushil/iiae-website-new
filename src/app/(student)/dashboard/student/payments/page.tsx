import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loading } from '@/components/student/ui';
import PaymentsPage from '@/components/student/PaymentsPage';

export const metadata: Metadata = { title: { absolute: 'Payments - IIAE Student Dashboard' } };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentsPage />
    </Suspense>
  );
}
