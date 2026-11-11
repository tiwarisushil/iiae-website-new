'use client';

import Link from 'next/link';
import { STUDENT_DASHBOARD_URL, STUDENT_LOGIN_URL } from '@/lib/site';
import { useSession } from '@/lib/student/session';

/** Header button: "Student Login", or "My Dashboard" once a student is signed in. */
export default function StudentLoginLink({ className }: { className: string }) {
  const signedIn = useSession()?.user.role === 'student';
  return (
    <Link className={className} href={signedIn ? STUDENT_DASHBOARD_URL : STUDENT_LOGIN_URL}>
      <i className="fa-solid fa-user"></i> {signedIn ? 'My Dashboard' : 'Student Login'}
    </Link>
  );
}
