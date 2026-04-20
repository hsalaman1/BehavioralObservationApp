-- Allow anon UPDATE on observations so observers can resume a previously
-- submitted report and re-save their edits into the same row.
-- Run this once in your Supabase SQL editor.
--
-- Also make sure `supabase/students-table.sql` has been run, otherwise the
-- student roster cannot sync across devices.

create policy if not exists "anon_update_observations" on public.observations
  for update using (true) with check (true);
