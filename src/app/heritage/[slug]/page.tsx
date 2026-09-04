import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Gallery } from "@/components/heritage/Gallery";
import { SourceList } from "@/components/heritage/SourceList";
import { ProductCard } from "@/components/heritage/ProductCard";
import {
  getHeritageSiteBySlug,
  getImagesForSite,
  getRelatedProductsForSite,
  getSourceLinksForSite,
} from "@/lib/queries";
import { ACCESSIBILITY_LEVELS, HERITAGE_CATEGORIES } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getHeritageSiteBySlug(slug);
  if (!site) return { title: "Not found" };
  return {
    title: site.name,
    description: site.short_description ?? undefined,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cream-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl text-royal-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function HeritageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getHeritageSiteBySlug(slug);
  if (!site) notFound();

  const [images, sourceLinks, relatedProducts] = await Promise.all([
    getImagesForSite(site.id),
    getSourceLinksForSite(site.id),
    getRelatedProductsForSite(site.id),
  ]);

  const categoryLabel = HERITAGE_CATEGORIES.find((c) => c.value === site.category)?.label;
  const accessibilityLabel = ACCESSIBILITY_LEVELS.find((a) => a.value === site.accessibility)?.label;

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sandstone">{categoryLabel}</Badge>
        {site.era && <Badge tone="royal">{site.era}</Badge>}
        {accessibilityLabel && <Badge tone="neutral">{accessibilityLabel}</Badge>}
      </div>
      <h1 className="mt-3 font-display text-4xl text-royal-900 sm:text-5xl">{site.name}</h1>
      {site.location && (
        <p className="mt-2 text-cream-700">
          {[site.location.area, site.location.city].filter(Boolean).join(", ")}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <Gallery
            images={images}
            coverImageUrl={site.cover_image_url}
            coverImageAlt={site.cover_image_alt}
            coverImageCredit={site.cover_image_credit}
            title={site.name}
          />

          <Section title="Historical description">
            {site.historical_description ? (
              <p className="whitespace-pre-line text-cream-800">{site.historical_description}</p>
            ) : (
              <EmptyState title="No historical description added yet" />
            )}
          </Section>

          <Section title="Architectural highlights">
            {site.architectural_highlights ? (
              <p className="whitespace-pre-line text-cream-800">{site.architectural_highlights}</p>
            ) : (
              <EmptyState title="No architectural details added yet" />
            )}
          </Section>

          <Section title="Visiting information">
            {site.visiting_info ? (
              <p className="whitespace-pre-line text-cream-800">{site.visiting_info}</p>
            ) : (
              <EmptyState title="No visiting information added yet" />
            )}
          </Section>

          <Section title="Related crafts &amp; products">
            {relatedProducts.length === 0 ? (
              <EmptyState title="No related crafts or products linked yet" />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Section>

          <Section title="Sources &amp; references">
            <SourceList links={sourceLinks} />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
              Fun fact
            </p>
            {site.fun_fact_image_url && (
              <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={site.fun_fact_image_url}
                  alt={site.fun_fact_image_alt || `Fun fact illustration for ${site.name}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            )}
            {site.fun_fact_image_credit && (
              <p className="mt-1 text-right text-xs text-gold-700">
                Photo credit: {site.fun_fact_image_credit}
              </p>
            )}
            {site.fun_fact ? (
              <p className="mt-4 text-sm text-gold-900">{site.fun_fact}</p>
            ) : (
              <p className="mt-4 text-sm text-gold-700">
                No fun fact added yet. The administrator can add one from the dashboard.
              </p>
            )}
          </div>
        </aside>
      </div>
    </Container>
  );
}
