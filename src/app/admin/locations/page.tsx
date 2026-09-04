import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteLocation } from "./actions";
import type { Location } from "@/lib/types";

export default async function AdminLocationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").order("city");
  const locations = (data as Location[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-royal-900">Locations</h2>
        <Button href="/admin/locations/new" size="sm">
          + New location
        </Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No locations added yet"
          description="Add the cities and localities you'll reference from monuments and crafts."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {locations.map((location) => (
            <Card key={location.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-royal-900">
                  {location.city}
                  {location.area ? `, ${location.area}` : ""}
                </p>
                {location.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-cream-600">{location.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/locations/${location.id}/edit`}
                  className="text-sm font-medium text-royal-700 hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteLocation}>
                  <input type="hidden" name="id" value={location.id} />
                  <ConfirmSubmitButton confirmMessage="Delete this location? This cannot be undone.">
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
