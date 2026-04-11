export type ProfileRow = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  created_at: string;
};

export type AboutRow = {
  id: string;
  description: string;
  created_at: string;
};

export type EducationRow = {
  id: string;
  title: string;
  institute: string;
  field: string | null;
  score: string | null;
  start_year: string;
  end_year: string;
  tech_stack: string[];
  created_at: string;
};

export type ExperienceRow = {
  id: string;
  role: string;
  company: string;
  description: string;
  start_year: string;
  end_year: string;
  tech_stack: string[];
  created_at: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: string;
  live_url: string | null;
  image_url: string | null;
  created_at: string;
};

export const PROJECT_CATEGORIES = [
  "All",
  "WordPress",
  "PHP/MySQL",
  "HTML/CSS",
  "JavaScript",
  "Bootstrap",
] as const;

/** Categories stored on `projects.category` (excludes the "All" tab). */
export const ADMIN_PROJECT_CATEGORIES = PROJECT_CATEGORIES.filter(
  (c): c is Exclude<(typeof PROJECT_CATEGORIES)[number], "All"> => c !== "All",
);
