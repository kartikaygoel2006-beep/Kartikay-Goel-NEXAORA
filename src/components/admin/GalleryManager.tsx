"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { uploadMediaFile } from "@/lib/supabase/storage";
import { deleteGalleryImage, type FormState } from "@/app/admin/images/actions";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import type { HeritageImage } from "@/lib/types";

const initialState: FormState = { error: null };

export function GalleryManager({
  images,
  pathPrefix,
  revalidateTo,
  addAction,
}: {
  images: HeritageImage[];
  pathPrefix: string;
  revalidateTo: string;
  addAction: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(addAction, initialState);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.error === null) {
      setUrl("");
      setFormKey((k) => k + 1);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadMediaFile(file, pathPrefix);
      setUrl(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {images.length === 0 ? (
        <p className="text-sm text-cream-600">No photos added yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-xl border border-cream-200">
              <div className="relative aspect-[4/3] w-full bg-cream-100">
                <Image src={image.url} alt={image.alt_text} fill className="object-cover" sizes="240px" />
              </div>
              <div className="p-3 text-xs text-cream-700">
                <p className="line-clamp-1 font-medium text-cream-900">{image.alt_text}</p>
                <p className="mt-0.5 line-clamp-1">Credit: {image.photographer_credit}</p>
                {image.caption && <p className="mt-0.5 line-clamp-2">{image.caption}</p>}
                <form action={deleteGalleryImage} className="mt-2">
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="revalidateTo" value={revalidateTo} />
                  <ConfirmSubmitButton confirmMessage="Delete this photo?">Delete</ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form key={formKey} action={formAction} className="mt-6 max-w-md rounded-xl border border-dashed border-cream-300 p-4">
        <p className="text-sm font-medium text-cream-800">Add a photo</p>
        <input type="hidden" name="url" value={url} />
        <div className="mt-2 flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="text-sm text-cream-700"
          />
          {uploading && <span className="text-xs text-cream-500">Uploading…</span>}
        </div>
        {url && (
          <div className="relative mt-3 aspect-video w-40 overflow-hidden rounded-lg">
            <Image src={url} alt="" fill className="object-cover" sizes="160px" />
          </div>
        )}
        {uploadError && <p className="mt-1 text-xs text-red-700">{uploadError}</p>}

        <div className="mt-3 space-y-3">
          <div>
            <Label htmlFor="alt_text" required>
              Alt text
            </Label>
            <Input id="alt_text" name="alt_text" required />
          </div>
          <div>
            <Label htmlFor="photographer_credit" required>
              Photographer / image credit
            </Label>
            <Input id="photographer_credit" name="photographer_credit" required />
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea id="caption" name="caption" className="min-h-16" />
          </div>
        </div>

        {state.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}

        <Button type="submit" size="sm" className="mt-3" disabled={pending || uploading || !url}>
          {pending ? "Adding…" : "Add photo"}
        </Button>
      </form>
    </div>
  );
}
