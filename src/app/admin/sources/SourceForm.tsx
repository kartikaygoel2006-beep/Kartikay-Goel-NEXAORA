"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, Select, FormRow } from "@/components/ui/Field";
import { SOURCE_TYPES } from "@/lib/types";
import type { Source } from "@/lib/types";
import type { FormState } from "./actions";

const initialState: FormState = { error: null };

export function SourceForm({
  source,
  action,
}: {
  source?: Source;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-1">
      <FormRow>
        <Label htmlFor="title" required>
          Source title
        </Label>
        <Input id="title" name="title" required defaultValue={source?.title} />
      </FormRow>
      <FormRow>
        <Label htmlFor="author_organisation">Author / organisation</Label>
        <Input id="author_organisation" name="author_organisation" defaultValue={source?.author_organisation ?? ""} />
      </FormRow>
      <FormRow>
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" type="url" placeholder="https://" defaultValue={source?.url ?? ""} />
      </FormRow>
      <div className="grid grid-cols-2 gap-4">
        <FormRow>
          <Label htmlFor="source_type" required>
            Source type
          </Label>
          <Select id="source_type" name="source_type" defaultValue={source?.source_type ?? "article"}>
            {SOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </FormRow>
        <FormRow>
          <Label htmlFor="publication_date">Publication date</Label>
          <Input
            id="publication_date"
            name="publication_date"
            type="date"
            defaultValue={source?.publication_date ?? ""}
          />
        </FormRow>
      </div>
      <FormRow>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={source?.notes ?? ""} />
      </FormRow>

      {state.error && <p className="mb-4 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : source ? "Save changes" : "Create source"}
      </Button>
    </form>
  );
}
