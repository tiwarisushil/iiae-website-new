import type { NextConfig } from 'next';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

// Old site URLs were /<blog-slug>. The published slugs come from the CRM API.
async function blogSlugRedirects(moved: (source: string, destination: string) => { source: string; destination: string; statusCode: 301 }) {
  const redirects: { source: string; destination: string; statusCode: 301 }[] = [];
  try {
    let page = 1;
    let pages = 1;
    do {
      const res = await fetch(`${API_BASE}/posts/blog?page=${page}&limit=50&summary=1`);
      if (!res.ok) break;
      const data = (await res.json()) as { posts?: { slug?: string }[]; pages?: number };
      pages = data.pages || 1;
      for (const post of data.posts || []) {
        if (post.slug) redirects.push(moved(`/${post.slug}`, `/blog/${post.slug}`));
      }
      page += 1;
    } while (page <= pages && page <= 20);
  } catch {
    // The build still succeeds. Legacy /<slug> redirects are skipped when the API is down.
  }
  return redirects;
}

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  poweredByHeader: false,

  async redirects() {
    // Laravel used permanentRedirect(), which answers 301; keep the same status.
    const moved = (source: string, destination: string) => ({ source, destination, statusCode: 301 as const });
    return [
      // Existing redirects from routes/web.php.
      moved('/career', '/career-growth'),
      // Older exam URLs land on the AIAEE exam page.
      moved('/aiaee-exam', '/important-dates-for-aiaee'),
      ...(await blogSlugRedirects(moved)),

      // URLs the old site linked to or served as duplicates.
      moved('/index.php', '/'),
      moved('/index.php/:path*', '/:path*'),
      moved('/important-dates-for-aiaee-2025', '/important-dates-for-aiaee'),
      moved('/register.html', '/apply-online'),
      moved('/blog/page/1', '/blog'),
      moved('/newsroom/page/1', '/newsroom'),
      // Assets were linked as /public/... but the server only serves them without
      // that prefix (the root .htaccess intends this redirect).
      moved('/public/:path*', '/:path*'),

      // Student area. /student was the old site's login page.
      moved('/student', '/login'),
      moved('/student/my-profile', '/dashboard/student/profile'),
      moved('/student/update-profile', '/dashboard/student/profile'),
      moved('/student/announcement', '/dashboard/announcements'),
      moved('/student/change-password', '/login?forgot=1'),
      // Paths of the CRM's student portal (chatbot links, older emails).
      moved('/apply-now', '/apply-online'),
      { source: '/dashboard', destination: '/dashboard/student/profile', permanent: false },
      { source: '/dashboard/student', destination: '/dashboard/student/profile', permanent: false },
      { source: '/dashboard/student/status', destination: '/dashboard/student/profile', permanent: false },
      { source: '/dashboard/student/ledger', destination: '/dashboard/student/payments', permanent: false },
    ];
  },
};

export default nextConfig;
