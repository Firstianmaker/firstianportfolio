# Managing project images

Project images are now managed through **Sanity Studio**, not manual file paths.

1. Complete the one-time setup/import in [README.md](./README.md).
2. Open `/studio`, select a project, and open **Images & gallery**.
3. Upload or select a **Cover image**. Add descriptive alt text and an optional caption.
4. Upload screenshots to **Screenshot gallery**. Drag the items into the desired order.
5. Click **Publish**. The portfolio refreshes through Next.js background revalidation.

Existing PNGs under `public/images/projects/` are the original placeholders, retained for the unconfigured preview and one-time importer. You do not need to add new project images there. Replace placeholders with real screenshots using Studio; no filenames or paths need to be entered.
