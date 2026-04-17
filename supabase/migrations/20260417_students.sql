-- Run this in your Supabase SQL Editor to enable Student Profiles
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  student_id text not null default '',
  school text not null default '',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_name_idx on students (name);
create index if not exists students_archived_idx on students (archived);
