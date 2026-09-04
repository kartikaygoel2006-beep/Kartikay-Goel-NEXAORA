"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, Select, Checkbox, FormRow } from "@/components/ui/Field";
import { SingleImageField } from "@/components/admin/SingleImageField";
import type { Location, ProductOrCraft } from "@/lib/types";
import type { FormState } from "./actions";

const initialState: FormState = { error: null };

export function ProductForm({
  product,
  locations,
  action,
}: {
  product?: ProductOrCraft;
  locations: Location[];
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-3xl space-y-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input id="name" name="name" required defaultValue={product?.name} />
        </FormRow>
        <FormRow>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" placeholder="auto-generated from name" defaultValue={product?.slug} />
        </FormRow>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="e.g. Blue pottery, Textiles" defaultValue={product?.category ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="related_location_id">Related location</Label>
          <Select id="related_location_id" name="related_location_id" defaultValue={product?.related_location_id ?? ""}>
            <option value="">No location set</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.city}
                {loc.area ? `, ${loc.area}` : ""}
              </option>
            ))}
          </Select>
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </FormRow>
      <FormRow>
        <Label htmlFor="history_origin">History / origin</Label>
        <Textarea id="history_origin" name="history_origin" defaultValue={product?.history_origin ?? ""} />
      </FormRow>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="artisan_name">Artisan / business name</Label>
          <Input id="artisan_name" name="artisan_name" defaultValue={product?.artisan_name ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="contact_link">Availability / contact link</Label>
          <Input id="contact_link" name="contact_link" type="url" placeholder="https://" defaultValue={product?.contact_link ?? ""} />
        </FormRow>
      </div>

      <FormRow>
        <SingleImageField
          name="cover_image"
          label="Cover photo"
          pathPrefix="craft-covers"
          defaultUrl={product?.cover_image_url}
          defaultAlt={product?.cover_image_alt}
          defaultCredit={product?.cover_image_credit}
        />
      </FormRow>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={product?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </FormRow>
        <FormRow className="flex items-end">
          <Checkbox name="featured" defaultChecked={product?.featured} label="Feature on home page" />
        </FormRow>
      </div>

      {state.error && <p className="mb-4 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : product ? "Save changes" : "Create craft / product"}
      </Button>
    </form>
  );
}
