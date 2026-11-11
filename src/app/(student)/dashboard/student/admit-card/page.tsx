import type { Metadata } from 'next';
import AdmitCardPage from '@/components/student/AdmitCardPage';

export const metadata: Metadata = { title: { absolute: 'Admit Card - IIAE Student Dashboard' } };

export default function Page() {
  return <AdmitCardPage />;
}
