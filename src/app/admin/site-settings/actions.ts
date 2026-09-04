"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";

export type FormState = { error: string | null; success?: boolean };

export async function updateSiteSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();

  const values = {
    hero_title: String(formData.get("hero_title") ?? "").trim() || null,
    hero_subtitle: String(formData.get("hero_subtitle") ?? "").trim() || null,
    hero_image_url: String(formData.get("hero_image_url") ?? "").trim() || null,
    hero_image_alt: String(formData.get("hero_image_alt") ?? "").trim() || null,
    hero_image_credit: String(formData.get("hero_image_credit") ?? "").trim() || null,
    hero_cta_primary_label: String(formData.get("hero_cta_primary_label") ?? "").trim() || null,
    hero_cta_primary_href: String(formData.get("hero_cta_primary_href") ?? "").trim() || null,
    hero_cta_secondary_label: String(formData.get("hero_cta_secondary_label") ?? "").trim() || null,
    hero_cta_secondary_href: String(formData.get("hero_cta_secondary_href") ?? "").trim() || null,
    about_title: String(formData.get("about_title") ?? "").trim() || null,
    about_body: String(formData.get("about_body") ?? "").trim() || null,
    about_team: String(formData.get("about_team") ?? "").trim() || null,
    about_contact_email: String(formData.get("about_contact_email") ?? "").trim() || null,
    about_contact_phone: String(formData.get("about_contact_phone") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(values).eq("id", true);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/site-settings");
  return { error: null, success: true };
}
