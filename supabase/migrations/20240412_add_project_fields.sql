-- Add GitHub URL and Project Year to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS project_year text;

-- Add a comment for clarity
COMMENT ON COLUMN public.projects.project_year IS 'The year the project was completed (e.g. 2024)';
