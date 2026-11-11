import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/student/toast';

// Student login, registration, payments and dashboard. Personal pages: not indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// The student area uses Inter for legibility (forms, tables, figures); the rest of the
// site keeps its own fonts. Headings inherit it instead of the site's heading font.
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.className} text-[15px] leading-[1.6] text-[#0f172a] [-webkit-font-smoothing:auto] [-moz-osx-font-smoothing:auto] [&_h1]:[font-family:inherit] [&_h2]:[font-family:inherit] [&_h3]:[font-family:inherit] [&_h4]:[font-family:inherit] [&_h5]:[font-family:inherit]`}
    >
      {children}
      <Toaster />
    </div>
  );
}
