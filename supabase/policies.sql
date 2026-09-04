-- Studio 1947 — Row Level Security policies
-- Run after schema.sql. Public visitors can read published content only.
-- Only users whose profiles.role = 'admin' may create/edit/delete content.

alter table profiles enable row level security;
alter table locations enable row level security;
alter table heritage_sites enable row level security;
alter table products_or_crafts enable row level security;
alter table site_product_links enable row level security;
alter table heritage_images enable row level security;
alter table sources enable row level security;
alter table source_links enable row level security;
alter table favourites enable row level security;
alter table site_settings enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy "profiles: read own" on profiles
  for select using (auth.uid() = id or is_admin());

create policy "profiles: update own" on profiles
  for update using (auth.uid() = id or is_admin());

-- ---------------------------------------------------------------------------
-- locations — public read, admin write
-- ---------------------------------------------------------------------------

create policy "locations: public read" on locations
  for select using (true);

create policy "locations: admin write" on locations
  for insert with check (is_admin());
create policy "locations: admin update" on locations
  for update using (is_admin());
create policy "locations: admin delete" on locations
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- heritage_sites — public read of published rows, admin full access
-- ---------------------------------------------------------------------------

create policy "heritage_sites: public read published" on heritage_sites
  for select using (status = 'published' or is_admin());

create policy "heritage_sites: admin insert" on heritage_sites
  for insert with check (is_admin());
create policy "heritage_sites: admin update" on heritage_sites
  for update using (is_admin());
create policy "heritage_sites: admin delete" on heritage_sites
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- products_or_crafts — public read of published rows, admin full access
-- ---------------------------------------------------------------------------

create policy "products: public read published" on products_or_crafts
  for select using (status = 'published' or is_admin());

create policy "products: admin insert" on products_or_crafts
  for insert with check (is_admin());
create policy "products: admin update" on products_or_crafts
  for update using (is_admin());
create policy "products: admin delete" on products_or_crafts
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- site_product_links — readable with parent, admin write
-- ---------------------------------------------------------------------------

create policy "site_product_links: public read" on site_product_links
  for select using (true);

create policy "site_product_links: admin insert" on site_product_links
  for insert with check (is_admin());
create policy "site_product_links: admin delete" on site_product_links
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- heritage_images — public read, admin write
-- ---------------------------------------------------------------------------

create policy "heritage_images: public read" on heritage_images
  for select using (true);

create policy "heritage_images: admin insert" on heritage_images
  for insert with check (is_admin());
create policy "heritage_images: admin update" on heritage_images
  for update using (is_admin());
create policy "heritage_images: admin delete" on heritage_images
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- sources — public read, admin write
-- ---------------------------------------------------------------------------

create policy "sources: public read" on sources
  for select using (true);

create policy "sources: admin insert" on sources
  for insert with check (is_admin());
create policy "sources: admin update" on sources
  for update using (is_admin());
create policy "sources: admin delete" on sources
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- source_links — public read, admin write
-- ---------------------------------------------------------------------------

create policy "source_links: public read" on source_links
  for select using (true);

create policy "source_links: admin insert" on source_links
  for insert with check (is_admin());
create policy "source_links: admin delete" on source_links
  for delete using (is_admin());

-- ---------------------------------------------------------------------------
-- favourites — each visitor manages only their own rows
-- ---------------------------------------------------------------------------

create policy "favourites: read own" on favourites
  for select using (auth.uid() = user_id);
create policy "favourites: insert own" on favourites
  for insert with check (auth.uid() = user_id);
create policy "favourites: delete own" on favourites
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- site_settings — public read, admin write
-- ---------------------------------------------------------------------------

create policy "site_settings: public read" on site_settings
  for select using (true);
create policy "site_settings: admin update" on site_settings
  for update using (is_admin());
