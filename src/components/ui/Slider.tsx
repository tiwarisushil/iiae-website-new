'use client';

import type { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import type { SliderVariant } from '@/lib/slider';

// Parameters copied from the old assets/web/js/main.js.
const VARIANTS = {
  'placements-logo': {
    spaceBetween: 10,
    speed: 1000,
    loop: true,
    autoplay: { delay: 3500 },
    navigation: true,
    breakpoints: {
      320: { slidesPerView: 2 },
      480: { slidesPerView: 3 },
      629: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
    },
  },
  'testimonial-slide': {
    spaceBetween: 20,
    speed: 1000,
    loop: true,
    autoplay: { delay: 4500 },
    breakpoints: {
      629: { slidesPerView: 1 },
      1024: { slidesPerView: 2 },
    },
  },
  'reach-slide': {
    spaceBetween: 10,
    speed: 1000,
    loop: true,
    autoplay: { delay: 3500 },
    navigation: true,
    breakpoints: {
      1024: { slidesPerView: 1 },
    },
  },
} satisfies Record<SliderVariant, SwiperOptions>;

export type Slide = { className?: string; content: ReactNode };

export default function Slider({
  variant,
  slides,
  className,
}: {
  variant: SliderVariant;
  slides: Slide[];
  /** Utilities for the slider root (Swiper adds its own `swiper` class). */
  className?: string;
}) {
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { autoplay, ...options } = VARIANTS[variant];
  return (
    <Swiper
      className={className}
      modules={[Autoplay, Navigation]}
      autoplay={reducedMotion ? false : autoplay}
      {...options}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i} className={slide.className}>
          {slide.content}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
