// Fetch blog posts that exist on the live site but are not linked from nav or the
// sitemap, and save them in the same format extract-content.mjs uses.
// Usage: node scripts/fetch-extra-posts.mjs <slugs.txt> <snapshotDir>
// slugs.txt: one blog slug per line, e.g. every /blog/<slug> target in Laravel routes/web.php.
import { load } from 'cheerio';
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const [slugFile, outDir] = process.argv.slice(2);
const BASE = 'https://iiae.in';
const slugs = (await readFile(slugFile, 'utf8')).split('\n').map((s) => s.trim()).filter(Boolean);
const pagesFile = path.join(outDir, 'content/pages.json');
const pages = JSON.parse(await readFile(pagesFile, 'utf8'));
const assetsFile = path.join(outDir, 'content/assets.json');
const assets = JSON.parse(await readFile(assetsFile, 'utf8'));

function clean($, root) {
  root.find('script, noscript, style, link').remove();
  root.find('*').addBack().each((_, el) => {
    for (const name of Object.keys(el.attribs || {})) {
      if (name.startsWith('wire:') || name.startsWith('x-') || name === 'data-csrf') $(el).removeAttr(name);
    }
  });
  return root;
}

let added = 0;
for (const slug of slugs) {
  const route = `/blog/${slug}`;
  const file = path.join(outDir, 'content/html', `blog__${slug}.html`);
  try {
    await access(file);
    continue; // already captured by the main crawl
  } catch {}
  const res = await fetch(BASE + route);
  if (res.status !== 200) {
    console.log(`skip ${res.status} ${route}`);
    continue;
  }
  const $ = load(await res.text());
  const header = $('header.main-header').first();
  const wrapper = $('<div data-snapshot-root></div>');
  header.nextUntil('footer').each((_, el) => wrapper.append($(el).clone()));
  await writeFile(file, clean($, wrapper).html() || '');
  $('img[src]').each((_, el) => {
    try {
      const u = new URL($(el).attr('src'), BASE + route);
      if (u.origin === BASE) (assets[decodeURI(u.pathname)] ||= []).push(route);
    } catch {}
  });
  pages[route] = {
    route,
    status: 200,
    template: 'post',
    title: $('title').first().text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    keywords: $('meta[name="keywords"]').attr('content') || '',
    h1: $('h1').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get(),
    unlisted: true,
  };
  added++;
  console.log(`page ${route}`);
  await new Promise((r) => setTimeout(r, 250));
}
await writeFile(pagesFile, JSON.stringify(pages, null, 2));
await writeFile(assetsFile, JSON.stringify(assets, null, 2));
console.log(`added ${added}`);
