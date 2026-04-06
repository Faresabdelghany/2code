-- ============================================================
-- FORMA CMS — Database Schema
-- Run this in the Supabase Dashboard SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- TABLES
-- ------------------------------------------------------------

-- pages
create table if not exists pages (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  meta_title   text,
  meta_description text,
  og_image     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- sections
create table if not exists sections (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references pages(id) on delete cascade,
  type        text not null,
  title       text,
  content     jsonb not null default '{}',
  sort_order  integer not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create index if not exists sections_page_id_idx on sections(page_id);
alter table sections add constraint sections_page_id_sort_order_key unique (page_id, sort_order);

-- media
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  filename    text not null,
  url         text not null,
  alt_text    text,
  size        integer,
  mime_type   text,
  folder      text not null default '/',
  created_at  timestamptz not null default now()
);

-- submissions (contact form)
create table if not exists submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- settings (key/value store)
create table if not exists settings (
  key         text primary key,
  value       jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- ------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger pages_updated_at
  before update on pages
  for each row execute function set_updated_at();

create or replace trigger sections_updated_at
  before update on sections
  for each row execute function set_updated_at();

create or replace trigger settings_updated_at
  before update on settings
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table pages       enable row level security;
alter table sections    enable row level security;
alter table media       enable row level security;
alter table submissions enable row level security;
alter table settings    enable row level security;

-- pages: public read, authenticated write
create policy "pages_public_select"
  on pages for select using (true);

create policy "pages_auth_insert"
  on pages for insert with check (auth.role() = 'authenticated');

create policy "pages_auth_update"
  on pages for update using (auth.role() = 'authenticated');

create policy "pages_auth_delete"
  on pages for delete using (auth.role() = 'authenticated');

-- sections: public read, authenticated write
create policy "sections_public_select"
  on sections for select using (true);

create policy "sections_auth_insert"
  on sections for insert with check (auth.role() = 'authenticated');

create policy "sections_auth_update"
  on sections for update using (auth.role() = 'authenticated');

create policy "sections_auth_delete"
  on sections for delete using (auth.role() = 'authenticated');

-- media: public read, authenticated write
create policy "media_public_select"
  on media for select using (true);

create policy "media_auth_insert"
  on media for insert with check (auth.role() = 'authenticated');

create policy "media_auth_update"
  on media for update using (auth.role() = 'authenticated');

create policy "media_auth_delete"
  on media for delete using (auth.role() = 'authenticated');

-- settings: public read, authenticated write
create policy "settings_public_select"
  on settings for select using (true);

create policy "settings_auth_insert"
  on settings for insert with check (auth.role() = 'authenticated');

create policy "settings_auth_update"
  on settings for update using (auth.role() = 'authenticated');

create policy "settings_auth_delete"
  on settings for delete using (auth.role() = 'authenticated');

-- submissions: public insert only, authenticated read/update/delete
create policy "submissions_public_insert"
  on submissions for insert with check (true);

create policy "submissions_auth_select"
  on submissions for select using (auth.role() = 'authenticated');

create policy "submissions_auth_update"
  on submissions for update using (auth.role() = 'authenticated');

create policy "submissions_auth_delete"
  on submissions for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- STORAGE BUCKET
-- ------------------------------------------------------------

-- Create the media bucket (public read)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow anyone to read objects in the media bucket
create policy "media_bucket_public_select"
  on storage.objects for select
  using (bucket_id = 'media');

-- Allow authenticated users to upload/update/delete in the media bucket
create policy "media_bucket_auth_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_bucket_auth_update"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_bucket_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
