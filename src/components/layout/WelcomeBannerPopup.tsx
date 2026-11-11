'use client';

import SiteLink from '@/components/SiteLink';
import { WELCOME_POPUP_IMAGE } from '@/lib/site';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'iiae_welcome_banner_v1';
const SHOW_DELAY_MS = 3000;

const TRUST_POINTS = ['DGCA approved, Govt. of India', 'CAR-147 (Basic) compliant', 'Approved since 2002'];

const EXCLUDED_PATH_PREFIXES = ['/apply-online', '/login', '/register', '/dashboard', '/pay', '/payment'];

function isExcludedPath(pathname: string) {
  const path = (pathname || '/').split('?')[0] || '/';
  return EXCLUDED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function hasSeenWelcomeBanner() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

function markWelcomeBannerSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* storage unavailable */
  }
}

export default function WelcomeBannerPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    markWelcomeBannerSeen();
  }, []);

  useEffect(() => {
    if (isExcludedPath(pathname) || hasSeenWelcomeBanner()) return undefined;

    const timer = window.setTimeout(() => {
      if (isExcludedPath(pathname) || hasSeenWelcomeBanner()) return;
      markWelcomeBannerSeen();
      setOpen(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1060] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onClick={close}
    >
      <div
        className="absolute inset-0 bg-[rgba(4,17,40,0.62)] backdrop-blur-sm motion-reduce:backdrop-blur-none animate-[iiae-welcome-fade_0.35s_ease-out]"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-banner-title"
        aria-describedby="welcome-banner-desc"
        className="relative z-[1] flex max-h-[calc(100dvh-2rem)] w-full max-w-[24rem] flex-col overflow-hidden rounded-[18px] bg-white font-sans shadow-[0_32px_64px_-12px_rgba(4,31,69,0.45)] ring-1 ring-black/5 animate-[iiae-welcome-rise_0.45s_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none sm:max-h-[calc(100dvh-3rem)] md:max-w-[50rem] md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close welcome message"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#475569] shadow-[0_2px_8px_rgba(4,31,69,0.18)] transition hover:bg-white hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:right-3 md:top-3 md:bg-transparent md:shadow-none md:hover:bg-[#f1f5f9]"
        >
          <i className="fa-solid fa-xmark text-[15px]" aria-hidden="true" />
        </button>

        {/* Brand panel — the photo's subject sits on the left, so anchor the crop there and keep text clear of the face */}
        <div className="relative h-[160px] w-full shrink-0 overflow-hidden bg-heading md:h-auto md:min-h-[27rem] md:w-[42%]">
          <Image
            src={WELCOME_POPUP_IMAGE}
            alt="IIAE student in uniform holding a model aircraft"
            fill
            priority
            sizes="(max-width: 767px) 24rem, 360px"
            className="object-cover object-[0%_center] md:object-[8%_center]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(4,31,69,0.95)_0%,rgba(4,31,69,0.7)_40%,transparent_70%)] md:bg-[linear-gradient(to_top,rgba(4,31,69,0.95)_0%,rgba(4,31,69,0.3)_45%,rgba(4,31,69,0.55)_100%)]"
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex flex-col items-end justify-end gap-2 p-3.5 text-right md:items-start md:justify-between md:p-5 md:text-left">
            <img
              src="/assets/web/images/logo.png"
              alt="IIAE — approved by DGCA, Ministry of Civil Aviation, Govt. of India"
              className="h-8 w-auto md:h-11"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-primary md:text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                Admissions open 2027
              </span>
              <p className="m-0 mt-1.5 font-trip-bold text-[17px] leading-[1.1] text-white md:text-[24px]">AME&nbsp;Programme</p>
              <p className="m-0 mt-1 hidden text-[12px] leading-[1.4] text-white/75 md:block">
                Indian Institute of Aircraft Engineering, Delhi
              </p>
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 md:justify-center md:px-8 md:py-7">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7618] md:text-[10.5px]">AIAEE entrance exam</p>
          <h2
            id="welcome-banner-title"
            className="mb-1.5 mt-1 font-trip-bold text-[19px] leading-[1.25] text-heading md:mb-2 md:pr-6 md:text-[24px]"
          >
            Begin your aviation career with IIAE
          </h2>
          <p id="welcome-banner-desc" className="m-0 text-[13px] leading-[1.5] text-[#475569] md:text-[13.5px]">
            AIAEE registration is open for Class XII pass-out and appearing students.
          </p>

          <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0 md:mt-4">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-1 rounded-full border border-[#d6eadc] bg-[#f1f9f3] px-2 py-0.5 text-[11px] font-medium text-[#166534] md:text-[11.5px]"
              >
                <i className="fa-solid fa-circle-check text-[10px]" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>

          <p className="m-0 mt-3 flex items-center gap-2 rounded-[10px] border border-[#f0e6b8] bg-[#fdfaf0] px-3 py-2 text-[12px] leading-[1.4] text-[#334155] md:mt-4 md:text-[12.5px]">
            <i className="fa-solid fa-award text-[14px] text-[#8a7618]" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-heading">Up to 100% scholarship</strong> for top AIAEE rankers
            </span>
          </p>

          <div className="mt-4 flex gap-2 md:mt-5">
            <SiteLink
              href="/apply-online"
              onClick={close}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-secondary px-3 py-2.5 text-center text-[13.5px] font-semibold text-white no-underline shadow-[0_8px_20px_-8px_rgba(255,42,0,0.55)] transition hover:brightness-[1.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:text-[14px]"
            >
              Apply online
              <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
            </SiteLink>
            <SiteLink
              href="/important-dates-for-aiaee"
              onClick={close}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#cbd5e1] bg-white px-3 py-2.5 text-center text-[13.5px] font-semibold text-heading no-underline transition hover:border-heading hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading md:text-[14px]"
            >
              <i className="fa-regular fa-calendar text-[12px]" aria-hidden="true" />
              Exam dates
            </SiteLink>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="m-0 flex items-center gap-1.5 text-[11px] text-[#64748b]">
              <i className="fa-solid fa-lock text-[10px]" aria-hidden="true" />
              Secure online registration
            </p>
            <button
              type="button"
              onClick={close}
              className="border-0 bg-transparent p-0 text-[12px] font-medium text-[#475569] underline-offset-2 hover:text-heading hover:underline"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
