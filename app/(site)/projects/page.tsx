import { DataError } from "../../components/data-error";
import { SupabaseMissing } from "../../components/supabase-missing";
import { fetchProjects } from "@/lib/data/portfolio";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
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
