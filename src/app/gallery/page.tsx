import PageSubheader from '@/components/layout/PageSubheader';
import { gallery } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import SiteLink from '@/components/SiteLink';

// New page: the "See more Gallery" buttons on /infrastructure pointed at /gallery,
// which did not exist. It collects the campus photos already published on
// /infrastructure and /career-growth, using the career-growth gallery markup.
export async function generateMetadata() {
  return pageMetadata('/gallery', {
    title: 'IIAE Gallery – Aircraft, Labs, Workshops & Campus | IIAE Delhi',
    description:
      'Photos of the IIAE Delhi training aircraft, workshops, laboratories, classrooms and technical library used for DGCA-approved AME training.',
  });
}

export default function GalleryPage() {
  return (
    <div>
      <PageSubheader title="Gallery" />
      {gallery.map((group) => (
        <section key={group.anchor} className="pt-[60px] max-md:pt-[40px]" data-gallery="">
          <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
            <h3>
              <SiteLink href={group.anchor}>{group.title}</SiteLink>
            </h3>
            <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
              {group.images.map((src) => (
                <div className="w-[25%] max-w-full mt-0 shrink-0 p-[5px] max-sm:w-full sm:max-lg:w-[50%] sm:grow-0 sm:basis-auto" key={src}>
                  <a className="cursor-zoom-in" data-lightbox="" href={src}>
                    <img className="h-auto rounded-[10px]" src={src} alt={group.title} loading="lazy" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <div className="pb-[80px]! max-md:pb-[50px]!"></div>
    </div>
  );
}
