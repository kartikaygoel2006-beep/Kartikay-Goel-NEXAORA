"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";
import type { ImageParentType } from "@/lib/types";

export type FormState = { error: string | null };

export async function addGalleryImage(
  parentType: ImageParentType,
  parentId: string,
  revalidateTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();

  const url = String(formData.get("url") ?? "").trim();
  const alt_text = String(formData.get("alt_text") ?? "").trim();
  const photographer_credit = String(formData.get("photographer_credit") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!url) return { error: "Upload a photo first." };
  if (!alt_text) return { error: "Alt text is required for every image." };
  if (!photographer_credit) return { error: "Photographer / image credit is required for every image." };

  const supabase = await createClient();
  const { count } = await supabase
    .from("heritage_images")
    .select("*", { count: "exact", head: true })
    .eq(parentType === "heritage_site" ? "heritage_site_id" : "product_id", parentId);

  const { error } = await supabase.from("heritage_images").insert({
    parent_type: parentType,
    heritage_site_id: parentType === "heritage_site" ? parentId : null,
    product_id: parentType === "product" ? parentId : null,
    url,
    alt_text,
    photographer_credit,
    caption,
    display_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidatePath(revalidateTo);
  return { error: null };
}

export async function deleteGalleryImage(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const revalidateTo = String(formData.get("revalidateTo"));
  const supabase = await createClient();
  await supabase.from("heritage_images").delete().eq("id", id);
  revalidatePath(revalidateTo);
}
