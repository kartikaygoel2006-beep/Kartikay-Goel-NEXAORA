"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { AccessibilityLevel, ContentStatus, HeritageCategory } from "@/lib/types";

export type FormState = { error: string | null };

function parseHeritageSite(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  return {
    name,
    slug: slugify(slugInput || name),
    category: String(formData.get("category") ?? "monument") as HeritageCategory,
    era: String(formData.get("era") ?? "").trim() || null,
    location_id: String(formData.get("location_id") ?? "").trim() || null,
    short_description: String(formData.get("short_description") ?? "").trim() || null,
    historical_description: String(formData.get("historical_description") ?? "").trim() || null,
    architectural_highlights: String(formData.get("architectural_highlights") ?? "").trim() || null,
    visiting_info: String(formData.get("visiting_info") ?? "").trim() || null,
    accessibility: String(formData.get("accessibility") ?? "unknown") as AccessibilityLevel,
    fun_fact: String(formData.get("fun_fact") ?? "").trim() || null,
    fun_fact_image_url: String(formData.get("fun_fact_image_url") ?? "").trim() || null,
    fun_fact_image_alt: String(formData.get("fun_fact_image_alt") ?? "").trim() || null,
    fun_fact_image_credit: String(formData.get("fun_fact_image_credit") ?? "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    cover_image_alt: String(formData.get("cover_image_alt") ?? "").trim() || null,
    cover_image_credit: String(formData.get("cover_image_credit") ?? "").trim() || null,
    tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
    status: String(formData.get("status") ?? "draft") as ContentStatus,
    featured: formData.get("featured") === "on",
  };
}

function validateImages(values: ReturnType<typeof parseHeritageSite>): string | null {
  if (values.cover_image_url && (!values.cover_image_alt || !values.cover_image_credit)) {
    return "Cover photo needs both alt text and a photo credit.";
  }
  if (values.fun_fact_image_url && (!values.fun_fact_image_alt || !values.fun_fact_image_credit)) {
    return "Fun fact photo needs both alt text and a photo credit.";
  }
  return null;
}

export async function createHeritageSite(_prev: FormState, formData: FormData): Promise<FormState> {
  const { userId } = await assertAdminAndGetUser();
  const values = parseHeritageSite(formData);
  if (!values.name) return { error: "Name is required." };
  const imageError = validateImages(values);
  if (imageError) return { error: imageError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("heritage_sites")
    .insert({ ...values, created_by: userId })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use — choose another." : error.message };
  }

  revalidatePath("/admin/heritage-sites");
  redirect(`/admin/heritage-sites/${data.id}/edit`);
}

export async function updateHeritageSite(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const values = parseHeritageSite(formData);
  if (!values.name) return { error: "Name is required." };
  const imageError = validateImages(values);
  if (imageError) return { error: imageError };

  const supabase = await createClient();
  const { error } = await supabase.from("heritage_sites").update(values).eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use — choose another." : error.message };
  }

  revalidatePath("/admin/heritage-sites");
  revalidatePath(`/admin/heritage-sites/${id}/edit`);
  revalidatePath(`/heritage/${values.slug}`);
  return { error: null };
}

export async function deleteHeritageSite(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("heritage_sites").delete().eq("id", id);
  revalidatePath("/admin/heritage-sites");
}

export async function toggleHeritageSiteStatus(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ContentStatus;
  const supabase = await createClient();
  await supabase
    .from("heritage_sites")
    .update({ status: status === "published" ? "draft" : "published" })
    .eq("id", id);
  revalidatePath("/admin/heritage-sites");
}

export async function toggleHeritageSiteFeatured(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const featured = formData.get("featured") === "true";
  const supabase = await createClient();
  await supabase.from("heritage_sites").update({ featured: !featured }).eq("id", id);
  revalidatePath("/admin/heritage-sites");
}

async function assertAdminAndGetUser() {
  await assertAdmin();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { userId: user?.id ?? null };
}
