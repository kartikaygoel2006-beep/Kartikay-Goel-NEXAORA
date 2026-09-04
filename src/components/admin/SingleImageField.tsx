"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadMediaFile } from "@/lib/supabase/storage";
import { Input, Label, FieldHint } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function SingleImageField({
  name,
  label,
  pathPrefix,
  defaultUrl,
  defaultAlt,
  defaultCredit,
}: {
  name: string;
  label: string;
  pathPrefix: string;
  defaultUrl?: string | null;
  defaultAlt?: string | null;
  defaultCredit?: string | null;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadMediaFile(file, pathPrefix);
      setUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-cream-200 p-4">
      <p className="text-sm font-medium text-cream-800">{label}</p>

      {url && (
        <div className="relative mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-cream-100">
          <Image src={url} alt={defaultAlt || ""} fill className="object-cover" sizes="384px" />
        </div>
      )}

      <input type="hidden" name={`${name}_url`} value={url} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="text-sm text-cream-700"
        />
        {uploading && <span className="text-xs text-cream-500">Uploading…</span>}
        {url && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setUrl("")}>
            Remove photo
          </Button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${name}_alt`} required={!!url}>
            Alt text
          </Label>
          <Input id={`${name}_alt`} name={`${name}_alt`} defaultValue={defaultAlt ?? ""} />
        </div>
        <div>
          <Label htmlFor={`${name}_credit`} required={!!url}>
            Photo credit
          </Label>
          <Input id={`${name}_credit`} name={`${name}_credit`} defaultValue={defaultCredit ?? ""} />
        </div>
      </div>
      <FieldHint>Required whenever a photo is attached.</FieldHint>
    </div>
  );
}
