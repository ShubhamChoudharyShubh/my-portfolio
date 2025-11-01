"use client";

import Link from "next/link";
import { Briefcase, Code, Laptop, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  skills: string[];
}

type IconComponentType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & { 
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }
>;

const iconComponents: Record<number, IconComponentType> = {
  1: Briefcase as unknown as IconComponentType,
  2: Code as unknown as IconComponentType,
  3: Laptop as unknown as IconComponentType,
  4: Rocket as unknown as IconComponentType
};

const experienceData: ExperienceItem[] = [
    {
      id: 1,
      role: "Graduate Engineering Trainee",
      company: "MPSeDC - State IT Center",
      type: "Internship",
      startDate: "Oct 2025",
      endDate: "Present",
      location: "Bhopal, India",
      skills: ["Web Development", "Software Engineering", "Problem Solving", "Team Collaboration"]
    },
    {
      id: 2,
      role: "Founder & Developer",
      company: "ExamTrakr",
      type: "Startup",
      startDate: "Oct 2025",
      endDate: "Present",
      location: "Bhopal, India",
      skills: ["Full-Stack Development", "EdTech", "Progress Tracking", "Resource Management"]
    },
    {
      id: 3,
      role: "Freelance Web Developer",
      company: "Self-Employed",
      type: "Freelance",
      startDate: "Jan 2022",
      endDate: "Present",
      location: "Remote (Global Clients)",
      skills: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Responsive Design"]
    },
    {
      id: 4,
      role: "Founder",
      company: "BoardExamsCommunity",
      type: "Educational Initiative",
      startDate: "Jan 2021",
      endDate: "Dec 2024",
      location: "Online",
      skills: ["Community Building", "Content Creation", "Educational Technology", "Web Development"]
    }
  ];

export default function ExperiencePage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Experience
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400" />
      </div>

      <div className="space-y-6 md:space-y-8">
        {experienceData.map((exp) => {
          const IconComponent = iconComponents[exp.id] || Briefcase;
          const iconColor = exp.id === 1 ? '#3b82f6' : 
                          exp.id === 2 ? '#10b981' : 
                          exp.id === 3 ? '#8b5cf6' :
                          '#ec4899';
                          
          return (
            <div 
              key={exp.id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/50 p-4 transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/30 md:p-6"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-100 opacity-10 transition-all duration-500 group-hover:scale-150 dark:bg-blue-900/20" />
              
              <div className="relative z-10">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div 
                        className="flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12"
                        style={{ 
                          backgroundColor: `${iconColor}20`,
                        }}
                      >
                        <IconComponent 
                          className="h-5 w-5 sm:h-6 sm:w-6" 
                          style={{ color: iconColor }} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {exp.company} • {exp.type}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {exp.location}
                    </p>
                  </div>
                  <div className="mt-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 md:mt-0">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {exp.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}