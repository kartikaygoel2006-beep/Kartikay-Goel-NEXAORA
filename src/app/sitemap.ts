import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createClient();

  const [{ data: sites }, { data: products }] = await Promise.all([
    supabase.from("heritage_sites").select("slug, updated_at").eq("status", "published"),
    supabase.from("products_or_crafts").select("slug, updated_at").eq("status", "published"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/` },
    { url: `${base}/explore` },
    { url: `${base}/crafts` },
    { url: `${base}/sources` },
    { url: `${base}/about` },
  ];

  const siteRoutes: MetadataRoute.Sitemap = (sites ?? []).map((s) => ({
    url: `${base}/heritage/${s.slug}`,
    lastModified: s.updated_at,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${base}/crafts/${p.slug}`,
    lastModified: p.updated_at,
  }));

  return [...staticRoutes, ...siteRoutes, ...productRoutes];
}
