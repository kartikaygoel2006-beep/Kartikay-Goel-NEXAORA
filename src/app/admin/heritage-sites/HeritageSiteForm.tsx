"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, Select, Checkbox, FormRow } from "@/components/ui/Field";
import { SingleImageField } from "@/components/admin/SingleImageField";
import { ACCESSIBILITY_LEVELS, HERITAGE_CATEGORIES } from "@/lib/types";
import type { HeritageSite, Location } from "@/lib/types";
import type { FormState } from "./actions";

const initialState: FormState = { error: null };

export function HeritageSiteForm({
  site,
  locations,
  action,
}: {
  site?: HeritageSite;
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
          <Input id="name" name="name" required defaultValue={site?.name} />
        </FormRow>
        <FormRow>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" name="slug" placeholder="auto-generated from name" defaultValue={site?.slug} />
        </FormRow>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormRow>
          <Label htmlFor="category" required>
            Category
          </Label>
          <Select id="category" name="category" defaultValue={site?.category ?? "monument"}>
            {HERITAGE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow>
          <Label htmlFor="era">Era</Label>
          <Input id="era" name="era" placeholder="e.g. Mughal era, 18th century" defaultValue={site?.era ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="location_id">Location</Label>
          <Select id="location_id" name="location_id" defaultValue={site?.location_id ?? ""}>
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
        <Label htmlFor="short_description">Short description</Label>
        <Textarea
          id="short_description"
          name="short_description"
          className="min-h-16"
          defaultValue={site?.short_description ?? ""}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="historical_description">Historical description</Label>
        <Textarea
          id="historical_description"
          name="historical_description"
          defaultValue={site?.historical_description ?? ""}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="architectural_highlights">Architectural highlights</Label>
        <Textarea
          id="architectural_highlights"
          name="architectural_highlights"
          defaultValue={site?.architectural_highlights ?? ""}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="visiting_info">Visiting information</Label>
        <Textarea id="visiting_info" name="visiting_info" defaultValue={site?.visiting_info ?? ""} />
      </FormRow>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="accessibility">Accessibility</Label>
          <Select id="accessibility" name="accessibility" defaultValue={site?.accessibility ?? "unknown"}>
            {ACCESSIBILITY_LEVELS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" name="tags" placeholder="comma, separated, tags" defaultValue={site?.tags?.join(", ") ?? ""} />
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="fun_fact">Fun fact</Label>
        <Textarea id="fun_fact" name="fun_fact" className="min-h-20" defaultValue={site?.fun_fact ?? ""} />
      </FormRow>

      <FormRow>
        <SingleImageField
          name="cover_image"
          label="Cover photo"
          pathPrefix="heritage-covers"
          defaultUrl={site?.cover_image_url}
          defaultAlt={site?.cover_image_alt}
          defaultCredit={site?.cover_image_credit}
        />
      </FormRow>
      <FormRow>
        <SingleImageField
          name="fun_fact_image"
          label="Fun fact photo"
          pathPrefix="heritage-fun-facts"
          defaultUrl={site?.fun_fact_image_url}
          defaultAlt={site?.fun_fact_image_alt}
          defaultCredit={site?.fun_fact_image_credit}
        />
      </FormRow>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={site?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </FormRow>
        <FormRow className="flex items-end">
          <Checkbox name="featured" defaultChecked={site?.featured} label="Feature on home page" />
        </FormRow>
      </div>

      {state.error && <p className="mb-4 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : site ? "Save changes" : "Create monument / fort"}
      </Button>
    </form>
  );
}
