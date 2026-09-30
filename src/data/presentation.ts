import type { Profile } from "@/types/portfolio";

// Local defaults; published CMS fields take precedence. Empty values stay visibly unconfigured.
export const presentation: Partial<Profile> = {
  roles: ["Full-Stack Developer", "Website & Mobile Developer", "AI Engineer"],
  aboutShort: 'Computer Science graduate from UPN "Veteran" Jakarta. Previously a Programmer Intern at GfK, an NIQ company.',
  birthPlace: "Jakarta",
  birthDate: "2004-08-11",
  heightCm: 175,
  itExperienceStartDate: "2022-08-01",
  githubUrl: "https://github.com/Firstianmaker",
  linkedinUrl: "https://www.linkedin.com/in/faiz-firstian-nugroho-518299305/",
  instagramUrl: "",
  cvUrl: "",
};

export const stackVisuals: Record<string, { image: string; description: string }> = {
  Programming: { image: "/images/stack/programming.svg", description: "Languages for application logic, scripting, and everyday problem solving." },
  "Web & Mobile": { image: "/images/stack/web-mobile.svg", description: "Interfaces and applications for browsers and mobile devices." },
  "Data & AI": { image: "/images/stack/data-ai.svg", description: "Data processing, computer vision, and on-device machine learning." },
  Databases: { image: "/images/stack/databases.svg", description: "Relational data, document storage, and application caching." },
  Tools: { image: "/images/stack/tools.svg", description: "Version control, API testing, and development environments." },
};
