import { notFound } from 'next/navigation';
import PostListing from '@/components/posts/PostListing';
import { listPosts } from '@/lib/posts';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { pages } = await listPosts('newsroom', 1);
  return Array.from({ length: pages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<'/newsroom/page/[page]'>) {
  const { page } = await params;
  const base = await pageMetadata('/newsroom');
  return {
    ...base,
    title: { absolute: `${(base.title as { absolute: string }).absolute} – Page ${page}` },
    alternates: { canonical: `/newsroom/page/${page}` },
  };
}

export default async function Page({ params }: PageProps<'/newsroom/page/[page]'>) {
  const page = Number((await params).page);
  // /blog/page/1 redirects to /blog (next.config.ts); pages past the end 404 inside PostListing.
  if (!Number.isInteger(page) || page < 2) notFound();
  return <PostListing kind="newsroom" page={page} />;
}
