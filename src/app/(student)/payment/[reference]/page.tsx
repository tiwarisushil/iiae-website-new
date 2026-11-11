import type { Metadata } from 'next';
import PaymentLinkStatus from '@/components/student/PaymentLinkStatus';
import StudentFrame from '@/components/student/StudentFrame';

export const metadata: Metadata = { title: { absolute: 'Payment Status - IIAE' } };

export default async function PaymentPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return (
    <StudentFrame title="Payment Status">
      <PaymentLinkStatus reference={decodeURIComponent(reference)} />
    </StudentFrame>
  );
}
