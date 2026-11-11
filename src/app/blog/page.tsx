import PostListing from '@/components/posts/PostListing';
import { pageMetadata } from '@/lib/seo';

// Posts come from the CRM API; the page is re-rendered in the background at most this often
// (and at once when the CRM calls /api/revalidate).
export const revalidate = 60;

// The old /blog had no SEO record (it printed the layout's "Air Craft - IIAE").
export async function generateMetadata() {
  return pageMetadata('/blog', {
    title: 'AME Blog – Aircraft Maintenance Engineering Guides | IIAE Delhi',
    description:
      'Articles from IIAE Delhi on Aircraft Maintenance Engineering (AME): course details, eligibility, admissions, licensing, careers and the aviation industry.',
  });
}

export default function Page() {
  return <PostListing kind="blog" />;
}
