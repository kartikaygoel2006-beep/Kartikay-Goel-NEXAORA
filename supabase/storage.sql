-- Studio 1947 — Storage bucket setup
-- Creates one public bucket "media" used for heritage/monument photos, craft
-- product photos, fun-fact images and the home page hero background.
-- Run after schema.sql and policies.sql.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read access to every object in the bucket
create policy "media: public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only admins (per profiles.role) may upload, replace or delete files
create policy "media: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and is_admin());

create policy "media: admin update"
  on storage.objects for update
  using (bucket_id = 'media' and is_admin());

create policy "media: admin delete"
  on storage.objects for delete
  using (bucket_id = 'media' and is_admin());
