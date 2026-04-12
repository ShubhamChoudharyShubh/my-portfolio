import { DataError } from "../../components/data-error";
import { SupabaseMissing } from "../../components/supabase-missing";
import { fetchProjects } from "@/lib/data/portfolio";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { ProjectsClient } from "./projects-client";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return <SupabaseMissing />;
  }

  let projects;
  try {
    projects = await fetchProjects(supabase);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return <DataError message={message} />;
  }

  return <ProjectsClient projects={projects} />;
}
