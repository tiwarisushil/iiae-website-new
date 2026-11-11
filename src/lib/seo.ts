import type { Metadata } from 'next';
import { seoFor } from './content';
import { API_BASE_URL } from './posts';
import { SITE_NAME, SITE_URL } from './site';

// Admins can set a page's title and meta description in the CRM (Website > SEO). Those
// entries come from GET /api/seo with the same 60-second revalidation as posts, and the API
// pings /api/revalidate after every change. They win over the defaults below; an empty field
// (or the API being down) leaves the default in place.
export const SEO_TAG = 'seo';
const REVALIDATE_SECONDS = 60;

type SeoOverride = { title?: string; description?: string };

/** Every CRM entry keyed by route; empty when the API is unavailable. One request per render. */
async function seoOverrides(): Promise<Record<string, SeoOverride>> {
  try {
    const res = await fetch(`${API_BASE_URL}/seo`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: [SEO_TAG] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { entries?: Record<string, SeoOverride> };
    return data.entries ?? {};
  } catch (error) {
    console.warn(`[seo] /seo: ${error instanceof Error ? error.message : String(error)}.`);
    return {};
  }
}

type Options = {
  /** Used when the route has no SEO record (posts, new pages). */
  title?: string;
  description?: string;
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
};

/**
 * Title and description: the CRM entry for the route, else the live site's records
 * (content/seo.json), else the page's own options. Keywords come from the records.
 * Canonical is self-referencing (the old site pointed every page at the home page),
 * and Open Graph / Twitter tags are added.
 */
export async function pageMetadata(route: string, options: Options = {}): Promise<Metadata> {
  const seo = seoFor(route);
  const override = (await seoOverrides())[route];
  const title = override?.title || seo?.title || options.title || SITE_NAME;
  const description = override?.description || seo?.description || options.description || undefined;
  const images = options.image ? [{ url: options.image }] : [{ url: '/assets/web/images/IIAE-LOGO.png' }];
  return {
    title: { absolute: title },
    description,
    keywords: seo?.keywords || undefined,
    alternates: { canonical: route },
    openGraph: {
      type: options.type ?? 'website',
      url: route,
      siteName: SITE_NAME,
      title,
      description,
      images,
      locale: 'en_IN',
      ...(options.type === 'article' && options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export const absoluteUrl = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);
