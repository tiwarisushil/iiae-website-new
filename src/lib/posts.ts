// Blog and newsroom posts come from the IIAE CRM API (GET /api/posts/...), where admins
// manage them (CRM > Website > Blog / Newsroom). Pages fetch on the server with a 60-second
// revalidation, and the API also pings /api/revalidate after every change so edits show up
// at once.
import { notFound } from 'next/navigation';
import { type Post, type PostKind } from './content';

export type { Post, PostKind } from './content';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api').replace(/\/+$/, '');
/** Origin that serves files uploaded through the CRM ("/uploads/..."). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const PER_PAGE = 10;
/** Seconds a fetched page may be served before it is re-fetched in the background. */
export const REVALIDATE_SECONDS = 60;
export const POSTS_TAG = 'posts';

const NO_IMAGE = '/assets/web/images/image-not-available.png';

export type PostList = { posts: Post[]; total: number; page: number; pages: number };

type ApiPost = {
  slug: string;
  title: string;
  date?: string | null;
  image?: string | null;
  excerpt?: string | null;
  html?: string | null;
};
type ApiList = { posts: ApiPost[]; total: number; page: number; pages: number; perPage: number };

const toPost = (p: ApiPost): Post => ({
  slug: p.slug,
  title: p.title,
  date: p.date ?? null,
  image: p.image || null,
  excerpt: p.excerpt ?? '',
  listed: true,
  html: p.html ?? '',
});

/**
 * `undefined` when the API is unavailable (network error, 5xx), `null` for a 404,
 * otherwise the JSON body.
 */
async function apiGet<T>(path: string): Promise<T | null | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: [POSTS_TAG] },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[posts] ${path}: ${error instanceof Error ? error.message : String(error)}.`);
    return undefined;
  }
}

const emptyList = (page: number): PostList => ({ posts: [], total: 0, page, pages: 1 });

/** One page of published posts, newest first, without bodies. */
export async function listPosts(kind: PostKind, page = 1): Promise<PostList> {
  const data = await apiGet<ApiList>(`/posts/${kind}?page=${page}&limit=${PER_PAGE}&summary=1`);
  if (!data) return emptyList(page);
  return { posts: data.posts.map(toPost), total: data.total, page: data.page, pages: Math.max(1, data.pages) };
}

/** Every published post (slug, title, date, image, excerpt), for the sitemap and static params. */
export async function listAllPosts(kind: PostKind): Promise<Post[]> {
  const first = await apiGet<ApiList>(`/posts/${kind}?page=1&limit=50&summary=1`);
  if (!first) return [];
  const posts = [...first.posts];
  for (let page = 2; page <= first.pages; page += 1) {
    const next = await apiGet<ApiList>(`/posts/${kind}?page=${page}&limit=50&summary=1`);
    if (!next) break;
    posts.push(...next.posts);
  }
  return posts.map(toPost);
}

/** A published post with its body, or null when there is none. */
export async function getPost(kind: PostKind, slug: string): Promise<Post | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const data = await apiGet<ApiPost>(`/posts/${kind}/${slug}`);
  return data ? toPost(data) : null;
}

/** The post, or a 404 page. */
export async function requirePost(kind: PostKind, slug: string): Promise<Post> {
  const post = await getPost(kind, slug);
  if (!post) notFound();
  return post;
}

/** The newest posts for the sidebar. */
export async function recentPosts(kind: PostKind, count = 5): Promise<Post[]> {
  return (await listPosts(kind, 1)).posts.slice(0, count);
}

export const pageHref = (kind: PostKind, page: number) => (page <= 1 ? `/${kind}` : `/${kind}/page/${page}`);

/**
 * Where a post image is served from. Imported posts point at files in this site's
 * public folder ("/storage/..."); images uploaded in the CRM live on the API ("/uploads/...").
 */
export function postImageUrl(image: string | null | undefined): string {
  if (!image) return NO_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith('/uploads/')) return `${API_ORIGIN}${image}`;
  return image;
}
