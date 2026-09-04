-- Studio 1947 — Database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.
-- This file creates NO content rows — only structure. All monuments, forts, crafts,
-- history, images and sources must be entered by an administrator afterwards.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('admin', 'visitor');
create type content_status as enum ('draft', 'published');
create type heritage_category as enum ('monument', 'fort', 'temple', 'haveli', 'garden', 'museum', 'other');
create type accessibility_level as enum ('accessible', 'partially_accessible', 'not_accessible', 'unknown');
create type source_type as enum ('primary', 'government', 'book', 'article', 'archive', 'image_credit');
create type image_parent_type as enum ('heritage_site', 'product');

-- ---------------------------------------------------------------------------
-- profiles — one row per authenticated user, extends auth.users
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'visitor',
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- locations — city / locality reference data
-- ---------------------------------------------------------------------------

create table locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  area text,
  latitude double precision,
  longitude double precision,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- heritage_sites — monuments & forts
-- ---------------------------------------------------------------------------

create table heritage_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category heritage_category not null default 'monument',
  era text,
  location_id uuid references locations (id) on delete set null,
  short_description text,
  historical_description text,
  architectural_highlights text,
  visiting_info text,
  accessibility accessibility_level not null default 'unknown',
  fun_fact text,
  fun_fact_image_url text,
  fun_fact_image_alt text,
  fun_fact_image_credit text,
  cover_image_url text,
  cover_image_alt text,
  cover_image_credit text,
  tags text[] not null default '{}',
  status content_status not null default 'draft',
  featured boolean not null default false,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index heritage_sites_status_idx on heritage_sites (status);
create index heritage_sites_category_idx on heritage_sites (category);
create index heritage_sites_location_idx on heritage_sites (location_id);

-- ---------------------------------------------------------------------------
-- products_or_crafts — Jaipur crafts / export products
-- ---------------------------------------------------------------------------

create table products_or_crafts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  description text,
  history_origin text,
  artisan_name text,
  contact_link text,
  related_location_id uuid references locations (id) on delete set null,
  cover_image_url text,
  cover_image_alt text,
  cover_image_credit text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on products_or_crafts (status);

-- ---------------------------------------------------------------------------
-- site_product_links — many-to-many between heritage sites and crafts/products
-- ---------------------------------------------------------------------------

create table site_product_links (
  heritage_site_id uuid not null references heritage_sites (id) on delete cascade,
  product_id uuid not null references products_or_crafts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (heritage_site_id, product_id)
);

-- ---------------------------------------------------------------------------
-- heritage_images — gallery photos for a heritage site OR a product/craft
-- (exactly one of heritage_site_id / product_id must be set)
-- ---------------------------------------------------------------------------

create table heritage_images (
  id uuid primary key default gen_random_uuid(),
  parent_type image_parent_type not null,
  heritage_site_id uuid references heritage_sites (id) on delete cascade,
  product_id uuid references products_or_crafts (id) on delete cascade,
  url text not null,
  alt_text text not null,
  caption text,
  photographer_credit text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint heritage_images_parent_chk check (
    (parent_type = 'heritage_site' and heritage_site_id is not null and product_id is null) or
    (parent_type = 'product' and product_id is not null and heritage_site_id is null)
  )
);

create index heritage_images_site_idx on heritage_images (heritage_site_id);
create index heritage_images_product_idx on heritage_images (product_id);

-- ---------------------------------------------------------------------------
-- sources — research / citation records
-- ---------------------------------------------------------------------------

create table sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_organisation text,
  url text,
  source_type source_type not null default 'article',
  publication_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- source_links — connects a source to a heritage site and/or product, with
-- an optional label naming which section/claim the source backs
-- ---------------------------------------------------------------------------

create table source_links (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources (id) on delete cascade,
  heritage_site_id uuid references heritage_sites (id) on delete cascade,
  product_id uuid references products_or_crafts (id) on delete cascade,
  section_label text,
  created_at timestamptz not null default now(),
  constraint source_links_target_chk check (
    heritage_site_id is not null or product_id is not null
  )
);

create index source_links_source_idx on source_links (source_id);
create index source_links_site_idx on source_links (heritage_site_id);
create index source_links_product_idx on source_links (product_id);

-- ---------------------------------------------------------------------------
-- favourites — visitor-saved sites / products
-- ---------------------------------------------------------------------------

create table favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  heritage_site_id uuid references heritage_sites (id) on delete cascade,
  product_id uuid references products_or_crafts (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favourites_target_chk check (
    (heritage_site_id is not null and product_id is null) or
    (heritage_site_id is null and product_id is not null)
  ),
  unique (user_id, heritage_site_id, product_id)
);

-- ---------------------------------------------------------------------------
-- site_settings — singleton row for editable home-page hero content
-- ---------------------------------------------------------------------------

create table site_settings (
  id boolean primary key default true,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  hero_image_alt text,
  hero_image_credit text,
  hero_cta_primary_label text,
  hero_cta_primary_href text,
  hero_cta_secondary_label text,
  hero_cta_secondary_href text,
  about_title text,
  about_body text,
  about_team text,
  about_contact_email text,
  about_contact_phone text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into site_settings (id) values (true);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger locations_set_updated_at before update on locations
  for each row execute function set_updated_at();
create trigger heritage_sites_set_updated_at before update on heritage_sites
  for each row execute function set_updated_at();
create trigger products_set_updated_at before update on products_or_crafts
  for each row execute function set_updated_at();
create trigger sources_set_updated_at before update on sources
  for each row execute function set_updated_at();
create trigger site_settings_set_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up
-- ---------------------------------------------------------------------------

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, full_name)
  values (new.id, 'visitor', new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
