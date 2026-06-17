-- ============================================================
-- Biovance Platform — Database Schema
-- Run this ONCE in Supabase: SQL Editor → paste → Run.
-- Creates the storage layer the dashboard + search read from.
-- ============================================================

-- 1. DATASETS ------------------------------------------------
-- The core table. Every piece of conservation data you feed the
-- platform lives here. Dashboard counts + search both read this.
create table if not exists public.datasets (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  org           text,
  description   text,
  ecosystem     text,                       -- e.g. 'Desert', 'Marine', 'Forest'
  type          text default 'dataset',     -- 'dataset' | 'program' | 'research' | 'volunteer'
  species       text,                       -- primary species, optional
  tags          text[] default '{}',
  permission    text default 'public',      -- 'public' | 'restricted' | 'private'
  record_count  integer default 0,          -- how many data points it represents
  quality_score integer default 90,         -- 0-100, auto-scored on submit
  status        text default 'active',
  created_at    timestamptz default now()
);

-- 2. ACTIVITY (live ingest feed) -----------------------------
-- Every submission/event writes a row here so the dashboard
-- "Live Ingest Feed" shows real recent activity.
create table if not exists public.activity (
  id          uuid primary key default gen_random_uuid(),
  org         text,
  description text not null,
  color       text default '#22C55E',
  created_at  timestamptz default now()
);

-- 3. PARTNER ORGS --------------------------------------------
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text default 'Partner Organization',
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security — allow public READ, public INSERT for demo.
-- (Tighten later when you add auth/partners. For now this lets
--  you and the dashboard feed + read data freely.)
-- ============================================================
alter table public.datasets      enable row level security;
alter table public.activity      enable row level security;
alter table public.organizations enable row level security;

-- READ for everyone
create policy "public read datasets"  on public.datasets      for select using (true);
create policy "public read activity"  on public.activity      for select using (true);
create policy "public read orgs"      on public.organizations for select using (true);

-- INSERT for everyone (demo-friendly; restrict to authenticated later)
create policy "public insert datasets" on public.datasets      for insert with check (true);
create policy "public insert activity" on public.activity      for insert with check (true);
create policy "public insert orgs"     on public.organizations for insert with check (true);

-- ============================================================
-- Seed a little starter data so the dashboard isn't empty on day one.
-- Safe to delete these rows once you feed real data.
-- ============================================================
insert into public.organizations (name, role) values
  ('Arizona Game & Fish', 'Partner Organization'),
  ('NOAA Marine', 'Data Partner'),
  ('USFS Region 6', 'Research Partner')
on conflict do nothing;

insert into public.datasets (title, org, description, ecosystem, type, species, tags, record_count, quality_score) values
  ('Sonoran Desert Reptile Survey', 'Arizona Game & Fish', 'GPS-tagged reptile observations across the Sonoran corridor.', 'Desert', 'dataset', 'Gila monster', array['GeoJSON','Species'], 142, 96),
  ('Gulf Coast Coral Monitoring', 'NOAA Marine', 'Reef health transects and bleaching surveys.', 'Marine', 'program', 'Coral', array['Ongoing'], 389, 94),
  ('Pacific NW Canopy LIDAR', 'USFS Region 6', 'Old-growth canopy density scans.', 'Forest', 'research', null, array['Satellite'], 632, 88)
on conflict do nothing;

insert into public.activity (org, description, color) values
  ('Arizona Game & Fish', 'Desert tortoise survey — 142 GPS observations uploaded', '#22C55E'),
  ('NOAA Marine', 'SST satellite pass — Gulf thermal layer updated', '#14B8A6'),
  ('USFS Region 6', 'Forest canopy LIDAR scan — 2.3 GB processed', '#3B82F6')
on conflict do nothing;
