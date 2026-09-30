# Faiz Firstian Nugroho — Portfolio

The existing Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 portfolio, now with **Sanity CMS**. The original responsive UI, project cards, case-study layout, navigation, and styling are retained. Studio lives at `/studio`.

## Updating the existing portfolio

See [UPGRADE.md](./UPGRADE.md) for the identity-focused hero, personal photos, activity detail pages, CV / WhatsApp controls, PDDIKTI, experience media, sixth skills card, compact certifications, and optional translation preparation. Keep your existing `.env.local` and dataset; no re-import is needed.

## Run locally

Use Node.js **22.12+** (or Node 24 LTS).

```bash
npm ci
npm run dev
```

Open [the portfolio](http://localhost:3000) or [Sanity Studio](http://localhost:3000/studio).

On Windows PowerShell, if `npm.ps1` is blocked, use `npm.cmd ci` and `npm.cmd run dev` (and `npm.cmd` for the commands below), or use Command Prompt.

With both Sanity variables unset, the site displays the preserved original content and images. This is a setup preview, not an editable CMS. Once connected, Sanity is the authoritative content source: empty collections stay empty, and deleted projects never reappear from the snapshot.

## One-time Sanity setup and content import

1. Sign in at [Sanity Manage](https://www.sanity.io/manage). Create a project, or select your existing project, and create a dataset such as `production`. A public dataset allows public portfolio reads without a token. Use the dashboard; do not scaffold another Next.js application or overwrite this project's schemas.
2. Copy `.env.example` to `.env.local`. Fill in the project ID and dataset name. Under your project's **API → CORS origins**, add `http://localhost:3000` and your production origin with **Allow credentials** enabled. Origins contain no `/studio` suffix.
3. Create an **Editor** API token and put it in `SANITY_API_WRITE_TOKEN` in `.env.local`. This token is only for the import. For a private dataset, also add a separate **Viewer** token as `SANITY_API_READ_TOKEN`.
4. Import the existing content and images:

   ```bash
   npm run sanity:seed:check
   npm run sanity:seed
   ```

   The import creates **20 documents**: 4 projects, 1 profile, 1 experience, 1 education, 1 publication, 5 skill groups, 3 activities, and 4 certifications. It uploads all **12 original placeholder PNGs** as Sanity assets, preserving alt text, captions, dates, descriptions, metrics, and ordering. It does not generate screenshots or invent links. Drafts and existing documents are skipped, so rerunning is safe. Documents are published immediately by this one-time import.
5. Remove `SANITY_API_WRITE_TOKEN` from `.env.local` after import. Restart `npm run dev`, open `/studio`, and sign in with an account that belongs to the Sanity project. Portfolio editing uses your Sanity login, not the import token.

**Import status:** the migration is implemented and verified offline. No Sanity project ID or credentials were supplied with this project, so the import into your account still needs to be run. A connected but unseeded project shows a clear missing-profile error rather than silently displaying stale data. Seed before the first connected production build.

## Add a new project

1. Open `/studio` → **Project** → create a document.
2. Enter the full title, category, displayed period, short description, and full introduction. Set the optional short display title or leave it blank to use the full title.
3. Click **Generate** beside the slug. The page URL will be `/projects/your-slug`. Keep published slugs stable to preserve inbound links.
4. Add technologies, metrics, implementation highlights, and any Challenge / Approach / Outcome text. Additional case-study sections and formatted rich text are optional.
5. Add images and any real GitHub or live/demo URLs. Blank URLs produce no link or button. Projects can be published without images; the card retains its neutral image area and the detail page omits empty media sections.
6. Click **Publish**. The same existing project template renders the new page automatically; no React page, TypeScript array, image path, or source edit is needed.

Published changes become eligible for refresh after **60 seconds**. Next.js uses background revalidation, so the first request after expiry may show cached content; refresh again after revalidation completes. No deployment is needed. Draft changes do not appear publicly until published. This integration does not include a draft-preview mode.

## Upload and order images

Open a project's **Images & gallery** tab:

- **Cover image:** upload or select an asset. It is used by the card, detail hero, and social metadata.
- **Screenshot gallery:** add multiple images, then drag items into display order. Edit each image's required alt text and optional caption. Crop/hotspot controls are available.
- Replace the imported placeholders with your real screenshots here. You never need to place new files in `/public` or type image paths.

Images use Sanity asset references and CDN transformations plus responsive Next.js Image optimization. Image dimensions are derived from the assets to preserve aspect ratio and avoid layout shifts. The original placeholder files remain only to support the unconfigured preview and reproducible migration.

## Featured projects and ordering

The existing **Selected work** grid remains in place, showing every project with **Show on homepage** enabled.

- **Featured project** promotes a project above ordinary projects. The first featured project uses the existing large card.
- **Featured order** sorts the featured group; lower values appear first.
- **Display order** sorts ordinary homepage projects and the detail-page “Next project” sequence. Lower values appear first.
- Turn off **Show on homepage** to hide a card while keeping its published detail page. This is presentation control, not access control; the page remains in the sitemap. Unpublish a project to remove it publicly.

All original projects remain visible in their original order after migration. The original featured flags for Sindoraku and AcademyNTM are preserved. Profile metrics are editorial values; update the project-count metric in **Profile & About** when appropriate.

## Edit the other sections

Use **Profile & About** for identity, contact details, hero copy and metrics, About text, experience introduction, languages, and soft skills. Use the separate **Experience**, **Education**, **Publication**, **Certification**, **Activity**, and **Skill group** lists for those entries. Each list supports display ordering and adding multiple records. Click **Publish** after changes.

Navigation labels, styling, layout, and section headings remain in code. Content can change independently of presentation.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Final portfolio origin, used by canonical links and sitemap. Defaults to localhost. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID. Public identifier, not a secret. |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name, typically `production`. Required together with project ID. |
| `SANITY_API_READ_TOKEN` | Server-only Viewer token, required only for private datasets. |
| `SANITY_API_WRITE_TOKEN` | Server-only Editor token for the one-time import. Remove afterward; do not deploy it. |

Never commit `.env.local`, expose tokens with `NEXT_PUBLIC_`, or put them in Studio config. The API date is pinned in code. Sanity public identifiers are compiled into the Studio bundle; restart locally or rebuild after changing them.

## Validation and deployment

```bash
npm run check             # ESLint, strict TypeScript, content tests, production build
npm run sanity:seed:check # Validate migration inputs without credentials or writes
npm run start
```

See [VALIDATION.md](./VALIDATION.md) for the checks actually performed and the remaining live-account checks.

For Vercel: push this folder to your repository, import it as a Next.js project, select Node 22 or 24, set the site URL and both public Sanity identifiers (plus the read token only for a private dataset), and deploy after seeding. Add your production origin to Sanity CORS. `/studio` ships with the same deployment and requires a Sanity login. Do not use static export: newly published detail pages require the Next.js runtime.

## Code organization

- `src/app/(portfolio)/`: original public pages/layout, with unchanged URLs.
- `src/app/(cms)/studio/[[...tool]]/`: embedded Studio with its own root layout, isolated from portfolio styles.
- `src/components/`: presentation components.
- `src/sanity/schemaTypes/`: document schemas and reusable image, metric, and rich-content fields.
- `src/sanity/queries.ts`, `client.ts`, `image.ts`: GROQ, server-only fetching, and image normalization.
- `src/types/portfolio.ts`: frontend types independent of CMS document structure.
- `src/content/`: normalization, content utilities, fetching, and the original seed snapshot.
- `scripts/seed-sanity.ts`: idempotent importer; `scripts/seed-data.ts`: migration mapping.
- `tests/content.test.ts`: content parity, new project, ordering, image, empty-content, and safe-link checks.

Integration follows Sanity's [embedded Studio documentation](https://www.sanity.io/docs/studio/embedding-sanity-studio) and [Next.js toolkit](https://github.com/sanity-io/next-sanity).
