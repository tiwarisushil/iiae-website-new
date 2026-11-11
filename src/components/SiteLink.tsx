import Link from 'next/link';
import type { ComponentProps } from 'react';

// Static files (PDFs, images, documents) need a normal page load.
const FULL_LOAD = /^\/(assets|storage|admin|public|wp-content)(\/|$)|\.[a-z0-9]{2,5}$/i;

/** True for pages of this app, which are navigated client-side. */
export function isAppRoute(href: string | undefined): href is string {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return false;
  return !FULL_LOAD.test(href.split(/[?#]/)[0]);
}

/**
 * Internal links navigate client-side (next/link); links to files, other sites (such as
 * the student portal), new tabs and Bootstrap toggles stay plain anchors.
 */
export default function SiteLink({ href, ...rest }: ComponentProps<'a'> & { href: string }) {
  const toggle = (rest as Record<string, unknown>)['data-bs-toggle'];
  if (isAppRoute(href) && !rest.target && !rest.download && !toggle) return <Link href={href} {...rest} />;
  return <a href={href} {...rest} />;
}
