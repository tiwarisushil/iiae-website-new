'use client';

import { useEffect } from 'react';

/**
 * The flying-plane effect from the old main.js: as the page scrolls past
 * the facilities section the plane moves right and up; past the registration section
 * the second plane moves right.
 */
export default function PlaneParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      document.querySelectorAll<HTMLElement>('[data-parallax-section="facilities"]').forEach((section) => {
        const d = scrollY - (section.getBoundingClientRect().top + scrollY);
        section.querySelectorAll<HTMLElement>('[data-parallax="plane"]').forEach((plane) => {
          plane.style.left = `${d}px`;
          plane.style.top = `${-d * 1.5}px`;
        });
      });
      document.querySelectorAll<HTMLElement>('[data-parallax-section="registration"]').forEach((section) => {
        const d = scrollY - (section.getBoundingClientRect().top + scrollY);
        section.querySelectorAll<HTMLElement>('[data-parallax="plane2"]').forEach((plane) => {
          plane.style.left = `${d}px`;
        });
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
    };
  }, []);
  return null;
}
