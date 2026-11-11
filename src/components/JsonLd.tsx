import { absoluteUrl } from '@/lib/seo';
import { EMAIL, HELPLINE_PHONES, SITE_URL, SOCIAL_LINKS } from '@/lib/site';

type Schema = Record<string, unknown>;

export default function JsonLd({ data }: { data: Schema | Schema[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export const organizationSchema = (): Schema => ({
  '@context': 'https://schema.org',
  '@type': 'CollegeOrUniversity',
  name: 'Indian Institute of Aircraft Engineering',
  alternateName: 'IIAE Delhi',
  url: SITE_URL,
  logo: absoluteUrl('/assets/web/images/IIAE-LOGO.png'),
  email: EMAIL,
  telephone: HELPLINE_PHONES[0].tel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot No. 3 & 4, Near Yadav Bhavan, Bagdola Village Extension, Sector 8, Dwarka',
    addressLocality: 'New Delhi',
    postalCode: '110077',
    addressCountry: 'IN',
  },
  sameAs: SOCIAL_LINKS.map((s) => s.href).filter(Boolean),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): Schema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]): Schema => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const articleSchema = (a: {
  title: string;
  path: string;
  image: string | null;
  date: string | null;
  description: string;
}): Schema => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  mainEntityOfPage: absoluteUrl(a.path),
  ...(a.image ? { image: [absoluteUrl(a.image)] } : {}),
  ...(a.date ? { datePublished: a.date } : {}),
  author: { '@type': 'Organization', name: 'Team IIAE' },
  publisher: {
    '@type': 'Organization',
    name: 'Indian Institute of Aircraft Engineering',
    logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/web/images/IIAE-LOGO.png') },
  },
});
