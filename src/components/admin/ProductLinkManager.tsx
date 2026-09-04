"use client";

import { useActionState } from "react";
import { unlinkProduct, type FormState } from "@/app/admin/links/actions";
import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import type { ProductOrCraft } from "@/lib/types";

const initialState: FormState = { error: null };

export function ProductLinkManager({
  heritageSiteId,
  linkedProducts,
  allProducts,
  revalidateTo,
  linkAction,
}: {
  heritageSiteId: string;
  linkedProducts: ProductOrCraft[];
  allProducts: ProductOrCraft[];
  revalidateTo: string;
  linkAction: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(linkAction, initialState);
  const linkedIds = new Set(linkedProducts.map((p) => p.id));
  const available = allProducts.filter((p) => !linkedIds.has(p.id));

  return (
    <div>
      {linkedProducts.length === 0 ? (
        <p className="text-sm text-cream-600">No crafts or products linked yet.</p>
      ) : (
        <ul className="space-y-2">
          {linkedProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-cream-200 bg-white p-3"
            >
              <p className="text-sm font-medium text-royal-900">{product.name}</p>
              <form action={unlinkProduct}>
                <input type="hidden" name="heritage_site_id" value={heritageSiteId} />
                <input type="hidden" name="product_id" value={product.id} />
                <input type="hidden" name="revalidateTo" value={revalidateTo} />
                <ConfirmSubmitButton confirmMessage="Remove this linked product?" variant="ghost">
                  Remove
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      {allProducts.length === 0 ? (
        <p className="mt-4 text-sm text-cream-600">
          No crafts or products exist yet. Add one under &ldquo;Crafts &amp; Products&rdquo; first.
        </p>
      ) : (
        <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-48">
            <label htmlFor="product_id" className="mb-1.5 block text-sm font-medium text-cream-800">
              Link a craft / product
            </label>
            <Select id="product_id" name="product_id" required defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Linking…" : "Link product"}
          </Button>
        </form>
      )}
      {state.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
    </div>
  );
}
