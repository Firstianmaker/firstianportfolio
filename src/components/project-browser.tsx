"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/portfolio";

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const categories = ["Mobile", "Full Stack Web"] as const;
  const visible = category === null ? projects : projects.filter((project) => (/mobile|android|flutter/i.test(project.category + " " + project.stack.join(" ")) ? "Mobile" : "Full Stack Web") === category);
  if (!projects.length) return <p className="empty-state">Projects will appear here when published.</p>;
  return <>
    <div className="project-browser-toolbar">
      <div className="project-filters" role="group" aria-label="Filter projects by category">
        <button aria-pressed={category === null} onClick={() => setCategory(null)}>All Projects<span>{projects.length}</span></button>
        {categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="project-result-count" role="status">{visible.length} of {projects.length} projects</p>
    </div>
    <div className="project-card-grid">{visible.map((project) => <div className="project-filter-item" key={project.slug}><ProjectCard project={project} /></div>)}</div>
  </>;
}
