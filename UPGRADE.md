# Portfolio revisions — 16 September 2026

This updates the existing Next.js + Sanity portfolio. It does not create a new website, dataset, or admin system.

## Apply to your existing project

1. Keep a copy of your current project, including your `.env.local`.
2. Copy the updated source from this folder into your existing project, or use this folder as the updated project and copy your `.env.local` into it. Keep your current Sanity project ID and dataset. The archive contains no credentials.
3. Run `npm.cmd ci`, then `npm.cmd run dev` from Windows PowerShell. Open `http://localhost:3000/studio`.
4. **Do not reset your dataset or re-import your content.** Existing published content and IDs are retained. No data migration is required for these revisions. `sanity:seed` remains for first-time setup only.
5. Publish any changed documents in Studio. Public content follows the existing 60-second background revalidation behavior. CV download requests read the latest published file immediately.
6. Deploy the updated code through your existing Vercel workflow. Keep your existing environment variables and CORS origins. There is no dependency or hosting-provider migration.

## Where to edit the new features

| Feature | Sanity location |
| --- | --- |
| Large name and professional title | Profile & About → Name / Role |
| Smaller supporting copy | Profile & About → Hero supporting headline / Introduction |
| Hero photo | Profile & About → Hero personal photo |
| About photo | Profile & About → About personal photo |
| CV | Profile & About → CV file |
| WhatsApp | Profile & About → WhatsApp number / WhatsApp default message |
| LinkedIn / GitHub | Profile & About → LinkedIn URL / GitHub URL |
| PDDIKTI | Profile & About → Default PDDIKTI student URL, or Education → PDDIKTI student URL |
| Soft Skills card | Profile & About → Soft Skills — sixth skills card |
| Internship / work photos | Experience → Company / work image / Image gallery |
| Certificate images / links | Certification → Certificate image / Verification URL |
| Activity stories and photos | Activity → create or edit an entry |

Images are optional and use Sanity uploads, alt text, captions, and crop controls. No new image paths or files in `/public` are needed. Without a personal photo, the existing profile card and About layout remain; no empty photo frame appears. Missing experience photos and empty gallery items are omitted.

### Download CV

Upload a PDF or Word document in **CV file**, then publish Profile & About. Download CV appears in the header, hero, and contact section only when a valid published asset exists. Every button uses `/cv`; this endpoint fetches the current published asset without caching and redirects to Sanity's download URL. Replacing the asset does not require editing links or rebuilding. The uploaded document itself is not bundled in this ZIP.

The page may take the normal revalidation interval to show or hide the button after an initial upload or removal. An already-visible button always resolves the current file when clicked. If the file has been removed, `/cv` returns a clear 404 response; it never downloads an old cached CV.

### WhatsApp and PDDIKTI defaults

The supplied number `08979359266` resolves to `https://wa.me/628979359266`. The default message is “Hi Faiz, I found your portfolio and would like to connect.” Both have editable fields in Profile & About. Existing profiles without the new fields use these supplied defaults. Local Indonesian numbers and international numbers are normalized safely.

The provided PDDIKTI URL is used by the original `education-upnvj` entry when it has no entry-specific URL. Other education entries only show their own URL, so adding a different institution does not accidentally link to Faiz's UPNVJ record. All these external links open in a new tab with `noopener noreferrer`.

### Activities

Each Activity supports title, slug, short description, detailed introduction, formatted story, displayed period, optional exact date, role, organization, location, cover, ordered gallery, highlights, metrics, external link, and display order.

1. Open **Activity** in Studio and create or select an entry.
2. Enter the title, role, displayed period, and summary. Generate a slug.
3. Add the story and any available photos or highlights; omit fields that do not apply.
4. Publish. The homepage card links to `/activities/your-slug` automatically.

Existing activities without slugs keep working at `/activities/<document-id>`, such as `/activities/activity-0`. Their old ID URLs still resolve after a proper slug is added, with canonical metadata pointing to the current slug. No existing activity text is invented or expanded automatically. The detail design emphasizes the experience, role, event context, contributions, and photos rather than project-specific challenge/approach sections.

### Skills and certifications

The five existing technical groups are followed by the Profile's existing six soft skills in a matching sixth card. Alternatively, create a Skill group titled **Soft Skills** to manage it alongside the technical groups; it replaces the Profile-derived card rather than duplicating it.

Certifications use a compact two-column desktop grid. Certificate images open within a “View certificate” disclosure, keeping the section compact; verification links remain directly available.

## Optional English / Indonesian preparation

The public site remains **English**. No EN / ID switcher is enabled in this revision.

Profile, Project, Activity, Experience, Education, and Certification schemas contain optional collapsed **Translations (optional preparation)** fields. These use structures such as `translations.title.en`, `translations.title.id`, `translations.content.en`, and `translations.content.id`. Existing string and Portable Text fields keep their types and remain the live source, preserving all current content without migration.

`src/content/localization.ts` provides a tested resolver for a later language-aware query/rendering layer: Indonesian → English override → original English field, treating empty strings and empty rich-text arrays as missing. Images, dates, links, metrics, technology lists, files, gallery order, and phone numbers remain shared. Translation fields are preparation only and do not change the public website yet. Completing the switcher later also needs localized interface labels, queries, and locale-aware metadata.

References: [Sanity field localization](https://www.sanity.io/docs/studio/localization), [Sanity file fields](https://www.sanity.io/docs/studio/file-type), and [Next.js dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes).
