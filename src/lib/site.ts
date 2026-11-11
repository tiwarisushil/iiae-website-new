// Site-wide settings and menus. On the Laravel site the menus were database rows
// (App\Models\Menu); these are the rendered values.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iiae.in').replace(/\/+$/, '');
export const SITE_NAME = 'IIAE – Indian Institute of Aircraft Engineering';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-KZC9FMMV';
export const GOOGLE_SITE_VERIFICATION = 'xhaC0DvMljL_MnSvftsUVZ_54kZuIHPkEAkC5v-sa-A';

export const BROCHURE_URL = '/assets/documents/E-Brochure.pdf';
export const ADDRESS =
  'Plot NO. 3&4., Near Yadav Bhavan, Bagdola Village Extension, Sector 8, Dwarka, New Delhi 110077.';
export const EMAIL = 'admission.iiae@gmail.com';

export type Phone = { tel: string; label: string };
export const HEADER_PHONES: Phone[] = [
  { tel: '+91-84484-88194', label: '+91 8448488194' },
  { tel: '+91-98702-90573', label: '+91 9870290573' },
];
export const HELPLINE_PHONES: Phone[] = [
  { tel: '+91-98702-90575', label: '+91 9870290575' },
  { tel: '+91-98702-90577', label: '+91 9870290577' },
  { tel: '+91-98702-90573', label: '+91 9870290573' },
  { tel: '+91-84484-88194', label: '+91 8448488194' },
];

// The X icon linked to "#" on the live site; add the profile URL here to show it.
export const SOCIAL_LINKS: { icon: string; href: string; label: string }[] = [
  { icon: 'fa-facebook', href: 'https://www.facebook.com/www.iiae.in', label: 'Facebook' },
  { icon: 'fa-x-twitter', href: '', label: 'X' },
  {
    icon: 'fa-linkedin',
    href: 'https://www.linkedin.com/company/indian-institute-of-aircraft-engineering-iiae-delhi',
    label: 'LinkedIn',
  },
  { icon: 'fa-instagram', href: 'https://www.instagram.com/iiaenewdelhi/', label: 'Instagram' },
];

export type MenuItem = { label: string; href: string; children?: MenuItem[] };

export const MAIN_MENU: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Degrees & Programs', href: '/degree' },
  {
    label: 'Admission',
    href: '/admission',
    children: [
      { label: 'Admission', href: '/admission' },
      { label: 'AIAEE Important Dates', href: '/important-dates-for-aiaee' },
    ],
  },
  { label: 'Research', href: '/research-at-iiae' },
  { label: 'Partnerships', href: '/partnerships' },
  {
    label: 'About Us',
    href: '/about-us',
    children: [
      { label: 'About Us IIAE', href: '/about-us' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Career', href: '/career-growth' },
      { label: 'Placements', href: '/placements' },
    ],
  },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
];

export const TOP_LINKS: (MenuItem & { icon: string })[] = [
  { label: 'Request Info', href: '/request-information', icon: 'fa-circle-info' },
  { label: 'Apply Now', href: '/apply-online', icon: 'fa-check-to-slot' },
  { label: 'Contact Us', href: '/contact-us', icon: 'fa-at' },
  { label: 'Newsroom', href: '/newsroom', icon: 'fa-newspaper' },
];

export const FOOTER_USEFUL_LINKS: MenuItem[] = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Infrastructure', href: '/infrastructure' },
  { label: 'Placement', href: '/placements' },
  { label: 'Parents Page', href: '/parents-page' },
  { label: 'Newsroom', href: '/newsroom' },
];

export const FOOTER_BOTTOM_LINKS: MenuItem[] = [
  { label: 'Libraries', href: '/iiae-libraries' },
  { label: 'Research At IIAE', href: '/research-at-iiae' },
  { label: 'Faculty Directory', href: '/faculties' },
  { label: 'Course Catalogue', href: BROCHURE_URL },
  { label: 'Career Services', href: '/career-service' },
  { label: 'Award Of C OF R', href: '/award-of-c-of-r' },
];

export const SIDEBAR_LINKS: MenuItem[] = [
  { label: 'About Us IIAE ', href: '/about-us' },
  { label: "IIAE FAQ's", href: '/faq' },
  { label: 'Career', href: '/career-growth' },
  { label: 'Placements', href: '/placements' },
  { label: 'Open Admission', href: '/admission' },
  { label: 'AIAEE Important Dates', href: '/important-dates-for-aiaee' },
  { label: 'Infrastructure', href: '/infrastructure' },
];

export const ATTEND_OPTIONS = [
  { value: 'on_campus', label: 'By visiting the Delhi Campus' },
  { value: 'online_course', label: 'Online' },
];

// Student area of this site (src/app/(student)).
export const STUDENT_LOGIN_URL = '/login';
export const STUDENT_DASHBOARD_URL = '/dashboard/student/profile';

// Active home page hero banners (Laravel picked one at random per request).
export const HERO_BANNERS = [
  '/storage/banners/43w72HEDvpJspuebHoqpykuiQSJroJNnCAE6CRFD.png',
  '/storage/banners/T9Do78WwVAF52ujqd8oNzAJg9M374XW5lr8Xgyww.png',
  '/storage/banners/khtQk6CmINmyzLtXswDVGmiHZQ6Fa5kWOEiJWoGR.jpg',
];

/** Full-frame image for the first-visit welcome popup (same as the home page default banner). */
export const WELCOME_POPUP_IMAGE = HERO_BANNERS[0];
