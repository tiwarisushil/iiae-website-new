// The faculty directory comes from the IIAE CRM API (GET /api/faculty), where admins manage
// it (CRM > Website > Faculty). The page fetches on the server with a 60-second revalidation,
// and the API also pings /api/revalidate after every change so edits show up at once.
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api').replace(/\/+$/, '');
/** Origin that serves photos uploaded through the CRM ("/uploads/..."). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const REVALIDATE_SECONDS = 60;
export const FACULTY_TAG = 'faculty';

const PLACEHOLDER = '/assets/web/images/faculty-placeholder.png';

export type FacultyMember = {
  _id?: string;
  name: string;
  post: string;
  experience: string;
  competency: string;
  image: string;
  order?: number;
};

type ApiFaculty = {
  _id?: string;
  name: string;
  post?: string;
  experience?: string;
  competency?: string;
  image?: string;
  order?: number;
};

const toMember = (member: ApiFaculty): FacultyMember => ({
  _id: member._id,
  name: member.name,
  post: member.post ?? '',
  experience: member.experience ?? '',
  competency: member.competency ?? '',
  image: member.image || '',
  order: member.order,
});

/** `undefined` when the API is unavailable, otherwise the JSON body. */
async function apiGet<T>(path: string): Promise<T | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: [FACULTY_TAG] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[faculty] ${path}: ${error instanceof Error ? error.message : String(error)}.`);
    return undefined;
  }
}

/** Published faculty in directory order. */
export async function listFaculty(): Promise<FacultyMember[]> {
  const data = await apiGet<{ faculty: ApiFaculty[] }>('/faculty');
  return (data?.faculty ?? []).map(toMember);
}

/**
 * Where a faculty photo is served from. Imported photos point at files in this site's
 * public folder ("/storage/..."); photos uploaded in the CRM live on the API ("/uploads/...").
 */
export function facultyImageUrl(image: string | null | undefined): string {
  if (!image) return PLACEHOLDER;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith('/uploads/')) return `${API_ORIGIN}${image}`;
  return image;
}
