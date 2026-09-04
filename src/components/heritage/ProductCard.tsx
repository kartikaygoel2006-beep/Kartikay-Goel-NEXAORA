import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProductOrCraft } from "@/lib/types";

export function ProductCard({ product }: { product: ProductOrCraft }) {
  return (
    <Link href={`/crafts/${product.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.cover_image_alt || product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="pattern-jaali-gold flex h-full w-full items-center justify-center text-sm text-cream-500">
              No photo added yet
            </div>
          )}
          {product.category && (
            <Badge tone="gold" className="absolute left-3 top-3 shadow">
              {product.category}
            </Badge>
          )}
        </div>
        <div className="p-5">
          {product.artisan_name && (
            <p className="text-xs uppercase tracking-wide text-royal-600">
              {product.artisan_name}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg text-royal-900">{product.name}</h3>
          {product.description && (
            <p className="mt-2 line-clamp-2 text-sm text-cream-700">{product.description}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
