import { createClient } from "@/lib/supabase/server";
import type {
  AccessibilityLevel,
  HeritageCategory,
  HeritageImage,
  HeritageSite,
  Location,
  ProductOrCraft,
  SiteSettings,
  Source,
  SourceLink,
} from "@/lib/types";

const SITE_SELECT = "*, location:locations(*)";
const PRODUCT_SELECT = "*, location:locations(*)";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  return data as SiteSettings | null;
}

export async function getFeaturedHeritageSites(limit = 3): Promise<HeritageSite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_sites")
    .select(SITE_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data as HeritageSite[]) ?? [];
}

export async function getFeaturedProducts(limit = 3): Promise<ProductOrCraft[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products_or_crafts")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data as ProductOrCraft[]) ?? [];
}

export interface HeritageFilters {
  search?: string;
  category?: HeritageCategory | "";
  era?: string;
  area?: string;
  accessibility?: AccessibilityLevel | "";
  featured?: boolean;
}

export async function getPublishedHeritageSites(filters: HeritageFilters = {}): Promise<HeritageSite[]> {
  const supabase = await createClient();
  let query = supabase.from("heritage_sites").select(SITE_SELECT).eq("status", "published");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.era) query = query.eq("era", filters.era);
  if (filters.accessibility) query = query.eq("accessibility", filters.accessibility);
  if (filters.featured) query = query.eq("featured", true);
  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(`name.ilike.${term},short_description.ilike.${term}`);
  }

  const { data } = await query.order("name", { ascending: true });
  let sites = (data as HeritageSite[]) ?? [];

  if (filters.area) {
    sites = sites.filter((s) => s.location?.area === filters.area);
  }

  return sites;
}

export async function getHeritageEras(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_sites")
    .select("era")
    .eq("status", "published")
    .not("era", "is", null);
  const eras = new Set((data ?? []).map((row) => row.era as string).filter(Boolean));
  return Array.from(eras).sort();
}

export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").order("city");
  return (data as Location[]) ?? [];
}

export async function getHeritageSiteBySlug(slug: string): Promise<HeritageSite | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_sites")
    .select(SITE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as HeritageSite | null;
}

export async function getHeritageSiteById(id: string): Promise<HeritageSite | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("heritage_sites").select(SITE_SELECT).eq("id", id).maybeSingle();
  return data as HeritageSite | null;
}

export async function getImagesForSite(siteId: string): Promise<HeritageImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_images")
    .select("*")
    .eq("heritage_site_id", siteId)
    .order("display_order", { ascending: true });
  return (data as HeritageImage[]) ?? [];
}

export async function getImagesForProduct(productId: string): Promise<HeritageImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_images")
    .select("*")
    .eq("product_id", productId)
    .order("display_order", { ascending: true });
  return (data as HeritageImage[]) ?? [];
}

export async function getSourceLinksForSite(siteId: string): Promise<SourceLink[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("source_links")
    .select("*, source:sources(*)")
    .eq("heritage_site_id", siteId);
  return (data as SourceLink[]) ?? [];
}

export async function getSourceLinksForProduct(productId: string): Promise<SourceLink[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("source_links")
    .select("*, source:sources(*)")
    .eq("product_id", productId);
  return (data as SourceLink[]) ?? [];
}

export async function getRelatedProductsForSite(siteId: string): Promise<ProductOrCraft[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_product_links")
    .select("product:products_or_crafts(*, location:locations(*))")
    .eq("heritage_site_id", siteId);
  const rows = (data ?? []) as unknown as { product: ProductOrCraft | null }[];
  return rows.map((r) => r.product).filter((p): p is ProductOrCraft => !!p && p.status === "published");
}

export async function getRelatedSitesForProduct(productId: string): Promise<HeritageSite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_product_links")
    .select("site:heritage_sites(*, location:locations(*))")
    .eq("product_id", productId);
  const rows = (data ?? []) as unknown as { site: HeritageSite | null }[];
  return rows.map((r) => r.site).filter((s): s is HeritageSite => !!s && s.status === "published");
}

export async function getPublishedProducts(search?: string): Promise<ProductOrCraft[]> {
  const supabase = await createClient();
  let query = supabase.from("products_or_crafts").select(PRODUCT_SELECT).eq("status", "published");
  if (search) {
    const term = `%${search}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term}`);
  }
  const { data } = await query.order("name", { ascending: true });
  return (data as ProductOrCraft[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductOrCraft | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products_or_crafts")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as ProductOrCraft | null;
}

export async function getProductById(id: string): Promise<ProductOrCraft | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products_or_crafts").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  return data as ProductOrCraft | null;
}

export async function getAllSourcesWithLinks(): Promise<Source[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("sources").select("*").order("title");
  return (data as Source[]) ?? [];
}

export async function getSourceLinksForSource(sourceId: string): Promise<SourceLink[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("source_links")
    .select("*, heritage_site:heritage_sites(id, slug, name), product:products_or_crafts(id, slug, name)")
    .eq("source_id", sourceId);
  return (data as SourceLink[]) ?? [];
}

export async function getAllSourceLinksWithTargets(): Promise<SourceLink[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("source_links")
    .select("*, heritage_site:heritage_sites(id, slug, name), product:products_or_crafts(id, slug, name)");
  return (data as SourceLink[]) ?? [];
}
