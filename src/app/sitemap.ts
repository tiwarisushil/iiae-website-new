import type { MetadataRoute } from 'next';
import { cmsSlugs } from '@/lib/content';
import { listAllPosts, PER_PAGE, type PostKind } from '@/lib/posts';
import { BROCHURE_URL, SITE_URL } from '@/lib/site';

// Posts are read from the CRM API; the sitemap is regenerated with the same cadence as the pages.
export const revalidate = 60;

const STATIC_ROUTES = [
  '/',
  '/degree',
  '/contact-us',
  '/request-information',
  '/apply-online',
  '/admission',
  '/important-dates-for-aiaee',
  '/faculties',
  '/gallery',
  '/blog',
  '/newsroom',
];

// The PDFs were listed in the old sitemap; keep them indexable.
const DOCUMENTS = [
  BROCHURE_URL,
  '/admin/wp-content/uploads/2025/08/Chemistry-Syllabus-AIAEE__2024-25.pdf',
  '/admin/wp-content/uploads/2025/08/Physics-Syllabus-AIAEE-_2024-25-2.pdf',
  '/admin/wp-content/uploads/2025/08/Maths-Syllabus-AIAEE_2024-25.pdf',
  '/admin/wp-content/uploads/2025/08/DGCACAR-147B12.pdf',
  '/admin/wp-content/uploads/2025/08/DGCACAR-147BV12.pdf',
  '/admin/wp-content/uploads/2025/08/eGCA-IIAE.pdf',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
  const posts = async (kind: PostKind) => {
    const all = await listAllPosts(kind);
    const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    return [
      ...Array.from({ length: pages - 1 }, (_, i) => ({ url: url(`/${kind}/page/${i + 2}`) })),
      ...all.map((p) => ({
        url: url(`/${kind}/${p.slug}`),
        ...(p.date ? { lastModified: p.date } : {}),
      })),
    ];
  };
  const [blog, newsroom] = await Promise.all([posts('blog'), posts('newsroom')]);
  return [
    ...STATIC_ROUTES.map((path) => ({ url: url(path), priority: path === '/' ? 1 : 0.8 })),
    ...cmsSlugs().map((slug) => ({ url: url(`/${slug}`), priority: 0.8 })),
    ...blog,
    ...newsroom,
    ...DOCUMENTS.map((path) => ({ url: url(path) })),
  ];
}
