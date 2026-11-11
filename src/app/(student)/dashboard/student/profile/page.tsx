import type { Metadata } from 'next';
import ProfilePage from '@/components/student/ProfilePage';

export const metadata: Metadata = { title: { absolute: 'Profile - IIAE Student Dashboard' } };

export default function Page() {
  return <ProfilePage />;
}
