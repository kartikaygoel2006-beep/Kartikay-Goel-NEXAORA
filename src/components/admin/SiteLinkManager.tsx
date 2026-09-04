"use client";

import { useActionState } from "react";
import { unlinkProduct, type FormState } from "@/app/admin/links/actions";
import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import type { HeritageSite } from "@/lib/types";

const initialState: FormState = { error: null };

export function SiteLinkManager({
  productId,
  linkedSites,
  allSites,
  revalidateTo,
  linkAction,
}: {
  productId: string;
  linkedSites: HeritageSite[];
  allSites: HeritageSite[];
  revalidateTo: string;
  linkAction: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(linkAction, initialState);
  const linkedIds = new Set(linkedSites.map((s) => s.id));
  const available = allSites.filter((s) => !linkedIds.has(s.id));

  return (
    <div>
      {linkedSites.length === 0 ? (
        <p className="text-sm text-cream-600">No monuments or forts linked yet.</p>
      ) : (
        <ul className="space-y-2">
          {linkedSites.map((site) => (
            <li
              key={site.id}
              className="flex items-center justify-between rounded-lg border border-cream-200 bg-white p-3"
            >
              <p className="text-sm font-medium text-royal-900">{site.name}</p>
              <form action={unlinkProduct}>
                <input type="hidden" name="heritage_site_id" value={site.id} />
                <input type="hidden" name="product_id" value={productId} />
                <input type="hidden" name="revalidateTo" value={revalidateTo} />
                <ConfirmSubmitButton confirmMessage="Remove this linked monument/fort?" variant="ghost">
                  Remove
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      {allSites.length === 0 ? (
        <p className="mt-4 text-sm text-cream-600">
          No monuments or forts exist yet. Add one under &ldquo;Monuments &amp; Forts&rdquo; first.
        </p>
      ) : (
        <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-48">
            <label htmlFor="heritage_site_id" className="mb-1.5 block text-sm font-medium text-cream-800">
              Link a monument / fort
            </label>
            <Select id="heritage_site_id" name="heritage_site_id" required defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {available.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Linking…" : "Link monument / fort"}
          </Button>
        </form>
      )}
      {state.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
    </div>
  );
}
