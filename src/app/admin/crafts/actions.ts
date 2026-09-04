"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ContentStatus } from "@/lib/types";

export type FormState = { error: string | null };

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    name,
    slug: slugify(slugInput || name),
    category: String(formData.get("category") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    history_origin: String(formData.get("history_origin") ?? "").trim() || null,
    artisan_name: String(formData.get("artisan_name") ?? "").trim() || null,
    contact_link: String(formData.get("contact_link") ?? "").trim() || null,
    related_location_id: String(formData.get("related_location_id") ?? "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    cover_image_alt: String(formData.get("cover_image_alt") ?? "").trim() || null,
    cover_image_credit: String(formData.get("cover_image_credit") ?? "").trim() || null,
    status: String(formData.get("status") ?? "draft") as ContentStatus,
    featured: formData.get("featured") === "on",
  };
}

function validateImages(values: ReturnType<typeof parseProduct>): string | null {
  if (values.cover_image_url && (!values.cover_image_alt || !values.cover_image_credit)) {
    return "Cover photo needs both alt text and a photo credit.";
  }
  return null;
}

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const values = parseProduct(formData);
  if (!values.name) return { error: "Name is required." };
  const imageError = validateImages(values);
  if (imageError) return { error: imageError };

  const { data, error } = await supabase
    .from("products_or_crafts")
    .insert({ ...values, created_by: user?.id ?? null })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use — choose another." : error.message };
  }

  revalidatePath("/admin/crafts");
  redirect(`/admin/crafts/${data.id}/edit`);
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const values = parseProduct(formData);
  if (!values.name) return { error: "Name is required." };
  const imageError = validateImages(values);
  if (imageError) return { error: imageError };

  const supabase = await createClient();
  const { error } = await supabase.from("products_or_crafts").update(values).eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "That slug is already in use — choose another." : error.message };
  }

  revalidatePath("/admin/crafts");
  revalidatePath(`/admin/crafts/${id}/edit`);
  revalidatePath(`/crafts/${values.slug}`);
  return { error: null };
}

export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("products_or_crafts").delete().eq("id", id);
  revalidatePath("/admin/crafts");
}

export async function toggleProductStatus(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ContentStatus;
  const supabase = await createClient();
  await supabase
    .from("products_or_crafts")
    .update({ status: status === "published" ? "draft" : "published" })
    .eq("id", id);
  revalidatePath("/admin/crafts");
}

export async function toggleProductFeatured(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const featured = formData.get("featured") === "true";
  const supabase = await createClient();
  await supabase.from("products_or_crafts").update({ featured: !featured }).eq("id", id);
  revalidatePath("/admin/crafts");
}
