-- =============================================================================
-- TEK NAIJA — Admin RLS policies
-- -----------------------------------------------------------------------------
-- The marketing site uses anon SELECT policies on the public-facing tables.
-- The admin CMS (app/(admin)/admin) authenticates real Supabase users and
-- needs INSERT / UPDATE / DELETE permission on each content table.
--
-- Apply this migration after the base schema (projects, posts, team_members,
-- testimonials) exists. Idempotent: safe to re-run.
-- =============================================================================

-- ---------- projects ---------------------------------------------------------
alter table if exists public.projects enable row level security;

drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

-- ---------- posts ------------------------------------------------------------
alter table if exists public.posts enable row level security;

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);

-- Allow authenticated users to read all posts (incl. drafts) for the CMS.
drop policy if exists "Authenticated users can read all posts" on public.posts;
create policy "Authenticated users can read all posts"
  on public.posts
  for select
  to authenticated
  using (true);

-- ---------- team_members -----------------------------------------------------
alter table if exists public.team_members enable row level security;

drop policy if exists "Authenticated users can insert team_members" on public.team_members;
create policy "Authenticated users can insert team_members"
  on public.team_members
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update team_members" on public.team_members;
create policy "Authenticated users can update team_members"
  on public.team_members
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete team_members" on public.team_members;
create policy "Authenticated users can delete team_members"
  on public.team_members
  for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read all team_members" on public.team_members;
create policy "Authenticated users can read all team_members"
  on public.team_members
  for select
  to authenticated
  using (true);

-- ---------- testimonials -----------------------------------------------------
alter table if exists public.testimonials enable row level security;

drop policy if exists "Authenticated users can insert testimonials" on public.testimonials;
create policy "Authenticated users can insert testimonials"
  on public.testimonials
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update testimonials" on public.testimonials;
create policy "Authenticated users can update testimonials"
  on public.testimonials
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete testimonials" on public.testimonials;
create policy "Authenticated users can delete testimonials"
  on public.testimonials
  for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read all testimonials" on public.testimonials;
create policy "Authenticated users can read all testimonials"
  on public.testimonials
  for select
  to authenticated
  using (true);
