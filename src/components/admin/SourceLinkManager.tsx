"use client";

import { useActionState } from "react";
import { unlinkSource, type FormState } from "@/app/admin/links/actions";
import { Select, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { SOURCE_TYPES } from "@/lib/types";
import type { Source, SourceLink } from "@/lib/types";

const initialState: FormState = { error: null };

export function SourceLinkManager({
  links,
  allSources,
  revalidateTo,
  linkAction,
}: {
  links: SourceLink[];
  allSources: Source[];
  revalidateTo: string;
  linkAction: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(linkAction, initialState);
  const linkedIds = new Set(links.map((l) => l.source_id));
  const available = allSources.filter((s) => !linkedIds.has(s.id));

  return (
    <div>
      {links.length === 0 ? (
        <p className="text-sm text-cream-600">No sources linked yet.</p>
      ) : (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-cream-200 bg-white p-3"
            >
              <div className="text-sm">
                <p className="font-medium text-royal-900">{link.source?.title}</p>
                <p className="text-xs text-cream-600">
                  {SOURCE_TYPES.find((t) => t.value === link.source?.source_type)?.label}
                  {link.section_label ? ` · Supports: ${link.section_label}` : ""}
                </p>
              </div>
              <form action={unlinkSource}>
                <input type="hidden" name="id" value={link.id} />
                <input type="hidden" name="revalidateTo" value={revalidateTo} />
                <ConfirmSubmitButton confirmMessage="Remove this source link?" variant="ghost">
                  Remove
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      {allSources.length === 0 ? (
        <p className="mt-4 text-sm text-cream-600">
          No sources exist yet. Add one under &ldquo;Sources &amp; credits&rdquo; first.
        </p>
      ) : (
        <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-48">
            <label htmlFor="source_id" className="mb-1.5 block text-sm font-medium text-cream-800">
              Link a source
            </label>
            <Select id="source_id" name="source_id" required defaultValue="">
              <option value="" disabled>
                Select a source…
              </option>
              {available.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-48">
            <label htmlFor="section_label" className="mb-1.5 block text-sm font-medium text-cream-800">
              Supports which section? (optional)
            </label>
            <Input id="section_label" name="section_label" placeholder="e.g. Historical description" />
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Linking…" : "Link source"}
          </Button>
        </form>
      )}
      {state.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
    </div>
  );
}
