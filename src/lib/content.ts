// Typed access to the content files produced by scripts/import-snapshot.mjs.
import pagesJson from '@content/pages.json';
import homeJson from '@content/home.json';
import degreeJson from '@content/degree.json';
import categoriesJson from '@content/categories.json';
import seoJson from '@content/seo.json';
import galleryJson from '@content/gallery.json';

export type CmsPage = {
  slug: string;
  title: string;
  banner: string | null;
  html: string;
  data?: { placements?: string[][]; placementColumns?: string[]; faqs?: { question: string; answer: string }[] };
};

export type Post = {
  slug: string;
  title: string;
  date: string | null;
  image: string | null;
  excerpt: string;
  /** Shown on the live listing page; the rest were only reachable by URL. */
  listed: boolean;
  html: string;
};

export type PostKind = 'blog' | 'newsroom';

export type Seo = { title: string; description: string; keywords: string };

const pages = pagesJson as Record<string, CmsPage>;

// The imported dates HTML is unused: /important-dates-for-aiaee is the AIAEE exam page.
const RETIRED_CMS_SLUGS = new Set(['important-dates-for-aiaee']);
// These slugs still live in pages.json, but a dedicated route file owns the URL.
const OWN_ROUTE_SLUGS = new Set(['admission']);
export const cmsSlugs = () =>
  Object.keys(pages).filter((slug) => !RETIRED_CMS_SLUGS.has(slug) && !OWN_ROUTE_SLUGS.has(slug));
export const getCmsPage = (slug: string): CmsPage | undefined => (RETIRED_CMS_SLUGS.has(slug) ? undefined : pages[slug]);

export const home = homeJson;
export const gallery = galleryJson as { title: string; anchor: string; images: string[] }[];
export const degree = degreeJson;
/** Category names shown in the listing sidebars (one category per section today). */
export const categories = categoriesJson as Record<PostKind, string[]>;

export const seoFor = (route: string): Seo | undefined => (seoJson as Record<string, Seo>)[route];

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** PHP date('F j, Y'), e.g. "October 1, 2025". */
export const formatDate = (iso: string | null) => (iso ? DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`)) : '');
