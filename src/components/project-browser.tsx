"use client";

import { isMobileProject } from "@/content/presentation";
import { useState } from "react";
import { WalkingCat } from "@/components/walking-cat";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/portfolio";

export function ProjectBrowser({ projects, totalProjects = projects.length }: { projects: Project[]; totalProjects?: number }) {
  const [category, setCategory] = useState<string | null>(null);
  const categories = ["Mobile", "Full Stack Web"] as const;
  const visible = category === null ? projects : projects.filter((project) => (isMobileProject(project) ? "Mobile" : "Full Stack Web") === category);
  if (!projects.length) return <p className="empty-state">Projects will appear here when published.</p>;
  return <>
    <div className="project-browser-toolbar">
      <div className="project-filters" role="group" aria-label="Filter projects by category">
        <button aria-pressed={category === null} onClick={() => setCategory(null)}>All Projects<span>{totalProjects}</span></button>
        {categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="project-toolbar-aside"><WalkingCat /><p className="project-result-count" role="status">{visible.length} of {totalProjects} projects</p></div>
    </div>
    <div className="project-card-grid">{visible.map((project) => <div className="project-filter-item" key={project.slug}><ProjectCard project={project} /></div>)}</div>
  </>;
}
