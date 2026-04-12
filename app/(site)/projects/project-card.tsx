"use client";

import { useId, useState } from "react";
import Image from "next/image";
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
  const imageUrl = project.image_url?.trim();

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {imageUrl && (
        <div className="p-5 pb-0">
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            />
          </div>
        </div>
      )}
      <div className="px-6 py-6">
        <button
          type="button"
          id={labelId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="group flex w-full items-start justify-between text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-600"
        >
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
              {project.title}
            </h3>
            {project.subheading && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {project.subheading}
              </p>
            )}
          </div>
          <div className="ml-4 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-50 group-hover:bg-neutral-100 transition-colors dark:bg-neutral-900 dark:group-hover:bg-neutral-800">
            <ChevronIcon expanded={expanded} />
          </div>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={labelId}
          className={`grid transition-[grid-template-rows,margin] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr] mt-0"
            }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`space-y-6 transition-opacity duration-200 ease-in-out ${expanded ? "opacity-100" : "opacity-0"
                }`}
            >
              {tech.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {project.description && (
                <ul className="list-inside list-disc space-y-2 mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {detailBlocks.map((block, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: block }} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-900">
          <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-500 font-medium">
            {link !== "#" ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Open Project
              </a>
            ) : (
              <span>Locked Project</span>
            )}
            <span className="mx-2 text-neutral-300 dark:text-neutral-700">·</span>
            <span>{displayYear}</span>
            <span className="mx-2 text-neutral-300 dark:text-neutral-700">·</span>
            <span>{project.category}</span>
          </div>

          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-900 transition-colors dark:text-neutral-500 dark:hover:text-neutral-100"
              title="View on GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
