import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { HERITAGE_CATEGORIES } from "@/lib/types";
import type { HeritageSite } from "@/lib/types";

export function SiteCard({ site }: { site: HeritageSite }) {
  const categoryLabel =
    HERITAGE_CATEGORIES.find((c) => c.value === site.category)?.label ?? site.category;

  return (
    <Link href={`/heritage/${site.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
          {site.cover_image_url ? (
            <Image
              src={site.cover_image_url}
              alt={site.cover_image_alt || site.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="pattern-jaali flex h-full w-full items-center justify-center text-sm text-cream-500">
              No photo added yet
            </div>
          )}
          <Badge tone="sandstone" className="absolute left-3 top-3 shadow">
            {categoryLabel}
          </Badge>
        </div>
        <div className="p-5">
          {site.location?.area && (
            <p className="text-xs uppercase tracking-wide text-royal-600">
              {site.location.area}
              {site.location.city ? `, ${site.location.city}` : ""}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg text-royal-900">{site.name}</h3>
          {site.short_description && (
            <p className="mt-2 line-clamp-2 text-sm text-cream-700">{site.short_description}</p>
          )}
          {site.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {site.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
