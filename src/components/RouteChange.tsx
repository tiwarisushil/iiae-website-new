'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Runs after each client-side navigation:
 *   - tells Google Tag Manager about the new page (event "virtual_pageview"), since
 *     its page-load triggers only fire on the first, full page load
 *   - closes the mobile menu and any open dropdown, which Bootstrap would leave open
 */
export default function RouteChange() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    (window.dataLayer ||= []).push({
      event: 'virtual_pageview',
      page_path: pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });

    // the header's collapsible menu, found through its toggle button
    document.querySelectorAll<HTMLElement>('header [data-bs-toggle="collapse"][data-bs-target]').forEach((toggler) => {
      const menu = document.querySelector(toggler.dataset.bsTarget!);
      if (!menu?.classList.contains('show')) return;
      menu.classList.remove('show');
      toggler.classList.add('collapsed');
      toggler.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.dropdown-menu.show').forEach((menu) => {
      menu.classList.remove('show');
      menu.removeAttribute('data-bs-popper');
      const toggle = menu.parentElement?.querySelector('[data-bs-toggle="dropdown"]');
      toggle?.classList.remove('show');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  }, [pathname]);

  return null;
}
