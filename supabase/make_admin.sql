-- Studio 1947 — Promote a user to administrator
--
-- 1. Sign up normally on the site's /login page (or create the user in
--    Supabase Studio → Authentication → Users) using the email/password
--    you want to use for the admin dashboard.
-- 2. Find that user's email below, replace it, and run this in the
--    Supabase SQL editor. It flips their profiles.role to 'admin'.

update profiles
set role = 'admin'
where id = (select id from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL');
