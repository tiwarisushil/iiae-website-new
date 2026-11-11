import PostDetail, { postMetadata, postParams } from '@/components/posts/PostDetail';

export const revalidate = 60;
// Posts published after the build are rendered on their first request; unknown slugs are 404s.
export const dynamicParams = true;

export function generateStaticParams() {
  return postParams('blog');
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  return postMetadata('blog', (await params).slug);
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  return <PostDetail kind="blog" slug={slug} />;
}
