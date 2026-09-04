# Deploying Studio 1947 to Vercel

## Prerequisites

- A Supabase project with `supabase/schema.sql`, `supabase/policies.sql` and
  `supabase/storage.sql` already run (see [README.md](README.md)).
- Your Supabase **Project URL** and **anon public key**.

## Steps

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
   Vercel auto-detects Next.js — no build settings need to change.
3. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://studio-1947.vercel.app` |

4. Click **Deploy**.
5. Once deployed, update `NEXT_PUBLIC_SITE_URL` to match the final domain (or
   your custom domain once attached) and redeploy — this value is only used
   for `sitemap.xml` and `robots.txt`.
6. In Supabase → Authentication → URL Configuration, add your Vercel domain to
   the **Site URL** and **Redirect URLs** so auth cookies work correctly in
   production.
7. Promote your admin account by running `supabase/make_admin.sql` against
   your Supabase project (see README step 4) if you haven't already.

## Notes

- The admin dashboard (`/admin`) is excluded from the sitemap and disallowed
  in `robots.txt`, but it is still protected by Supabase Auth + Row Level
  Security regardless — do not rely on `robots.txt` alone for access control.
- Image uploads go directly from the admin's browser to Supabase Storage, so
  there is no Vercel function size limit to worry about for large photos.
- No environment variable holds a Supabase **service role** key — every
  server action runs as the logged-in admin user and relies on RLS policies,
  so there is no elevated secret to leak.
