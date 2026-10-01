// Explicit projections keep the public site independent from Studio internals.
export const projectProjection = `{
  _id, title, "slug": slug.current, shortTitle, period, projectDate,
  category, summary, description, content, stack, metrics, highlights,
  challenge, approach, outcome, sections, galleryDescription,
  featured, displayOrder, featuredOrder, showOnHomepage, githubUrl, demoUrl,
  coverImage{..., "metadata": asset->metadata},
  gallery[]{..., "metadata": asset->metadata}
}`;

export const portfolioQuery = `{
  "profile": *[_type == "profile" && _id == "profile"][0]{
    name, role, location, email, phone, initials, intro, about,
    heroHeadline, heroEyebrow, aboutTagline, experienceIntro,
    heroMetrics, softSkills, languages,
    whatsappNumber, whatsappMessage, linkedinUrl, githubUrl, instagramUrl, letterboxdUrl, pddiktiUrl,
    roles, aboutShort, birthPlace, birthDate, heightCm, itExperienceStartDate, cvUrl,
    "musicUrl": backgroundMusic.asset->url,
    technicalGroups[]{title, items},
    volunteerImages[]{..., "metadata": asset->metadata},
    heroPhoto{..., "metadata": asset->metadata},
    aboutPhoto{..., "metadata": asset->metadata},
    "cvIndonesian": cvIndonesian.asset->{"url": url, "filename": originalFilename},
    "cv": cv.asset->{"url": url, "filename": originalFilename}
  },
  "projects": *[_type == "project" && defined(slug.current)]
    | order(coalesce(displayOrder, 100) asc, title asc) ${projectProjection},
  "experiences": *[_type == "experience"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, company, role, period, bullets, stack, image{..., "metadata": asset->metadata}, gallery[]{..., "metadata": asset->metadata}},
  "educations": *[_type == "education"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, school, degree, period, gpa, coursework, pddiktiUrl},
  "publications": *[_type == "publication"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, title, journal, issue, date, doi},
  "skills": *[_type == "skillGroup"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, title, items, description, image{..., "metadata": asset->metadata}},
  "community": *[_type == "activity"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, title, "slug": slug.current, role, period, date, summary, description, content,
      organization, location, highlights, metrics, externalUrl, displayOrder,
      coverImage{..., "metadata": asset->metadata}, gallery[]{..., "metadata": asset->metadata}},
  "certifications": *[_type == "certification"] | order(coalesce(displayOrder, 100) asc, _id asc)
    {_id, title, issuer, date, verificationUrl, image{..., "metadata": asset->metadata}}
}`;
