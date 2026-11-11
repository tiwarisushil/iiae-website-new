import type { Metadata } from 'next';
import ResultsPage from '@/components/student/ResultsPage';

export const metadata: Metadata = { title: { absolute: 'Exam Results - IIAE Student Dashboard' } };

export default function Page() {
  return <ResultsPage />;
}
