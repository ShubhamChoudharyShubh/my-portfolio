"use client";

import { useId, useState } from "react";
import type { ProjectRow } from "@/lib/types/portfolio";

type ProjectCardProps = {
  project: ProjectRow;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-neutral-600 transition-transform duration-300 ease-in-out dark:text-neutral-400 ${
        expanded ? "rotate-90" : ""
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
  const detailBlocks = splitDetailBlocks(project.description);
  const year = new Date(project.created_at).getFullYear();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="border-neutral-200 px-4 pb-4 pt-4 dark:border-neutral-800">
        <button
          type="button"
          id={labelId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-start gap-3 rounded-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-600"
        >
          <span className="min-w-0 flex-1">
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {project.title}
            </span>
            <span className="mt-1 block text-sm text-neutral-600 dark:text-neutral-400">
              {detailBlocks[0] ?? project.description}
            </span>
          </span>
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
            <ChevronIcon expanded={expanded} />
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={labelId}
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`mt-4 space-y-3 border-t border-neutral-200 pt-5 text-sm text-neutral-700 transition-opacity duration-200 ease-in-out dark:border-neutral-800 dark:text-neutral-300 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              {tech.length > 0 ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Tech stack
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {detailBlocks.length > 1 ? (
                <div className="space-y-2 leading-relaxed">
                  {detailBlocks.slice(1).map((block) => (
                    <p key={block}>{block}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          {link !== "#" ? (
            <>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2 dark:text-neutral-200 dark:decoration-neutral-600"
              >
                Open project
              </a>
              <span className="mx-1.5">·</span>
            </>
          ) : null}
          <span>{year}</span>
          <span className="mx-1.5">·</span>
          <span>{project.category}</span>
        </p>
      </div>
    </div>
  );
}
