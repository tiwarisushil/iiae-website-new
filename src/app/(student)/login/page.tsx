import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/student/LoginForm';
import { Loading } from '@/components/student/ui';

export const metadata: Metadata = {
  title: { absolute: 'Student Login - IIAE' },
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return (
    <section className="bg-[#f8f8fb] px-[16px] py-[80px] max-md:py-[40px]">
      <h1 className="sr-only">Student Login</h1>
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
