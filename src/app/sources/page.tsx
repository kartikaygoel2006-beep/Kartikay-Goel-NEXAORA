import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllSourceLinksWithTargets, getAllSourcesWithLinks } from "@/lib/queries";
import { SOURCE_TYPES } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research Sources",
  description: "Every source cited across Studio 1947, entered and verified by the administrator.",
};

const toneByType: Record<string, "royal" | "gold" | "sandstone" | "neutral"> = {
  primary: "royal",
  government: "gold",
  book: "sandstone",
  article: "neutral",
  archive: "neutral",
  image_credit: "neutral",
};

export default async function SourcesPage() {
  const [sources, links] = await Promise.all([
    getAllSourcesWithLinks(),
    getAllSourceLinksWithTargets(),
  ]);

  const linksBySource = new Map<string, typeof links>();
  for (const link of links) {
    const list = linksBySource.get(link.source_id) ?? [];
    list.push(link);
    linksBySource.set(link.source_id, list);
  }

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Research"
        title="Sources &amp; References"
        description="Every historical claim, image credit and factual detail on this site traces back to a source listed here."
      />

      {sources.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No sources added yet"
          description="The administrator hasn't entered any research sources yet."
        />
      ) : (
        <div className="mt-10 space-y-5">
          {sources.map((source) => {
            const typeLabel = SOURCE_TYPES.find((t) => t.value === source.source_type)?.label;
            const linkedTargets = (linksBySource.get(source.id) ?? []).filter(
              (l) => l.heritage_site || l.product,
            );
            return (
              <article key={source.id} className="rounded-2xl border border-cream-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={toneByType[source.source_type] ?? "neutral"}>{typeLabel}</Badge>
                  {formatDate(source.publication_date) && (
                    <span className="text-xs text-cream-600">
                      {formatDate(source.publication_date)}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-xl text-royal-900">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </h3>
                {source.author_organisation && (
                  <p className="mt-1 text-sm text-cream-700">{source.author_organisation}</p>
                )}
                {source.notes && <p className="mt-3 text-sm text-cream-700">{source.notes}</p>}

                {linkedTargets.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-cream-100 pt-4">
                    <span className="text-xs uppercase tracking-wide text-cream-500">Cited on:</span>
                    {linkedTargets.map((link) => (
                      <Link
                        key={link.id}
                        href={
                          link.heritage_site
                            ? `/heritage/${link.heritage_site.slug}`
                            : `/crafts/${link.product?.slug}`
                        }
                        className="text-xs font-medium text-royal-700 hover:underline"
                      >
                        {link.heritage_site?.name ?? link.product?.name}
                        {link.section_label ? ` (${link.section_label})` : ""}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </Container>
  );
}
