import type { Metadata } from 'next';
import AnnouncementsPage from '@/components/student/AnnouncementsPage';

export const metadata: Metadata = { title: { absolute: 'Announcements - IIAE Student Dashboard' } };

export default function Page() {
  return <AnnouncementsPage />;
}
