# Revision validation — 16 September 2026

Applied to the existing Sanity-integrated `faiz-portfolio.zip`, preserving its dependencies, lockfile, content snapshot, component structure, project routes, typography system, and styling.

## Completed for this revision

- Optimized Next.js 16.3.5 production build and strict TypeScript compilation: passed. Routes include `/activities/[slug]`, `/projects/[slug]`, `/cv`, `/studio`, and the sitemap.
- ESLint: passed with no warnings.
- Eleven content tests: passed. These exercise the real GROQ query, content normalization, original content preservation, idempotent seeding, new projects, legacy and new activities, ordered galleries, optional media, safe links, CV URLs, WhatsApp normalization, six skills cards, and translation fallback.
- Sanity CLI schema extraction: passed using test project identifiers. Extracted schemas contain the new profile photos, CV file, contact fields, activity media/story, experience media, certificate image/link, and translation fields.
- Real production-server HTTP checks: homepage, all four existing project pages, all three original activity pages, `/studio`, and sitemap return 200. Unknown project/activity slugs return 404. `/cv` returns 404 when no file exists.
- Homepage HTML checks: H1 is “Faiz Firstian Nugroho”; six skill cards render; activity detail links, PDDIKTI, and correctly normalized WhatsApp URLs are present. CV buttons are absent without an uploaded file.
- The actual `/cv` route handler was tested with a mocked Sanity response: the first request redirects to the initial file, the next request redirects to a replacement file with the correct download filename, and removing the file returns 404. Responses use `Cache-Control: no-store`.
- Existing snapshot content and project image bytes are retained. Schema additions preserve existing field names and types; no remote dataset was mutated.

## Scope and limitations

- Personal photos, activity stories/photos, work photos, and CV files were not invented or supplied. Upload them in Studio when available; optional media and empty controls remain hidden.
- The public language remains English. Optional field-level translation schemas and a tested fallback helper are prepared, but the public EN / ID switcher and locale-aware rendering are deliberately deferred.
- Responsive classes and semantic structure were reviewed. This environment's browser could not reach the local preview (`ERR_BLOCKED_BY_CLIENT`), so visual browser checks at desktop/mobile sizes and interaction checks are **not claimed as completed for this revision**.
- No Sanity account credentials were available. Actual authenticated Studio uploads/publishing, live CDN delivery, and background revalidation against the owner's dataset remain unverified. Automated media tests use synthetic asset references and do not claim to have downloaded those test images.
- The ZIP is an updated source deliverable for the existing Vercel workflow; it has not been deployed to a live site in this turn.

## Final owner checks after applying the update

1. Keep the existing project ID, dataset, and `.env.local`; do not reset or reseed your content.
2. Open `/studio`, upload hero/About photos and a CV in Profile & About, then publish. Confirm the layouts at desktop and mobile widths and use Download CV.
3. Replace the published CV and click the button again; it should download the new file.
4. Create an Activity with a slug, story, cover, and gallery. Publish and confirm its new URL and homepage link after content revalidation.
5. Add an optional Experience image, inspect the six skill cards and compact certificates, and verify WhatsApp/PDDIKTI links.

See [UPGRADE.md](./UPGRADE.md) for exact editing locations and upgrade instructions.
