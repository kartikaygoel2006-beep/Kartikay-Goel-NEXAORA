import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LocationForm } from "../../LocationForm";
import { updateLocation } from "../../actions";
import type { Location } from "@/lib/types";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").eq("id", id).maybeSingle();
  const location = data as Location | null;
  if (!location) notFound();

  const boundUpdate = updateLocation.bind(null, id);

  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">Edit location</h2>
      <div className="mt-6">
        <LocationForm location={location} action={boundUpdate} />
      </div>
    </div>
  );
}
