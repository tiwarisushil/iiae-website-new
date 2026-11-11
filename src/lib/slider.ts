// Slider class names from the old main.js; shared by the server-side HTML renderer
// and the client Slider component.
export const SLIDER_VARIANTS = ['placements-logo', 'testimonial-slide', 'reach-slide'] as const;
export type SliderVariant = (typeof SLIDER_VARIANTS)[number];
export const isSliderVariant = (v: string): v is SliderVariant => (SLIDER_VARIANTS as readonly string[]).includes(v);
