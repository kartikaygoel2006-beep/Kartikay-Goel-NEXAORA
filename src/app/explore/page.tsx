import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterBar } from "@/components/explore/FilterBar";
import { SiteCard } from "@/components/heritage/SiteCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { getHeritageEras, getLocations, getPublishedHeritageSites } from "@/lib/queries";
import type { AccessibilityLevel, HeritageCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Explore Jaipur",
  description: "Search and filter Jaipur's monuments and forts by category, era, area and accessibility.",
};

type SearchParams = {
  search?: string;
  category?: string;
  era?: string;
  area?: string;
  accessibility?: string;
  featured?: string;
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [sites, eras, locations] = await Promise.all([
    getPublishedHeritageSites({
      search: params.search,
      category: (params.category as HeritageCategory) || "",
      era: params.era,
      area: params.area,
      accessibility: (params.accessibility as AccessibilityLevel) || "",
      featured: params.featured === "true",
    }),
    getHeritageEras(),
    getLocations(),
  ]);

  const areas = Array.from(new Set(locations.map((l) => l.area).filter(Boolean))) as string[];

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Explore"
        title="Monuments &amp; Forts of Jaipur"
        description="Browse every published heritage site. Use the filters to narrow down by category, era, area or accessibility."
      />

      <Suspense fallback={null}>
        <FilterBar eras={eras} areas={areas} />
      </Suspense>

      {sites.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No monument added yet"
          description="No published monuments or forts match these filters. The administrator can add entries from the admin dashboard."
        />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </Container>
  );
}
