import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegistrationPaymentPage from '@/components/student/RegistrationFeePayment';
import StudentFrame from '@/components/student/StudentFrame';
import { Loading } from '@/components/student/ui';

export const metadata: Metadata = { title: { absolute: 'Registration Fee Payment - IIAE' } };

// Linked from the API's emails and acknowledgement PDF; PayU returns registration-link
// payments here with ?payment=&result=.
export default async function PayRegistrationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <StudentFrame title="Registration Fee">
      <div className="mx-auto max-w-[760px]">
        <Suspense fallback={<Loading />}>
          <RegistrationPaymentPage token={token} />
        </Suspense>
      </div>
    </StudentFrame>
  );
}
