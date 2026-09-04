"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";
import type { SourceType } from "@/lib/types";

export type FormState = { error: string | null };

function parseSource(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    author_organisation: String(formData.get("author_organisation") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
    source_type: String(formData.get("source_type") ?? "article") as SourceType,
    publication_date: String(formData.get("publication_date") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createSource(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = parseSource(formData);
  if (!values.title) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("sources").insert(values);
  if (error) return { error: error.message };

  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function updateSource(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const values = parseSource(formData);
  if (!values.title) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("sources").update(values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function deleteSource(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("sources").delete().eq("id", id);
  revalidatePath("/admin/sources");
}
