"use client";

import { useId, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import type { ProjectRow } from "@/lib/types/portfolio";

type ProjectCardProps = {
  project: ProjectRow;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-neutral-600 transition-transform duration-300 ease-in-out dark:text-neutral-400 ${expanded ? "rotate-90" : ""
        }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function splitDetailBlocks(text: string) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (blocks.length > 0) return blocks;
  return text
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const labelId = useId();
  const tech = project.tech_stack;
  const link = project.live_url?.trim() || "#";
  const githubLink = project.github_url?.trim();
  const detailBlocks = splitDetailBlocks(project.description);
  const displayYear = project.project_year?.trim() || new Date(project.created_at).getFullYear();

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700">
      <div className="p-6">
        <button
          type="button"
          id={labelId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-600"
        >
          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {detailBlocks[0] ?? project.description}
            </p>
          </div>
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-50 transition-colors group-hover:bg-neutral-100 dark:bg-neutral-900 dark:group-hover:bg-neutral-800">
            <ChevronIcon expanded={expanded} />
          </div>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={labelId}
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`space-y-4 pt-6 text-sm text-neutral-700 transition-opacity duration-300 ease-in-out dark:text-neutral-300 ${expanded ? "opacity-100" : "opacity-0"
                }`}
            >
              {tech.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detailBlocks.length > 1 && (
                <div className="space-y-3 leading-relaxed">
                  {detailBlocks.slice(1).map((block, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: block }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-900">
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {link !== "#" ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 hover:underline dark:text-neutral-100"
              >
                Open Project
              </a>
            ) : (
              <span>Open Project</span>
            )}
            <span>·</span>
            <span>{displayYear}</span>
            <span>·</span>
            <span>{project.category}</span>
          </div>

          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"
              title="View on GitHub"
            >
              <FaGithub size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
