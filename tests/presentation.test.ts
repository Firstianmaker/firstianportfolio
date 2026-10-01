import assert from "node:assert/strict";
import test from "node:test";
import { evaluate, parse } from "groq-js";
import { createInitialDocuments } from "../scripts/seed-data";
import { initialPortfolio } from "../src/content/initial";
import { normalizePortfolio, type RawPortfolio } from "../src/content/normalize";
import { cvHref, displayProfile, uniqueImages, wholeYearsSince, isMobileProject, mobileThumbnailImages } from "../src/content/presentation";
import { portfolioQuery } from "../src/sanity/queries";

test("personal dates use complete calendar years and reject impossible or future dates", () => {
  assert.equal(wholeYearsSince("2004-08-11", new Date("2026-08-10T23:59:59Z")), 21);
  assert.equal(wholeYearsSince("2004-08-11", new Date("2026-08-11T00:00:00Z")), 22);
  assert.equal(wholeYearsSince("2022-08-01", new Date("2026-09-30T00:00:00Z")), 4);
  for (const date of ["", "2024-02-31", "not-a-date", "2028-01-01"]) {
    assert.equal(wholeYearsSince(date, new Date("2026-09-30T00:00:00Z")), undefined);
  }
});

test("CMS personal data and showcase media survive actual GROQ projection", async () => {
  const image = { _type: "portfolioImage", asset: { _type: "reference" as const, _ref: "image-test-600x400-png" }, alt: "Uploaded image" };
  const docs = await createInitialDocuments(async () => image);
  Object.assign(docs.find((item) => item._id === "profile")!, {
    roles: ["Backend Developer", "Mobile Developer"], aboutShort: "Short personal introduction.",
    technicalGroups: [{ title: "Languages", items: ["Python", "JavaScript"] }, { title: "Empty group" }],
    birthPlace: "Jakarta", birthDate: "2004-08-11", heightCm: 175, itExperienceStartDate: "2022-08-01",
    instagramUrl: "https://instagram.com/example", cvUrl: "https://example.com/cv.pdf",
    volunteerImages: [image, { _type: "portfolioImage" }, { ...image, alt: "Second photo" }],
  });
  Object.assign(docs.find((item) => item._type === "skillGroup")!, { description: "Technical description.", image });
  const raw = await (await evaluate(parse(portfolioQuery), { dataset: docs })).get() as RawPortfolio;
  const portfolio = normalizePortfolio(raw, { projectId: "test1234", dataset: "production" });
  assert.deepEqual(portfolio.profile.roles, ["Backend Developer", "Mobile Developer"]);
  assert.equal(portfolio.profile.birthDate, "2004-08-11");
  assert.equal(portfolio.profile.heightCm, 175);
  assert.equal(portfolio.profile.itExperienceStartDate, "2022-08-01");
  assert.equal(portfolio.profile.aboutShort, "Short personal introduction.");
  assert.deepEqual(portfolio.profile.technicalGroups, [{ title: "Languages", items: ["Python", "JavaScript"] }, { title: "Empty group", items: [] }]);
  assert.equal(portfolio.profile.instagramUrl, "https://instagram.com/example");
  assert.deepEqual(portfolio.profile.volunteerImages?.map((item) => item.alt), ["Uploaded image", "Second photo"]);
  assert.equal(portfolio.skills[0].description, "Technical description.");
  assert.ok(portfolio.skills[0].image?.src);
  assert.equal(cvHref(portfolio.profile), "https://example.com/cv.pdf");
});

test("presentation respects explicit empty fields and rejects unsafe social/CV links", () => {
  const profile = displayProfile({ ...initialPortfolio.profile, birthPlace: "", aboutShort: "", githubUrl: "javascript:alert(1)", instagramUrl: "data:text/html,test", cvUrl: "javascript:alert(1)" });
  assert.equal(profile.birthPlace, "");
  assert.equal(profile.aboutShort, "");
  assert.equal(profile.githubUrl, undefined);
  assert.equal(profile.instagramUrl, undefined);
  assert.equal(cvHref(profile), undefined);
  assert.equal(cvHref({ ...profile, cv: { url: "https://cdn.sanity.io/files/test1234/production/cv.pdf", filename: "cv.pdf" } }), "/cv");
});

test("gallery preserves order without duplicating the cover image", () => {
  const image = initialPortfolio.projects[0].coverImage!;
  const second = { ...image, src: "/another-image.png" };
  assert.deepEqual(uniqueImages([image, undefined, image, second]), [image, second]);
});

test("mobile previews prefer distinct portrait screenshots and handle missing images", () => {
  const media = (src: string, width = 400, height = 800) => ({ src, width, height, alt: src, caption: "" });
  const cover = media("cover", 1200, 800);
  const first = media("first");
  assert.deepEqual(mobileThumbnailImages({ coverImage: cover, gallery: [first, first, media("second"), media("third"), media("fourth")] }).map((image) => image.src), ["first", "second", "third"]);
  assert.deepEqual(mobileThumbnailImages({ coverImage: first, gallery: [first] }), [first]);
  assert.deepEqual(mobileThumbnailImages({ coverImage: cover, gallery: [] }), [cover]);
  assert.deepEqual(mobileThumbnailImages({ gallery: [] }), []);
  assert.equal(isMobileProject({ category: "Android application", stack: [] }), true);
  assert.equal(isMobileProject({ category: "Mobile", stack: [] }), true);
  assert.equal(isMobileProject({ category: "Full Stack Web", stack: ["Flutter"] }), false);
});
