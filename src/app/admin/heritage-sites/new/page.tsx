import { createClient } from "@/lib/supabase/server";
import { HeritageSiteForm } from "../HeritageSiteForm";
import { createHeritageSite } from "../actions";
import type { Location } from "@/lib/types";

export default async function NewHeritageSitePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").order("city");
  const locations = (data as Location[]) ?? [];

  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">New monument / fort</h2>
      <p className="mt-1 text-sm text-cream-600">
        Save the basic details first — photo galleries and source links can be added right after.
      </p>
      <div className="mt-6">
        <HeritageSiteForm locations={locations} action={createHeritageSite} />
      </div>
    </div>
  );
}
