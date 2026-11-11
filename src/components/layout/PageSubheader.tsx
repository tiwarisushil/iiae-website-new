import { formatDate } from '@/lib/content';
import SiteLink from '@/components/SiteLink';

const DEFAULT_BANNER = '/assets/web/images/bg-research.jpg';

/** Inner page banner with H1 and breadcrumbs (every page except home and /apply-online). */
export default function PageSubheader({
  title,
  banner = DEFAULT_BANNER,
  centerAlign = false,
}: {
  title: string;
  banner?: string | null;
  /** Contact pages also vertically centre the row. */
  centerAlign?: boolean;
}) {
  return (
    <section className="bg-[#f7f7f7] [background-image:url(/assets/web/images/airplan03.png)] [background-position-x:50%] [background-position-y:center] [background-repeat:no-repeat] [background-size:20%_auto]">
      <div className="pt-[80px] max-md:p-[40px_0px_50px]! pb-[80px]!" style={{ background: `url('${banner || DEFAULT_BANNER}')` }}>
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className={`mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex content-center! ${centerAlign ? 'items-center!' : ''}`}>
            <div className="w-[66.6667%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 gap-[40px] max-sm:w-full flex! items-center! sm:grow-0 sm:basis-auto">
              <h1 className="text-[#ffffff]">{title}</h1>
              <span className="text-[18px] font-semibold leading-[1] block text-primary!">
                TRANSFORMING AMBITIONS
                <br /> INTO REALITY
              </span>
            </div>
            <div className="w-[33.3333%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto">
              <nav aria-label="Breadcrumb">
                <ol className="text-[0.875em] flex-wrap [justify-content:end] m-[20px_0px_0px] gap-[7px_12px] max-md:mt-[10px] max-md:justify-start flex! items-center!">
                  <li className="text-[#ffffff]">
                    <SiteLink className="text-[#ffffff]" href="/" title="Go back to Home">
                      Home
                    </SiteLink>
                  </li>
                  <li className="text-[#ffffff] [&::before]:[content:'/'] [&::before]:text-[#ffffff]" aria-hidden="true"></li>
                  <li className="text-[#ffffff]" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Centred banner on blog and newsroom posts: title, author and date. */
export function PostSubheader({ title, date, banner }: { title: string; date: string | null; banner: boolean }) {
  // Blog posts have the image banner with white text; newsroom posts a plain band.
  const onImage = banner ? 'text-[#ffffff]' : undefined;
  const inner = (
    <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
      <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex content-center!">
        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 text-center! sm:grow-0 sm:basis-auto">
          <h1 className={onImage}>{title}</h1>
        </div>
        <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 sm:grow-0 sm:basis-auto">
          <nav aria-label="Breadcrumb">
            <ol className="text-[0.875em] flex-wrap justify-center m-[10px_0px_0px] gap-[7px_12px] flex! items-center! max-md:justify-start">
              <li className={onImage}>
                <a className="text-inherit">
                  <i className="fa-solid fa-user"></i> By Team IIAE
                </a>
              </li>
              <li className={onImage}> | </li>
              <li className={onImage}>
                <a className="text-inherit">
                  <i className="fa-solid fa-calendar"></i> <time dateTime={date ?? undefined}>{formatDate(date)}</time>
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
  // Blog posts use the image banner; newsroom posts a plain padded band.
  return banner ? (
    <section className="[background:#f5f2f2]">
      <div className="pt-[80px] max-md:p-[40px_0px_50px]! pb-[80px]!" style={{ background: `url('${DEFAULT_BANNER}')` }}>
        {inner}
      </div>
    </section>
  ) : (
    <section className="pt-[60px] pb-[60px] [background:#f5f2f2] max-md:pt-[40px] max-md:pb-[40px]">{inner}</section>
  );
}
