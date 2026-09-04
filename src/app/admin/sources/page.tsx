import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteSource } from "./actions";
import { SOURCE_TYPES } from "@/lib/types";
import type { Source } from "@/lib/types";

export default async function AdminSourcesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("sources").select("*").order("title");
  const sources = (data as Source[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-royal-900">Sources &amp; credits</h2>
        <Button href="/admin/sources/new" size="sm">
          + New source
        </Button>
      </div>

      {sources.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No sources added yet"
          description="Add research sources, then link them to monuments, forts and products."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {sources.map((source) => (
            <Card key={source.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge tone="royal">
                    {SOURCE_TYPES.find((t) => t.value === source.source_type)?.label}
                  </Badge>
                </div>
                <p className="mt-1 truncate font-medium text-royal-900">{source.title}</p>
                {source.author_organisation && (
                  <p className="text-sm text-cream-600">{source.author_organisation}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/sources/${source.id}/edit`}
                  className="text-sm font-medium text-royal-700 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteSource}>
                  <input type="hidden" name="id" value={source.id} />
                  <ConfirmSubmitButton confirmMessage="Delete this source? Any links to monuments or products will also be removed.">
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
