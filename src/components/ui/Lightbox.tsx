'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lightbox for `[data-gallery] a[data-lightbox]` links (the old main.js called
 * baguetteBox for this but never loaded the library). Listens at the document
 * level so it works for gallery markup coming from CMS HTML.
 */
export default function Lightbox() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [index, setIndex] = useState(-1);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index >= 0;

  const close = useCallback(() => {
    setIndex(-1);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (i < 0 ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element).closest?.('[data-gallery] a[data-lightbox]') as HTMLAnchorElement | null;
      if (!link) return;
      const gallery = link.closest('[data-gallery]');
      const links = Array.from(gallery?.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]') ?? []);
      e.preventDefault();
      opener.current = link;
      setImages(links.map((a) => ({ src: a.href, alt: a.querySelector('img')?.alt ?? '' })));
      setIndex(links.indexOf(link));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close, step]);

  if (!open) return null;
  const image = images[index];
  return (
    <div
      ref={dialog}
      className="z-[2000] justify-center items-center flex fixed [inset:0px] [background:rgba(0,14,46,0.92)] [outline:none]"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${images.length}`}
      tabIndex={-1}
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <img className="max-w-[min(92vw,_1400px)] object-contain max-h-[86vh] [box-shadow:rgba(0,0,0,0.5)_0px_10px_40px] rounded-[10px]" src={image.src} alt={image.alt} />
      <button type="button" className="text-[22px] text-[#ffffff] w-[48px] h-[48px] absolute top-[20px] right-[20px] [border-width:0px] rounded-[100px] [background:rgba(255,255,255,0.15)] [transition:background_0.2s] [&:focus-visible]:bg-primary [&:hover]:bg-primary" aria-label="Close" onClick={close}>
        <i className="fa-solid fa-xmark" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className="text-[22px] text-[#ffffff] w-[48px] h-[48px] absolute top-[calc(50%_-_24px)] left-[20px] [border-width:0px] rounded-[100px] [background:rgba(255,255,255,0.15)] [transition:background_0.2s] [&:focus-visible]:bg-primary [&:hover]:bg-primary" aria-label="Previous image" onClick={() => step(-1)}>
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button type="button" className="text-[22px] text-[#ffffff] w-[48px] h-[48px] absolute top-[calc(50%_-_24px)] right-[20px] [border-width:0px] rounded-[100px] [background:rgba(255,255,255,0.15)] [transition:background_0.2s] [&:focus-visible]:bg-primary [&:hover]:bg-primary" aria-label="Next image" onClick={() => step(1)}>
            <i className="fa-solid fa-chevron-right" />
          </button>
          <div className="text-center text-[#ffffff] text-[15px] absolute bottom-[20px] left-0 right-0">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
