"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, FormRow } from "@/components/ui/Field";
import type { Location } from "@/lib/types";
import type { FormState } from "./actions";

const initialState: FormState = { error: null };

export function LocationForm({
  location,
  action,
}: {
  location?: Location;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-1">
      <FormRow>
        <Label htmlFor="city" required>
          City
        </Label>
        <Input id="city" name="city" required defaultValue={location?.city} placeholder="e.g. Jaipur" />
      </FormRow>
      <FormRow>
        <Label htmlFor="area">Locality / area</Label>
        <Input id="area" name="area" defaultValue={location?.area ?? ""} placeholder="e.g. Pink City / Amer" />
      </FormRow>
      <div className="grid grid-cols-2 gap-4">
        <FormRow>
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" defaultValue={location?.latitude ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" defaultValue={location?.longitude ?? ""} />
        </FormRow>
      </div>
      <FormRow>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={location?.description ?? ""} />
      </FormRow>

      {state.error && <p className="mb-4 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : location ? "Save changes" : "Create location"}
      </Button>
    </form>
  );
}
