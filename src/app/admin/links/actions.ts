"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";
import type { ImageParentType } from "@/lib/types";

export type FormState = { error: string | null };

export async function linkSource(
  parentType: ImageParentType,
  parentId: string,
  revalidateTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const source_id = String(formData.get("source_id") ?? "");
  const section_label = String(formData.get("section_label") ?? "").trim() || null;

  if (!source_id) return { error: "Choose a source to link." };

  const supabase = await createClient();
  const { error } = await supabase.from("source_links").insert({
    source_id,
    heritage_site_id: parentType === "heritage_site" ? parentId : null,
    product_id: parentType === "product" ? parentId : null,
    section_label,
  });

  if (error) return { error: error.message };
  revalidatePath(revalidateTo);
  return { error: null };
}

export async function unlinkSource(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const revalidateTo = String(formData.get("revalidateTo"));
  const supabase = await createClient();
  await supabase.from("source_links").delete().eq("id", id);
  revalidatePath(revalidateTo);
}

export async function linkProduct(
  heritageSiteId: string,
  revalidateTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const product_id = String(formData.get("product_id") ?? "");
  if (!product_id) return { error: "Choose a craft/product to link." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_product_links")
    .insert({ heritage_site_id: heritageSiteId, product_id });

  if (error) return { error: error.message };
  revalidatePath(revalidateTo);
  return { error: null };
}

export async function linkSite(
  productId: string,
  revalidateTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const heritage_site_id = String(formData.get("heritage_site_id") ?? "");
  if (!heritage_site_id) return { error: "Choose a monument/fort to link." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_product_links")
    .insert({ heritage_site_id, product_id: productId });

  if (error) return { error: error.message };
  revalidatePath(revalidateTo);
  return { error: null };
}

export async function unlinkProduct(formData: FormData) {
  await assertAdmin();
  const heritage_site_id = String(formData.get("heritage_site_id"));
  const product_id = String(formData.get("product_id"));
  const revalidateTo = String(formData.get("revalidateTo"));
  const supabase = await createClient();
  await supabase
    .from("site_product_links")
    .delete()
    .eq("heritage_site_id", heritage_site_id)
    .eq("product_id", product_id);
  revalidatePath(revalidateTo);
}
