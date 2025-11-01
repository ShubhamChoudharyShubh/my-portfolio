"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { GraduationCap, BookOpen, Award, Rocket } from "lucide-react";

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  field: string;
  startYear: string;
  endYear: string;
  percentage: string;
  cgpa?: string;
}

type IconComponentType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & { 
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }
>;

// Update the icon components to include the 4th icon
const iconComponents: Record<number, IconComponentType> = {
    1: GraduationCap as unknown as IconComponentType,
    2: BookOpen as unknown as IconComponentType,
    3: Award as unknown as IconComponentType,
    4: Rocket as unknown as IconComponentType  // Added Rocket icon for JEE preparation
  };

  const educationData: EducationItem[] = [
    {
      id: 1,
      degree: "B.Tech in Computer Science & Business Systems",
      institution: "SOIT, RGPV Bhopal",
      field: "Computer Science & Engineering",
      startYear: "2021",
      endYear: "2025",
      percentage: "",
      cgpa: "7.2/10"
    },
    {
      id: 4,
      degree: "JEE Preparation",
      institution: "Allen Career Institute, Kota",
      field: "Engineering Entrance Exam Preparation",
      startYear: "2019",
      endYear: "2021",
      percentage: "68 Percentile"
    },
    {
      id: 3,
      degree: "Class 12th (MP Board)",
      institution: "Government School, Mandsaur",
      field: "Higher Secondary Education",
      startYear: "2018",
      endYear: "2019",
      percentage: "83%"
    },
    {
      id: 2,
      degree: "Class 8th to 11th (MP Board)",
      institution: "Arya Bal Mandir, Budha",
      field: "Secondary School Education",
      startYear: "2014",
      endYear: "2018",
      percentage: "78%"
    },
    {
      id: 1,
      degree: "Class 1st to 7th (MP Board)",
      institution: "Love Kush Bal Mandir School, Sarwaniya",
      field: "Primary & Middle School Education",
      startYear: "2005",
      endYear: "2014",
      percentage: "85%"
    }
  ];

export default function EducationPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Education
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400" />
      </div>

      <div className="space-y-6 md:space-y-8">
        {educationData.map((edu) => {
          const IconComponent = iconComponents[edu.id];
          const iconColor = edu.id === 1 ? '#3b82f6' : 
                edu.id === 2 ? '#10b981' : 
                edu.id === 3 ? '#8b5cf6' :
                '#ec4899';  // Added color for the 4th item
                          
          return (
            <div 
              key={edu.id}
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
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {edu.field}
                    </p>
                  </div>
                  <div className="mt-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 md:mt-0">
                    {edu.startYear} - {edu.endYear}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Percentage</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {edu.percentage}
                      </span>
                    </div>
                    {edu.cgpa && (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">CGPA</span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {edu.cgpa}
                        </span>
                      </div>
                    )}
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