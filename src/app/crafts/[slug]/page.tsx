import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Gallery } from "@/components/heritage/Gallery";
import { SourceList } from "@/components/heritage/SourceList";
import { SiteCard } from "@/components/heritage/SiteCard";
import { Button } from "@/components/ui/Button";
import {
  getImagesForProduct,
  getProductBySlug,
  getRelatedSitesForProduct,
  getSourceLinksForProduct,
} from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description ?? undefined };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cream-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl text-royal-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function CraftDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [images, sourceLinks, relatedSites] = await Promise.all([
    getImagesForProduct(product.id),
    getSourceLinksForProduct(product.id),
    getRelatedSitesForProduct(product.id),
  ]);

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-center gap-2">
        {product.category && <Badge tone="gold">{product.category}</Badge>}
      </div>
      <h1 className="mt-3 font-display text-4xl text-royal-900 sm:text-5xl">{product.name}</h1>
      {product.artisan_name && (
        <p className="mt-2 text-cream-700">By {product.artisan_name}</p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <Gallery
            images={images}
            coverImageUrl={product.cover_image_url}
            coverImageAlt={product.cover_image_alt}
            coverImageCredit={product.cover_image_credit}
            title={product.name}
          />

          <Section title="Description">
            {product.description ? (
              <p className="whitespace-pre-line text-cream-800">{product.description}</p>
            ) : (
              <EmptyState title="No description added yet" />
            )}
          </Section>

          <Section title="History &amp; origin">
            {product.history_origin ? (
              <p className="whitespace-pre-line text-cream-800">{product.history_origin}</p>
            ) : (
              <EmptyState title="No history or origin added yet" />
            )}
          </Section>

          <Section title="Related monuments &amp; places">
            {relatedSites.length === 0 ? (
              <EmptyState title="No related monuments or places linked yet" />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            )}
          </Section>

          <Section title="Sources &amp; references">
            <SourceList links={sourceLinks} />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-royal-200 bg-royal-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal-700">
              Availability
            </p>
            {product.contact_link ? (
              <Button href={product.contact_link} className="mt-4 w-full" target="_blank" rel="noopener noreferrer">
                Contact / view availability
              </Button>
            ) : (
              <p className="mt-4 text-sm text-royal-700">
                No contact or availability link added yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </Container>
  );
}
