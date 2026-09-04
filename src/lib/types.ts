// Hand-written types mirroring supabase/schema.sql.
// If you change the SQL schema, update these types (or run
// `supabase gen types typescript` against your project and replace this file).

export type UserRole = "admin" | "visitor";
export type ContentStatus = "draft" | "published";
export type HeritageCategory =
  | "monument"
  | "fort"
  | "temple"
  | "haveli"
  | "garden"
  | "museum"
  | "other";
export type AccessibilityLevel =
  | "accessible"
  | "partially_accessible"
  | "not_accessible"
  | "unknown";
export type SourceType =
  | "primary"
  | "government"
  | "book"
  | "article"
  | "archive"
  | "image_credit";
export type ImageParentType = "heritage_site" | "product";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeritageSite {
  id: string;
  slug: string;
  name: string;
  category: HeritageCategory;
  era: string | null;
  location_id: string | null;
  short_description: string | null;
  historical_description: string | null;
  architectural_highlights: string | null;
  visiting_info: string | null;
  accessibility: AccessibilityLevel;
  fun_fact: string | null;
  fun_fact_image_url: string | null;
  fun_fact_image_alt: string | null;
  fun_fact_image_credit: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  tags: string[];
  status: ContentStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  location?: Location | null;
}

export interface ProductOrCraft {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  history_origin: string | null;
  artisan_name: string | null;
  contact_link: string | null;
  related_location_id: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  status: ContentStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  location?: Location | null;
}

export interface HeritageImage {
  id: string;
  parent_type: ImageParentType;
  heritage_site_id: string | null;
  product_id: string | null;
  url: string;
  alt_text: string;
  caption: string | null;
  photographer_credit: string;
  display_order: number;
  created_at: string;
}

export interface Source {
  id: string;
  title: string;
  author_organisation: string | null;
  url: string | null;
  source_type: SourceType;
  publication_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceLink {
  id: string;
  source_id: string;
  heritage_site_id: string | null;
  product_id: string | null;
  section_label: string | null;
  created_at: string;
  // joined
  source?: Source;
  heritage_site?: Pick<HeritageSite, "id" | "slug" | "name"> | null;
  product?: Pick<ProductOrCraft, "id" | "slug" | "name"> | null;
}

export interface Favourite {
  id: string;
  user_id: string;
  heritage_site_id: string | null;
  product_id: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: true;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  hero_image_credit: string | null;
  hero_cta_primary_label: string | null;
  hero_cta_primary_href: string | null;
  hero_cta_secondary_label: string | null;
  hero_cta_secondary_href: string | null;
  about_title: string | null;
  about_body: string | null;
  about_team: string | null;
  about_contact_email: string | null;
  about_contact_phone: string | null;
  updated_at: string;
}

export const HERITAGE_CATEGORIES: { value: HeritageCategory; label: string }[] = [
  { value: "monument", label: "Monument" },
  { value: "fort", label: "Fort" },
  { value: "temple", label: "Temple" },
  { value: "haveli", label: "Haveli" },
  { value: "garden", label: "Garden" },
  { value: "museum", label: "Museum" },
  { value: "other", label: "Other" },
];

export const ACCESSIBILITY_LEVELS: { value: AccessibilityLevel; label: string }[] = [
  { value: "accessible", label: "Accessible" },
  { value: "partially_accessible", label: "Partially accessible" },
  { value: "not_accessible", label: "Not accessible" },
  { value: "unknown", label: "Not specified" },
];

export const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: "primary", label: "Primary source" },
  { value: "government", label: "Government source" },
  { value: "book", label: "Book" },
  { value: "article", label: "Article" },
  { value: "archive", label: "Archive" },
  { value: "image_credit", label: "Image credit" },
];
