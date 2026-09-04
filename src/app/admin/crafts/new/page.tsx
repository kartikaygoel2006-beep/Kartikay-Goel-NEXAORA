import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";
import type { Location } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").order("city");
  const locations = (data as Location[]) ?? [];

  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">New craft / product</h2>
      <p className="mt-1 text-sm text-cream-600">
        Save the basic details first — photos and source links can be added right after.
      </p>
      <div className="mt-6">
        <ProductForm locations={locations} action={createProduct} />
      </div>
    </div>
  );
}
