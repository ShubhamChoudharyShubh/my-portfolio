'use client';
import { useState } from "react";
import Image from "next/image";
import { projects } from "./project-data";

const tabs = ["All", "WordPress", "PHP/MySQL", "HTML/CSS", "JavaScript", "Bootstrap"];

export default function Projects() {
  const [selectedTab, setSelectedTab] = useState("All");

  const filteredProjects =
    selectedTab === "All"
      ? projects
      : projects.filter((project) => project.type === selectedTab);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-medium">Projects</h1>

      {/* Responsive tab container */}
      <div className="flex overflow-x-auto gap-3 mb-8 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-700 ${
                isActive
                  ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 shadow-md shadow-neutral-400/30 dark:shadow-neutral-900/40"
                  : "bg-neutral-200/70 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200 hover:bg-neutral-300 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-50"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:shadow-neutral-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-700"
          >
            {project.image && (
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="mt-4 space-y-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {project.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}