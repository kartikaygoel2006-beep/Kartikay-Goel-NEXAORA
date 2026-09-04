"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth";

export type FormState = { error: string | null };

function parseLocation(formData: FormData) {
  const city = String(formData.get("city") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  const description = String(formData.get("description") ?? "").trim();

  return {
    city,
    area: area || null,
    latitude: latitude ? Number(latitude) : null,
    longitude: longitude ? Number(longitude) : null,
    description: description || null,
  };
}

export async function createLocation(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = parseLocation(formData);
  if (!values.city) return { error: "City is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("locations").insert(values);
  if (error) return { error: error.message };

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function updateLocation(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const values = parseLocation(formData);
  if (!values.city) return { error: "City is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("locations").update(values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function deleteLocation(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("locations").delete().eq("id", id);
  revalidatePath("/admin/locations");
}
