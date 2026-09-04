import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SourceForm } from "../../SourceForm";
import { updateSource } from "../../actions";
import type { Source } from "@/lib/types";

export default async function EditSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("sources").select("*").eq("id", id).maybeSingle();
  const source = data as Source | null;
  if (!source) notFound();

  const boundUpdate = updateSource.bind(null, id);

  return (
    <div>
      <h2 className="font-display text-2xl text-royal-900">Edit source</h2>
      <div className="mt-6">
        <SourceForm source={source} action={boundUpdate} />
      </div>
    </div>
  );
}
