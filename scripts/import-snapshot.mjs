#!/usr/bin/env node
/**
 * import-snapshot.mjs — turn the crawl produced by extract-content.mjs into the
 * content files this app renders (content/*.json).
 *
 *   node scripts/import-snapshot.mjs ../snapshot
 *
 * What it does to the CMS HTML (and nothing else):
 *   - re-serialises it through an HTML5 parser, which balances the stray closing
 *     tags some CMS bodies contain
 *   - strips Livewire comments
 *   - rewrites absolute site URLs (iiae.in, the old staging host, the broken
 *     /public/... prefix) to root-relative paths, and relative links to absolute
 *     paths so they work from /blog/* and /newsroom/*
 *   - repoints links that 404 today to their working destination
 *   - makes duplicate element ids unique (the /ame accordions reuse ids)
 *   - lifts the placements table into data so it can be rendered as a sortable,
 *     searchable table
 * Copy, headings and class names are left exactly as served.
 */
import { load } from 'cheerio';
import { readFile, writeFile, mkdir, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP = path.resolve(process.argv[2] || '../snapshot');
const HTML_DIR = path.join(SNAP, 'content/html');
const OUT = path.join(ROOT, 'content');
const PUBLIC = path.join(ROOT, 'public');

const SITE_HOSTS = /^https?:\/\/(?:www\.)?(?:iiae\.in|iiae\.feelhappyhours\.in)/i;

// Links that are broken on the live site, mapped to where they should go.
const LINK_FIXES = {
  'http://127.0.0.1:8003/': '/admission',
  '/important-dates-for-aiaee-2025': '/important-dates-for-aiaee',
  '/register.html': '/apply-online',
};

// Pages rendered by app/[slug] from CMS HTML (Laravel's Page component).
const CMS_PAGES = [
  'about-us', 'admission', 'ame', 'approved-by-dgca', 'award-of-c-of-r', 'career-growth',
  'career-service', 'faq', 'iiae-libraries', 'important-dates-for-aiaee', 'infrastructure',
  'parents-page', 'partnerships', 'placements', 'privacy-policy', 'research-at-iiae',
  'terms-conditions',
];

const missingAssets = new Map();

// Root-level legacy URLs that 301 (routes/web.php); links in content go straight to
// the destination. Filled in once the snapshot's blog files are known.
const LEGACY = new Map([
  ['/career', '/career-growth'],
  ['/aiaee-exam', '/important-dates-for-aiaee'],
]);

function normalizeUrl(raw) {
  if (raw == null) return raw;
  let u = raw.trim();
  if (!u || /^(#|mailto:|tel:|javascript:|data:)/i.test(u)) return u;
  if (LINK_FIXES[u]) return LINK_FIXES[u];
  if (SITE_HOSTS.test(u)) {
    u = u.replace(SITE_HOSTS, '') || '/';
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//')) {
    return u; // external
  } else if (!u.startsWith('/')) {
    u = '/' + u; // relative CMS links were written for pages at the root
  }
  u = u.replace(/^\/index\.php(?=\/|$)/, '') || '/';
  u = u.replace(/^\/public(?=\/)/, '');
  if (u.length > 1) u = u.replace(/\/+$/, '').replace(/\/+(?=[?#])/, '');
  const [pathname, rest = ''] = u.split(/(?=[?#])/);
  const fixed = LINK_FIXES[pathname] || LEGACY.get(pathname);
  return fixed ? fixed + rest : u;
}

const brokenImages = [];
async function noteAsset(url, where, el) {
  if (!url || !url.startsWith('/') || !/\.(png|jpe?g|gif|webp|svg|pdf|avif)$/i.test(url)) return;
  try {
    await access(path.join(PUBLIC, decodeURI(url)));
  } catch {
    if (!missingAssets.has(url)) missingAssets.set(url, new Set());
    missingAssets.get(url).add(where);
    if (el?.name === 'img') brokenImages.push(el);
  }
}

/** Clean a cheerio fragment in place and return its inner HTML. */
async function cleanFragment($, root, where) {
  root.contents().addBack().find('*').addBack().contents().each((_, n) => {
    if (n.type === 'comment') $(n).remove();
  });
  const pending = [];
  root.find('[href], [src], [style]').each((_, el) => {
    const $el = $(el);
    // Placeholder links: React refuses javascript: URLs, and they do nothing anyway.
    if (/^javascript:/i.test($el.attr('href') || '')) $el.removeAttr('href');
    for (const attr of ['href', 'src']) {
      const v = $el.attr(attr);
      if (v != null) {
        const n = normalizeUrl(v);
        $el.attr(attr, n);
        if (attr === 'src' || /\.(pdf|jpe?g|png)$/i.test(n)) pending.push(noteAsset(n, where, el));
      }
    }
    const style = $el.attr('style');
    if (style && style.includes('url(')) {
      $el.attr(
        'style',
        style.replace(/url\((['"]?)([^'")]+)\1\)/g, (_, q, u) => {
          const n = normalizeUrl(u);
          pending.push(noteAsset(n, where));
          return `url(${q}${n}${q})`;
        }),
      );
    }
  });
  // Inline event handlers never belong in CMS content.
  root.find('*').each((_, el) => {
    for (const name of Object.keys(el.attribs || {})) if (/^on/i.test(name)) $(el).removeAttr(name);
  });
  await Promise.all(pending);
  // An <img> whose file exists nowhere (not even on the old server) only shows a
  // broken-image icon; leave it out.
  for (const el of brokenImages.splice(0)) $(el).remove();
  return root;
}

// Ids the original stylesheet targets. Duplicates of these keep their id (as on the
// live site) so they stay styled; everything else is renamed.
const STYLED_IDS = new Set(['AIAEE-according', 'itemList', 'Photos', 'Placement', 'placements']);

/** Make ids unique inside a fragment, rewriting accordion references that point at them. */
function dedupeIds($, root) {
  const seen = new Map();
  root.find('[id]').each((_, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    const count = seen.get(id) || 0;
    seen.set(id, count + 1);
    if (count === 0) return;
    const n = count + 1;
    if (STYLED_IDS.has(id)) {
      // Bootstrap resolves data-bs-parent with querySelector, which would find the
      // first element with this id; point this accordion's items at it directly.
      if ($el.hasClass('accordion')) {
        $el.attr('data-accordion', `${id}-${n}`);
        $el.find(`[data-bs-parent="#${id}"]`).attr('data-bs-parent', `[data-accordion="${id}-${n}"]`);
      }
      return;
    }
    const next = `${id}-${n}`;
    $el.attr('id', next);
    // References live in the same accordion item (heading <-> collapse) or, for an
    // accordion container, in its descendants (data-bs-parent).
    const scope = $el.hasClass('accordion') ? $el : $el.closest('.accordion-item');
    if (!scope.length) return;
    scope.find('[data-bs-target], [aria-controls], [aria-labelledby], [data-bs-parent]').each((_, ref) => {
      const $ref = $(ref);
      if ($ref.attr('data-bs-target') === `#${id}`) $ref.attr('data-bs-target', `#${next}`);
      if ($ref.attr('aria-controls') === id) $ref.attr('aria-controls', next);
      if ($ref.attr('aria-labelledby') === id) $ref.attr('aria-labelledby', next);
      if ($ref.attr('data-bs-parent') === `#${id}`) $ref.attr('data-bs-parent', `#${next}`);
    });
  });
}

// Collapse ordinary whitespace only; non-breaking spaces are deliberate.
const text = ($el) => $el.text().replace(/[ \t\n\r\f]+/g, ' ').replace(/^[ ]+|[ ]+$/g, '');

async function loadSnapshot(file) {
  const html = await readFile(path.join(HTML_DIR, file), 'utf8');
  return load(html, null, false);
}

function serialize($, nodes) {
  return nodes
    .map((_, el) => $.html(el))
    .get()
    .join('\n')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

// ---------------------------------------------------------------- CMS pages
async function importCmsPage(slug) {
  const $ = await loadSnapshot(`${slug}.html`);
  const root = $.root().children().first();
  await cleanFragment($, root, `/${slug}`);
  dedupeIds($, root);

  const subheader = root.children('section.page-subheader').first();
  const banner = subheader.find('.page-subheader-banner').attr('style') || '';
  const bannerUrl = (banner.match(/url\((['"]?)([^'")]+)\1\)/) || [])[2] || null;
  const title = text(subheader.find('h1').first());

  const data = {};
  const table = root.find('table#Placement');
  if (table.length) {
    data.placements = table
      .find('tbody tr')
      .map((_, tr) => [$(tr).find('td').map((__, td) => text($(td))).get()])
      .get();
    data.placementColumns = table.find('thead th').map((_, th) => text($(th))).get();
    table.replaceWith('<div data-component="placements-table"></div>');
  }

  if (slug === 'faq') {
    // For FAQPage structured data; the page itself renders the HTML as served.
    data.faqs = root
      .find('.accordion-item')
      .map((_, el) => ({
        question: text($(el).find('.accordion-button')).replace(/^(?:Q\.?\s*)?\d+\s*[.:)]?\s*/i, ''),
        answer: text($(el).find('.accordion-body')),
      }))
      .get();
  }

  const body = subheader.length ? subheader.nextAll() : root.children();
  return { slug, title, banner: bannerUrl, html: serialize($, body), ...(Object.keys(data).length ? { data } : {}) };
}

// ---------------------------------------------------------------- other data
async function importHome() {
  const $ = await loadSnapshot('index.html');
  const faqs = $('.faq-section .accordion-item')
    .map((_, el) => ({
      question: text($(el).find('.accordion-button')).replace(/^Q\d+\.\s*/, ''),
      answer: $(el).find('.accordion-body').html().trim(),
    }))
    .get();
  const news = $('.latest-news .card-news')
    .map((_, el) => ({
      slug: normalizeUrl($(el).find('a').first().attr('href')).replace('/newsroom/', ''),
      excerpt: text($(el).find('.news-content p')),
    }))
    .get();
  const banner = normalizeUrl(($('section.top-banner').attr('style') || '').match(/url\((['"]?)([^'")]+)\1\)/)?.[2]);
  return { banner, faqs, newsExcerpts: Object.fromEntries(news.map((n) => [n.slug, n.excerpt])) };
}

async function importDegree() {
  const $ = await loadSnapshot('degree.html');
  const group = (sel) =>
    $(`${sel} .form-check`)
      .map((_, el) => ({ id: $(el).find('input').attr('value'), label: text($(el).find('label')) }))
      .get();
  return { degreeLevels: group('#degreeFilters'), fieldsOfStudy: group('#fieldFilters') };
}

async function importCategories(file) {
  const $ = await loadSnapshot(file);
  return $('.sidebar-nav .collapsable-nav-link li')
    .map((_, li) => text($(li)).replace(/\s*\(\d+\)$/, ''))
    .get();
}

/** Every photo on /infrastructure and /career-growth, grouped by section, for /gallery. */
async function importGallery() {
  const groups = [];
  const infra = await loadSnapshot('infrastructure.html');
  infra('[id]').each((_, el) => {
    const $el = infra(el);
    const title = text($el.children('h3').first());
    if (!title) return;
    const images = $el
      .find('img')
      .map((__, img) => normalizeUrl(infra(img).attr('src')))
      .get();
    if (images.length) groups.push({ title: title.replace(/^\d+\.\s*/, ''), anchor: `/infrastructure#${$el.attr('id')}`, images });
  });
  const career = await loadSnapshot('career-growth.html');
  const photos = career('#Photos a.lightbox')
    .map((_, a) => normalizeUrl(career(a).attr('href')))
    .get();
  if (photos.length) groups.push({ title: 'Career Growth', anchor: '/career-growth#Photos', images: photos });
  return groups;
}

async function importSeo() {
  const pages = JSON.parse(await readFile(path.join(SNAP, 'content/pages.json'), 'utf8'));
  const seo = {};
  for (const [route, p] of Object.entries(pages)) {
    if (route.startsWith('/index.php') || p.template === 'backend-app' || p.status !== 200) continue;
    // Posts and /blog have no SEO record: Laravel printed an empty title or its
    // layout fallback. Those pages generate their own metadata.
    if (!p.title || p.title === 'Air Craft - IIAE') continue;
    seo[route] = { title: p.title, description: p.description, keywords: p.keywords };
  }
  return seo;
}

// ---------------------------------------------------------------- main
async function writeJson(rel, data) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
}

const files = await readdir(HTML_DIR);
const slugsOf = (kind) =>
  files.filter((f) => f.startsWith(`${kind}__`)).map((f) => f.slice(kind.length + 2, -5));
for (const slug of slugsOf('blog')) LEGACY.set(`/${slug}`, `/blog/${slug}`);

const pages = {};
for (const slug of CMS_PAGES) pages[slug] = await importCmsPage(slug);
await writeJson('pages.json', pages);

// Blog, newsroom and faculty are managed in the CRM and served by the API.
await writeJson('home.json', await importHome());
await writeJson('degree.json', await importDegree());
await writeJson('categories.json', { blog: await importCategories('blog.html'), newsroom: await importCategories('newsroom.html') });
await writeJson('gallery.json', await importGallery());
await writeJson('seo.json', await importSeo());

console.log(`pages ${Object.keys(pages).length}`);
if (missingAssets.size) {
  console.log(`\n${missingAssets.size} referenced assets are not in public/ (images among them were dropped):`);
  for (const [u, where] of missingAssets) console.log(`  ${u}  <- ${[...where].join(', ')}`);
}
