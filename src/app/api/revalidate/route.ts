import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { FACULTY_TAG } from '@/lib/faculty';
import { POSTS_TAG } from '@/lib/posts';
import { SEO_TAG } from '@/lib/seo';

// Called by the CRM API after a blog / newsroom post, a faculty member or a page's SEO entry
// is created, edited or deleted, so the change is visible immediately instead of after the pages' timed
// revalidation. Shared secret: REVALIDATE_SECRET here, WEBSITE_REVALIDATE_SECRET in the API's
// .env. Without it the endpoint is off and pages still refresh on their own within a minute.
//
//   POST /api/revalidate   header x-revalidate-secret: <secret>   body {"kind":"blog","slugs":["..."]}
//   POST /api/revalidate   header x-revalidate-secret: <secret>   body {"kind":"faculty"}
//   POST /api/revalidate   header x-revalidate-secret: <secret>   body {"kind":"seo"}

const KINDS = ['blog', 'newsroom'] as const;
type Kind = (typeof KINDS)[number];

const safeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret) return NextResponse.json({ message: 'Revalidation is not configured' }, { status: 503 });
  const given = request.headers.get('x-revalidate-secret') ?? '';
  if (!safeEqual(given, secret)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { kind?: unknown; slugs?: unknown };

  // The faculty directory is one page, separate from blog and newsroom.
  if (body.kind === 'faculty') {
    revalidateTag(FACULTY_TAG, 'max');
    revalidatePath('/faculties');
    return NextResponse.json({ revalidated: true, kinds: ['faculty'], at: new Date().toISOString() });
  }

  // SEO entries feed the metadata of every page, so the whole site is re-rendered.
  if (body.kind === 'seo') {
    revalidateTag(SEO_TAG, 'max');
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, kinds: ['seo'], at: new Date().toISOString() });
  }

  const kinds: Kind[] = KINDS.includes(body.kind as Kind) ? [body.kind as Kind] : [...KINDS];
  const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === 'string' && /^[a-z0-9-]+$/.test(s)) : [];

  // Fetched data first (the posts tag covers every /api/posts request), then the rendered pages.
  revalidateTag(POSTS_TAG, 'max');
  const paths: string[] = ['/', '/sitemap.xml'];
  for (const kind of kinds) {
    paths.push(`/${kind}`, ...slugs.map((slug) => `/${kind}/${slug}`));
    revalidatePath(`/${kind}/page/[page]`, 'page');
    revalidatePath(`/${kind}/[slug]`, 'page');
  }
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: true, kinds, slugs, at: new Date().toISOString() });
}
