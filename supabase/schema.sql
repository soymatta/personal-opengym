-- personal-opengym Supabase schema
-- Run this in Supabase Dashboard > SQL Editor (once).
--
-- One row per auth user holding the whole training state as JSONB.
-- Mirrors the self-hosted `state-<uid>.json` file so the frontend needs no
-- per-table rewrite. RLS keeps every user isolated.

create table if not exists public.gym_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.gym_states enable row level security;

drop policy if exists "own state read" on public.gym_states;
drop policy if exists "own state write" on public.gym_states;

create policy "own state read"
  on public.gym_states for select
  using (auth.uid() = user_id);

create policy "own state write"
  on public.gym_states for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
