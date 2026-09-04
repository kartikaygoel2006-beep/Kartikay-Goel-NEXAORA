import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

async function countRows(table: string) {
  const supabase = await createClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminOverviewPage() {
  const [sites, drafts, products, sources, locations] = await Promise.all([
    countRows("heritage_sites"),
    (async () => {
      const supabase = await createClient();
      const { count } = await supabase
        .from("heritage_sites")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft");
      return count ?? 0;
    })(),
    countRows("products_or_crafts"),
    countRows("sources"),
    countRows("locations"),
  ]);

  const tiles = [
    { label: "Monuments & forts", value: sites, href: "/admin/heritage-sites" },
    { label: "Draft entries", value: drafts, href: "/admin/heritage-sites?status=draft" },
    { label: "Crafts & products", value: products, href: "/admin/crafts" },
    { label: "Sources", value: sources, href: "/admin/sources" },
    { label: "Locations", value: locations, href: "/admin/locations" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card className="p-6 transition-shadow hover:shadow-md">
              <p className="text-3xl font-semibold text-royal-900">{tile.value}</p>
              <p className="mt-1 text-sm text-cream-700">{tile.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-display text-xl text-royal-900">Getting started</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-cream-800">
          <li>Add a location under &ldquo;Locations&rdquo; for each city/area you&rsquo;ll reference.</li>
          <li>Create a monument or fort, save it as a draft, then add photos and sources.</li>
          <li>Add crafts &amp; products and optionally link them to monuments.</li>
          <li>Enter research sources and link them to the content they support.</li>
          <li>Publish entries and mark your best ones as &ldquo;Featured&rdquo; to show them on the home page.</li>
          <li>Set the home page hero and About page content under &ldquo;Home &amp; About Content&rdquo;.</li>
        </ol>
      </Card>
    </div>
  );
}
