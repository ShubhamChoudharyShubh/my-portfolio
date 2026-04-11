-- Portfolio schema: UUID PKs, created_at, RLS with public read and admin-only writes.
-- Admin access: set App Metadata on the user in Supabase Dashboard (Authentication > Users):
--   { "role": "admin" }
-- Or via SQL after creating the user (replace USER_UUID):
--   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where id = 'USER_UUID';

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institute text not null,
  field text,
  score text,
  start_year text not null,
  end_year text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  description text not null,
  start_year text not null,
  end_year text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack jsonb not null default '[]'::jsonb,
  category text not null,
  live_url text,
  created_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists education_created_at_idx on public.education (created_at desc);
create index if not exists experience_created_at_idx on public.experience (created_at desc);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.about enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;

-- Helper expression (inline): (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'

-- profiles
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_admin"
  on public.profiles for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "profiles_delete_admin"
  on public.profiles for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- about
create policy "about_select_public"
  on public.about for select
  using (true);

create policy "about_insert_admin"
  on public.about for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "about_update_admin"
  on public.about for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "about_delete_admin"
  on public.about for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- education
create policy "education_select_public"
  on public.education for select
  using (true);

create policy "education_insert_admin"
  on public.education for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "education_update_admin"
  on public.education for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "education_delete_admin"
  on public.education for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- experience
create policy "experience_select_public"
  on public.experience for select
  using (true);

create policy "experience_insert_admin"
  on public.experience for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "experience_update_admin"
  on public.experience for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "experience_delete_admin"
  on public.experience for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- projects
create policy "projects_select_public"
  on public.projects for select
  using (true);

create policy "projects_insert_admin"
  on public.projects for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "projects_update_admin"
  on public.projects for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "projects_delete_admin"
  on public.projects for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
