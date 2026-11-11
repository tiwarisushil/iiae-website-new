import PostListing from '@/components/posts/PostListing';
import { pageMetadata } from '@/lib/seo';

// Posts come from the CRM API; the page is re-rendered in the background at most this often
// (and at once when the CRM calls /api/revalidate).
export const revalidate = 60;

// Newsroom posts come from the CRM API (see src/lib/posts.ts).
export async function generateMetadata() {
  return pageMetadata('/newsroom');
}

export default function Page() {
  return <PostListing kind="newsroom" />;
}
