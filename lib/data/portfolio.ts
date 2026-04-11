import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AboutRow,
  EducationRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
} from "@/lib/types/portfolio";

export async function fetchProfile(
  supabase: SupabaseClient,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as ProfileRow | null;
}

export async function fetchAbout(
  supabase: SupabaseClient,
): Promise<AboutRow | null> {
  const { data, error } = await supabase
    .from("about")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as AboutRow | null;
}

export async function fetchEducation(
  supabase: SupabaseClient,
): Promise<EducationRow[]> {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as EducationRow[];
}

export async function fetchExperience(
  supabase: SupabaseClient,
): Promise<ExperienceRow[]> {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ExperienceRow[];
}

export async function fetchProjects(
  supabase: SupabaseClient,
): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    tech_stack: normalizeTechStack(row.tech_stack),
  })) as ProjectRow[];
}

function normalizeTechStack(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t));
  }
  return [];
}

export function parseDescriptionLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}
