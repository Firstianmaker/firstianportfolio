import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { Container } from "@/components/container";
import { ProjectBrowser } from "@/components/project-browser";
import { getPortfolio } from "@/content/portfolio";
import { CvLink, WhatsAppLink } from "@/components/profile-actions";
import { SocialLinks } from "@/components/social-links";
import { RoleRotator } from "@/components/role-rotator";
import { ImageGallery } from "@/components/image-gallery";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { homepageProjects, serializeJsonLd, safeExternalUrl } from "@/content/utils";
import { displayProfile, formatBirthDate, uniqueImages, wholeYearsSince } from "@/content/presentation";
import { technicalGroups } from "@/data/technical-stack";
import type { CSSProperties } from "react";
import { ContactEmail } from "@/components/contact-email";
import { WelcomeIntro } from "@/components/welcome-intro";
import { PageMotion } from "@/components/page-motion";
import { SkillIcon } from "@/components/skill-icon";
import { HeroLabel } from "@/components/hero-label";

export const revalidate = 60;

export default async function Home() {
  const { profile: rawProfile, projects, experiences, community, educations, languages, publications } = await getPortfolio();
  const profile = displayProfile(rawProfile);
  const selectedProjects = homepageProjects(projects).slice(0, 4);
  const age = wholeYearsSince(profile.birthDate);
  const yearsInIt = wholeYearsSince(profile.itExperienceStartDate);
  const birthDate = formatBirthDate(profile.birthDate);
  const education = educations[0];
  const techGroups = profile.technicalGroups ?? technicalGroups;
  const volunteerImages = profile.volunteerImages?.length
    ? profile.volunteerImages.slice(0, 3)
    : uniqueImages(community.flatMap((item) => [item.coverImage, ...item.gallery])).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    jobTitle: profile.role, email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "ID" },
  };
  const personalDetails = [
    ["Place & date of birth", [profile.birthPlace, birthDate].filter(Boolean).join(", ") || "Not provided"],
    ["Languages", languages.length ? languages.map((language) => language.name).join(" · ") : "Bahasa Indonesia · English"],
    ["Age", age !== undefined ? `${age} years` : "Not provided"],
    ["Height", profile.heightCm ? `${profile.heightCm} cm` : "Not provided"],
    ["Current location", profile.location],
    ["GPA", education?.gpa || "Not provided"],
  ];

  return <>
    <WelcomeIntro />
    <PageMotion />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    <section className="hero developer-hero" aria-labelledby="hero-title">
      <div className="hero-architecture" aria-hidden="true"><div className="architecture-stack">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--plane": i } as React.CSSProperties} />)}</div></div>
      <Container className="hero-content">
        <div className="hero-topline"><HeroLabel /><span className="eyebrow hero-location">{profile.location}</span></div>
        <h1 id="hero-title" className="hero-name-animation" aria-label={profile.name}><span aria-hidden="true">{profile.name.split(" ").map((word, wordIndex) => <span key={wordIndex}>{wordIndex > 0 && " "}<span className="hero-name-word">{Array.from(word).map((letter, index) => <span key={index} className="hero-name-letter" style={{ "--letter-delay": `${(wordIndex * 5 + index) * 22}ms` } as CSSProperties}>{letter}</span>)}</span></span>)}</span></h1>
        <RoleRotator roles={profile.roles?.length ? profile.roles : [profile.role]} />
        <div className="hero-shortcuts"><CvLink profile={profile} showUnavailable /><WhatsAppLink profile={profile} /></div>
        <SocialLinks profile={profile} hero />
        <a href="#about" className="scroll-cue"><span className="scroll-cue-track" aria-hidden="true"><span /></span>Scroll to explore <span aria-hidden="true">↓</span></a>
        <div className="site-stack"><p className="eyebrow">This portfolio is built with</p><ul>{["Next.js", "React", "TypeScript", "Tailwind CSS", "Sanity"].map((name) => <li key={name}>{name}</li>)}</ul></div>
      </Container>
    </section>

    <section id="about" className="section">
      <Container><div className="section-topline"><h2 className="direct-heading">About</h2></div>
        <div className="personal-layout">
          <div className="personal-photo">{profile.aboutPhoto || profile.heroPhoto ? <ImageGallery images={uniqueImages([profile.aboutPhoto || profile.heroPhoto])} title={profile.name} className="about-photo-gallery" /> : <MediaPlaceholder label={profile.name + " · personal photo"} portrait />}</div>
          <div className="personal-info">{profile.aboutShort && <p className="reading-copy short-about">{profile.aboutShort}</p>}
            {education && <div className="education-with-link"><p className="education-summary">{education.degree}<span>{education.school}</span></p>{safeExternalUrl(education.pddiktiUrl || profile.pddiktiUrl) && <a href={safeExternalUrl(education.pddiktiUrl || profile.pddiktiUrl)} target="_blank" rel="noopener noreferrer" className="pddikti-button">PDDIKTI<ArrowUpRightIcon className="size-4" /></a>}</div>}
            {publications.length > 0 && <ul className="about-publications" aria-label="Publications">{publications.map((publication) => {
              const doi = publication.doi?.trim();
              const href = doi && /^10\.\d{4,9}\/\S+$/.test(doi) ? `https://doi.org/${doi.split("/").map(encodeURIComponent).join("/")}` : undefined;
              return <li key={publication._id}><svg className="publication-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M9 12h6m-6 4h6" /></svg><div><p className="publication-title">{publication.title}</p><p className="publication-meta">{[publication.journal, publication.issue, publication.date].filter(Boolean).join(" · ")}</p></div>{href && <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Read paper: ${publication.title}`}>Read<ArrowUpRightIcon className="size-4" /></a>}</li>;
            })}</ul>}
            <dl className="personal-facts">{personalDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <div className="personal-stats"><Link href="/projects" className="stat-projects stat-card-link"><div className="stat-header"><h3>Total Projects</h3><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 17.5h7m-3.5-3.5v7" /></svg></div><strong>{projects.length}<span>projects</span></strong><span className="stat-footer">Explore projects <span aria-hidden="true">↗</span></span></Link><Link href="#experience" className="stat-experience stat-card-link"><div className="stat-header"><h3>Years of Experience in IT</h3><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg></div><strong>{yearsInIt !== undefined ? yearsInIt : "—"}<span>years</span></strong><p className="stat-footer">{profile.itExperienceStartDate && yearsInIt !== undefined ? `Since ${new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(profile.itExperienceStartDate + "T00:00:00Z"))} · study & projects` : "Starting date not provided"}<span aria-hidden="true">↗</span></p></Link></div>
          </div>
        </div>
      </Container>
    </section>

    <section id="projects" className="section work-section">
      <Container><div className="section-topline"><h2 className="direct-heading">Projects</h2></div>
        <ProjectBrowser projects={selectedProjects} totalProjects={projects.length} />
        <div className="all-projects-action"><Link href="/projects" className="button button-secondary">See all projects<ArrowUpRightIcon className="size-4" /></Link></div>
      </Container>
    </section>

    <section id="experience" className="section">
      <Container><div className="section-topline"><h2 className="direct-heading">Work Experience</h2></div>
        <div className="work-experience-grid">{experiences.map((experience) => {
          const images = uniqueImages([experience.image, ...experience.gallery]);
          return <article key={experience._id} className="work-experience-card">
            <div className="work-photo-strip">{images.length > 0 && <ImageGallery images={images} title={experience.company} previewCount={3} className="work-image-gallery" />}{Array.from({ length: Math.max(0, 3 - images.length) }, (_, index) => <MediaPlaceholder key={index} label={`${experience.company} · photo ${images.length + index + 1}`} />)}</div>
            <div className="experience-row"><div className="experience-meta"><p className="eyebrow">{experience.period}</p><h3>{experience.role}</h3><p>{experience.company}</p><div className="tag-list">{experience.stack.map((item) => <span key={item}>{item}</span>)}</div></div><details className="work-responsibilities" open><summary>Responsibilities<span className="disclosure-sign" aria-hidden="true" /></summary><ul className="contribution-list">{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></details></div>
          </article>;
        })}</div>
      </Container>
    </section>

    <section id="volunteer" className="section volunteer-section">
      <Container><div className="section-topline"><h2 className="direct-heading">Volunteer</h2></div>
        <div className="volunteer-showcase">{volunteerImages.length > 0 && <ImageGallery images={volunteerImages} title="Volunteer gallery" className="volunteer-image-gallery" />}{Array.from({ length: 3 - volunteerImages.length }, (_, index) => <MediaPlaceholder key={index} label={`Volunteer photo ${volunteerImages.length + index + 1}`} />)}</div>
        <div id="activities" className="volunteer-list">{community.map((item) => <article key={item._id} className="volunteer-row"><div><h3><Link href={`/activities/${encodeURIComponent(item.slug)}`}>{item.title}</Link></h3><p className="muted">{item.role}</p></div><p className="eyebrow">{item.period}</p><Link href={`/activities/${encodeURIComponent(item.slug)}`} className="circle-link" aria-label={`View ${item.title}`}><ArrowUpRightIcon className="size-5" /></Link></article>)}</div>
      </Container>
    </section>

    <section id="skills" className="section skills-section">
      <Container><div className="section-topline"><h2 className="direct-heading">Tech Stack</h2></div>
        <div className="skill-group-grid">{techGroups.map((group) => <article key={group.title} className="skill-group"><h3>{group.title}</h3><div className="skill-logo-row" aria-hidden="true">{group.items.map((item) => <span key={item} data-skill={item}><SkillIcon name={item} /></span>)}</div><p className="skill-names">{group.items.join(" · ")}</p></article>)}</div>
      </Container>
    </section>

    <section id="contact" className="contact-section compact-contact">
      <Container><div className="section-topline"><h2 className="direct-heading">Contact</h2></div>
        <div className="contact-invitation"><h3>Let’s build something<br /><span>useful together.</span></h3><p>Have a project in mind? Let’s talk about what you want to build.</p><ContactEmail email={profile.email} /></div>
        <div className="contact-bottom"><SocialLinks profile={profile} /><CvLink profile={profile} showUnavailable /></div>
      </Container>
    </section>
  </>;
}
