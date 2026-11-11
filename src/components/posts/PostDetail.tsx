import { PostSubheader } from '@/components/layout/PageSubheader';
import { RecentPosts, SidebarNav } from '@/components/layout/Sidebar';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/JsonLd';
import { getPost, listAllPosts, postImageUrl, recentPosts, requirePost, type PostKind } from '@/lib/posts';
import { renderHtml } from '@/lib/html';
import { pageMetadata } from '@/lib/seo';

const SECTION = { blog: 'Blogs', newsroom: 'Newsroom' } as const;

const description = (excerpt: string) => {
  const text = excerpt.replace(/\s+/g, ' ').replace(/\.\.\.$/, '').trim();
  return text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, '')}...` : text;
};

/** Slugs to pre-render at build time; other slugs render on their first request. */
export const postParams = async (kind: PostKind) => (await listAllPosts(kind)).map((p) => ({ slug: p.slug }));

export async function postMetadata(kind: PostKind, slug: string) {
  const post = await getPost(kind, slug);
  if (!post) return {};
  return pageMetadata(`/${kind}/${slug}`, {
    title: `${post.title} | IIAE Delhi`,
    description: description(post.excerpt),
    image: post.image ? postImageUrl(post.image) : null,
    type: 'article',
    publishedTime: post.date,
  });
}

/** A single blog or newsroom post with the useful-links / recent-posts sidebar. */
export default async function PostDetail({ kind, slug }: { kind: PostKind; slug: string }) {
  const [post, recent] = await Promise.all([requirePost(kind, slug), recentPosts(kind)]);
  const path = `/${kind}/${slug}`;
  const image = postImageUrl(post.image);
  return (
    <div>
      <JsonLd
        data={[
          articleSchema({ title: post.title, path, image: post.image ? image : null, date: post.date, description: description(post.excerpt) }),
          breadcrumbSchema([
            { name: SECTION[kind], path: `/${kind}` },
            { name: post.title, path },
          ]),
        ]}
      />
      <PostSubheader title={post.title} date={post.date} banner={kind === 'blog'} />
      <section className="pt-[80px] max-md:pt-[50px] pb-[80px]! max-md:pb-[50px]!">
        <div className="w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] ml-auto mr-auto max-w-[1200px]">
          <div className="mt-[calc(-1_*_0)] mr-[calc(-0.75rem)] ml-[calc(-0.75rem)] flex-wrap flex">
            <div className="w-[75%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-md:w-full md:max-lg:w-[66.6667%] sm:grow-0 sm:basis-auto">
              <div >
                <div className="text-center! pb-[30px]! max-md:pb-[20px]!">
                  <img src={image} alt={post.title} />
                </div>
                {renderHtml(post.html)}
              </div>
            </div>
            <div className="w-[25%] max-w-full pr-[calc(0.75rem)] pl-[calc(0.75rem)] mt-0 shrink-0 max-md:w-full md:max-lg:w-[33.3333%] md:grow-0 md:basis-auto">
              <SidebarNav>
                <RecentPosts kind={kind} posts={recent} />
              </SidebarNav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
