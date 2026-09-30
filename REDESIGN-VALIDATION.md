# Redesign validation

Date: 2026-09-30. Includes the portfolio revision and personal-data corrections.

## Implemented scope

- DESIGN.md dark navy/cyan palette, Inter headings, Oswald body, JetBrains Mono metadata, 8px corners, architectural hero planes. The referenced HTML was unavailable; the written specification was used.
- Hero cycles four career roles, offers pause/resume, respects reduced motion and lists the actual website stack.
- About uses a short CMS description, personal photo, Jakarta / 11 August 2004 / 175 cm, location and GPA. Weight is omitted. Age and completed years since August 2022 are calculated; IT experience explicitly includes study and projects.
- Two-column project grid on desktop/tablet, one column on mobile. Details contain description, period, technologies, features and zoomable gallery.
- Work uses one visual card per CMS experience. Volunteer has three image positions above its list.
- Five technical groups use replaceable SVG illustrations and short descriptions; desktop layout is 3 + 2. Soft skills are excluded.
- CMS data is retained; no remote documents were edited or published. Missing photos, CV and social destinations remain clearly identified.

## Automated validation

PASS: npm run check — ESLint, TypeScript, all 15 tests, and production build.

Tests cover legacy content preservation, GROQ projections, media ordering, safe URLs, personal date boundaries, explicit empty values and gallery deduplication.

Windows Node v22.17.1 required its system trust store for Sanity HTTPS. Certificate verification remains enabled:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm run check
node node_modules/next/dist/bin/next dev --port 3000
```

## Browser validation

- PASS: no horizontal document overflow at 320, 390, 768 and 1440 CSS pixels.
- PASS: project grid has one column at 320/390 and two at 768/1440.
- PASS: desktop/mobile hero and desktop tech illustrations visually inspected; five groups form 3 + 2.
- PASS: role changes, pause remains stable, resume works.
- PASS: mobile menu opens, Escape closes and returns focus; Tech Stack navigation reaches #skills.
- PASS: Technologies disclosure reveals the existing technology list.
- PASS: Sindoraku detail displays the requested content and three images.
- PASS: lightbox opens, zoom reaches 150% with a larger scrollable canvas; next image changes caption and resets zoom to 100%.
- PASS: Escape closes lightbox and restores focus to its image trigger.
- PASS: no captured browser error/warning logs during this revision check.

Screenshots: redesign-desktop.png and redesign-mobile.png.

## Antislop delivery gate

- During mode, as selected by the user. No generic marketing replacement taglines.
- Existing architecture, content routes and CMS integration reused; no added dependencies.
- Missing personal/work/volunteer media is labeled. Inherited project images remain labeled placeholders. Tech illustrations represent their categories.
- Contrast retained from the initial redesign: #A1A1AA on #18181B = 6.91:1; #02050E on #00E5FF = 13.25:1; control border #62636C on #090F1B = 3.21:1.
- Semantic navigation, native disclosure/dialog controls, focus outlines, skip link, 44px primary controls, reduced-motion support and empty states are present.
- Cyan identifies actions, large type establishes hierarchy, decorative planes follow the architectural brief. Continuous role motion is requested and can be paused.

Limits: no real-device or full screen-reader audit. Reduced-motion handling was source-inspected. Work/volunteer lightboxes share the tested gallery component but lack supplied photos for live content verification. Actual CV/social links cannot be click-tested until configured. See PORTFOLIO-EDITING.md.

## Latest revision: platform buttons and GitHub README

- Next.js development indicator disabled using the documented devIndicators option.
- Contact links now use the existing WhatsApp number. Platform buttons use brand colors/icons; CV uses a document treatment. GitHub and LinkedIn URLs come from the supplied README. Instagram and CV remain unconfigured.
- Section/list numbering removed. Statistics redesigned with clear units and a project navigation action.
- Work job descriptions and stack restored beneath three image slots. Actual work photos are still required.
- About and three career roles updated from the README. Six skill groups now show individual local brand icons, with licenses retained. Technical groups can be overridden in Profile & About in Studio.
- PASS: lint, TypeScript and production build. All 15 tests passed again after the final CMS normalization change, including missing skill-list handling.
- PASS: desktop hero, work and skill sections visually inspected. All 35 rendered brand icons loaded. No horizontal overflow at 1440 or 390 pixels; mobile skill/work grids collapse to one column. Dev-tools button absent from rendered accessibility tree.
- Platform URL destinations inspected; no WhatsApp message sent. Final changes are local and have not been deployed.

## Latest polish: typing, compact About, email Contact

Navbar WhatsApp removed. Contact now uses email and a working copy action. Career roles type/delete character by character without a pause button, per request; reduced-motion preference displays static text. Statistics reduced in height; photo and statistics bottom edges measured at the same position on desktop. Tech stack uses three columns/two rows, grouped logos above text, with one column on mobile. Added one-time section reveals, hover feedback and a reading-progress line without new personal data.

Validation: ESLint and TypeScript passed. Browser verified partial typed text, 3 desktop skill columns, exact About bottom alignment, successful Email copied status, and no horizontal overflow at 390px. Screenshot: review-contact.png. Existing build/test results above precede this visual polish; no new production build was run for this pass.

## Latest refinement: About width and welcome intro

About facts and statistics now share a 560px maximum width, aligned left inside the existing column. Browser measurements confirmed matching right edges. Added a 2.2-second dismissible welcome dialog once per tab, a desktop section rail with current-section state, scroll cue, heading dividers and pointer spotlight on existing cards. Reduced-motion skips the intro. No personal data or new content sections were added.

ESLint/TypeScript passed. Browser confirmed automatic intro closure, restored scrolling, equal About widths, and no console errors. Preview evidence: review-about.png. Intro is an opening animation, not a fabricated loading percentage.
