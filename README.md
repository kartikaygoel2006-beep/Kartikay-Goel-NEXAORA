# Studio 1947 — Jaipur Heritage

*Our team product based on Indian heritage and culture.*

A full-stack heritage website for documenting Jaipur's monuments, forts, crafts and
history. **No content is prefilled or auto-generated.** Every city, monument, fort,
craft, image and source must be entered by an administrator through the admin
dashboard — the public site shows polished empty states until you do.

Built with Next.js (App Router, TypeScript), Tailwind CSS and Supabase
(Postgres, Auth, Storage), deployed on Vercel.

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, React 19
- **Styling:** Tailwind CSS v4 — a "pink sandstone / royal blue / cream / gold" palette
  defined in [`src/app/globals.css`](src/app/globals.css)
- **Backend:** Supabase (Postgres + Row Level Security, Auth, Storage)
- **Deployment:** Vercel

## Project structure

```
supabase/
  schema.sql        — tables, enums, triggers (run first)
  policies.sql       — Row Level Security policies (run second)
  storage.sql         — storage bucket + storage policies (run third)
  make_admin.sql      — promote a signed-up user to administrator
src/
  app/
    (public pages)   — /, /explore, /heritage/[slug], /crafts, /crafts/[slug],
                        /sources, /about, /login
    admin/            — protected admin dashboard (CRUD for every entity)
  components/
    ui/               — buttons, cards, form fields, empty states
    layout/           — navbar, footer
    heritage/          — public site cards, gallery, source list
    home/              — hero section
    explore/           — search & filter bar
    admin/             — image uploader, gallery manager, source/relation linkers
  lib/
    supabase/          — browser/server/middleware Supabase clients + storage upload helper
    queries.ts          — all public data-fetching functions
    types.ts            — hand-written types mirroring the SQL schema
    auth.ts             — current-user/profile helpers, `assertAdmin()`
```

## 1. Create a Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the three files **in this order**:
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. `supabase/storage.sql`
3. Copy your project's **Project URL** and **anon public key** from
   Project Settings → API.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Every public page will show "No … added yet" empty
states — this is expected until you add content.

## 4. Create your administrator account

1. Go to `/login` and try to sign in — this only works for existing users, so
   instead create the user first: in Supabase Studio → Authentication → Users →
   "Add user", set an email and password (or enable email sign-ups and use the
   `/login` page's flow if you add a sign-up form).
2. A `profiles` row is created automatically for every new auth user (via a
   database trigger) with `role = 'visitor'`.
3. Open `supabase/make_admin.sql`, replace the placeholder email with your
   admin's email, and run it in the SQL editor. This flips their role to
   `'admin'`.
4. Sign in at `/login` — you'll be redirected to `/admin`.

## 5. Add your content

From `/admin` you can create, edit, publish/unpublish and delete:

- **Locations** — cities/areas referenced by monuments and crafts
- **Monuments & Forts** — full details, photo gallery, related crafts, sources
- **Crafts & Products** — full details, photo gallery, related monuments, sources
- **Sources & credits** — every citation, linkable to any monument/fort/product
- **Home & About content** — hero title/subtitle/image and About page text

Every uploaded photo requires **alt text** and a **photographer/image credit**
before it can be saved — this is enforced in the admin forms.

Mark an entry "Featured" from its list page to have it appear on the home page.
Entries stay in **Draft** until you click **Publish** — drafts are visible to
admins only and never appear on the public site.

## Database schema

See `supabase/schema.sql` for the full definition. Summary:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` with a `role` (`admin` / `visitor`) |
| `locations` | Cities / localities |
| `heritage_sites` | Monuments and forts |
| `heritage_images` | Gallery photos, linked to a heritage site **or** a product |
| `products_or_crafts` | Crafts / export products |
| `site_product_links` | Many-to-many: monuments ↔ crafts/products |
| `sources` | Research sources / citations |
| `source_links` | Many-to-many: sources ↔ monuments/products, with an optional section label |
| `favourites` | Visitor-saved sites/products (schema + RLS ready; no UI is wired up yet) |
| `site_settings` | Singleton row for the home-page hero and About page copy |

Row Level Security ensures: anonymous visitors can only read **published**
content; only users with `profiles.role = 'admin'` can create, edit or delete
anything, or read draft content.

## Image storage

All photos go to a single public Supabase Storage bucket named `media`
(created by `supabase/storage.sql`), organised into folders like
`heritage-sites/<id>/`, `products/<id>/`, `heritage-covers/`, `craft-covers/`,
`heritage-fun-facts/` and `site-settings/`. Only authenticated admins can
upload, replace or delete files; anyone can view them.

## Deployment (Vercel)

See [DEPLOYMENT.md](DEPLOYMENT.md).

## Content policy

This codebase intentionally ships with **zero real Jaipur content**. No
monuments, forts, historical facts, images, crafts or sources are hard-coded
anywhere — everything you see on a fresh deploy is an empty state. All content
must be entered by an administrator through `/admin`.
