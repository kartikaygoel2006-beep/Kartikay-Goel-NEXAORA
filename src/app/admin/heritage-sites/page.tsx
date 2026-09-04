import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteHeritageSite, toggleHeritageSiteFeatured, toggleHeritageSiteStatus } from "./actions";
import { HERITAGE_CATEGORIES } from "@/lib/types";
import type { HeritageSite } from "@/lib/types";

export default async function AdminHeritageSitesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("heritage_sites")
    .select("*, location:locations(*)")
    .order("updated_at", { ascending: false });
  const sites = (data as HeritageSite[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-royal-900">Monuments &amp; forts</h2>
        <Button href="/admin/heritage-sites/new" size="sm">
          + New entry
        </Button>
      </div>

      {sites.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No monument added yet"
          description="Create your first monument or fort entry."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {sites.map((site) => (
            <Card key={site.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={site.status === "published" ? "green" : "neutral"}>
                    {site.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  {site.featured && <Badge tone="gold">Featured</Badge>}
                  <Badge tone="sandstone">
                    {HERITAGE_CATEGORIES.find((c) => c.value === site.category)?.label}
                  </Badge>
                </div>
                <p className="mt-1 truncate font-medium text-royal-900">{site.name}</p>
                {site.location && (
                  <p className="text-sm text-cream-600">
                    {[site.location.area, site.location.city].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <form action={toggleHeritageSiteStatus}>
                  <input type="hidden" name="id" value={site.id} />
                  <input type="hidden" name="status" value={site.status} />
                  <Button type="submit" variant="outline" size="sm">
                    {site.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                </form>
                <form action={toggleHeritageSiteFeatured}>
                  <input type="hidden" name="id" value={site.id} />
                  <input type="hidden" name="featured" value={String(site.featured)} />
                  <Button type="submit" variant="outline" size="sm">
                    {site.featured ? "Unfeature" : "Feature"}
                  </Button>
                </form>
                <Link
                  href={`/admin/heritage-sites/${site.id}/edit`}
                  className="text-sm font-medium text-royal-700 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteHeritageSite}>
                  <input type="hidden" name="id" value={site.id} />
                  <ConfirmSubmitButton confirmMessage="Delete this monument/fort? Its photos, source links and craft links will also be removed.">
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
