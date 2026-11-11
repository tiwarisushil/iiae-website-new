import { notFound } from 'next/navigation';
import PageSubheader from '@/components/layout/PageSubheader';
import { PostCard, RecentPosts, SidebarNav } from '@/components/layout/Sidebar';
import { categories } from '@/lib/content';
import { listPosts, pageHref, PER_PAGE, type PostKind } from '@/lib/posts';
import SiteLink from '@/components/SiteLink';

/** Laravel's bootstrap-5 pagination view, with static page URLs. */
function Pagination({ kind, page, pages, total }: { kind: PostKind; page: number; pages: number; total: number }) {
  if (pages <= 1) return null;
  const first = (page - 1) * PER_PAGE + 1;
  const last = Math.min(page * PER_PAGE, total);
  const prev =
    page > 1 ? (
      <li >
        <SiteLink className="[&:focus]:text-[#0a58ca] [&:focus]:bg-[#e9ecef] [&:focus]:z-[3] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] text-[1rem] bg-[#ffffff] block relative rounded-tl-[0.375rem] rounded-bl-[0.375rem] [border-top:1px_solid_#dee2e6] [border-right:1px_solid_#dee2e6] [border-bottom:1px_solid_#dee2e6] [border-left:1px_solid_#dee2e6] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover]:bg-[#f8f9fa] [&:hover]:z-[2] [&:hover:focus]:bg-[#e9ecef] [&:hover:focus]:z-[3] motion-reduce:[transition:none]" href={pageHref(kind, page - 1)} rel="prev" aria-label="&laquo; Previous">
          &lsaquo;
        </SiteLink>
      </li>
    ) : (
      <li className="disabled" aria-label="&laquo; Previous">
        <span className="text-[1rem] text-[rgba(33,37,41,0.75)] bg-[#e9ecef] block relative pointer-events-none rounded-tl-[0.375rem] rounded-bl-[0.375rem] [border:1px_solid_#dee2e6] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [text-decoration:none] motion-reduce:[transition:none] [&:hover]:z-[2]" aria-hidden="true">
          &lsaquo;
        </span>
      </li>
    );
  const next =
    page < pages ? (
      <li >
        <SiteLink className="[&:focus]:text-[#0a58ca] [&:focus]:bg-[#e9ecef] [&:focus]:z-[3] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] text-[1rem] bg-[#ffffff] block relative ml-[calc(-1px)] rounded-tr-[0.375rem] rounded-br-[0.375rem] [border-top:1px_solid_#dee2e6] [border-right:1px_solid_#dee2e6] [border-bottom:1px_solid_#dee2e6] [border-left:1px_solid_#dee2e6] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover]:bg-[#f8f9fa] [&:hover]:z-[2] [&:hover:focus]:bg-[#e9ecef] [&:hover:focus]:z-[3] motion-reduce:[transition:none]" href={pageHref(kind, page + 1)} rel="next" aria-label="Next &raquo;">
          &rsaquo;
        </SiteLink>
      </li>
    ) : (
      <li className="disabled" aria-label="Next &raquo;">
        <span className="text-[1rem] text-[rgba(33,37,41,0.75)] bg-[#e9ecef] block relative pointer-events-none ml-[calc(-1px)] rounded-tr-[0.375rem] rounded-br-[0.375rem] [border:1px_solid_#dee2e6] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [text-decoration:none] motion-reduce:[transition:none] [&:hover]:z-[2]" aria-hidden="true">
          &rsaquo;
        </span>
      </li>
    );
  return (
    <nav className="flex! justify-between!" aria-label="Pagination">
      <div className="hidden! justify-between! [flex:1_1_auto]! max-sm:flex!">
        <ul className="flex">
          {prev}
          {next}
        </ul>
      </div>
      <div className="flex! max-sm:hidden! sm:justify-between! sm:items-center! sm:[flex:1_1_auto]!">
        <div>
          <p className="text-[0.875em] text-[rgba(33,37,41,0.75)]!">
            Showing <span className="font-semibold!">{first}</span> to <span className="font-semibold!">{last}</span> of{' '}
            <span className="font-semibold!">{total}</span> results
          </p>
        </div>
        <div>
          <ul className="flex">
            {prev}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
              n === page ? (
                <li  aria-current="page" key={n}>
                  <span className="text-[1rem] text-[#ffffff] bg-[#0d6efd] block relative z-[3] ml-[calc(-1px)] [border:1px_solid_#0d6efd] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [text-decoration:none] motion-reduce:[transition:none]">{n}</span>
                </li>
              ) : (
                <li  key={n}>
                  <SiteLink className="[&:focus]:text-[#0a58ca] [&:focus]:bg-[#e9ecef] [&:focus]:z-[3] [&:focus]:[box-shadow:rgba(13,110,253,0.25)_0px_0px_0px_0.25rem] text-[1rem] bg-[#ffffff] block relative ml-[calc(-1px)] [border-top:1px_solid_#dee2e6] [border-right:1px_solid_#dee2e6] [border-bottom:1px_solid_#dee2e6] [border-left:1px_solid_#dee2e6] p-[0.375rem_0.75rem] [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out] [&:hover]:bg-[#f8f9fa] [&:hover]:z-[2] [&:hover:focus]:bg-[#e9ecef] [&:hover:focus]:z-[3] motion-reduce:[transition:none]" href={pageHref(kind, n)}>
                    {n}
                  </SiteLink>
                </li>
              ),
            )}
            {next}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/** /blog and /newsroom: two-per-row cards, categories, Apply Now, recent posts. */
export default async function PostListing({ kind, page = 1 }: { kind: PostKind; page?: number }) {
  const { posts: visible, total, pages } = await listPosts(kind, page);
  // Page numbers past the end (e.g. after posts were deleted) are 404s.
  if (page > pages) notFound();
  const recent = visible.slice(0, 5);
  return (
    <div>
      <PageSubheader title={kind === 'blog' ? 'Blogs' : 'Newsroom'} />
      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-[75%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-md:w-full md:max-lg:w-[66.6667%] sm:grow-0 sm:basis-auto">
              <div>
                <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
                  {visible.map((post) => (
                    <div className="w-[50%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-sm:w-full sm:grow-0 sm:basis-auto" key={post.slug}>
                      <PostCard kind={kind} post={post} />
                    </div>
                  ))}
                  <div className="mt-0 mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] shrink-0">
                    <div className="w-full max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 md:grow-0 md:basis-auto">
                      <Pagination kind={kind} page={page} pages={pages} total={total} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-md:w-full md:max-lg:w-[33.3333%] md:grow-0 md:basis-auto">
              <SidebarNav
                title="Categories"
                links={categories[kind].map((name) => ({ label: `${name} (${total})`, href: '' }))}
              >
                <RecentPosts kind={kind} posts={recent} />
              </SidebarNav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
