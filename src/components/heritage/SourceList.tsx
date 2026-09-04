import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SOURCE_TYPES } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import type { SourceLink } from "@/lib/types";

const toneByType: Record<string, "royal" | "gold" | "sandstone" | "neutral"> = {
  primary: "royal",
  government: "gold",
  book: "sandstone",
  article: "neutral",
  archive: "neutral",
  image_credit: "neutral",
};

export function SourceList({ links }: { links: SourceLink[] }) {
  if (links.length === 0) {
    return (
      <EmptyState
        title="No sources added yet"
        description="The administrator hasn't linked any references for this entry yet."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {links.map((link) => {
        const source = link.source;
        if (!source) return null;
        const typeLabel = SOURCE_TYPES.find((t) => t.value === source.source_type)?.label;
        return (
          <li key={link.id} className="rounded-xl border border-cream-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={toneByType[source.source_type] ?? "neutral"}>{typeLabel}</Badge>
              {link.section_label && (
                <span className="text-xs uppercase tracking-wide text-cream-600">
                  Supports: {link.section_label}
                </span>
              )}
            </div>
            <p className="mt-2 font-medium text-royal-900">
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </p>
            <p className="mt-1 text-sm text-cream-600">
              {[source.author_organisation, formatDate(source.publication_date)]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {source.notes && <p className="mt-2 text-sm text-cream-700">{source.notes}</p>}
          </li>
        );
      })}
    </ul>
  );
}
