import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteProduct, toggleProductFeatured, toggleProductStatus } from "./actions";
import type { ProductOrCraft } from "@/lib/types";

export default async function AdminCraftsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products_or_crafts")
    .select("*, location:locations(*)")
    .order("updated_at", { ascending: false });
  const products = (data as ProductOrCraft[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-royal-900">Crafts &amp; products</h2>
        <Button href="/admin/crafts/new" size="sm">
          + New entry
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No craft or product added yet"
          description="Create your first craft or product entry."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={product.status === "published" ? "green" : "neutral"}>
                    {product.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  {product.featured && <Badge tone="gold">Featured</Badge>}
                  {product.category && <Badge tone="sandstone">{product.category}</Badge>}
                </div>
                <p className="mt-1 truncate font-medium text-royal-900">{product.name}</p>
                {product.artisan_name && <p className="text-sm text-cream-600">{product.artisan_name}</p>}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <form action={toggleProductStatus}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="status" value={product.status} />
                  <Button type="submit" variant="outline" size="sm">
                    {product.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                </form>
                <form action={toggleProductFeatured}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="featured" value={String(product.featured)} />
                  <Button type="submit" variant="outline" size="sm">
                    {product.featured ? "Unfeature" : "Feature"}
                  </Button>
                </form>
                <Link
                  href={`/admin/crafts/${product.id}/edit`}
                  className="text-sm font-medium text-royal-700 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <ConfirmSubmitButton confirmMessage="Delete this craft/product? Its photos and source links will also be removed.">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
