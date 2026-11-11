# IIAE website (Next.js)

The public site for iiae.in, migrated from the Laravel/Livewire app in `../code`.
It keeps the same URLs, markup, CSS, copy, images and documents. It does not depend on
Laravel: form submissions go to the IIAE CRM API (Node.js, `/Users/azhar/Desktop/iiae/Nodejs`),
and the student login, exam registration and student dashboard are pages of this site that
use the same API (see [Student area](#student-area)).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Node 20.9+ is required (Next.js 16).

## Environment

| Variable | Needed | What it does |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | production, **at build time** | The CRM API, e.g. `https://api.iiae.in/api`. Default `http://localhost:5001/api` (the API's local port). |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin, default `https://iiae.in`. |
| `NEXT_PUBLIC_GTM_ID` | optional | Google Tag Manager container, default `GTM-KZC9FMMV`. Set to an empty string to disable it (e.g. on staging). |
| `REVALIDATE_SECRET` | optional, server-side | Lets the CRM API refresh blog / newsroom pages the moment a post is saved (`POST /api/revalidate`). Set the same value as `WEBSITE_REVALIDATE_SECRET` in the API's `.env`. Without it pages still refresh within a minute. |

`NEXT_PUBLIC_*` values are compiled into the browser code, so set them before `npm run build`.
See `.env.example`.

## How it is put together

- **Styling is Tailwind CSS v4.** Every element is styled with utility classes in the markup
  (JSX and the CMS HTML in `content/`). `src/app/globals.css` only sets Tailwind up: the theme
  (the site's breakpoints `xs` 481, `sm` 576, `md` 768, `lg` 992, `tab` 1150, `xl` 1200,
  `2xl` 1400px; the Trip Sans font names; brand colours `primary`, `secondary`, `heading`, `text`,
  `footer`), the fonts and keyframes, and an `@layer base` with element-level defaults (the
  old Bootstrap reboot and the site's tag rules). Font Awesome and Swiper keep their own
  library stylesheets, in a `vendor` layer below the utilities.
  The utilities were generated from the old Bootstrap + site CSS by compiling the cascade
  for every element, and checked against the old build by comparing the computed style of
  every element at every breakpoint, in hover/focus/active states and after interactions.
  Hence the exact arbitrary values (`p-[13px_30px]`, `max-md:text-[25px]`). Some patterns:
  - `[&:hover]:` rather than `hover:`. Tailwind's `hover:` only applies on devices with a
    mouse, while the old CSS also applied hover styles after a tap.
  - `[&.collapsed]:`, `[&.show]:`, `group-[.show]/…:` style the classes Bootstrap's
    JavaScript toggles (`collapse`, `show`, `collapsed`). Those classes, and `navbar`,
    `navbar-nav`, `dropdown-menu` and `dropdown-item`, stay in the markup because the
    JavaScript looks for them; they have no CSS of their own.
  - `[revert-layer]` values mean "as the browser default", where the old CSS set nothing.
- `public/`: original images, fonts and PDFs **at their original URL paths**
  (`/assets/web/...`, `/assets/documents/...`, `/storage/{banners,blogs,news,faculty}/...`,
  `/admin/wp-content/uploads/...`).
- `content/*.json`: page bodies, faculty, SEO records and so on, generated from a
  crawl of the live site by `scripts/import-snapshot.mjs` (see below). CMS pages (`/about-us`,
  `/ame`, `/faq`, ...) are rendered from their stored HTML through `src/lib/html.tsx`, which
  swaps in React components for the Swiper sliders and the placements table.
- **Blog and newsroom posts come from the CRM API** (`GET /api/posts/...`), where admins
  manage them under Website > Blog Posts / Newsroom (see `Nodejs/docs/POSTS.md`).
  `src/lib/posts.ts` fetches them on the server; `/blog`, `/blog/[slug]`, `/blog/page/[n]`,
  the newsroom equivalents, the home page's "Campus News" and the sitemap are prerendered at
  build time and re-rendered in the background at most once a minute (ISR, `revalidate = 60`).
  New posts render on their first request. The API also calls `POST /api/revalidate`
  (`src/app/api/revalidate/route.ts`, guarded by `REVALIDATE_SECRET`) after each change so
  edits appear immediately. Blog, newsroom and faculty are not stored in JSON; the site
  reads them from the API. Legacy `/<slug>` → `/blog/<slug>` redirects in `next.config.ts`
  use the published blog slugs from that API. Post images are either `/storage/...`
  files in `public/` (imported posts) or `/uploads/posts/...` on the API (uploaded in the CRM).
- `src/app/`: one route per page type. `[slug]` covers the CMS pages (unknown slugs
  return 404), including `/admission`. `/important-dates-for-aiaee` is the AIAEE
  exam page (`src/components/admission/`), the same page the CRM shows on its public home
  (`Reactjs/src/pages/ExamHomePage.jsx`); update dates, fees and FAQs in
  `src/components/admission/data.ts` and keep the two in step.
- Behaviour from the old `main.js` is reimplemented without jQuery: `swiper/react` sliders
  with the same settings, the plane parallax, Bootstrap's own JS for the navbar, dropdowns and
  accordions, a DataTables-compatible placements table, and a gallery lightbox.
- Navigation is client-side (SPA). Internal links go through `src/components/SiteLink.tsx`
  (and `<Link>` for links inside CMS HTML, in `src/lib/html.tsx`). Links to files (PDFs,
  images), other sites, new tabs and Bootstrap toggles
  stay normal links. `src/components/RouteChange.tsx` runs on every route change: it closes
  the mobile menu and dropdowns and pushes a `virtual_pageview` event to the GTM dataLayer.
  **Google Tag Manager:** page-load triggers only fire on the first page of a visit. Add a
  Custom Event trigger on `virtual_pageview` (or a History Change trigger) to the page-view
  tags, and fire conversion tags on the form events (`enquiry_form_submit`,
  `newsletter_subscribe`, `apply_online_submit`), since `/thank-you` is now reached
  client-side.

## Updating content

Content was taken from the live site because the database was not available. To refresh it:

```bash
# from the folder that contains extract-content.mjs
node extract-content.mjs --base https://iiae.in --out ./snapshot
node iiaewebsite/scripts/fetch-extra-posts.mjs <blog-slugs.txt> ./snapshot   # posts not linked anywhere
cd iiaewebsite && node scripts/import-snapshot.mjs ../snapshot
```

The importer balances unclosed tags in CMS HTML, rewrites absolute and `/public/...` URLs to
root-relative ones, points links that 404 today at their working destination, resolves legacy
redirects, makes duplicate accordion ids unique, and lists any referenced file missing from
`public/`.

Hand-maintained values (menus, phone numbers, address, social links, hero banners) are in
`src/lib/site.ts`.

Note: a fresh import brings the old Bootstrap/site class names with it, and those have no CSS
any more. New or edited CMS content should be written with Tailwind utilities, copying the
classes of an existing element of the same kind.

## Forms

The forms validate in the browser with the old site's rules and messages (`src/lib/forms.ts`),
then post directly from the browser to the CRM API (`src/lib/api.ts`). Posting from the browser
keeps the API's per-visitor rate limits working; the API has CORS enabled and validates again.

| Form | CRM API endpoint | Stored as |
|---|---|---|
| "Tell Us About Yourself" (home, `/contact-us`, `/request-information`) | `POST /api/website/enquiry` | `WebsiteLead` with the message, counselling preference (`on_campus` / `online_course`) and the page it came from; appears in the CRM's Website inbox |
| Footer newsletter | `POST /api/newsletters/subscribe` | `Newsletter` (subscribing twice counts as subscribed) |
| Apply Online | `POST /api/auth/register` | Student `User` + CRM `Lead` + `WebsiteLead`; the student is signed in and taken to the registration form (`/register/<token>`), or to the dashboard when registration is closed |

`/api/website/enquiry` was added to the CRM API for this site (`src/routes/websiteRoutes.js`,
with tests in `tests/website/enquiry.test.js`). Errors from the API are shown under the
matching field. A hidden honeypot field turns away simple bots. Each successful submission
pushes a `dataLayer` event (`enquiry_form_submit`, `newsletter_subscribe`,
`apply_online_submit`) and then navigates to `/thank-you` (Apply Online: to the registration form).

## Student area

Students sign in, register for the entrance exam (AIAEE) and use their dashboard on this site.
Everything goes to the CRM API from the browser with the student's token (a JWT from
`POST /api/auth/login`, kept in `localStorage` under the CRM portal's keys `iiae_token` and
`iiae_user`). These pages are not indexed and are disallowed in `robots.txt`. The code is in
`src/app/(student)/`, `src/components/student/` and `src/lib/student/`.

| Page | What it does | API |
|---|---|---|
| `/login` | Sign in (students only; staff accounts are refused), `?returnUrl=/path` (same-site paths only), forgot / reset password by emailed OTP (`?forgot=1`) | `/auth/login`, `/auth/forgot-password`, `/auth/reset-password` |
| `/apply-online` | Create the account, then continue to the registration form | `/auth/register`, `/registrations/continue` |
| `/register/<token>` | The registration form in 4 steps (personal, education, photo and signature, review). Each step is saved as the student continues and the form resumes where it was left. After submitting: acknowledgement PDF and the fee payment | `/registrations/form/<token>[/step/<n>]` |
| `/pay/registration/<token>` | Pay the registration fee without signing in (linked from the API's emails and acknowledgement); PayU returns here | `/online-payments/registration/<token>[/orders]` |
| `/dashboard/student/profile` | Registration record, "finish your registration", fee due with Pay button, edit profile (photo, signature, address, Class XII, ...) | `/dashboard`, `/registrations/continue`, `PUT /registrations/me` |
| `/dashboard/student/payments` | Fees due (PayU), payment history with invoices and status checks; PayU returns signed-in students here | `/online-payments/payables`, `/mine`, `/orders`, `/<id>?sync=true` |
| `/dashboard/student/admit-card` | Hall ticket, printed from the browser (only the ticket is printed) | `/exams/admit-card/me`, `/settings` |
| `/dashboard/student/results` | Published exam results | `/exams`, `/settings` |
| `/dashboard/announcements` | Notices for students | `/announcements` |
| `/payment/<reference>` | Status of a PayU payment link sent by the institute | `/online-payments/public/<reference>` |

PayU checkout is a real form POST to PayU with the fields the API signs; after payment PayU
posts back to the API, which redirects to the return page with `?payment=&result=`, shown as
a banner and then removed from the address. Uploaded files (photos, PDFs, invoices) are
loaded from the API's origin (`NEXT_PUBLIC_API_BASE_URL` without `/api`).

The header's "Student Login" button becomes "My Dashboard" when a student is signed in. Old
and CRM-portal URLs redirect: `/student` → `/login`, `/student/my-profile` → profile,
`/student/announcement` → announcements, `/apply-now` → `/apply-online`, `/dashboard` →
profile.

## Deploying

Every page is pre-rendered at build time, and the blog / newsroom pages (plus the home page
and sitemap) are re-rendered in the background as posts change, so the site needs a Node
host (`next start`) or a platform that supports ISR such as Vercel; a plain static export
would freeze the posts at build time. Set `NEXT_PUBLIC_API_BASE_URL` **before building**
(the build reads posts, faculty and legacy blog redirects from that API),
and make sure the CRM API accepts requests from the site's origin (it currently allows all
origins). The student pages under `/register/`, `/pay/registration/` and `/payment/` are
rendered on request (they take a token from the URL).

**CRM API setting:** set `FRONTEND_URL` in the API's `.env` to this site's origin (for
example `https://iiae.in`). The API builds links with it: PayU returns payers to
`<FRONTEND_URL>/dashboard/student/payments` and `/pay/registration/<token>`, and its emails
link to `/register/<token>` and `/pay/registration/<token>`. The login session is kept in
the browser per origin, so PayU must return students to the same site they signed in on.
Payments already started keep the return address they were created with.

## Changes from the live site

Fixed deliberately:

- Every page's canonical pointed at the home page; canonicals are now self-referencing.
- Posts had empty titles and descriptions; they are now generated from the post. `/blog`
  has a real title and description.
- All three newsroom posts showed the same H1; each shows its own title.
- Unknown post slugs returned 500; they now return 404. A branded 404 page was added.
- `robots.txt` was added. The sitemap is generated, and the old `/crm` login page was removed from it.
- Open Graph, Twitter cards and JSON-LD (`CollegeOrUniversity`, `BreadcrumbList`, `FAQPage`,
  `Article`) were added.
- Broken links: the Admission menu pointed at `127.0.0.1`, the Important Dates tile at a 404,
  the `/ame` Apply buttons at `/register.html`, and footer links broke on post pages. All now
  point at working pages.
- Content images and PDFs linked as `/public/...` (all 36 infrastructure photos, the DGCA
  approval scans, the E-Brochure) did not load. They are served from their working paths, and
  `/public/*` redirects there.
- `/blog` listed 7 of the 49 published posts; it lists all of them, 10 per page.
- New `/gallery` page for the four "See more Gallery" buttons (it was a 404).
- The career-growth gallery lightbox, which never loaded, now works.
- Accordions on `/ame` shared ids and interfered with each other; they now work independently.
- The X (Twitter) icon linked to `#`. It is hidden until a profile URL is added in `site.ts`.

Matched to the live site on purpose:

- **Fonts.** The CSS names Trip Sans everywhere, but on the live server only
  `trip-sans-bold.otf` loads; `trip-sans.otf` and `trip-sans-medium.otf` return 404, so most
  text renders in the browser's default font (Times) while the bold display text (home hero,
  registration heading and badges, timeline years) is Trip Sans Bold. The new site does the
  same: `src/app/globals.css` loads only the bold face. To use Trip Sans throughout, add:

  ```css
  @font-face { font-family: trip-sans; src: url('/assets/web/fonts/trip-sans.otf'); }
  @font-face { font-family: trip-sans-medium; src: url('/assets/web/fonts/trip-sans-medium.otf'); }
  ```

Still open (needs the site owner):

- `/degree` shows no programmes (the same as live); add them in `src/app/degree/page.tsx`.
- `/parents-page` says only "Coming Soon" (the same as live).
- Confirm that the Trip Sans font licence covers this site (if Trip Sans is turned back on).
