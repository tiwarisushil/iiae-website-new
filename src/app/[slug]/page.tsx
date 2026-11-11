import { notFound } from 'next/navigation';
import PageSubheader from '@/components/layout/PageSubheader';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { cmsSlugs, getCmsPage } from '@/lib/content';
import { renderHtml } from '@/lib/html';
import { pageMetadata } from '@/lib/seo';

// Pages whose body is CMS HTML (Laravel's catch-all /{slug} Page component).
export const dynamicParams = false;

export function generateStaticParams() {
  return cmsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  return page ? pageMetadata(`/${slug}`, { title: page.title }) : {};
}

export default async function CmsPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) notFound();
  return (
    <div>
      <JsonLd data={breadcrumbSchema([{ name: page.title, path: `/${slug}` }])} />
      {page.data?.faqs && <JsonLd data={faqSchema(page.data.faqs)} />}
      <PageSubheader title={page.title} banner={page.banner} />
      {renderHtml(page.html, page.data)}
    </div>
  );
}
