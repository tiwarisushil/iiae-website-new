import PostDetail, { postMetadata, postParams } from '@/components/posts/PostDetail';

export const revalidate = 60;
// Posts published after the build are rendered on their first request; unknown slugs are 404s.
export const dynamicParams = true;

export function generateStaticParams() {
  return postParams('newsroom');
}

export async function generateMetadata({ params }: PageProps<'/newsroom/[slug]'>) {
  return postMetadata('newsroom', (await params).slug);
}

export default async function Page({ params }: PageProps<'/newsroom/[slug]'>) {
  const { slug } = await params;
  return <PostDetail kind="newsroom" slug={slug} />;
}
