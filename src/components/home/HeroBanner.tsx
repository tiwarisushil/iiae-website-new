'use client';

import { useLayoutEffect } from 'react';
import { InlineScript } from '@/components/InlineScript';

const pick = (banners: string[]) =>
  `(function(b){var u="url('"+b[Math.floor(Math.random()*b.length)]+"')";document.querySelectorAll('[data-hero-banner]').forEach(function(e){e.style.backgroundImage=u;e.dataset.heroPicked='1'})})(${JSON.stringify(banners)})`;

/**
 * Random hero banner (the old site picked one of the active banners per request).
 * Render it right after the hero. On a full page load the inline script picks the banner
 * while the HTML is parsed, before the first paint; after client-side navigation that
 * script does not run, so the layout effect does the same before the first paint.
 */
export default function HeroBanner({ banners }: { banners: string[] }) {
  useLayoutEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-hero-banner]');
    if (!els.length || [...els].some((e) => e.dataset.heroPicked)) return;
    const url = `url('${banners[Math.floor(Math.random() * banners.length)]}')`;
    els.forEach((e) => {
      e.style.backgroundImage = url;
      e.dataset.heroPicked = '1';
    });
  }, [banners]);
  return <InlineScript html={pick(banners)} />;
}
