import { Inter } from 'next/font/google';
import AdmissionPage from '@/components/admission/AdmissionPage';
import { FAQS } from '@/components/admission/data';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';

// AIAEE exam page (the same page as the CRM's public home). The imported dates HTML stays unused.
export async function generateMetadata() {
  return pageMetadata('/important-dates-for-aiaee', { title: 'AIAEE 2027 Exam | IIAE Delhi' });
}

// Same typeface as the CRM page and this site's student area.
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function Page() {
  return (
    <div className={`${inter.className} [-webkit-font-smoothing:antialiased] [&_h1]:[font-family:inherit] [&_h2]:[font-family:inherit] [&_h3]:[font-family:inherit]`}>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: 'AIAEE 2027 Exam', path: '/important-dates-for-aiaee' }]),
          faqSchema(FAQS.map(([question, answer]) => ({ question, answer }))),
        ]}
      />
      <AdmissionPage />
    </div>
  );
}
