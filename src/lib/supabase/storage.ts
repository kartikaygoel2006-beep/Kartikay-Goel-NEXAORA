import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export async function uploadMediaFile(file: File, pathPrefix: string): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${pathPrefix}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
