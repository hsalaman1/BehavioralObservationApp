-- Students roster table for the Behavioral Observation App.
-- Run this once in your Supabase SQL editor to enable the student picker.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  student_id text default '',
  school text default '',
  created_at timestamptz default now()
);

create index if not exists students_name_idx on public.students (name);

alter table public.students enable row level security;

-- Allow read/write from the anon key (matches the existing observations policy).
-- Tighten these for production if you add per-user auth.
create policy if not exists "anon_select_students" on public.students
  for select using (true);

create policy if not exists "anon_insert_students" on public.students
  for insert with check (true);

create policy if not exists "anon_delete_students" on public.students
  for delete using (true);
