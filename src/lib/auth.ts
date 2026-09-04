import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getCurrentProfile(): Promise<{
  userId: string | null;
  email: string | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, email: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { userId: user.id, email: user.email ?? null, profile: profile as Profile | null };
}

export async function requireAdmin() {
  const { profile, ...rest } = await getCurrentProfile();
  return { ...rest, profile, isAdmin: profile?.role === "admin" };
}

export class NotAdminError extends Error {
  constructor() {
    super("You must be an administrator to perform this action.");
  }
}

export async function assertAdmin() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) throw new NotAdminError();
}
