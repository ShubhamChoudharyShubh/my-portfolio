"use client";

import { useMemo, useState } from "react";
import type { ProjectRow } from "@/lib/types/portfolio";
import { ProjectCard } from "./project-card";

type ProjectsClientProps = {
  projects: ProjectRow[];
};

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const tabs = useMemo(() => {
    const fromData = new Set(
      projects.map((p) => p.category).filter(Boolean) as string[],
    );
    return ["All", ...Array.from(fromData).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const [selectedTab, setSelectedTab] = useState("All");

  const filteredProjects =
    selectedTab === "All"
      ? projects
      : projects.filter((project) => project.category === selectedTab);

  if (projects.length === 0) {
    return (
      <section>
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-neutral-900 dark:text-neutral-50">
            Projects
          </h1>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No projects yet.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-8 lg:gap-y-2">
        <h1 className="shrink-0 text-2xl font-medium text-neutral-900 dark:text-neutral-50">
          Projects
        </h1>
        <div
          className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 pt-0.5 scrollbar-hide sm:gap-2.5 lg:min-w-0 lg:flex-1 lg:flex-wrap lg:justify-end lg:gap-x-2 lg:gap-y-2 lg:overflow-x-visible lg:pb-0 lg:pt-0"
          role="tablist"
          aria-label="Project categories"
        >
          {tabs.map((tab) => {
            const isActive = selectedTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTab(tab)}
                className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium transition-[color,border-color] duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-600 ${
                  isActive
                    ? "border-b-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-50"
                    : "border-b-2 border-transparent text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
