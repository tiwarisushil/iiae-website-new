import { notFound } from 'next/navigation';
import PageSubheader from '@/components/layout/PageSubheader';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { getCmsPage } from '@/lib/content';
import { renderHtml } from '@/lib/html';
import { pageMetadata } from '@/lib/seo';

// Dedicated route for the Admission CMS page. Body stays in content/pages.json.
export async function generateMetadata() {
  const page = getCmsPage('admission');
  return page ? pageMetadata('/admission', { title: page.title }) : {};
}

export default function AdmissionPage() {
  const page = getCmsPage('admission');
  if (!page) notFound();
  return (
    <div>
      <JsonLd data={breadcrumbSchema([{ name: page.title, path: '/admission' }])} />
      {page.data?.faqs && <JsonLd data={faqSchema(page.data.faqs)} />}
      <PageSubheader title={page.title} banner={page.banner} />
      {renderHtml(page.html, page.data)}
    </div>
  );
}
