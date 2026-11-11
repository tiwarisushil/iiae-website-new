import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegistrationForm from '@/components/student/RegistrationForm';
import StudentFrame from '@/components/student/StudentFrame';
import { Loading } from '@/components/student/ui';

export const metadata: Metadata = { title: { absolute: 'Student Registration - IIAE' } };

// The link in the sign-up flow, the dashboard and the API's reminder emails.
export default async function RegisterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <StudentFrame title="Student Registration">
      <Suspense fallback={<Loading />}>
        <RegistrationForm token={token} />
      </Suspense>
    </StudentFrame>
  );
}
