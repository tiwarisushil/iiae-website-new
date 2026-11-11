import parse, { attributesToProps, domToReact, Element, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser';
import Link from 'next/link';
import { isAppRoute } from '@/components/SiteLink';
import type { ReactNode } from 'react';
import Slider, { type Slide } from '@/components/ui/Slider';
import { isSliderVariant } from './slider';
import PlacementsTable from '@/components/ui/PlacementsTable';
import type { CmsPage } from './content';

const classes = (el: Element) => (el.attribs.class ?? '').split(/\s+/).filter(Boolean);

/**
 * Render CMS HTML (page bodies, posts) as React, markup unchanged, swapping in
 * components where the old site relied on jQuery plugins:
 *   div[data-slider=<variant>]         -> <Slider> (swiper/react)
 *   div[data-component=placements-table] -> <PlacementsTable> (was DataTables)
 *   a[href=/internal]                  -> <Link> (client-side navigation)
 */
export function renderHtml(html: string, data: CmsPage['data'] = {}): ReactNode {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return undefined;

      // Internal links in CMS content navigate client-side, like the rest of the site.
      const a = node.attribs;
      if (node.name === 'a' && isAppRoute(a.href) && !a.target && !('data-lightbox' in a) && !a['data-bs-toggle']) {
        return (
          <Link {...(attributesToProps(a) as Record<string, string>)} href={a.href}>
            {domToReact(node.children as DOMNode[], options)}
          </Link>
        );
      }

      if (node.attribs['data-component'] === 'placements-table' && data.placements) {
        return <PlacementsTable columns={data.placementColumns ?? []} rows={data.placements} />;
      }

      const variant = node.attribs['data-slider'];
      if (variant && isSliderVariant(variant)) {
        const wrapper = node.children.find((c): c is Element => c instanceof Element && classes(c).includes('swiper-wrapper'));
        const slides: Slide[] = (wrapper?.children ?? [])
          .filter((c): c is Element => c instanceof Element && classes(c).includes('swiper-slide'))
          .map((slide) => ({
            className: classes(slide).filter((c) => c !== 'swiper-slide').join(' '),
            content: domToReact(slide.children as DOMNode[], options),
          }));
        const className = classes(node).filter((c) => c !== 'swiper').join(' ');
        return <Slider variant={variant} className={className} slides={slides} />;
      }
      return undefined;
    },
  };
  return parse(html, options);
}
