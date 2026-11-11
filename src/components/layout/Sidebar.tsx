import type { ReactNode } from 'react';
import { formatDate, type Post, type PostKind } from '@/lib/content';
import { postImageUrl } from '@/lib/posts';
import { SIDEBAR_LINKS, type MenuItem } from '@/lib/site';
import SiteLink from '@/components/SiteLink';

export function SidebarNav({
  title = 'IIAE Useful Links',
  links = SIDEBAR_LINKS,
  children,
}: {
  title?: string;
  links?: MenuItem[];
  children?: ReactNode;
}) {
  return (
    <div className="w-full h-full pb-[40px] top-0 left-0 max-md:mt-[40px]">
      <div className="sticky top-[20px]">
        <div className="[border:1px_solid_#eeeeee] rounded-[10px] [background:#f9f9f9] overflow-hidden">
          <div className="text-[#000000] text-[20px] font-bold block [border-bottom:1px_solid_#eeeeee] p-[10px_20px] [background:#eeeeee]">{title}</div>
          <div >
            <ul className="mb-0 mr-0 ml-0">
              {links.map((l) => (
                <li className="leading-[1] block [border-bottom:1px_solid_#eeeeee] p-[15px_20px] [&:last-child]:[border-width:medium] [&:last-child]:[border-style:none] [&:last-child]:[border-color:currentcolor] [&:last-child]:[border-image:none]" key={`${l.href}${l.label}`}>{l.href ? <SiteLink className="text-[#444444] text-[15px] block [&:hover]:text-primary" href={l.href}>{l.label}</SiteLink> : <a className="text-inherit text-[15px] block">{l.label}</a>}</li>
              ))}
            </ul>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Apply Now button and the "Recent Blogs" / "Recent News" thumbnail list. */
export function RecentPosts({ kind, posts }: { kind: PostKind; posts: Post[] }) {
  return (
    <>
      <SiteLink href="/apply-online" className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary mt-[1.5rem]! [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
        Apply Now <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
      </SiteLink>
      <div className="mt-[1.5rem]!">
        <div className="relative [&::after]:[content:''] [&::after]:w-full [&::after]:h-[1px] [&::after]:mt-0 [&::after]:block [&::after]:absolute [&::after]:top-[14px] [&::after]:[background:#d7dce3]">
          <h2 className="text-[#000000] mb-0 text-[22px] z-[9] bg-[#ffffff] mr-0 ml-0 pb-[20px] pr-[25px] inline-block relative">{kind === 'blog' ? 'Recent Blogs' : 'Recent News'}</h2>
        </div>
        <ul className="mb-0 mr-0 ml-0">
          {posts.map((post) => {
            const href = `/${kind}/${post.slug}`;
            return (
              <li className="mb-[20px] flex [list-style:none]" key={post.slug}>
                <div >
                  <SiteLink href={href}>
                    <img className="object-cover w-[100px] h-[80px] mr-[15px] rounded-[10px]" src={postImageUrl(post.image)} alt={post.title} loading="lazy" />
                  </SiteLink>
                </div>
                <div className="w-[78%] pl-[15px]">
                  <div >
                    <SiteLink className="text-[#999999] text-[12px] leading-[1]" href={href}>{formatDate(post.date)}</SiteLink>
                  </div>
                  <h3 className="leading-[1.1] text-[18px] [text-decoration:none]">
                    <SiteLink className="text-[#111111] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] [display:-webkit-box] overflow-hidden" href={href}>{post.title}</SiteLink>
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// The card is styled differently in the home page's "Campus News" row and on the
// blog / newsroom listings.
const CARD = {
  home: {
    card: 'mt-[20px] rounded-[15px] [background:#faf9f4] overflow-hidden',
    image: 'object-cover w-full h-[230px] md:max-tab:h-[140px]',
    body: 'p-[25px] md:max-tab:p-[15px]',
  },
  blog: {
    card: '[border:1px_solid_#eeeeee] rounded-[15px] m-[0px_0px_25px] [background:#faf9f4] overflow-hidden',
    image: 'object-cover w-full h-[260px]',
    body: 'p-[30px]',
  },
  newsroom: {
    card: '[border:1px_solid_#eeeeee] rounded-[15px] m-[0px_0px_25px] [background:#faf9f4] overflow-hidden',
    image: 'object-cover w-full h-[300px]',
    body: 'p-[30px]',
  },
};

/** News/blog card used on listings and the home page. */
export function PostCard({
  kind,
  post,
  excerpt,
  context = kind,
}: {
  kind: PostKind;
  post: Post;
  excerpt?: string;
  context?: keyof typeof CARD;
}) {
  const href = `/${kind}/${post.slug}`;
  const c = CARD[context];
  return (
    <div className={c.card}>
      <SiteLink href={href}>
        <img className={c.image} src={postImageUrl(post.image)} alt={post.title} loading="lazy" />
      </SiteLink>
      <div className={c.body}>
        <h4 className="mb-[15px] leading-[1.3] text-[19px] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] mr-0 ml-0 [display:-webkit-box] overflow-hidden md:max-tab:leading-[1.1] md:max-tab:text-[18px] md:max-tab:[-webkit-line-clamp:3]">{post.title}</h4>
        <p className="text-[15px] leading-[1.4]">{excerpt ?? post.excerpt}</p>
        <SiteLink href={href} className="text-[#ffffff] font-trip text-[15px] font-normal leading-[1.5] text-center align-middle cursor-pointer select-none bg-secondary inline-flex items-center [border-width:medium] rounded-[15px] p-[12px_30px] gap-[5px] [transition:0.3s] [&:active]:bg-[#565e64] [&:active]:[border-color:#51585e] [&:hover]:bg-primary [&:hover:active]:bg-primary [&:focus-visible]:[box-shadow:rgba(130,138,145,0.5)_0px_0px_0px_0.25rem]">
          Learn More <i className="fa-solid fa-arrow-right leading-[15px] text-footer w-[18px] h-[18px] ml-[2px] text-[10px] [transform:rotate(320deg)] rounded-[100px] p-[3px] [background:#ffffff]"></i>
        </SiteLink>
      </div>
    </div>
  );
}
